export type AuthRole = "ADMIN" | "MENTOR" | "STUDENT";

export const AUTH_COOKIE_NAME = "lenslab_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const GOOGLE_STATE_COOKIE = "lenslab_google_oauth_state";
export const GOOGLE_NEXT_COOKIE = "lenslab_google_oauth_next";
export const DEFAULT_APP_URL = "http://localhost:3000";

const authRoles = ["ADMIN", "MENTOR", "STUDENT"] as const;
const authPagePaths = ["/login", "/register"] as const;
const privatePathPrefixes = ["/dashboard", "/student", "/admin", "/mentor", "/profile", "/gallery", "/leaderboard"] as const;

const allowedRoutePrefixesByRole: Record<AuthRole, readonly string[]> = {
  STUDENT: ["/student"],
  ADMIN: ["/admin", "/mentor"],
  MENTOR: ["/mentor"]
};

export function isAuthRole(role: unknown): role is AuthRole {
  return typeof role === "string" && authRoles.includes(role as AuthRole);
}

export function isPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isAuthPagePath(pathname: string) {
  return authPagePaths.some((path) => isPath(pathname, path));
}

export function isPrivatePath(pathname: string) {
  return privatePathPrefixes.some((path) => isPath(pathname, path));
}

export function getDashboardPathByRole(role: AuthRole | string | null | undefined) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "MENTOR":
      return "/mentor/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/login";
  }
}

export function getStartLearningPathByRole(role: AuthRole | string | null | undefined) {
  switch (role) {
    case "STUDENT":
      return "/student/materials";
    case "MENTOR":
      return "/mentor/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

export function canRoleAccessPath(role: AuthRole, pathname: string) {
  if (isPath(pathname, "/profile") || isPath(pathname, "/gallery") || isPath(pathname, "/leaderboard")) return true;
  if (isPath(pathname, "/student")) return role === "STUDENT";
  if (isPath(pathname, "/admin")) return role === "ADMIN";
  if (isPath(pathname, "/mentor")) return role === "MENTOR" || role === "ADMIN";
  return true;
}

export function getAllowedRoutesByRole(role: AuthRole | string | null | undefined) {
  return isAuthRole(role) ? [...allowedRoutePrefixesByRole[role]] : [];
}

function getPathname(path: string) {
  return new URL(path, "https://lenslab.local").pathname;
}

export function getSafeNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") return null;

  const nextPath = value.trim();
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//") || nextPath.includes("\\")) return null;

  try {
    const url = new URL(nextPath, "https://lenslab.local");
    if (url.origin !== "https://lenslab.local") return null;
    if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) return null;
    if (isAuthPagePath(url.pathname)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function getLoginPath(next?: FormDataEntryValue | string | null, error?: string | null) {
  const params = new URLSearchParams();
  const safeNextPath = getSafeNextPath(next);
  if (safeNextPath) params.set("next", safeNextPath);
  if (error) params.set("error", error);

  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}

export function getRegisterPath(next?: FormDataEntryValue | string | null, error?: string | null) {
  const params = new URLSearchParams();
  const safeNextPath = getSafeNextPath(next);
  if (safeNextPath) params.set("next", safeNextPath);
  if (error) params.set("error", error);

  const query = params.toString();
  return query ? `/register?${query}` : "/register";
}

export function getPostAuthRedirectPath(role: AuthRole | string | null | undefined, next?: FormDataEntryValue | string | null) {
  const safeNextPath = getSafeNextPath(next);
  if (isAuthRole(role) && safeNextPath) {
    const pathname = getPathname(safeNextPath);
    if (!isPrivatePath(pathname) || canRoleAccessPath(role, pathname)) return safeNextPath;
  }

  return getDashboardPathByRole(role);
}

export function getManagementPathByRole(role: AuthRole | string | null | undefined, adminPath: string) {
  if (role === "ADMIN") return adminPath;
  if (role === "MENTOR") return adminPath.replace(/^\/admin(?=\/|$)/, "/mentor");
  return getDashboardPathByRole(role);
}

type RequestLike = {
  headers?: Headers;
  url?: string;
  nextUrl?: { origin?: string };
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function firstHeaderValue(value: string | null | undefined) {
  return value?.split(",")[0]?.trim() || null;
}

export function getAppBaseUrl(request?: RequestLike) {
  const configuredUrl =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env["NEXT_PUBLIC_APP_URL"]?.trim();
  if (configuredUrl) return trimTrailingSlash(configuredUrl);

  const forwardedHost = firstHeaderValue(request?.headers?.get("x-forwarded-host"));
  const host = forwardedHost ?? firstHeaderValue(request?.headers?.get("host"));
  if (host) {
    const forwardedProto = firstHeaderValue(request?.headers?.get("x-forwarded-proto"));
    const proto = forwardedProto || (request?.nextUrl?.origin?.startsWith("https://") ? "https" : "http");
    return `${proto}://${host}`;
  }

  if (request?.nextUrl?.origin) return trimTrailingSlash(request.nextUrl.origin);
  if (request?.url) return trimTrailingSlash(new URL(request.url).origin);
  return DEFAULT_APP_URL;
}

export function getAppUrl(path: string, request?: RequestLike) {
  return new URL(path, getAppBaseUrl(request));
}
