import { NextRequest } from "next/server";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { getDbConnection } from "@/app/api/config/postgres-db";

const dbName = process.env.PGDB_NAME_COMMON!;

export async function POST(req: NextRequest) {
  const startTime = getStartTime();

  try {
    const client = getDbConnection(dbName);
    const body = await req.json(); // [{id, order_index}]

    for (const item of body) {
      await client.query(
        `UPDATE master_lookup_modules 
         SET order_index = $1 
         WHERE id = $2`,
        [item.order_index, item.id]
      );
    }

    return ApiResponse.updated("Order updated", startTime);
  } catch (error) {
    console.error("Reorder error:", error);
    return ApiResponse.failed("Reorder failed", startTime);
  }
}