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
      const oldRows = await client.query(
        `SELECT allocation_status_id FROM driver_allocation_lookup_driver_allocation_table WHERE id = ANY($1)`,
        [toDelete]
      );

      await client.query(
        `DELETE FROM driver_allocation_lookup_driver_allocation_table WHERE id = ANY($1)`,
        [toDelete]
      );
      //log
      await client.query(
        `
        INSERT INTO operation_logs_lookup_operation_logs_table
        (job_id, action, old_status_id, new_status_id, performed_by, notes, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `,
        [
          jobId,
          "DRIVER_REMOVED",
          oldRows.rows[0]?.allocation_status_id || null, // take first (or loop if needed)
          null,
          "admin",
          `Removed ${toDelete.length} driver allocation(s)`
        ]
      );
    }

    
    // 3️⃣ INSERT / UPDATE
    for (const row of rows) {
      if (row.id) {
        // UPDATE
// ✅ first update
const prev = await client.query(
  `SELECT allocation_status_id FROM driver_allocation_lookup_driver_allocation_table WHERE id = $1`,
  [row.id]
);

const oldStatus = prev.rows[0]?.allocation_status_id || null;

await client.query(
`
UPDATE driver_allocation_lookup_driver_allocation_table
SET 
  supplier_id = $1,
  driver_id = $2,
  vehicle_id = $3,
  allocation_status_id = $4,
  start_time = $5,
  end_time = $6,
  manual_cost = $7,
  notes = $8
WHERE id = $9
`,
[
  row.supplier || null,
  row.driver || null,
  row.vehicle || null,
  2,
  row.startTime || null,
  row.endTime || null,
  row.manualCost || null,
  row.remark || null,
  row.id
]
);

// ✅ THEN log
await client.query(
  `
  INSERT INTO operation_logs_lookup_operation_logs_table
  (job_id, action, old_status_id, new_status_id, performed_by, notes, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
  `,
  [
    jobId,
    "DRIVER_UPDATED",
    oldStatus,
    2,
    "admin",
    `Updated driver ${row.driver} with vehicle ${row.vehicle}`
  ]
);
      } else {
        // INSERT
// ✅ first insert
await client.query(
  `
  INSERT INTO driver_allocation_lookup_driver_allocation_table
  (
    job_id,
    supplier_id,
    driver_id,
    vehicle_id,
    allocation_status_id,
    start_time,
    end_time,
    created_at,
    manual_cost,
    notes
  )
  SELECT 
    $1,
    $2,
    $3,
    $4,
    $5,
    oj.scheduled_start_time,
    oj.scheduled_end_time,
    NOW(),
    $6,
    $7
  FROM operation_jobs_lookup_operation_jobs_table oj
  WHERE oj.id = $1
  `,
  [
    jobId,
    row.supplier || null,
    row.driver,
    row.vehicle,
    2,
    row.manualCost || null,
    row.remark || null,
  ]
);

// ✅ THEN log
await client.query(
  `
  INSERT INTO operation_logs_lookup_operation_logs_table
  (job_id, action, old_status_id, new_status_id, performed_by, notes, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
  `,
  [
    jobId,
    "DRIVER_ALLOCATED",
    null,
    2,
    "admin",
    `Assigned driver ${row.driver} to vehicle ${row.vehicle}`
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