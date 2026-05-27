import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const badgeSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(5),
  icon: z.string().trim().min(1),
  rule: z.string().trim().min(3),
  minScore: z.coerce.number().int().min(0).optional().nullable()
});

export async function POST(request: NextRequest) {
  await requireRole([Role.ADMIN]);
  const form = await request.formData();
  const parsed = badgeSchema.safeParse({
    name: form.get("name"),
    description: form.get("description"),
    icon: form.get("icon"),
    rule: form.get("rule"),
    minScore: form.get("minScore") || null
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/admin/badges?status=invalid", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }

  await prisma.badge.upsert({
    where: { name: parsed.data.name },
    update: parsed.data,
    create: parsed.data
  });

  return NextResponse.redirect(new URL("/admin/badges?status=saved", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
