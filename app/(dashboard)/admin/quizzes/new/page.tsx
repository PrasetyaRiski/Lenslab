import { Role } from "@prisma/client";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { QuizForm } from "@/components/admin/quiz-form";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function NewQuizPage() {
  await requireRole([Role.ADMIN]);
  const materials = await prisma.material.findMany({ orderBy: { title: "asc" } });
  return <div><PageHeader title="Kuis Baru" /><Card><QuizForm materials={materials} /></Card></div>;
}
