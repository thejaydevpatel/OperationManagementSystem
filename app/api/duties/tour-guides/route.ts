// // app/api/duties/guides/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/config";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        g."id",
        g."name",
        g."language_id"
      FROM "tour_guides_lookup_tour_guides_table" g
      WHERE g."is_deleted" = false
      ORDER BY g."name"
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tour guides" },
      { status: 500 }
    );
  }
}

// /api/tour-guides.ts
// import { NextResponse } from "next/server";
// import { pool } from "@/lib/config";

// export async function GET(req: Request) {
//   try {
//     const result = await pool.query(`
//       SELECT tg.id, tg.name, tg.language_id
//       FROM "tour_guides_lookup_tour_guides_table" tg
//       WHERE tg.is_deleted = false
//       ORDER BY tg.name
//     `);
//     return NextResponse.json({ data: result.rows });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }