import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if the record exists
    const record = db.prepare('SELECT file_path FROM downloads WHERE id = ?').get(id) as { file_path: string | null } | undefined;
    
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Attempt to delete from the filesystem
    if (record.file_path && fs.existsSync(record.file_path)) {
      try {
         fs.unlinkSync(record.file_path);
      } catch(fileErr) {
        console.error("Failed to delete file:", fileErr);
      }
    }

    // Delete from DB
    db.prepare('DELETE FROM downloads WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
