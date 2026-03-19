import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  try {
    const result = await pool.query(
      `
      SELECT 
        da."id" AS id,
        da."driver_id" AS "driver",
        da."vehicle_id" AS "vehicle",

        v."supplier_id" AS "supplier",   

        da."start_time" AS "startTime",
        da."end_time" AS "endTime",
        da."notes" AS "manualCost"

      FROM "driver_allocation_lookup_driver_allocation_table" da

      LEFT JOIN "vehicles_lookup_vehicles_table" v
        ON v."id" = da."vehicle_id"

      WHERE da."job_id" = $1
      `,
      [jobId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("DRIVER API ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}