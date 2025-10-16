import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM qc_calibrator ORDER BY qc_date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch QC records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO qc_calibrator (qc_date, calibrator_id, technologist, test_type, result, comments)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.qc_date, data.calibrator_id, data.technologist, data.test_type, data.result, data.comments]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create QC record' }, { status: 500 });
  }
}
