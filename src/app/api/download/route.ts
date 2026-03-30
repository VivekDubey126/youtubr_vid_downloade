import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { startDownload } from '@/lib/ytdlp';

export async function POST(req: Request) {
  try {
    const { url, title, formatId, isAudioOnly, thumbnail } = await req.json();

    if (!url || !formatId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const downloadId = uuidv4();

    // Insert to database
    const insertStmt = db.prepare(`
      INSERT INTO downloads (id, video_id, title, thumbnail, format, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    // video_id can be extracted from url or just save the URL temporarily
    insertStmt.run(downloadId, url, title, thumbnail, isAudioOnly ? 'audio' : 'video', 'processing');

    // Trigger download asynchronously
    startDownload(downloadId, url, formatId, isAudioOnly, title);

    return NextResponse.json({ success: true, downloadId });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
