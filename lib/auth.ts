import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  getDashboardPathByRole,
  getManagementPathByRole,
  getStartLearningPathByRole,
  isAuthRole
} from "@/lib/auth-paths";

export type TokenPayload = { id: string; role: Role; email: string };

function getAuthCookieOptions(maxAge = AUTH_COOKIE_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge
  };
}

function shouldUseSecureCookie() {
  const explicit = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
  if (["1", "true", "yes"].includes(explicit ?? "")) return true;
  if (["0", "false", "no"].includes(explicit ?? "")) return false;

  const configuredUrl =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env["NEXT_PUBLIC_APP_URL"]?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).protocol === "https:";
    } catch {
      return process.env.NODE_ENV === "production";
    }
  }

  return process.env.NODE_ENV === "production";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string | null | undefined) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export function signAuthToken(payload: TokenPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET belum diatur.");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export async function createAuthSession(user: { id: string; role: Role; email: string }) {
  await setAuthCookie(signAuthToken({ id: user.id, role: user.role, email: user.email }));
}

export function setAuthCookieOnResponse(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export function clearAuthCookieOnResponse(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(0),
    expires: new Date(0)
  });
}

export function createAuthRedirectResponse(user: { id: string; role: Role; email: string }, url: string | URL, status = 303) {
  const response = NextResponse.redirect(url, { status });
  setAuthCookieOnResponse(response, signAuthToken({ id: user.id, role: user.role, email: user.email }));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getTokenPayload(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as Partial<TokenPayload>;
    if (typeof payload.id !== "string" || typeof payload.email !== "string" || !isAuthRole(payload.role)) return null;
    return { id: payload.id, email: payload.email, role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const payload = await getTokenPayload();
  if (!payload) return null;
  return prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, role: true, className: true, avatarUrl: true }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export const requireAuth = requireUser;

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(getDashboardPathByRole(user.role));
  return user;
}

export { getDashboardPathByRole, getManagementPathByRole, getStartLearningPathByRole };

export const landingPathForRole = getDashboardPathByRole;
