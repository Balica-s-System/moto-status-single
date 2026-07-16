import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/dashboard", "/management", "/settings", "/account"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optimistic check only — não redireciona com base apenas no cookie
  // porque o cookie pode existir mesmo com sessão expirada no DB,
  // causando loop entre /login e /dashboard.
  // O layout do dashboard e as server actions validam a sessão real.

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/management/:path*", "/settings/:path*", "/account/:path*", "/login", "/register"],
};
