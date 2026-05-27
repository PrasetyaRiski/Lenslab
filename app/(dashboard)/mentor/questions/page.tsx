import Link from "next/link";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function MentorQuestionsPage() {
  const user = await requireRole([Role.MENTOR, Role.ADMIN]);
  const quizzes = await prisma.quiz.findMany({
    where: user.role === "MENTOR" ? { createdById: user.id } : {},
    include: { questions: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <PageHeader title="Kelola Soal" description="Soal dikelola dari halaman edit kuis masing-masing." />
      {quizzes.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <Badge>{quiz.status}</Badge>
              <CardTitle className="mt-4">{quiz.title}</CardTitle>
              <p className="mt-2 text-sm text-slate-500">{quiz.questions.length} soal</p>
              <Link className="mt-4 inline-block font-bold text-amber-600" href={`/mentor/quizzes/${quiz.id}/edit`}>Kelola soal</Link>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada kuis" description="Buat kuis terlebih dahulu sebelum menambahkan soal." />
      )}
    </div>
  );
}
