import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, name, created_at
      FROM lookup_notification
      WHERE is_deleted = false
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}