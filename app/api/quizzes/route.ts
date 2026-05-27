import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { quizSchema } from "@/lib/validators";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({ include: { questions: true } });
  return NextResponse.json(quizzes);
}

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const form = await request.formData();
  const parsed = quizSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const quiz = await prisma.quiz.create({ data: { ...parsed.data, materialId: parsed.data.materialId || null, createdById: user.id } });
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, `/admin/quizzes/${quiz.id}/edit`), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
