import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { MaterialForm } from "@/components/admin/material-form";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function NewMentorMaterialPage() {
  await requireRole([Role.MENTOR, Role.ADMIN]);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <div><PageHeader title="Materi Baru" description="Isi materi baru dan publish jika sudah siap." /><Card><MaterialForm categories={categories} /></Card></div>;
}
