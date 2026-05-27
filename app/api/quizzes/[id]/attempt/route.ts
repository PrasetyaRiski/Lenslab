import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { addScore, POINTS } from "@/lib/score";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.STUDENT]);
  const { id } = await params;
  const form = await request.formData();
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } });
  if (!quiz) return NextResponse.json({ error: "Kuis tidak ditemukan" }, { status: 404 });
  if (!quiz.questions.length) return NextResponse.redirect(new URL(`/student/quizzes/${quiz.id}?status=no_questions`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });

  let earned = 0;
  const missingAnswer = quiz.questions.some((q) => !String(form.get(q.id) ?? "").trim());
  if (missingAnswer) return NextResponse.redirect(new URL(`/student/quizzes/${quiz.id}?status=incomplete`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });

  const totalPoint = quiz.questions.reduce((sum, q) => sum + q.point, 0);
  const answers = quiz.questions.map((q) => {
    const selected = String(form.get(q.id) ?? "");
    const isCorrect = selected === q.correctAnswer;
    const earnedPoint = isCorrect ? q.point : 0;
    earned += earnedPoint;
    return { questionId: q.id, selected, isCorrect, earnedPoint };
  });
  const score = totalPoint > 0 ? Math.round((earned / totalPoint) * 100) : 0;
  const passed = score >= quiz.minimumScore;
  const attempt = await prisma.quizAttempt.create({ data: { userId: user.id, quizId: quiz.id, score, totalPoint, passed, submittedAt: new Date(), answers: { create: answers } } });
  await addScore(user.id, "COMPLETE_QUIZ", POINTS.COMPLETE_QUIZ, quiz.id);
  if (score >= 80) await addScore(user.id, "QUIZ_BONUS_80", POINTS.QUIZ_BONUS_80, quiz.id);

  return NextResponse.redirect(new URL(`/student/quiz-result/${attempt.id}`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
