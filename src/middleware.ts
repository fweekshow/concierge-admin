import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_COOKIE_VALUE, AUTH_HEADER } from "@/lib/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for login page and API login endpoint
  if (pathname === "/login" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  // --- Auth: cookie OR secret header ---
  const authCookie = request.cookies.get(AUTH_COOKIE);
  const cookieOk = authCookie?.value === AUTH_COOKIE_VALUE;

  const secretHeader = request.headers.get(AUTH_HEADER);
  const headerOk = !!secretHeader && secretHeader === process.env.ADMIN_PASSWORD;

  if (cookieOk || headerOk) {
    return NextResponse.next();
  }

  // Unauthenticated: API routes get 401 JSON, pages get redirect
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};

