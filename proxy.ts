import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const isLoggedIn = req.cookies.get("admin_auth")?.value;
  const role = req.cookies.get("admin_role")?.value;

  const { pathname } = req.nextUrl;

  // ✅ allow login page
  if (pathname.startsWith("/admin-login")) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 🚫 block if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  // 🚫 block entity generator for non-admin
  if (pathname.startsWith("/entity-generator")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 👤 USER restriction
  if (role === "user") {
    const allowed =
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/Management") ||
      pathname.startsWith("/dashboard/reports");

    if (!allowed) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api|admin-login).*)",
  ],
};