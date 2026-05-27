import { NextRequest, NextResponse } from "next/server";
import { AssetVisibility, PublishStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getManagementPathByRole, requireRole } from "@/lib/auth";
import { uploadFileToDrive } from "@/lib/google-drive";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "application/zip", "video/mp4"]);

export async function GET() {
  const assets = await prisma.asset.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(assets);
}

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.ADMIN, Role.MENTOR]);
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File wajib diunggah" }, { status: 400 });
  const backPath = getManagementPathByRole(user.role, "/admin/assets");
  if (file.size > MAX_FILE_SIZE) return NextResponse.redirect(new URL(`${backPath}?status=file_too_large`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (file.type && !ALLOWED_FILE_TYPES.has(file.type)) return NextResponse.redirect(new URL(`${backPath}?status=file_type`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  const uploaded = await uploadFileToDrive(file, "LensLab Assets");
  await prisma.asset.create({
    data: {
      title: String(form.get("title")),
      description: String(form.get("description") || ""),
      category: String(form.get("category")),
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      driveFileId: uploaded.driveFileId,
      downloadUrl: uploaded.downloadUrl,
      uploadedById: user.id,
      visibility: String(form.get("visibility") || "STUDENT_ONLY") as AssetVisibility,
      status: String(form.get("status") || "PUBLISHED") as PublishStatus
    }
  });
  return NextResponse.redirect(new URL(backPath, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
