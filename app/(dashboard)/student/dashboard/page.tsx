import Link from "next/link";
import { BookOpen, CheckCircle2, Images, Medal, Trophy } from "lucide-react";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getLeaderboard, getUserTotalScore } from "@/lib/score";

export default async function StudentDashboardPage() {
  const user = await requireRole([Role.STUDENT]);
  const [materials, completedMaterials, completedQuizzes, worksCount, works, score, leaderboard, badges, activities] = await Promise.all([
    prisma.material.count({ where: { status: "PUBLISHED" } }),
    prisma.materialProgress.count({ where: { userId: user.id, completed: true } }),
    prisma.quizAttempt.count({ where: { userId: user.id, submittedAt: { not: null } } }),
    prisma.studentWork.count({ where: { studentId: user.id } }),
    prisma.studentWork.findMany({ where: { studentId: user.id }, orderBy: { createdAt: "desc" }, take: 4 }),
    getUserTotalScore(user.id),
    getLeaderboard(user.className ?? undefined),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, take: 4 }),
    prisma.scoreLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 })
  ]);
  const rank = leaderboard.find((item) => item.id === user.id)?.rank ?? "-";

  return (
    <div>
      <PageHeader title="Dashboard Siswa" description="Pantau progress belajar, skor, ranking, dan karya jurnalistik Anda." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Materi Selesai" value={`${completedMaterials}/${materials}`} icon={BookOpen} />
        <StatCard title="Kuis Selesai" value={completedQuizzes} icon={CheckCircle2} />
        <StatCard title="Total Skor" value={score} icon={Trophy} />
        <StatCard title="Ranking Kelas" value={rank} icon={Medal} />
        <StatCard title="Karya Upload" value={worksCount} icon={Images} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardTitle>Jalur belajar cepat</CardTitle>
          <CardDescription>Mulai dari materi, lanjut simulasi, lalu upload karya untuk mendapat feedback mentor.</CardDescription>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link href="/student/materials"><Button className="w-full" variant="outline">Baca Materi</Button></Link>
            <Link href="/student/simulator"><Button className="w-full" variant="outline">Coba Simulasi</Button></Link>
            <Link href="/student/upload-work"><Button className="w-full">Upload Karya</Button></Link>
          </div>
        </Card>
        <Card>
          <CardTitle>Karya terbaru</CardTitle>
          <div className="mt-4 space-y-3">
            {works.length ? works.map((work) => (
              <div key={work.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-2"><Images className="h-4 w-4 text-amber-600" /><p className="font-bold text-slate-900">{work.title}</p></div>
                <p className="text-xs text-slate-500">{work.category} - {work.status}</p>
              </div>
            )) : <p className="text-sm text-slate-500">Belum ada karya. Upload karya pertama Anda.</p>}
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Badge</CardTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.length ? badges.map((item) => <span key={item.id} className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">{item.badge.name}</span>) : <p className="text-sm text-slate-500">Belum ada badge.</p>}
          </div>
        </Card>
        <Card>
          <CardTitle>Aktivitas terbaru</CardTitle>
          <div className="mt-4 space-y-2">
            {activities.length ? activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
                <span>{activity.activity}</span>
                <strong>+{activity.points}</strong>
              </div>
            )) : <p className="text-sm text-slate-500">Belum ada aktivitas skor.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
