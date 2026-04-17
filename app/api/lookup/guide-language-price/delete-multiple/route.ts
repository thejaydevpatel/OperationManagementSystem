import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/app/api/config/postgres-db";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({
        message: "No IDs provided",
      });
    }

    const client = await getDbConnection();

    await client.query(
      `DELETE FROM guide_language_price WHERE id = ANY($1::int[])`,
      [ids]
    );

    return NextResponse.json({
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Error deleting records",
    }, { status: 500 });
  }
}