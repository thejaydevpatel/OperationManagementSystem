import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        l."id",
        l."name"
      FROM "language_master_lookup_language_master_table" l
      WHERE l."is_deleted" = false
      ORDER BY l."name"
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}