import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth";
import { getLeaderboard } from "@/lib/score";

export default async function AdminLeaderboardPage() {
  await requireRole([Role.ADMIN]);
  const leaderboard = await getLeaderboard();
  return (
    <div>
      <PageHeader title="Leaderboard" description="Ranking siswa berdasarkan total skor, badge, dan jumlah karya." />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-slate-500"><th className="py-3">Rank</th><th>Nama</th><th>Kelas</th><th>Skor</th><th>Badge</th><th>Karya</th></tr></thead>
            <tbody>{leaderboard.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="py-3 font-black">#{item.rank}</td><td className="font-semibold">{item.name}</td><td>{item.className}</td><td>{item.totalScore}</td><td><Badge>{item.badge}</Badge></td><td>{item.workCount}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
