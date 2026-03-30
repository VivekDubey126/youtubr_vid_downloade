import { spawn } from 'child_process';
import util from 'util';
import db, { downloadsDir } from './db';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Check for cookies to bypass bot blocks safely
const getBaseArgs = (): string[] => {
  // Ultra-secure method: Use Hugging Face Secrets instead of public files
  if (process.env.YOUTUBE_COOKIES) {
    const tmpCookiePath = '/tmp/youtube_cookies.txt';
    try {
      if (!fs.existsSync(tmpCookiePath)) {
        fs.writeFileSync(tmpCookiePath, process.env.YOUTUBE_COOKIES);
      }
      return ['--cookies', tmpCookiePath];
    } catch (e) {
      console.error("Failed to write secure cookies", e);
    }
  }

  // Fallback for local testing
  const cookiePath = path.join(process.cwd(), 'cookies.txt');
  return fs.existsSync(cookiePath) ? ['--cookies', cookiePath] : [];
};

// Helper to spawn yt-dlp
function runYtDlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', args);
    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`yt-dlp exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

export async function fetchMetadata(url: string) {
  try {
    const output = await runYtDlp([...getBaseArgs(), '-j', url]);
    const parsed = JSON.parse(output);
    return {
      title: parsed.title,
      id: parsed.id,
      thumbnail: parsed.thumbnail,
      formats: parsed.formats
        .filter((f: any) => f.vcodec !== 'none' || f.acodec !== 'none')
        .map((f: any) => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.resolution || 'audio only',
          fps: f.fps,
          vcodec: f.vcodec,
          acodec: f.acodec,
          filesize: f.filesize,
          format_note: f.format_note,
        })),
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

export function startDownload(
  downloadId: string,
  url: string,
  formatId: string,
  isAudioOnly: boolean = false,
  title: string = "download"
) {
  const sanitizedTitle = title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_').substring(0, 50);
  const fileName = `${sanitizedTitle}_${downloadId}.%(ext)s`;
  const outputPath = path.join(downloadsDir, fileName);

  const args = isAudioOnly
    ? ['-x', '--audio-format', 'mp3', '-o', outputPath, url]
    : ['-f', formatId, '--merge-output-format', 'mp4', '-o', outputPath, url];

  // Run in background and update DB
  new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', [...getBaseArgs(), ...args]);
    let finalExt = isAudioOnly ? 'mp3' : 'mp4'; 
    let finalOutputPath = path.join(downloadsDir, `${sanitizedTitle}_${downloadId}.${finalExt}`);

    process.stdout.on('data', (data) => {
      const output = data.toString();
      const match = output.match(/\[download\]\s+([\d\.]+)%/);
      if (match && match[1]) {
        try {
          db.prepare('UPDATE downloads SET progress = ? WHERE id = ?')
            .run(match[1] + '%', downloadId);
        } catch(e) {}
      }
    });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          const stats = fs.statSync(finalOutputPath);
          const updateStmt = db.prepare(
            `UPDATE downloads SET status = ?, file_path = ?, file_size_bytes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
          );
          updateStmt.run('done', finalOutputPath, stats.size, downloadId);
          resolve(true);
        } catch (e: any) {
          const errStmt = db.prepare(
            `UPDATE downloads SET status = 'failed', error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
          );
          errStmt.run(e?.message || 'File not found after download', downloadId);
          reject(e);
        }
      } else {
        const errStmt = db.prepare(
          `UPDATE downloads SET status = 'failed', error_message = 'yt-dlp exited with code ' || ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        );
        errStmt.run(code, downloadId);
        reject(new Error(`yt-dlp failed with code ${code}`));
      }
    });
  }).catch((e) => console.error('Download background task failed:', e));
}
