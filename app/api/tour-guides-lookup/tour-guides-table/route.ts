import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { TourGuidesTableEntity } from "./interface/tour-guides-table";
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
    const allowedSortFields = ["is_used","is_deleted","is_active","created_at","updated_at","created_by","updated_by","host_ip","url","deleted_at","deleted_by","tenant_id","id","name","phone","language_id","supplier_id","guide_status_id","notes"]; // adjust to your table columns
    const requestedSortBy = searchParams.get("sortBy") ?? "id";
    const sortBy = allowedSortFields.includes(requestedSortBy)
      ? requestedSortBy
      : "id";

    // Whitelist order
    const requestedOrder = searchParams.get("order");
    const order = requestedOrder === "desc" ? "DESC" : "ASC";

    
  const client = getDbConnection(dbName);
    const result = await client.query(`SELECT * FROM tour_guides_lookup_tour_guides_table WHERE is_deleted=false  ORDER BY ${sortBy} ${order} LIMIT $1 OFFSET $2`,
      [pageSize, offset]);

      
    const countResult = await client.query(`SELECT COUNT(*)::int AS total FROM tour_guides_lookup_tour_guides_table WHERE is_deleted=false`,   []);
    const totalRecords =
      countResult?.rows.length > 0 ? countResult?.rows[0].total : 0;
    const totalPages =
      countResult?.rows.length > 0 ? Math.ceil(totalRecords / pageSize) : 0;

      if (result?.rows.length > 0) { 
            const usedUnusedRows = await getUsedUnusedRows(
                        "tour_guides_lookup_tour_guides_table",
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
    console.error("Error fetching tour_guides_lookup_tour_guides_table:", err);
    return ApiResponse.failed("", startTime);
  }
}


// export async function POST(req: NextRequest) {
//   const startTime = getStartTime();
//   try {
//   const client = getDbConnection(dbName);
// const referer = req.headers.get("referer");
// const userDetails = await retriveTokenDetails(req);

// const systemFields = {
//   tenant_id: userDetails?.tenantId,
//   created_by: userDetails?.empCode,
//   created_at: new Date().toISOString(),
//   host_ip: userDetails?.userIp,
//   url: referer && referer.trim() !== "" ? referer : req.url,
// };

// // REMOVE NON-TABLE FIELDS BEFORE INSERT
// const { languages, id, short_id, ...rest } = input;

// const body = {
//   ...rest,
//   ...systemFields,
// };
    
    
 
// // remove UI/helper fields
// const filteredBody = Object.fromEntries(
//   Object.entries(body).filter(
//     ([key, value]) =>
//       !key.endsWith("Logo") &&
//       value !== undefined &&
//       value !== null
//   )
// );

// const keys = Object.keys(filteredBody);
// const values = Object.values(filteredBody);

// if (keys.length === 0) {
//   return ApiResponse.failed("No data provided", startTime);
// }

// const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

// const query = `
//   INSERT INTO tour_guides_lookup_tour_guides_table
//   (${keys.join(", ")})
//   VALUES (${placeholders})
//   RETURNING *
// `;

// const result = await client.query(query, values);

// const guideId = result.rows[0].id;

// const input = await req.json();
// const { languages = [] } = input;

// // insert languages into child table
// if (languages?.length) {
//   for (const lang of body.languages) {
//     await client.query(
//       `INSERT INTO lookup_guide_language_price 
//        (guide_id, language_id, price)
//        VALUES ($1, $2, $3)`,
//       [guideId, lang.language_id, lang.price]
//     );
//   }
// }

//     return ApiResponse.created(result.rows[0].id, startTime);
//   } catch (err) {
//     console.error("Error inserting tour_guides_lookup_tour_guides_table:", err);
//     return ApiResponse.failed("", startTime);
//   }
// }

export async function POST(req: NextRequest) {
  const startTime = getStartTime();

  try {
    const client = getDbConnection(dbName);
    const referer = req.headers.get("referer");

    // 1️⃣ READ INPUT
    const input: Partial<TourGuidesTableEntity> & {
      languages?: {
        language_id: number;
        price: number;
      }[];
    } = await req.json();

    const { languages = [], ...rest } = input;

    // 2️⃣ USER INFO
    const userDetails = await retriveTokenDetails(req);

    const systemFields = {
      tenant_id: userDetails?.tenantId,
      created_by: userDetails?.empCode,
      created_at: new Date().toISOString(),
      host_ip: userDetails?.userIp,
      url: referer && referer.trim() !== "" ? referer : req.url,
    };

    // 3️⃣ BUILD MAIN BODY (IMPORTANT FIX)
    const body = {
      ...rest,
      ...systemFields,
    };

    // 4️⃣ FILTER BODY
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(
        ([key, value]) =>
          !key.endsWith("Logo") &&
          value !== undefined &&
          value !== null
      )
    );

    const keys = Object.keys(filteredBody);
    const values = Object.values(filteredBody);

    if (keys.length === 0) {
      return ApiResponse.failed("No data provided", startTime);
    }

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO tour_guides_lookup_tour_guides_table
      (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await client.query(query, values);

    const guideId = result.rows[0].id;

    // 5️⃣ INSERT LANGUAGES (FIXED)
    if (languages.length > 0) {
      for (const lang of languages) {
        await client.query(
          `
          INSERT INTO lookup_guide_language_price 
          (guide_id, language_id, price)
          VALUES ($1, $2, $3)
          `,
          [guideId, lang.language_id, lang.price]
        );
      }
    }

    return ApiResponse.created(result.rows[0].id, startTime);

  } catch (err) {
    console.error("Error inserting tour_guides_lookup_tour_guides_table:", err);
    return ApiResponse.failed("", startTime);
  }
}
