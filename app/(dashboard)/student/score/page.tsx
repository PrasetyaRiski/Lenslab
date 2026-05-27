import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getUserTotalScore } from "@/lib/score";

export default async function ScorePage() {
  const user = await requireRole([Role.STUDENT]);
  const [score, logs, badges] = await Promise.all([
    getUserTotalScore(user.id),
    prisma.scoreLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true } })
  ]);
  return (
    <div>
      <PageHeader title="Skor Saya" description="Riwayat poin dan badge aktivitas jurnalistik Anda." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><p className="text-sm text-slate-500">Total Skor</p><p className="mt-2 text-6xl font-black text-slate-950">{score}</p><div className="mt-4 flex flex-wrap gap-2">{badges.length ? badges.map((item) => <Badge key={item.id}>{item.badge.name}</Badge>) : <Badge>Newbie Journalist</Badge>}</div></Card>
        <Card><CardTitle>Riwayat skor</CardTitle><div className="mt-4 space-y-2">{logs.map((log) => <div key={log.id} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{log.activity}</span><strong>+{log.points}</strong></div>)}</div></Card>
      </div>
    </div>
  );
}
