import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  const result = await pool.query(
    `SELECT id, name FROM supplier_master_lookup_supplier_master_table WHERE is_deleted = false`
  );

  return NextResponse.json(result.rows);
}