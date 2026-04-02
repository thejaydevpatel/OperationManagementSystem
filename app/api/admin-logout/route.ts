import { NextResponse } from "next/server";

export async function POST(){

  const response = NextResponse.json({
    message:"Logged out"
  });

  response.cookies.delete("admin_auth");
  response.cookies.delete("admin_code");
  response.cookies.delete("admin_name");
  response.cookies.delete("admin_email");

  return response;

}