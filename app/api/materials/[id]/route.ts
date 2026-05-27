import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { materialSchema } from "@/lib/validators";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const material = await prisma.material.findUnique({ where: { id }, include: { category: true } });
  if (!material) return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  return NextResponse.json(material);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const form = await request.clone().formData();
  if (form.get("_method") === "DELETE") return DELETE(request, ctx);
  return PATCH(request, ctx);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const { id } = await params;
  const form = await request.formData();
  const data = Object.fromEntries(form);
  delete data._method;
  const parsed = materialSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const material = await prisma.material.findUnique({ where: { id }, select: { createdById: true } });
  if (!material) return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/materials")}?status=not_found`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (user.role === Role.MENTOR && material.createdById !== user.id) {
    return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/materials")}?status=forbidden`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }
  await prisma.material.update({ where: { id }, data: { ...parsed.data, thumbnail: parsed.data.thumbnail || null } });
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, "/admin/materials"), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const { id } = await params;
  const material = await prisma.material.findUnique({ where: { id }, select: { createdById: true } });
  if (!material) return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/materials")}?status=not_found`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (user.role === Role.MENTOR && material.createdById !== user.id) {
    return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/materials")}?status=forbidden`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }
  await prisma.material.delete({ where: { id } });
  return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/materials")}?status=deleted`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
