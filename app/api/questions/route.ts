import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { questionSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const form = await request.formData();
  const parsed = questionSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  await prisma.question.create({ data: parsed.data });
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, `/admin/quizzes/${parsed.data.quizId}/edit`), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
