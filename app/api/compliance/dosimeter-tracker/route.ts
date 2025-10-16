import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM dosimeter_tracker ORDER BY tracking_date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dosimeter records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO dosimeter_tracker (tracking_date, employee_name, badge_id, exposure, monthly_total, quarterly_total, yearly_total, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data.tracking_date, data.employee_name, data.badge_id, data.exposure, data.monthly_total, data.quarterly_total, data.yearly_total, data.status]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create dosimeter record' }, { status: 500 });
  }
}
