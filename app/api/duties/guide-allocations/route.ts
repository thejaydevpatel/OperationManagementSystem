import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        g."id",
        g."name"
      FROM "guide_allocation_lookup_guide_allocation_table" g
      WHERE g."is_deleted" = false
      ORDER BY g."name"
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}