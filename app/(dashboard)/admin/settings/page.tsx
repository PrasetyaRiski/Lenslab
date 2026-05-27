import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth";

export default async function SettingsPage() {
  await requireRole([Role.ADMIN]);
  const flags = [
    ["Google Drive", Boolean(process.env.GOOGLE_REFRESH_TOKEN)],
    ["Gemini API", Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY)],
    ["JWT Secret", Boolean(process.env.JWT_SECRET)],
    ["Database", Boolean(process.env.DATABASE_URL)]
  ] as const;
  return <div><PageHeader title="Pengaturan Integrasi" description="Status konfigurasi environment untuk Google Drive dan Gemini API." /><Card className="max-w-2xl"><CardTitle>Status ENV</CardTitle><div className="mt-4 space-y-3">{flags.map(([name, ok]) => <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><strong>{name}</strong><Badge tone={ok ? "success" : "warning"}>{ok ? "Aktif" : "Mode demo / belum diisi"}</Badge></div>)}</div></Card></div>;
}
