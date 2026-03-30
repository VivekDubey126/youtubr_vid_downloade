import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Node.js stream to Web standard stream adapter
function streamToWeb(nodeStream: fs.ReadStream) {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const record = db.prepare('SELECT file_path, title FROM downloads WHERE id = ?').get(id) as { file_path: string, title: string } | undefined;
    
    if (!record || !record.file_path) {
      return NextResponse.json({ error: 'File not found in database' }, { status: 404 });
    }

    if (!fs.existsSync(record.file_path)) {
      return NextResponse.json({ error: 'File no longer exists on disk' }, { status: 404 });
    }

    const stat = fs.statSync(record.file_path);
    const fileStream = fs.createReadStream(record.file_path);
    const filename = encodeURIComponent(path.basename(record.file_path));

    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    headers.set('Content-Length', stat.size.toString());

    return new NextResponse(streamToWeb(fileStream), {
      status: 200,
      headers
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
