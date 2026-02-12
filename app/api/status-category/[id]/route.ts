import { Pool } from "pg";
import { success, error, notFound } from "@/utils/response";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tms_db",
  password: "12345678",
  port: 5432,
});

//get 
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const idNum = parseInt(id, 10);

    if (Number.isNaN(idNum)) {
         return error({ message: "Invalid ID", status: 400 });
      // return Response.json({ message: "Invalid ID" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT * FROM status_category WHERE id = $1",
      [idNum]
    );

    if (result.rowCount === 0) {
      return notFound({ message: "Record not found" });
      // return Response.json({ message: "Record not found" }, { status: 404 });
    }
    return success({ data: result.rows[0] });    
    // return Response.json({ success: true, data: result.rows[0] }, { status: 200 });

  } catch (err:unknown) {
    console.error(err);
    return error({ message: "Failed to fetch record" });
    // return new Response("Failed to fetch record", { status: 500 });
  }
}

//edit
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;  
    const body = await req.json();

    const { name, description, isactive } = body;

    const result = await pool.query(
      `UPDATE status_category
       SET  
       name        = COALESCE($1, name),
      description  = COALESCE($2, description),
      isactive     = COALESCE($3, isactive)
       WHERE id = $4
       RETURNING *`,
      [name, description, isactive ?? true, id]
    );

    if (result.rowCount === 0) {
      return notFound({ message: "Record not found" });
      // return new Response("Record not found", { status: 404 });
    }
    return success({ message: "Updated successfully", data: result.rows[0] });
    // return Response.json({ success: true,data: result.rows[0]}{status:200},);
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) return error({ message: err.message });
    return error({ message: "Update failed" });
  }
}


//delete
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await pool.query(
      "DELETE FROM status_category WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
        return notFound({ message: "Record not found" });
    }
    return success({ message: "Deleted successfully"});
    }
    catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) return error({ message: err.message });
      return error({ message: "Delete failed" });
    }  
}