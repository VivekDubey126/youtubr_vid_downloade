import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const records = db.prepare('SELECT * FROM downloads ORDER BY created_at DESC').all();
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
