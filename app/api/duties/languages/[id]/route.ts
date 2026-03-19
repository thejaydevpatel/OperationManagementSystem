import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      `SELECT name FROM language_master_lookup_language_master_table WHERE id = $1`,
      [params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}