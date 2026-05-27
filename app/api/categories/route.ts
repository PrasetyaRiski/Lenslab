import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await requireRole([Role.ADMIN, Role.MENTOR]);
  const form = await request.formData();
  await prisma.category.create({ data: { name: String(form.get("name")), slug: String(form.get("slug")), description: String(form.get("description") || "") } });
  return NextResponse.redirect(new URL("/admin/categories", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
