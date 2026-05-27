import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { addScore, POINTS } from "@/lib/score";

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.STUDENT]);
  const form = await request.formData();
  const materialId = String(form.get("materialId"));
  const slug = String(form.get("slug") || "");
  const existing = await prisma.materialProgress.findUnique({ where: { userId_materialId: { userId: user.id, materialId } } });
  await prisma.materialProgress.upsert({
    where: { userId_materialId: { userId: user.id, materialId } },
    update: { completed: true, progress: 100, completedAt: new Date() },
    create: { userId: user.id, materialId, completed: true, progress: 100, completedAt: new Date() }
  });
  if (!existing?.completed) await addScore(user.id, "READ_MATERIAL", POINTS.READ_MATERIAL, materialId);
  return NextResponse.redirect(new URL(`/student/materials/${slug}`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
