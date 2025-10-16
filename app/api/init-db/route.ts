import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';
import { seedSampleData } from '@/lib/seed-data';

export async function POST() {
  try {
    await initializeDatabase();
    await seedSampleData();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}
