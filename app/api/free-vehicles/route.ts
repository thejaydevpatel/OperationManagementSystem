import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {

    const result = await pool.query(`
      SELECT 
        v.id,
        v.name,
        v.registration_number,
        vt.capacity
      FROM vehicles_lookup_vehicles_table v

      LEFT JOIN vehicle_types_lookup_vehicle_types_table vt
        ON vt.id = v.vehicle_type_id

      LEFT JOIN driver_allocation_lookup_driver_allocation_table da
        ON da.vehicle_id = v.id
        AND da.is_deleted = false
        AND da.is_active = true

      WHERE 
        da.id IS NULL
        AND v.is_deleted = false
        AND v.is_active = true

      ORDER BY v.name
    `);

    return NextResponse.json(result.rows);

  } catch (err:any) {
    console.error("FREE VEHICLE ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}