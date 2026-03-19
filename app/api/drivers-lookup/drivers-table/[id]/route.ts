import { NextRequest } from "next/server";
import { Pool } from "pg";
import { ApiResponse } from "@/app/api/utils/send-response";
import { getStartTime } from "@/lib/date-functions";
import { DriversTableEntity } from "../interface/drivers-table";
import { getDbConnection } from "@/app/api/config/postgres-db";
import { retriveTokenDetails } from "@/app/api/login/tokens/token";
import { PrepareAndDispatchValidation } from "@/app/api/lib/db/used-unused-rows/used-unused-rows";

const dbName = process.env.PGDB_NAME_COMMON!;


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = getStartTime();

  try {
    const { id } = await params;

    const client = getDbConnection(dbName);

    const result = await client.query(
      `SELECT * FROM drivers_lookup_drivers_table WHERE id = $1`,
      [Number(id)]
    );

    return ApiResponse.fetched(result?.rows, startTime, "");
  } catch (err) {
    console.error("Error fetching drivers_lookup_drivers_table:", err);
    return ApiResponse.failed("", startTime);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const startTime = getStartTime();
  try { 
  const { id } = await params;
  const client = getDbConnection(dbName);
  const referer = req.headers.get("referer");
    const body: Partial<DriversTableEntity> = await req.json();

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

    // remove generated File control helper fields (Logo) 
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
    UPDATE drivers_lookup_drivers_table 
    SET ${setClause} 
    WHERE id = $${keys.length + 1} 
    RETURNING *
    `;

    const result = await client.query(query, [
      ...values, 
     Number(id)
    ]);

    return ApiResponse.updated(
      result.rows[0]?.id || id,
      startTime
    );

  } catch (err) {
    console.error("Error updating drivers_lookup_drivers_table:", err);
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
        "drivers_lookup_drivers_table",
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
        UPDATE drivers_lookup_drivers_table
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
    console.error("Error deleting drivers_lookup_drivers_table:", err);
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
      `UPDATE drivers_lookup_drivers_table 
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
    console.error("Error updating status drivers_lookup_drivers_table:", err);
    return ApiResponse.failed("", startTime);
  }
}


