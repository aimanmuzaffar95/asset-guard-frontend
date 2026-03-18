import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_ONLY_PREFIXES = ["/dashboard", "/assets", "/asset-types", "/assignments", "/assignment-history"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isLoginRoute = pathname === "/login";

  const accessToken = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const isAuthenticatedAdmin = Boolean(accessToken) && userRole === "admin";

  if (isAdminRoute && !isAuthenticatedAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && isAuthenticatedAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/assets/:path*",
    "/asset-types/:path*",
    "/assignments/:path*",
    "/assignment-history/:path*",
    "/login",
  ],
};
