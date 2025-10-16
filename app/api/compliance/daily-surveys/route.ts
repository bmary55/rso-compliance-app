import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM daily_area_surveys ORDER BY survey_date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching daily surveys:', error);
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO daily_area_surveys (survey_date, technologist, area, radiation_reading, actions, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.survey_date, data.technologist, data.area, data.radiation_reading, data.actions, data.status]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 });
  }
}
