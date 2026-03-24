import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) return NextResponse.json([]);

   const result = await pool.query(
`
SELECT 
    ga.id,
    ga.job_id, 
    ga.guide_id AS guide,
    ga.supplier_id AS supplier,     -- ✅ ADD
    ga.extra_charge,                -- ✅ ADD
    tg.language_id AS language,
    tg.name AS guide_name
FROM guide_allocation_lookup_guide_allocation_table ga
LEFT JOIN tour_guides_lookup_tour_guides_table tg 
       ON tg.id = ga.guide_id
WHERE ga.job_id = $1
AND ga.is_deleted = false
`,
[jobId]
);

const rows = result.rows.map(r => ({
  id: r.id, 
  dutySlipNo: r.duty_slip_no || "",
  noOfGuide: 1,
  guide: Number(r.guide) || "",
  language: Number(r.language) || "",
  supplier: Number(r.supplier) || "",      // ✅ ADD
  extraCharge: r.extra_charge || "",       // ✅ ADD
}));

    return NextResponse.json(rows);

  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}