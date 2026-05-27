import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id }, include: { quiz: true } });

  if (!question) return NextResponse.redirect(new URL(getManagementPathByRole(user.role, "/admin/quizzes"), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (user.role === Role.MENTOR && question.quiz.createdById !== user.id) {
    return NextResponse.redirect(new URL(`${getManagementPathByRole(user.role, "/admin/quizzes")}?status=forbidden`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }

  await prisma.question.delete({ where: { id } });
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, `/admin/quizzes/${question.quizId}/edit`), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
