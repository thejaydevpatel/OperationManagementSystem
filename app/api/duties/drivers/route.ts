import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  const result = await pool.query(
    `SELECT id, name FROM drivers_lookup_drivers_table WHERE is_deleted = false`
  );

  return NextResponse.json(result.rows);
}