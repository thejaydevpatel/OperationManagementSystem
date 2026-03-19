import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function POST(req: Request) {
  const body = await req.json();
  const { jobId, rows } = body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Get existing IDs from DB
    const existing = await client.query(
      `SELECT id FROM driver_allocation_lookup_driver_allocation_table WHERE job_id = $1`,
      [jobId]
    );

    const existingIds = existing.rows.map((r) => r.id);

    const incomingIds = rows.filter((r: any) => r.id).map((r: any) => r.id);

    // 2️⃣ DELETE removed rows
    const toDelete = existingIds.filter((id: number) => !incomingIds.includes(id));

    if (toDelete.length > 0) {
      await client.query(
        `DELETE FROM driver_allocation_lookup_driver_allocation_table WHERE id = ANY($1)`,
        [toDelete]
      );
    }

    // 3️⃣ INSERT / UPDATE
    for (const row of rows) {
      if (row.id) {
        // UPDATE
await client.query(
  `
  UPDATE driver_allocation_lookup_driver_allocation_table
  SET 
    driver_id = $1,
    vehicle_id = $2,
    allocation_status_id = $3,
    start_time = $4,
    end_time = $5,
    notes = $6
  WHERE id = $7
  `,
  [
    row.driver || null,
    row.vehicle || null,
    2,  
    row.startTime || null,
    row.endTime || null,
    row.manualCost || null,
    row.id,
  ]
);
      } else {
        // INSERT
await client.query(
  `
  INSERT INTO driver_allocation_lookup_driver_allocation_table
  (job_id, driver_id, vehicle_id, allocation_status_id, start_time, end_time,created_at, notes)

  SELECT 
    $1,                -- job_id
    $2,                -- driver_id
    $3,                -- vehicle_id
    $4,                -- allocation_status_id
    oj.scheduled_start_time,     -- ✅ from operation_jobs table
    oj.scheduled_end_time,       -- ✅ from operation_jobs table
    NOW(), 
    $5                 -- notes

  FROM operation_jobs_lookup_operation_jobs_table oj
  WHERE oj.id = $1
  `,
  [
    jobId,
    row.driver,
    row.vehicle,
    2,
    row.manualCost || null,
  ]
);
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("SAVE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    client.release();
  }
}