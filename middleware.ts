import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  canRoleAccessPath,
  getDashboardPathByRole,
  getAppUrl,
  getLoginPath,
  getPostAuthRedirectPath,
  isAuthPagePath,
  isAuthRole,
  isPath,
  isPrivatePath,
  type AuthRole
} from "@/lib/auth-paths";

type MiddlewareTokenPayload = {
  id?: string;
  email?: string;
  role?: unknown;
  exp?: number;
};

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function deleteSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0)
  });
}

async function verifySessionToken(token: string): Promise<{ role: AuthRole } | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

  try {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const header = JSON.parse(decoder.decode(decodeBase64Url(encodedHeader))) as { alg?: string };
    if (header.alg !== "HS256") return null;

    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      encoder.encode(`${encodedHeader}.${encodedPayload}`)
    );
    if (!isValid) return null;

    const payload = JSON.parse(decoder.decode(decodeBase64Url(encodedPayload))) as MiddlewareTokenPayload;
    if (typeof payload.id !== "string" || typeof payload.email !== "string") return null;
    if (!isAuthRole(payload.role)) return null;
    if (typeof payload.exp === "number" && payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return { role: payload.role };
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest, clearCookie = false) {
  const loginUrl = getAppUrl(
    getLoginPath(`${request.nextUrl.pathname}${request.nextUrl.search}`, clearCookie ? "session_expired" : null),
    request
  );
  const response = NextResponse.redirect(loginUrl);
  response.headers.set("Cache-Control", "no-store");
  if (clearCookie) deleteSessionCookie(response);
  return response;
}

function redirectToRoleDashboard(request: NextRequest, role: AuthRole) {
  const response = NextResponse.redirect(getAppUrl(getDashboardPathByRole(role), request)); 
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthPage = isAuthPagePath(pathname);
  const isPrivatePage = isPrivatePath(pathname);

  if (isAuthPage) {
    if (session) {
      const response = NextResponse.redirect(
        getAppUrl(getPostAuthRedirectPath(session.role, request.nextUrl.searchParams.get("next")), request) 
      );
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const response = NextResponse.next();
    if (token) deleteSessionCookie(response);
    return response;
  }

  if (!isPrivatePage) return NextResponse.next();
  if (!session) return redirectToLogin(request, Boolean(token));

  if (isPath(pathname, "/dashboard")) {
    return redirectToRoleDashboard(request, session.role);
  }

  if (!canRoleAccessPath(session.role, pathname)) {
    return redirectToRoleDashboard(request, session.role);
  }

  const response = NextResponse.next();
  if (isPrivatePage) response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/student/:path*",
    "/admin/:path*",
    "/mentor/:path*",
    "/profile/:path*",
    "/gallery/:path*",
    "/leaderboard/:path*"
  ]
};
