import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const statusMessages: Record<string, string> = {
  in_use: "Kategori masih dipakai materi, jadi belum bisa dihapus.",
  deleted: "Kategori berhasil dihapus."
};

export default async function CategoriesPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  await requireRole([Role.ADMIN]);
  const params = await searchParams;
  const status = params?.status ? statusMessages[params.status] : null;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <div><PageHeader title="Kelola Kategori" description="Kategori materi pembelajaran LensLab." />{status ? <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{status}</div> : null}<div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><Card><form action="/api/categories" method="post" className="space-y-3"><Input name="name" placeholder="Nama kategori" required /><Input name="slug" placeholder="slug-kategori" required /><Textarea name="description" placeholder="Deskripsi" /><Button type="submit">Tambah Kategori</Button></form></Card><Card><div className="space-y-2">{categories.map((cat) => <div key={cat.id} className="rounded-xl bg-slate-50 p-3"><strong>{cat.name}</strong><p className="text-sm text-slate-500">{cat.description}</p><form action={`/api/categories/${cat.id}/delete`} method="post" className="mt-3"><ConfirmSubmitButton message="Hapus kategori ini?">Hapus</ConfirmSubmitButton></form></div>)}</div></Card></div></div>;
}
