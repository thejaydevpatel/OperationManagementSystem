import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function POST(req: Request) {
  const body = await req.json();
  const { jobId, rows } = body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Get existing allocations
    const existingRes = await client.query(
      `SELECT id FROM guide_allocation_lookup_guide_allocation_table
       WHERE job_id = $1 AND is_deleted = false`,
      [jobId]
    );
    const existingIds = existingRes.rows.map(r => r.id);

    const incomingIds = rows.filter(r => r.id).map(r => r.id);

    // 2️⃣ Delete removed allocations
    const toDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (toDelete.length > 0) {
      await client.query(
        `UPDATE guide_allocation_lookup_guide_allocation_table
         SET is_deleted = true
         WHERE id = ANY($1)`,
        [toDelete]
      );
    }

    // 3️⃣ Insert or update
    for (const row of rows) {
      if (row.id) {
        // Update existing guide allocation
await client.query(
  `UPDATE guide_allocation_lookup_guide_allocation_table ga
   SET 
       guide_id = $1,
       supplier_id = $2,
       extra_charge = $3,
       allocation_status_id = 2,
       report_time = oj.scheduled_start_time - interval '30 minutes',
       actual_start_time = oj.scheduled_start_time,
       actual_end_time = oj.scheduled_end_time
   FROM operation_jobs_lookup_operation_jobs_table oj
   WHERE ga.id = $4 
   AND oj.id = ga.job_id`,
  [
    row.guide,
    row.supplier,
    row.extraCharge || 0,
    row.id
  ]
);
      } else {
        // Insert new allocation
await client.query(
  `INSERT INTO guide_allocation_lookup_guide_allocation_table
   (
     job_id,
     supplier_id,
     guide_id,
     extra_charge,  -- ✅ ADD THIS
     allocation_status_id,
     report_time,
     actual_start_time,
     actual_end_time,
     created_at,
     is_deleted
   )
   VALUES
   (
     $1,
     $2,
     $3,
     $4,   -- ✅ ADD THIS
     2,
     NOW() - interval '30 minutes',
     NOW(),
     NOW(),
     NOW(),
     false
   )`,
  [
    jobId,
    row.supplier,
    row.guide,
    row.extraCharge || 0  // ✅ IMPORTANT
  ]
);
      }
    }

    await client.query("COMMIT");

    // ✅ Return success, optional: return total guides for frontend display
    const countRes = await client.query(
      `SELECT COUNT(*) AS total_guide
       FROM guide_allocation_lookup_guide_allocation_table
       WHERE job_id = $1 AND is_deleted = false`,
      [jobId]
    );
    const totalGuide = countRes.rows[0]?.total_guide || 0;

    return NextResponse.json({ success: true, totalGuide });


  } catch (err: any) {
  await client.query("ROLLBACK");

  console.error("❌ FULL DB ERROR:", err); // 👈 important

  return NextResponse.json({
    success: false,
    error: err.message, // 👈 send actual error
  });
} finally {
    client.release();
  }

}