import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuthRedirectResponse, verifyPassword } from "@/lib/auth";
import { getAppUrl, getLoginPath, getPostAuthRedirectPath } from "@/lib/auth-paths";
import { loginSchema } from "@/lib/validators";

function redirectToLogin(request: NextRequest, error: string, next: FormDataEntryValue | null) {
  const response = NextResponse.redirect(getAppUrl(getLoginPath(next, error), request), { status: 303 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = form.get("next");
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return redirectToLogin(request, "invalid_login", next);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return redirectToLogin(request, "invalid_credentials", next);
  }

  return createAuthRedirectResponse(user, getAppUrl(getPostAuthRedirectPath(user.role, next), request));
}
