import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
try {

 
const result = await pool.query(`
  SELECT 
    id,
    name
  FROM supplier_master_lookup_supplier_master_table
  WHERE is_deleted = false
  ORDER BY name
`);

return NextResponse.json(result.rows);
 

} catch (err) {
console.error("SUPPLIER API ERROR:", err);
return NextResponse.json(
{ error: "Failed to load suppliers" },
{ status: 500 }
);
}
}
