import Link from "next/link";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function QuizzesPage() {
  await requireRole([Role.STUDENT]);
  const quizzes = await prisma.quiz.findMany({ where: { status: "PUBLISHED" }, include: { material: true, questions: true } });
  return (
    <div>
      <PageHeader title="Kuis Jurnalistik" description="Kerjakan kuis untuk menguji pemahaman dan menambah skor leaderboard." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <Badge tone="info">{quiz.durationMinutes} menit</Badge>
            <CardTitle className="mt-4">{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
            <p className="mt-3 text-xs text-slate-500">{quiz.questions.length} soal • minimum {quiz.minimumScore}</p>
            <Link href={`/student/quizzes/${quiz.id}`} className="mt-5 inline-block"><Button>Kerjakan</Button></Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
