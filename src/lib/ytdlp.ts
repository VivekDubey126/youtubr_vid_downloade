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
        console.error(`yt-dlp error output: ${errorOutput}`);
        reject(new Error(`yt-dlp exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

export async function fetchMetadata(url: string) {
  try {
    const output = await runYtDlp([...getBaseArgs(), '-j', '--no-playlist', '--geo-bypass', url]);
    const parsed = JSON.parse(output);
    
    // For many non-YT sites, 'formats' might be empty or in a different field
    // But yt-dlp usually populates 'formats'
    const rawFormats = parsed.formats || [];
    
    // If no formats (direct file link), create a dummy format
    if (rawFormats.length === 0 && (parsed.url || parsed.webpage_url)) {
       rawFormats.push({
         format_id: 'default',
         ext: parsed.ext || 'mp4',
         resolution: parsed.resolution || 'Auto',
         filesize: parsed.filesize,
         vcodec: parsed.vcodec || 'unknown',
         acodec: parsed.acodec || 'unknown'
       });
    }

    return {
      title: parsed.title || parsed.webpage_url || 'Unknown Video',
      id: parsed.id || crypto.randomBytes(4).toString('hex'),
      thumbnail: parsed.thumbnail || 'https://placehold.co/600x400/111/fff?text=No+Preview',
      formats: rawFormats
        .filter((f: any) => f.vcodec !== 'none' || f.acodec !== 'none' || f.format_id === 'default')
        .map((f: any) => ({
          format_id: f.format_id,
          ext: f.ext,
          resolution: f.resolution || f.format_note || 'Standard',
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

  const baseArgs = [...getBaseArgs(), '--no-playlist', '--geo-bypass'];
  
  let args: string[];
  if (isAudioOnly) {
    args = [...baseArgs, '-x', '--audio-format', 'mp3', '-o', outputPath, url];
  } else {
    // If formatId is 'default', just let yt-dlp pick or use best
    const formatSpec = formatId === 'default' ? 'bestvideo+bestaudio/best' : formatId;
    args = [...baseArgs, '-f', formatSpec, '--merge-output-format', 'mp4', '-o', outputPath, url];
  }

  // Run in background and update DB
  new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', args);
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
