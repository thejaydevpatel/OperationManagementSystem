import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {

    const result = await pool.query(`
      SELECT 
        d.id,
        d.name,
        d.phone,
        d.license_number
      FROM drivers_lookup_drivers_table d

      LEFT JOIN driver_allocation_lookup_driver_allocation_table da
        ON da.driver_id = d.id
        AND da.is_deleted = false
        AND da.is_active = true

      WHERE 
        da.id IS NULL
        AND d.is_deleted = false
        AND d.is_active = true

      ORDER BY d.name
    `);

    return NextResponse.json(result.rows);

  } catch (err:any) {
    console.error("FREE DRIVER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}