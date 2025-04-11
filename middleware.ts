import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow public routes (login, static files, etc.)
  const isPublicRoute = [
    "/login",
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
  ].some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if no token (protected route)
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except public ones
export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};