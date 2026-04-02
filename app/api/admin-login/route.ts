import { NextResponse } from "next/server";
import { getDbConnection } from "@/app/api/config/postgres-db";

export async function POST(req: Request) {

  try {

    const { name, password } = await req.json();

    const client = getDbConnection(process.env.PGDB_NAME_COMMON!);

    const result = await client.query(
      `SELECT * FROM admin_users_lookup_admin_users_table
       WHERE name=$1 AND password=$2 AND is_deleted=false`,
      [name, password]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid Login" },
        { status: 401 }
      );
    }

    // ✅ create response
const user = result.rows[0];

const response = NextResponse.json({
  message: "Login Success"
});

response.cookies.set("admin_auth", "true", { httpOnly:true , path:"/" });

response.cookies.set("admin_code", user.user_code , { path:"/" });
response.cookies.set("admin_name", user.name , { path:"/" });
response.cookies.set("admin_email", user.email , { path:"/" });

return response;

    // ✅ set cookie
    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/"
    });

    return response;

  } catch (err) {
    console.log("Login Error", err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }

}