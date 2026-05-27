import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createAuthRedirectResponse, hashPassword } from "@/lib/auth";
import { getAppUrl, getPostAuthRedirectPath, getRegisterPath } from "@/lib/auth-paths";
import { registerSchema } from "@/lib/validators";

function redirectToRegister(request: NextRequest, error: string, next: FormDataEntryValue | null) {
  const response = NextResponse.redirect(getAppUrl(getRegisterPath(next, error), request), { status: 303 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const next = form.get("next");
  const parsed = registerSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return redirectToRegister(request, "invalid_register", next);

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return redirectToRegister(request, "email_taken", next);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      className: parsed.data.className || null,
      passwordHash: await hashPassword(parsed.data.password),
      role: Role.STUDENT
    }
  });
  return createAuthRedirectResponse(user, getAppUrl(getPostAuthRedirectPath(user.role, next), request));
}
