import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {

    const conditions: string[] = [
      `s."name" = 'Completed'`,
      `da."short_id" IS NOT NULL`
    ];

    const values: any[] = [];
    let index = 1;

    if (from) {
      conditions.push(`DATE(j."scheduled_start_time") >= $${index++}`);
      values.push(from);
    }

    if (to) {
      conditions.push(`DATE(j."scheduled_start_time") <= $${index++}`);
      values.push(to);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const result = await pool.query(
      `
      SELECT
        j.id,
        j.external_booking_id AS "bookingId",
        TO_CHAR(j.scheduled_start_time,'YYYY-MM-DD') AS "date",
        TO_CHAR(j.scheduled_start_time,'HH24:MI') AS "time",
        j.client,
        j.service_type,

        v.registration_number AS "vehicle",

        sup.name AS "supplier",

        da.short_id AS "dutySlip",

        lp.name AS "pickup",
        ld.name AS "drop"

      FROM operation_jobs_lookup_operation_jobs_table j

      LEFT JOIN driver_allocation_lookup_driver_allocation_table da
        ON da.job_id = j.id AND da.is_deleted = false

      LEFT JOIN vehicles_lookup_vehicles_table v
        ON v.id = da.vehicle_id

      LEFT JOIN supplier_master_lookup_supplier_master_table sup
        ON sup.id = v.supplier_id

      LEFT JOIN location_master_lookup_location_master_table lp
        ON lp.id = j.pickup_location_id

      LEFT JOIN location_master_lookup_location_master_table ld
        ON ld.id = j.dropoff_location_id

      LEFT JOIN status_master_lookup_status_master_table s
        ON s.id = j.job_status_id

      ${whereClause}

      ORDER BY j.scheduled_start_time DESC
      `,
      values
    );

    return NextResponse.json(result.rows);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}