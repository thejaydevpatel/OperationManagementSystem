import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest){

  const isLoggedIn = req.cookies.get("admin_auth");
  const { pathname } = req.nextUrl;

  // allow login page
  if(pathname.startsWith("/admin-login")){
    if(isLoggedIn){
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    }
    return NextResponse.next();
  }

  // protect all other pages
  if(!isLoggedIn){
    return NextResponse.redirect(
      new URL("/admin-login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api/admin-login|admin-login).*)",
  ],
};