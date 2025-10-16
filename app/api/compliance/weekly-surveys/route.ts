import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM weekly_area_surveys ORDER BY week_ending DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO weekly_area_surveys (week_ending, technologist, areas, max_reading, avg_reading, comments, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.week_ending, data.technologist, data.areas, data.max_reading, data.avg_reading, data.comments, data.status]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
  }
}
