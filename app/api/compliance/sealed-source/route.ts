import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM sealed_source_inventory ORDER BY inventory_date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await pool.query(
      `INSERT INTO sealed_source_inventory (inventory_date, source_id, isotope, activity, location, condition, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.inventory_date, data.source_id, data.isotope, data.activity, data.location, data.condition, data.comments]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory' }, { status: 500 });
  }
}
