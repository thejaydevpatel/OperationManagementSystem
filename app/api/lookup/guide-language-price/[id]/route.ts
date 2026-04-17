import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { GuideLanguagePriceEntity } from "../interface/guide-language-price";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
import { PrepareAndDispatchValidation } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";

const dbName = process.env.PGDB_NAME_COMMON!;


// ===================== GET =====================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;

    const client = getDbConnection(dbName);
    const userDetails = await retriveTokenDetails(req); // ✅ added

    const result = await client.query(
      `SELECT id, language_id, price
       FROM lookup_guide_language_price
       WHERE guide_id = $1 
         AND tenant_id = $2   -- ✅ added safety
         AND is_deleted = false`,
      [Number(id), userDetails?.tenantId]
    );

    return ApiResponse.fetched(result?.rows, startTime, "");

  } catch (err) {
    console.error("Error fetching lookup_guide_language_price:", err);
    return ApiResponse.failed("", startTime);
  }
}


// ===================== PUT =====================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;
    const client = getDbConnection(dbName);
    const referer = req.headers.get("referer");

    const body: Partial<GuideLanguagePriceEntity> = await req.json();
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

    // remove helper fields
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([key]) => !key.endsWith("Logo"))
    );

    const keys = Object.keys(filteredBody);
    const values = Object.values(filteredBody);

    if (keys.length === 0) {
      return ApiResponse.failed("No fields to update", startTime);
    }

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    const query = `
      UPDATE lookup_guide_language_price 
      SET ${setClause} 
      WHERE id = $${keys.length + 1}
        AND tenant_id = $${keys.length + 2}  -- ✅ added safety
      RETURNING *
    `;

    const result = await client.query(query, [
      ...values,
      Number(id),
      userDetails?.tenantId
    ]);

    return ApiResponse.updated(result.rows[0]?.id || id, startTime);

  } catch (err) {
    console.error("Error updating lookup_guide_language_price:", err);
    return ApiResponse.failed("", startTime);
  }
}


// ===================== BULK SAVE =====================
export async function saveGuideLanguages(
  guideId: number,
  languages: { languageId: number; price: number }[],
  req: NextRequest
) {
  const startTime = getStartTime();
  const client = getDbConnection(dbName);
  const userDetails = await retriveTokenDetails(req);
  const referer = req.headers.get("referer") || req.url;

  try {
    await client.query("BEGIN");

    // Step 1: get existing
    const existingResult = await client.query(
      `SELECT id, language_id, is_deleted
       FROM lookup_guide_language_price
       WHERE guide_id = $1
         AND tenant_id = $2`,   // ✅ added
      [guideId, userDetails?.tenantId]
    );

    const existingMap = new Map<number, { id: number; is_deleted: boolean }>();
    for (const row of existingResult.rows) {
      existingMap.set(Number(row.language_id), {
        id: Number(row.id),
        is_deleted: row.is_deleted
      });
    }

    const requestLangIds = new Set<number>();

    // Step 2: insert/update
    for (const lang of languages) {
      const languageId = Number(lang.languageId);
      requestLangIds.add(languageId);

      const existing = existingMap.get(languageId);

      if (existing) {
        await client.query(
          `UPDATE lookup_guide_language_price
           SET price = $1,
               is_deleted = false,
               updated_at = NOW(),
               updated_by = $2,
               host_ip = $3,
               url = $4
           WHERE id = $5`,
          [
            lang.price,
            userDetails?.empCode || "system",
            userDetails?.userIp || "",
            referer,
            existing.id
          ]
        );
      } else {
        await client.query(
          `INSERT INTO lookup_guide_language_price
           (guide_id, language_id, price, created_at, created_by, host_ip, url, tenant_id)
           VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)`,
          [
            guideId,
            languageId,
            lang.price,
            userDetails?.empCode || "system",
            userDetails?.userIp || "",
            referer,
            userDetails?.tenantId || 0
          ]
        );
      }
    }

    // Step 3: soft delete removed
    for (const [languageId, record] of existingMap.entries()) {
      if (!requestLangIds.has(languageId) && !record.is_deleted) {
        await client.query(
          `UPDATE lookup_guide_language_price
           SET is_deleted = true,
               deleted_at = NOW(),
               deleted_by = $1
           WHERE id = $2`,
          [userDetails?.empCode || "system", record.id]
        );
      }
    }

    await client.query("COMMIT");

    return ApiResponse.updated(guideId, startTime); // ✅ improved

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving guide languages:", err);
    return ApiResponse.failed("", startTime);
  }
}


// ===================== DELETE =====================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;
    if (!id) return ApiResponse.failed("Missing id", startTime);

    const client = getDbConnection(dbName);
    const userDetails = await retriveTokenDetails(req);

    await client.query(
      `UPDATE lookup_guide_language_price
       SET is_deleted = true,
           deleted_at = NOW(),
           deleted_by = $2
       WHERE id = $1
         AND tenant_id = $3`,  // ✅ added
      [Number(id), userDetails?.empCode, userDetails?.tenantId]
    );

    return ApiResponse.deleted(startTime);

  } catch (err) {
    console.error("Error deleting lookup_guide_language_price:", err);
    return ApiResponse.failed("", startTime);
  }
}


// ===================== PATCH =====================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;
    const client = getDbConnection(dbName);
    const userDetails = await retriveTokenDetails(req);

    const result = await client.query(
      `UPDATE lookup_guide_language_price 
       SET is_active = NOT is_active 
       WHERE id = $1
         AND tenant_id = $2   -- ✅ added
       RETURNING *`,
      [id, userDetails?.tenantId]
    );

    if (!result.rows.length) {
      return ApiResponse.notFound(startTime);
    }

    return result.rows[0].is_active
      ? ApiResponse.activated(startTime)
      : ApiResponse.suspended(startTime);

  } catch (err) {
    console.error("Error updating status lookup_guide_language_price:", err);
    return ApiResponse.failed("", startTime);
  }
}