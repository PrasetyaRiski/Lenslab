import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function redirectToUsers(request: NextRequest, status: string) {
  const response = NextResponse.redirect(new URL(`/admin/users?status=${status}`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireRole([Role.ADMIN]);
  const { id } = await params;

  if (id === admin.id) return redirectToUsers(request, "cannot_delete_self");

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true }
  });

  if (!target) return redirectToUsers(request, "not_found");
  if (target.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) return redirectToUsers(request, "last_admin");
  }

  await prisma.user.delete({ where: { id: target.id } });
  return redirectToUsers(request, "deleted");
}
