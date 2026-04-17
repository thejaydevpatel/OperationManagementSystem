import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(){

  const cookieStore = await cookies(); // ⭐ VERY IMPORTANT (await)

  const user = {
    code: cookieStore.get("admin_code")?.value,
    name: cookieStore.get("admin_name")?.value,
    email: cookieStore.get("admin_email")?.value,
    role: cookieStore.get("admin_role")?.value 
  };

  return NextResponse.json(user);

}