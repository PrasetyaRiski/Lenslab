import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { materialSchema } from "@/lib/validators";

export async function GET() {
  const materials = await prisma.material.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(materials);
}

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const form = await request.formData();
  const parsed = materialSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const material = await prisma.material.create({ data: { ...parsed.data, thumbnail: parsed.data.thumbnail || null, createdById: user.id } });
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, `/admin/materials/${material.id}/edit`), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
