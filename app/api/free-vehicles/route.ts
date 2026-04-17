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
        v.id,
        v.name,
        v.registration_number,
        vt.capacity
      FROM vehicles_lookup_vehicles_table v

      LEFT JOIN vehicle_types_lookup_vehicle_types_table vt
        ON vt.id = v.vehicle_type_id

      WHERE 
        v.is_deleted = false
        AND v.is_active = true

        AND NOT EXISTS (
          SELECT 1
          FROM driver_allocation_lookup_driver_allocation_table da
          WHERE 
            da.vehicle_id = v.id
            AND da.is_deleted = false
            AND da.is_active = true
            AND da.start_time >= $1::date
            AND da.start_time < ($1::date + interval '1 day')
        )

      ORDER BY v.name
      `,
      [date]
    );

    return NextResponse.json(result.rows);

  } catch (err: any) {
    console.error("FREE VEHICLE ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}