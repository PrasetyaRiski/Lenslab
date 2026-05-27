import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { reviewWorkSchema } from "@/lib/validators";
import { addScore, POINTS } from "@/lib/score";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const { id } = await params;
  const form = await request.formData();
  const rubricScores = ["themeScore", "compositionScore", "technicalScore", "captionScore", "journalismScore"]
    .map((key) => form.get(key))
    .filter((value) => value !== null)
    .map((value) => Number(value));
  const computedScore = rubricScores.length === 5 && rubricScores.every((value) => Number.isFinite(value))
    ? rubricScores.reduce((sum, value) => sum + Math.max(0, Math.min(20, value)), 0)
    : form.get("score");
  const parsed = reviewWorkSchema.safeParse({
    score: computedScore,
    feedback: form.get("feedback"),
    status: form.get("status"),
    showFeedback: form.get("showFeedback") === "on"
  });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.status === "REVISION" && !parsed.data.feedback.trim()) {
    return NextResponse.redirect(new URL(getManagementPathByRole(user.role, `/admin/works/${id}/review`), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }
  const before = await prisma.studentWork.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Karya tidak ditemukan" }, { status: 404 });
  const work = await prisma.studentWork.update({
    where: { id },
    data: { ...parsed.data, reviewedById: user.id, reviewedAt: new Date() }
  });
  if (parsed.data.status === "APPROVED" && before.status !== "APPROVED") await addScore(work.studentId, "WORK_APPROVED", POINTS.WORK_APPROVED, work.id);
  if (parsed.data.status === "PUBLISHED" && before.status !== "PUBLISHED") await addScore(work.studentId, "WORK_PUBLISHED", POINTS.WORK_PUBLISHED, work.id);
  return NextResponse.redirect(new URL(getManagementPathByRole(user.role, "/admin/works"), process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
