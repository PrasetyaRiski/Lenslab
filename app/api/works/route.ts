import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { uploadFileToDrive } from "@/lib/google-drive";
import { addScore, POINTS } from "@/lib/score";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4"]);

export async function GET() {
  const user = await requireRole([Role.ADMIN, Role.MENTOR, Role.STUDENT]);
  const works = await prisma.studentWork.findMany({
    where: user.role === "STUDENT" ? { studentId: user.id } : {},
    include: { student: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(works);
}

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.STUDENT]);
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File karya wajib diunggah" }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.redirect(new URL("/student/upload-work?status=file_too_large", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  if (file.type && !ALLOWED_FILE_TYPES.has(file.type)) return NextResponse.redirect(new URL("/student/upload-work?status=file_type", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  const uploaded = await uploadFileToDrive(file, "LensLab Student Works");
  const work = await prisma.studentWork.create({
    data: {
      title: String(form.get("title")),
      description: String(form.get("description")),
      category: String(form.get("category")),
      caption: String(form.get("caption") || ""),
      noteForMentor: String(form.get("noteForMentor") || ""),
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      driveFileId: uploaded.driveFileId,
      previewUrl: uploaded.previewUrl,
      downloadUrl: uploaded.downloadUrl,
      studentId: user.id,
      status: "SUBMITTED"
    }
  });
  await addScore(user.id, "UPLOAD_WORK", POINTS.UPLOAD_WORK, work.id);
  return NextResponse.redirect(new URL("/student/my-works", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
