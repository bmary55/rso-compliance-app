import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM tracer_checkout ORDER BY checkout_date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tracers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO tracer_checkout (checkout_date, tracer_type, technologist, check_in_time, check_out_time, patient_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.checkout_date, data.tracer_type, data.technologist, data.check_in_time, data.check_out_time, data.patient_id, data.status]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tracer checkout' }, { status: 500 });
  }
}
