import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const statusMessages: Record<string, string> = {
  incomplete: "Semua soal wajib dijawab sebelum kuis dikirim.",
  no_questions: "Kuis ini belum memiliki soal."
};

export default async function QuizDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ status?: string }> }) {
  await requireRole([Role.STUDENT]);
  const { id } = await params;
  const query = await searchParams;
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } });
  if (!quiz || quiz.status !== "PUBLISHED") notFound();
  const status = query?.status ? statusMessages[query.status] : null;
  return (
    <div>
      <PageHeader title={quiz.title} description={quiz.description} />
      {status ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{status}</div> : null}
      <Card>
        {quiz.questions.length ? <form action={`/api/quizzes/${quiz.id}/attempt`} method="post" className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-900">{index + 1}. {question.questionText}</h3>
              <div className="mt-3 grid gap-2">
                {["A", "B", "C", "D"].map((key) => {
                  const value = key === "A" ? question.optionA : key === "B" ? question.optionB : key === "C" ? question.optionC : question.optionD;
                  if (!value) return null;
                  return <label key={key} className="rounded-xl border border-slate-200 p-3 text-sm"><input type="radio" name={question.id} value={key} className="mr-2" required /> {key}. {value}</label>;
                })}
              </div>
            </div>
          ))}
          <Button type="submit">Kirim Jawaban</Button>
        </form> : <EmptyState title="Belum ada soal" description="Kuis ini belum siap dikerjakan." />}
      </Card>
    </div>
  );
}
