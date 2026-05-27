import Link from "next/link";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function StudentQuizResultsPage() {
  const user = await requireRole([Role.STUDENT]);
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id, submittedAt: { not: null } },
    include: { quiz: true, answers: true },
    orderBy: { submittedAt: "desc" }
  });

  return (
    <div>
      <PageHeader title="Hasil Kuis" description="Riwayat kuis yang sudah Anda kerjakan." />
      {attempts.length ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-3">Kuis</th>
                  <th>Skor</th>
                  <th>Benar</th>
                  <th>Salah</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => {
                  const correct = attempt.answers.filter((answer) => answer.isCorrect).length;
                  const wrong = attempt.answers.length - correct;
                  return (
                    <tr key={attempt.id} className="border-b last:border-0">
                      <td className="py-3 font-bold">{attempt.quiz.title}</td>
                      <td>{attempt.score}</td>
                      <td>{correct}</td>
                      <td>{wrong}</td>
                      <td><Badge tone={attempt.passed ? "success" : "danger"}>{attempt.passed ? "Lulus" : "Belum lulus"}</Badge></td>
                      <td>{attempt.submittedAt?.toLocaleDateString("id-ID") ?? "-"}</td>
                      <td><Link className="font-bold text-amber-600" href={`/student/quiz-result/${attempt.id}`}>Detail</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState title="Belum ada hasil kuis" description="Kerjakan kuis pertama untuk melihat riwayat nilai Anda." />
      )}
    </div>
  );
}
