import { NextRequest, NextResponse } from "next/server";
import { AuthProvider, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAuthRedirectResponse } from "@/lib/auth";
import { GOOGLE_NEXT_COOKIE, GOOGLE_STATE_COOKIE, getAppUrl, getLoginPath, getPostAuthRedirectPath } from "@/lib/auth-paths";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type GoogleTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type GoogleProfile = {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  picture?: string;
};

type VerifiedGoogleProfile = GoogleProfile & {
  id: string;
  email: string;
};

function getRedirectUri(request: NextRequest) {
  return process.env.GOOGLE_AUTH_REDIRECT_URI || new URL("/api/auth/google/callback", request.url).toString();
}

function redirectWithError(request: NextRequest, error: string) {
  const nextPath = request.cookies.get(GOOGLE_NEXT_COOKIE)?.value;
  const response = NextResponse.redirect(getAppUrl(getLoginPath(nextPath, error), request));
  response.cookies.delete(GOOGLE_STATE_COOKIE);
  response.cookies.delete(GOOGLE_NEXT_COOKIE);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function exchangeCodeForToken(request: NextRequest, code: string) {
  const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google OAuth belum dikonfigurasi.");

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: getRedirectUri(request),
    grant_type: "authorization_code"
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const token = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !token.access_token) {
    throw new Error(token.error_description || token.error || "Gagal menukar code Google.");
  }
  return token.access_token;
}

async function getGoogleProfile(accessToken: string): Promise<VerifiedGoogleProfile> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store"
  });
  const profile = (await response.json()) as GoogleProfile;
  if (!response.ok || !profile.email || !profile.id) throw new Error("Gagal mengambil profil Google.");
  if (profile.verified_email === false) throw new Error("Email Google belum terverifikasi.");
  return profile as VerifiedGoogleProfile;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const storedState = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;

  if (error) return redirectWithError(request, "google_denied");
  if (!code || !state || !storedState || state !== storedState) {
    return redirectWithError(request, "google_state_invalid");
  }

  try {
    const accessToken = await exchangeCodeForToken(request, code);
    const profile = await getGoogleProfile(accessToken);
    const email = profile.email.toLowerCase();
    const name = profile.name || email.split("@")[0];

    const existingByGoogleId = await prisma.user.findUnique({ where: { googleId: profile.id } });
    const existingByEmail = existingByGoogleId ? null : await prisma.user.findUnique({ where: { email } });
    const existingUser = existingByGoogleId ?? existingByEmail;

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: existingUser.googleId ?? profile.id,
            avatarUrl: existingUser.avatarUrl ?? profile.picture ?? null
          }
        })
      : await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl: profile.picture ?? null,
            googleId: profile.id,
            provider: AuthProvider.GOOGLE,
            role: Role.STUDENT
          }
    });

    const nextPath = request.cookies.get(GOOGLE_NEXT_COOKIE)?.value;
    const response = createAuthRedirectResponse(user, getAppUrl(getPostAuthRedirectPath(user.role, nextPath), request));
    response.cookies.delete(GOOGLE_STATE_COOKIE);
    response.cookies.delete(GOOGLE_NEXT_COOKIE);
    return response;
  } catch {
    return redirectWithError(request, "google_login_failed");
  }
}
