// import { NextResponse } from "next/server";
// import { pool } from "@/lib/config";

// export async function POST(req: Request) {

//   const body = await req.json();
//   const { jobId, rows } = body;

//   const client = await pool.connect();

//   try {

//     await client.query("BEGIN");

//     // ⭐ 1️⃣ Existing IDs
//     const existing = await client.query(
//       `SELECT id 
//        FROM guide_allocation_lookup_guide_allocation_table
//        WHERE job_id = $1 AND is_deleted = false`,
//       [jobId]
//     );

//     const existingIds = existing.rows.map(r => r.id);

//     const incomingIds = rows
//       .filter((r:any)=> r.id)
//       .map((r:any)=> r.id);

//     // ⭐ 2️⃣ Delete removed
//     const toDelete = existingIds.filter(
//       (id:number)=> !incomingIds.includes(id)
//     );

//     if (toDelete.length > 0) {
//       await client.query(
//         `
//         UPDATE guide_allocation_lookup_guide_allocation_table
//         SET is_deleted = true
//         WHERE id = ANY($1)
//         `,
//         [toDelete]
//       );
//     }

//     // ⭐ 3️⃣ Insert / Update
//     for (const row of rows) {

//       if (row.id) {

//         // UPDATE
//         await client.query(
//           ` 

// UPDATE guide_allocation_lookup_guide_allocation_table ga
// SET
//  guide_id = $1,
//  allocation_status_id = 1
//  report_time = oj.scheduled_start_time - interval '30 minutes',
//  actual_start_time = oj.scheduled_start_time,
//  actual_end_time = oj.scheduled_end_time
// FROM operation_jobs_lookup_operation_jobs_table oj
// WHERE ga.id = $2
// AND oj.id = ga.job_id

//           `,
//           [
//             row.guide || null,
//             row.id
//           ]
//         );

//       } else {

//         // INSERT
//         await client.query(
//           ` 

// INSERT INTO guide_allocation_lookup_guide_allocation_table
// (
//  job_id,
//  guide_id,
//  allocation_status_id,
//  report_time,
//  actual_start_time,
//  actual_end_time,
//  created_at,
//  is_deleted
// )

// SELECT
//  $1,
//  $2,
//  1,
//  oj.scheduled_start_time - interval '30 minutes',
//  oj.scheduled_start_time,
//  oj.scheduled_end_time,
//  NOW(),
//  false

// FROM operation_jobs_lookup_operation_jobs_table oj
// WHERE oj.id = $1

//           `,
//           [
//             jobId,
//             row.guide
//           ]
//         );

//       }

//     }
// // ✅ Count total guides dynamically from DB
// const { rows: countRows } = await client.query(
//   `SELECT COUNT(*) AS total_guide
//    FROM guide_allocation_lookup_guide_allocation_table
//    WHERE job_id = $1 AND is_deleted = false`,
//   [jobId]
// );

// const totalGuide = countRows[0].total_guide;

// // ✅ Update operation_jobs table
// await client.query(
//   `UPDATE operation_jobs_lookup_operation_jobs_table
//    SET no_of_guide = $1
//    WHERE id = $2`,
//   [totalGuide, jobId]
// );
//     await client.query("COMMIT");

//     return NextResponse.json({ success:true });

//   } catch (err) {

//     await client.query("ROLLBACK");
//     console.error(err);

//     return NextResponse.json({ success:false });

//   } finally {
//     client.release();
//   }

// }


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
           SET guide_id = $1,
               allocation_status_id = 2,
               report_time = oj.scheduled_start_time - interval '30 minutes',
               actual_start_time = oj.scheduled_start_time,
               actual_end_time = oj.scheduled_end_time
           FROM operation_jobs_lookup_operation_jobs_table oj
           WHERE ga.id = $2 AND oj.id = ga.job_id`,
          [row.guide, row.id]
        );
      } else {
        // Insert new allocation
        await client.query(
          `INSERT INTO guide_allocation_lookup_guide_allocation_table
           (job_id, guide_id, allocation_status_id,
            report_time, actual_start_time, actual_end_time, created_at, is_deleted)
           SELECT $1, $2, 2,
                  oj.scheduled_start_time - interval '30 minutes',
                  oj.scheduled_start_time,
                  oj.scheduled_end_time,
                  NOW(),
                  false
           FROM operation_jobs_lookup_operation_jobs_table oj
           WHERE oj.id = $1`,
          [jobId, row.guide]
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


  } catch (err) {

    await client.query("ROLLBACK");
    console.error(err);

    return NextResponse.json({ success:false });

  } finally {
    client.release();
  }

}