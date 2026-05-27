import Link from "next/link";
import { Role } from "@prisma/client";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function AdminMaterialsPage() {
  await requireRole([Role.ADMIN]);
  const materials = await prisma.material.findMany({ include: { category: true, createdBy: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHeader title="Kelola Materi" description="Buat, edit, hapus, dan publish materi pembelajaran." action={<Link href="/admin/materials/create"><Button><Plus className="mr-2 h-4 w-4" /> Materi Baru</Button></Link>} />
      <Card>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="py-3">Judul</th><th>Kategori</th><th>Status</th><th>Author</th><th>Aksi</th></tr></thead><tbody>{materials.map((m) => <tr key={m.id} className="border-b last:border-0"><td className="py-3 font-bold">{m.title}</td><td>{m.category.name}</td><td><Badge tone={m.status === "PUBLISHED" ? "success" : "warning"}>{m.status}</Badge></td><td>{m.createdBy.name}</td><td><Link className="font-bold text-amber-600" href={`/admin/materials/${m.id}/edit`}>Edit</Link></td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
