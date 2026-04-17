import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json([]);
    }

    const result = await pool.query(
      `
SELECT 
  d.id,
  d.name,
  d.phone,
  d.license_number
FROM drivers_lookup_drivers_table d
WHERE 
  d.is_deleted = false
  AND d.is_active = true

  AND NOT EXISTS (
    SELECT 1
    FROM driver_allocation_lookup_driver_allocation_table da
    WHERE 
      da.driver_id = d.id
      AND da.is_deleted = false
      AND da.is_active = true
      AND da.start_time >= $1::date
      AND da.start_time < ($1::date + interval '1 day')
  )

ORDER BY d.name;
      `,
      [date]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("FREE DRIVER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}