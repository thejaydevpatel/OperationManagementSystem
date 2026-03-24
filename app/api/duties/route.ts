import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const driver = searchParams.get("driver");
  const location = searchParams.get("location");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const fileNo = searchParams.get("fileNo");
  const locationType = searchParams.get("locationType");
  const allocationType = searchParams.get("allocationType");

  console.log("Filters:", { driver, location, from, to });

  try {
    const conditions: string[] = [];
const values: any[] = [];
let index = 1;

if (driver) {
  conditions.push(`da."driver_id" = $${index++}`);
  values.push(driver);
}

if (from) {
  conditions.push(`DATE(j."scheduled_start_time") >= $${index++}`);
  values.push(from);
}

if (to) {
  conditions.push(`DATE(j."scheduled_start_time") <= $${index++}`);
  values.push(to);
}
if (fileNo) {
  conditions.push(`j."external_booking_id" ILIKE $${index++}`);
  values.push(`%${fileNo}%`);
}
 
if (location && locationType === "Pickup") {
  conditions.push(`j."pickup_location_id" = $${index++}`);
  values.push(location);
}

if (location && locationType === "DropOff") {
  conditions.push(`j."dropoff_location_id" = $${index++}`);
  values.push(location);
}
// Allocation Type Filter
if (allocationType === "Allocate") {
  conditions.push(`d."id" IS NULL AND gl.guide_name IS NULL`);
}

if (allocationType === "Modify") {
  conditions.push(`(d."id" IS NOT NULL OR gl.guide_name IS NOT NULL)`);
}

const whereClause =
  conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
  `
  SELECT
    j."id",
    j."external_booking_id" AS "bookingId",
    TO_CHAR(j."scheduled_start_time", 'YYYY-MM-DD') AS "date",
    TO_CHAR(j."scheduled_start_time", 'HH24:MI') AS "pickupTime",
    TO_CHAR(j."scheduled_start_time" - INTERVAL '30 minutes', 'HH24:MI') AS "reportingTime",
    j."pax",
    j."client",
    j."agent",
    j."address",
    j."guide_language_required",
    j."service_type",
    j."notes" AS "remark",
    

    vt."name" AS "vehicleType",

    d."name" AS "driverName",

    gl.guide_name AS "guideName",
   lm.name AS "guideLanguage",
   gl.language_name AS "assignedLanguage" ,
    COALESCE(ga.guide_count, 0) AS "noOfGuide",

    v."registration_number" AS "registrationNumber",

    da."short_id" AS "dutySlipNo",

    lp."name" AS "pickupLocation",
    ld."name" AS "dropLocation",

    s."name" AS "status",
 
COALESCE(da_cost.vehicle_price, 0) AS "vehiclePrice",
COALESCE(ga_cost.guide_price, 0) AS "guidePrice"
    

  FROM "operation_jobs_lookup_operation_jobs_table" j

  LEFT JOIN "driver_allocation_lookup_driver_allocation_table" da
    ON da."job_id" = j."id"
    AND da."is_deleted" = false

  LEFT JOIN "drivers_lookup_drivers_table" d
    ON d."id" = da."driver_id"

  LEFT JOIN "vehicles_lookup_vehicles_table" v
    ON v."id" = da."vehicle_id"

  LEFT JOIN "vehicle_types_lookup_vehicle_types_table" vt
    ON vt."id" = j."vehicle_type_required"

  LEFT JOIN "location_master_lookup_location_master_table" lp
    ON lp."id" = j."pickup_location_id"

  LEFT JOIN "location_master_lookup_location_master_table" ld
    ON ld."id" = j."dropoff_location_id"

    LEFT JOIN language_master_lookup_language_master_table lm
  ON lm.id = j."guide_language_required"

  LEFT JOIN "status_master_lookup_status_master_table" s
    ON s."id" = j."job_status_id"

    LEFT JOIN (
    SELECT 
        job_id,
        COUNT(*) AS guide_count
    FROM guide_allocation_lookup_guide_allocation_table
    WHERE is_deleted = false
    GROUP BY job_id
) ga ON ga.job_id = j.id

LEFT JOIN (
    SELECT 
        job_id,
        SUM(manual_cost) AS vehicle_price
    FROM driver_allocation_lookup_driver_allocation_table
    WHERE is_deleted = false
    GROUP BY job_id
) da_cost ON da_cost.job_id = j.id

LEFT JOIN (
    SELECT 
        job_id,
        SUM(extra_charge) AS guide_price
    FROM guide_allocation_lookup_guide_allocation_table
    WHERE is_deleted = false
    GROUP BY job_id
) ga_cost ON ga_cost.job_id = j.id

LEFT JOIN (
    SELECT 
        g1.job_id,
        STRING_AGG(tg.name, ', ') AS guide_name,  -- combine all guides
        STRING_AGG(l.name, ', ') AS language_name
    FROM guide_allocation_lookup_guide_allocation_table g1
    LEFT JOIN tour_guides_lookup_tour_guides_table tg 
        ON tg.id = g1.guide_id
    LEFT JOIN language_master_lookup_language_master_table l
        ON l.id = tg.language_id
    WHERE g1.is_deleted = false
    GROUP BY g1.job_id
) gl ON gl.job_id = j.id
  ${whereClause}

  ORDER BY j."scheduled_start_time" DESC
  LIMIT 50
  `,
  values
);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}