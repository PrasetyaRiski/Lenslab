import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookieOnResponse } from "@/lib/auth";
import { GOOGLE_NEXT_COOKIE, GOOGLE_STATE_COOKIE, getAppUrl, getLoginPath } from "@/lib/auth-paths";

function createLogoutResponse(request: NextRequest) {
  const response = NextResponse.redirect(getAppUrl(getLoginPath(), request), { status: 303 });
  clearAuthCookieOnResponse(response);
  response.cookies.delete(GOOGLE_STATE_COOKIE);
  response.cookies.delete(GOOGLE_NEXT_COOKIE);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  return createLogoutResponse(request);
}

export async function GET(request: NextRequest) {
  return createLogoutResponse(request);
}
