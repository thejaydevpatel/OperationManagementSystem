import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { TourGuidesTableEntity } from "../interface/tour-guides-table";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
import { PrepareAndDispatchValidation } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";

const dbName = process.env.PGDB_NAME_COMMON!; 

type GuideLanguagePrice = {
  language_id: number;
  price: number;
};

type TourGuideUpdateBody = Partial<TourGuidesTableEntity> & {
  languages?: GuideLanguagePrice[];
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;
    const client = getDbConnection(dbName);

    // 1️⃣ Get guide
    const guideResult = await client.query(
      `SELECT * FROM tour_guides_lookup_tour_guides_table WHERE id = $1`,
      [Number(id)]
    );

    const guide = guideResult.rows[0];

    // 2️⃣ Get languages for this guide
    const langResult = await client.query(
      `SELECT language_id, price 
       FROM lookup_guide_language_price 
       WHERE guide_id = $1`,
      [Number(id)]
    );

    // 3️⃣ Attach languages array
    guide.languages = langResult.rows;

    return ApiResponse.fetched([guide], startTime, "");

  } catch (err) {
    console.error("Error fetching tour_guides_lookup_tour_guides_table:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const startTime = getStartTime();
  const client = getDbConnection(dbName);
  try { 
  const { id } = await params;
  await client.query("BEGIN");
  const referer = req.headers.get("referer");
    const body: TourGuideUpdateBody = await req.json();

    const userDetails = await retriveTokenDetails(req);

    body.tenant_id = userDetails?.tenantId;
    body.updated_by = userDetails?.empCode;
    body.updated_at = new Date().toISOString();
    body.host_ip = userDetails?.userIp;
    body.url = referer && referer.trim() !== "" ? referer : req.url;

    // remove protected columns 
    delete (body as any).id; 
    delete (body as any).short_id; 
    delete (body as any).created_at; 
    delete (body as any).created_by;

const filteredBody = Object.fromEntries(
  Object.entries(body).filter(([key]) => !key.endsWith("Logo"))
);


delete (filteredBody as any).languages;

const keys = Object.keys(filteredBody);
const values = Object.values(filteredBody);

if (!keys || keys.length === 0) {
  await client.query("ROLLBACK");
  return ApiResponse.failed("No fields to update", startTime);
}

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
    
    const query = `
    UPDATE tour_guides_lookup_tour_guides_table 
    SET ${setClause} 
    WHERE id = $${keys.length + 1} 
    RETURNING *
    `;

    const result = await client.query(query, [
      ...values, 
     Number(id)
    ]);

    await client.query(
  `DELETE FROM lookup_guide_language_price WHERE guide_id = $1`,
  [Number(id)]
);

if (body.languages?.length) {
  for (const lang of body.languages) {
    await client.query(
      `INSERT INTO lookup_guide_language_price 
       (guide_id, language_id, price)
       VALUES ($1, $2, $3)`,
      [Number(id), lang.language_id, lang.price]
    );
  }
}

await client.query("COMMIT");

    return ApiResponse.updated(
      result.rows[0]?.id || id,
      startTime
    );

} catch (err) {
  try {
    await client.query("ROLLBACK");
  } catch (e) {
    console.error("Rollback failed:", e);
  }

  console.error("Error updating tour_guides_lookup_tour_guides_table:", err);
  return ApiResponse.failed("", startTime);
}
}



export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
 ) {
  const startTime = getStartTime();
  try {

      const { id } = await params;

      const client = getDbConnection(dbName);

  const referenced = await PrepareAndDispatchValidation(
        "tour_guides_lookup_tour_guides_table",
        client,
        id
      );
  
      if (referenced.validate) {
        return ApiResponse.referencedError("", startTime, referenced.tables);
      }

      const userDetails = await retriveTokenDetails(req);
      const deletedAt = new Date().toISOString();
      const deletedBy = userDetails?.empCode; 
  
      const query =`
        UPDATE tour_guides_lookup_tour_guides_table
        SET is_deleted = true,
            deleted_at = $2,
            deleted_by = $3
        WHERE id = $1
        RETURNING *`;
  
      const result = await client.query(query, [
      id,
      deletedAt,
      deletedBy,
    ]);
   

    return ApiResponse.deleted(startTime);
  } catch (err) {
    console.error("Error deleting tour_guides_lookup_tour_guides_table:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;

    const client = getDbConnection(dbName);

    const result = await client.query(
      `UPDATE tour_guides_lookup_tour_guides_table 
       SET is_active = NOT is_active 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    if (!result.rows.length) {
      return ApiResponse.notFound(startTime);
    }

    if (result.rows[0].is_active) {
      return ApiResponse.activated(startTime);
    } else {
      return ApiResponse.suspended(startTime);
    }

  } catch (err) {
    console.error("Error updating status tour_guides_lookup_tour_guides_table:", err);
    return ApiResponse.failed("", startTime);
  }
}


