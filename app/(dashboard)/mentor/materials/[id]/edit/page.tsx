import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { MaterialForm } from "@/components/admin/material-form";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function EditMentorMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.MENTOR, Role.ADMIN]);
  const { id } = await params;
  const [material, categories] = await Promise.all([
    prisma.material.findFirst({ where: { id, ...(user.role === "MENTOR" ? { createdById: user.id } : {}) } }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);
  if (!material) notFound();
  return <div><PageHeader title="Edit Materi" description={material.title} /><Card><MaterialForm categories={categories} material={material} /><form action={`/api/materials/${material.id}`} method="post" className="mt-4 border-t pt-4"><input type="hidden" name="_method" value="DELETE" /><ConfirmSubmitButton message="Hapus materi ini? Progress dan relasi terkait dapat ikut terdampak.">Hapus Materi</ConfirmSubmitButton></form></Card></div>;
}
