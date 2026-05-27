import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { quizSchema } from "@/lib/validators";

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
  const parsed = quizSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const quiz = await prisma.quiz.findUnique({ where: { id }, select: { createdById: true } });
  if (!quiz) return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/quizzes")}?status=not_found`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (user.role === Role.MENTOR && quiz.createdById !== user.id) {
    return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/quizzes")}?status=forbidden`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }
  await prisma.quiz.update({ where: { id }, data: { ...parsed.data, materialId: parsed.data.materialId || null } });
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, "/admin/quizzes"), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const { id } = await params;
  const quiz = await prisma.quiz.findUnique({ where: { id }, select: { createdById: true } });
  if (!quiz) return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/quizzes")}?status=not_found`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (user.role === Role.MENTOR && quiz.createdById !== user.id) {
    return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/quizzes")}?status=forbidden`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }
  await prisma.quiz.delete({ where: { id } });
  return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/quizzes")}?status=deleted`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
