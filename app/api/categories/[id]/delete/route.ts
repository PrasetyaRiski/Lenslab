import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireRole([Role.ADMIN]);
  const { id } = await params;
  const materialCount = await prisma.material.count({ where: { categoryId: id } });

  if (materialCount > 0) {
    return NextResponse.redirect(new URL("/admin/categories?status=in_use", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.redirect(new URL("/admin/categories?status=deleted", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
