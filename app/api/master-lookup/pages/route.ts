import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { PagesEntity } from "./interface/pages";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
// import { checkLookupUsage } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";
import { getUsedUnusedRows } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";


const dbName = process.env.PGDB_NAME_COMMON!;

export async function GET(req: NextRequest) {
  const startTime = getStartTime();
  try {
  const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "5", 10);
    const offset = (page - 1) * pageSize;

    // Whitelist sort fields
const allowedSortFields = [
 "is_used","is_deleted","is_active","created_at","updated_at",
 "created_by","updated_by","host_ip","url","deleted_at",
 "deleted_by","tenant_id","id","module_name","page_name","page_url","icon",
 "order_index"
];// adjust to your table columns
    // const requestedSortBy = searchParams.get("sortBy") ?? "id";
    // const requestedSortBy = searchParams.get("sortBy") ?? "order_index";
    // const sortBy = allowedSortFields.includes(requestedSortBy)
    //   ? requestedSortBy
    //   : "id";

    // Whitelist order
    const requestedOrder = searchParams.get("order");
    const order = requestedOrder === "desc" ? "DESC" : "ASC";

    
  const client = getDbConnection(dbName);
   const result = await client.query(`
  SELECT * 
  FROM master_lookup_pages 
  WHERE is_deleted=false  
  ORDER BY order_index ASC 
  LIMIT $1 OFFSET $2
`, [pageSize, offset]); 
      
    const countResult = await client.query(`SELECT COUNT(*)::int AS total FROM master_lookup_pages WHERE is_deleted=false`,   []);
    const totalRecords =
      countResult?.rows.length > 0 ? countResult?.rows[0].total : 0;
    const totalPages =
      countResult?.rows.length > 0 ? Math.ceil(totalRecords / pageSize) : 0;

      if (result?.rows.length > 0) {
            // const usedUnusedRows = await checkLookupUsage(
            //   dbName,
            //   "master_lookup_pages"
            // );
      
            // result.rows.forEach((element) => {
            //   const usageStatus = usedUnusedRows.find((a) => a.id === element.id);
            //   element.is_used = usageStatus?.usage_status;
            // });
            const usedUnusedRows = await getUsedUnusedRows(
                        "master_lookup_pages",
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
      sortBy: "order_index",
      order,
    });
  } catch (err) {
    console.error("Error fetching master_lookup_pages:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function POST(req: NextRequest) {
  const startTime = getStartTime();
  try {
  const client = getDbConnection(dbName);
  const referer = req.headers.get("referer");
  const body: Partial<PagesEntity> = await req.json();

    const userDetails = await retriveTokenDetails(req);
    body.tenant_id = userDetails?.tenantId;
    body.created_by = userDetails?.empCode;
    body.created_at = new Date();
    body.host_ip = userDetails?.userIp;
    body.url = referer && referer.trim() !== "" ? referer : req.url;
    
    
    
 Object.keys(body).forEach((key) => {
      if ((body as any)[key] === "") {
        (body as any)[key] = null;
      }
    });

    

    const keys = Object.keys(body);
    const values = Object.values(body);
    if (keys.length === 0) return ApiResponse.failed("No data provided", startTime);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO master_lookup_pages (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
    const result = await client.query(query, values);
    return ApiResponse.created(result.rows[0].id, startTime);
  } catch (err) {
    console.error("Error inserting master_lookup_pages:", err);
    return ApiResponse.failed("", startTime);
  }
}
