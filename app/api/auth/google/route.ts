import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_NEXT_COOKIE, GOOGLE_STATE_COOKIE, getAppUrl, getLoginPath, getSafeNextPath } from "@/lib/auth-paths";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function createState() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getRedirectUri(request: NextRequest) {
  return process.env.GOOGLE_AUTH_REDIRECT_URI || new URL("/api/auth/google/callback", request.url).toString();
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));

  if (!clientId) {
    const response = NextResponse.redirect(getAppUrl(getLoginPath(nextPath, "google_config"), request));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const state = createState();
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", getRedirectUri(request));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10
  });
  if (nextPath) {
    response.cookies.set(GOOGLE_NEXT_COOKIE, nextPath, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10
    });
  } else {
    response.cookies.delete(GOOGLE_NEXT_COOKIE);
  }

  return response;
}
