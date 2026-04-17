import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { GuideLanguagePriceEntity } from "./interface/guide-language-price";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
// import { checkLookupUsage } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";
import { getUsedUnusedRows } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";


const dbName = process.env.PGDB_NAME_COMMON!;

export async function GET(req: NextRequest) {
  const startTime = getStartTime();
  try {
  const { searchParams } = new URL(req.url);
  const guide_id = searchParams.get("guide_id");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "5", 10);
    const offset = (page - 1) * pageSize;

    // Whitelist sort fields
    const allowedSortFields = ["is_used","is_deleted","is_active","created_at","updated_at","created_by","updated_by","host_ip","url","deleted_at","deleted_by","tenant_id","id","guide_id","language_id","price"]; // adjust to your table columns
    const requestedSortBy = searchParams.get("sortBy") ?? "id";
    const sortBy = allowedSortFields.includes(requestedSortBy)
      ? requestedSortBy
      : "id";

    // Whitelist order
    const requestedOrder = searchParams.get("order");
    const order = requestedOrder === "desc" ? "DESC" : "ASC";

    
  const client = getDbConnection(dbName);
  const result = await client.query(
    `SELECT * 
    FROM lookup_guide_language_price 
    WHERE is_deleted=false
    AND ($1::int IS NULL OR guide_id = $1::int)
    ORDER BY ${sortBy} ${order} 
    LIMIT $2 OFFSET $3`,
    [guide_id, pageSize, offset]
  );

      
  const countResult = await client.query(
    `SELECT COUNT(*)::int AS total 
    FROM lookup_guide_language_price 
    WHERE is_deleted=false
    AND ($1::int IS NULL OR guide_id = $1::int)`,
    [guide_id]
  );
  const totalRecords = countResult?.rows.length > 0 ? countResult?.rows[0].total : 0;
  const totalPages = countResult?.rows.length > 0 ? Math.ceil(totalRecords / pageSize) : 0;

          if (result?.rows.length > 0) { 
            const usedUnusedRows = await getUsedUnusedRows(
                        "lookup_guide_language_price",
                        client
                      );
            
                      result.rows.forEach((element) => {
                        const usageData = usedUnusedRows.find((a) => a.id === element.id);
                        element.is_used = usageData?.is_used ?? false;
                      });
          }

    return ApiResponse.fetched(result?.rows, startTime, "",{
      page,
      pageSize,
      totalRecords,
      totalPages,
      sortBy,
      order,
    });
  } catch (err) {
    console.error("Error fetching lookup_guide_language_price:", err);
    return ApiResponse.failed("", startTime);
  }
}


export async function POST(req: NextRequest) {
  const startTime = getStartTime();
  try {
    const client = getDbConnection(dbName);
    const referer = req.headers.get("referer");
    const body = await req.json();
    const userDetails = await retriveTokenDetails(req);

    // Bulk languages insert/update
    if (body.guide_id && Array.isArray(body.languages)) {
      for (const lang of body.languages) {
        const guide_id = body.guide_id;
        const language_id = lang.language_id;
        const price = lang.price;
        const tenantId = userDetails?.tenantId;
        const empCode = userDetails?.empCode;
        const userIp = userDetails?.userIp;
        const url = referer ?? req.url;

        await client.query(
          `INSERT INTO lookup_guide_language_price
             (guide_id, language_id, price, tenant_id, created_by, created_at, host_ip, url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (guide_id, language_id) DO UPDATE
           SET price = EXCLUDED.price,
               updated_by = $5,
               updated_at = NOW(),
               host_ip = $7,
               url = $8`,
          [guide_id, language_id, price, tenantId, empCode, new Date(), userIp, url]
        );
      }
      return ApiResponse.updated(body.guide_id, startTime); // changed to updated
    }

    // fallback: original single-row insert
    const singleBody: Partial<GuideLanguagePriceEntity> = body;
    singleBody.tenant_id = userDetails?.tenantId;
    singleBody.created_by = userDetails?.empCode;
    singleBody.created_at = new Date();
    singleBody.host_ip = userDetails?.userIp;
    singleBody.url = referer && referer.trim() !== "" ? referer : req.url;

    Object.keys(singleBody).forEach((key) => {
      if ((singleBody as any)[key] === "") (singleBody as any)[key] = null;
    });

    const keys = Object.keys(singleBody);
    const values = Object.values(singleBody);
    if (keys.length === 0) return ApiResponse.failed("No data provided", startTime);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO lookup_guide_language_price (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const result = await client.query(query, values);
    return ApiResponse.created(result.rows[0].id, startTime);

  } catch (err) {
    console.error("Error inserting/updating lookup_guide_language_price:", err);
    return ApiResponse.failed("", startTime);
  }
}