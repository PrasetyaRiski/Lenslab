import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { hashPassword, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createUserSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  className: z.string().trim().optional().nullable()
});

export async function POST(request: NextRequest) {
  await requireRole([Role.ADMIN]);
  const form = await request.formData();
  const parsed = createUserSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
    role: form.get("role"),
    className: form.get("className") || null
  });

  if (!parsed.success) return NextResponse.redirect(new URL("/admin/users?status=invalid", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.redirect(new URL("/admin/users?status=email_taken", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
      className: parsed.data.className || null
    }
  });

  return NextResponse.redirect(new URL("/admin/users?status=created", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
