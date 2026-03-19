import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        v.id,
        vt.name AS name
      FROM vehicles_lookup_vehicles_table v
      LEFT JOIN vehicle_types_lookup_vehicle_types_table vt
        ON vt.id = v.vehicle_type_id
      WHERE v.is_deleted = false
    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("VEHICLE API ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}