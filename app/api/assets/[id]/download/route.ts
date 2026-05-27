import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { addScore, POINTS } from "@/lib/score";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([Role.STUDENT]);
  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Asset tidak ditemukan" }, { status: 404 });
  await prisma.assetDownload.create({ data: { userId: user.id, assetId: asset.id } });
  await prisma.asset.update({ where: { id }, data: { totalDownload: { increment: 1 } } });
  await addScore(user.id, "DOWNLOAD_ASSET", POINTS.DOWNLOAD_ASSET, asset.id);
  return NextResponse.redirect(asset.downloadUrl ? asset.downloadUrl : new URL("/student/assets", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
