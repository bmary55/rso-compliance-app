import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM patients ORDER BY appointment_date ASC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO patients (patient_name, patient_id, scan_type, duration, insurance, appointment_status, appointment_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.patient_name, data.patient_id, data.scan_type, data.duration, data.insurance, data.appointment_status, data.appointment_date]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
