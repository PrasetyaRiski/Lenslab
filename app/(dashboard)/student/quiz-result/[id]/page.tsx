import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function QuizResultPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.STUDENT]);
  const { id } = await params;
  const attempt = await prisma.quizAttempt.findFirst({ where: { id, userId: user.id }, include: { quiz: true, answers: { include: { question: true } } } });
  if (!attempt) notFound();
  return (
    <div>
      <PageHeader title="Hasil Kuis" description={attempt.quiz.title} />
      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-4xl font-black text-slate-950">{attempt.score}</p>
          <Badge tone={attempt.passed ? "success" : "danger"}>{attempt.passed ? "Lulus" : "Belum lulus"}</Badge>
        </div>
        <div className="space-y-4">
          {attempt.answers.map((answer, index) => (
            <div key={answer.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-bold">{index + 1}. {answer.question.questionText}</p>
              <p className="mt-2 text-sm">Jawaban Anda: <strong>{answer.selected}</strong> • Jawaban benar: <strong>{answer.question.correctAnswer}</strong></p>
              <p className="mt-1 text-sm text-slate-500">{answer.question.explanation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
