import { BookOpen, ClipboardList, Images, Trophy, Users } from "lucide-react";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  await requireRole([Role.ADMIN]);
  const [students, mentors, materials, quizzes, assets, works, pendingWorks, scoreAvg, latestWorks] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "MENTOR" } }),
    prisma.material.count(),
    prisma.quiz.count(),
    prisma.asset.count(),
    prisma.studentWork.count(),
    prisma.studentWork.count({ where: { status: "SUBMITTED" } }),
    prisma.scoreLog.groupBy({ by: ["userId"], _sum: { points: true } }),
    prisma.studentWork.findMany({ include: { student: true }, orderBy: { createdAt: "desc" }, take: 5 })
  ]);
  const avg = scoreAvg.length ? Math.round(scoreAvg.reduce((sum, row) => sum + (row._sum.points ?? 0), 0) / scoreAvg.length) : 0;

  return (
    <div>
      <PageHeader title="Dashboard Admin" description="Ringkasan data pembelajaran, kuis, karya siswa, dan aktivitas platform." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Siswa" value={students} icon={Users} />
        <StatCard title="Total Mentor" value={mentors} icon={Users} />
        <StatCard title="Materi" value={materials} icon={BookOpen} />
        <StatCard title="Kuis" value={quizzes} icon={ClipboardList} />
        <StatCard title="Asset" value={assets} icon={Images} />
        <StatCard title="Karya Masuk" value={works} icon={Images} />
        <StatCard title="Menunggu Review" value={pendingWorks} icon={Images} />
        <StatCard title="Rata-rata Skor" value={avg} icon={Trophy} />
      </div>
      <Card className="mt-6">
        <CardTitle>Karya terbaru</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-slate-500"><th className="py-3">Judul</th><th>Siswa</th><th>Kategori</th><th>Status</th><th>Skor</th></tr></thead>
            <tbody>
              {latestWorks.map((work) => (
                <tr key={work.id} className="border-b last:border-0"><td className="py-3 font-semibold">{work.title}</td><td>{work.student.name}</td><td>{work.category}</td><td>{work.status}</td><td>{work.score ?? "-"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
