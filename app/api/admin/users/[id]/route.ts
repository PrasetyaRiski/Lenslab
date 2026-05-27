import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateUserSchema = z.object({
  name: z.string().trim().min(3),
  role: z.nativeEnum(Role),
  className: z.string().trim().optional().nullable()
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireRole([Role.ADMIN]);
  const { id } = await params;
  const form = await request.formData();
  const parsed = updateUserSchema.safeParse({
    name: form.get("name"),
    role: form.get("role"),
    className: form.get("className") || null
  });

  if (!parsed.success) return NextResponse.redirect(new URL("/admin/users?status=invalid", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (id === admin.id && parsed.data.role !== Role.ADMIN) return NextResponse.redirect(new URL("/admin/users?status=cannot_demote_self", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target) return NextResponse.redirect(new URL("/admin/users?status=not_found", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });

  if (target.role === Role.ADMIN && parsed.data.role !== Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) return NextResponse.redirect(new URL("/admin/users?status=last_admin", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }

  await prisma.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role,
      className: parsed.data.className || null
    }
  });

  return NextResponse.redirect(new URL("/admin/users?status=updated", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
