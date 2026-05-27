import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { QuizForm } from "@/components/admin/quiz-form";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole([Role.ADMIN]);
  const { id } = await params;
  const [quiz, materials] = await Promise.all([
    prisma.quiz.findUnique({ where: { id }, include: { questions: true } }),
    prisma.material.findMany({ orderBy: { title: "asc" } })
  ]);
  if (!quiz) notFound();

  return (
    <div>
      <PageHeader title="Edit Kuis" description={quiz.title} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <QuizForm materials={materials} quiz={quiz} />
          <form action={`/api/quizzes/${quiz.id}`} method="post" className="mt-4 border-t pt-4">
            <input type="hidden" name="_method" value="DELETE" />
            <ConfirmSubmitButton message="Hapus kuis ini beserta jawaban dan attempt terkait?">Hapus Kuis</ConfirmSubmitButton>
          </form>
        </Card>
        <Card>
          <CardTitle>Tambah Soal</CardTitle>
          <form action="/api/questions" method="post" className="mt-4 space-y-3">
            <input type="hidden" name="quizId" value={quiz.id} />
            <div><Label>Pertanyaan</Label><Textarea name="questionText" required /></div>
            <div><Label>Tipe</Label><Select name="questionType"><option value="MULTIPLE_CHOICE">Multiple choice</option><option value="TRUE_FALSE">True/False</option><option value="CASE_STUDY">Case study</option><option value="IMAGE_BASED">Image-based</option></Select></div>
            <div className="grid grid-cols-2 gap-3"><Input name="optionA" placeholder="Opsi A" /><Input name="optionB" placeholder="Opsi B" /><Input name="optionC" placeholder="Opsi C" /><Input name="optionD" placeholder="Opsi D" /></div>
            <div className="grid grid-cols-2 gap-3"><Input name="correctAnswer" placeholder="A/B/C/D" required /><Input name="point" type="number" defaultValue={10} /></div>
            <Textarea name="explanation" placeholder="Pembahasan" />
            <Button type="submit">Tambah Soal</Button>
          </form>
          <div className="mt-5 space-y-2">
            {quiz.questions.map((question) => (
              <div key={question.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                <strong>{question.questionText}</strong>
                <p className="text-slate-500">Jawaban: {question.correctAnswer} - {question.point} poin</p>
                <form action={`/api/questions/${question.id}/delete`} method="post" className="mt-2">
                  <ConfirmSubmitButton message="Hapus soal ini?" size="sm">Hapus Soal</ConfirmSubmitButton>
                </form>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
