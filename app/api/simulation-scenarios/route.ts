import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const scenarioSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  description: z.string().trim().min(10),
  idealIso: z.coerce.number().int().min(50),
  idealAperture: z.string().trim().min(1),
  idealShutter: z.string().trim().min(1),
  idealWhiteBalance: z.string().trim().min(1),
  idealFocalLength: z.string().trim().min(1),
  lighting: z.string().trim().min(1),
  movement: z.string().trim().min(1),
  goal: z.string().trim().min(1)
});

export async function POST(request: NextRequest) {
  await requireRole([Role.ADMIN]);
  const form = await request.formData();
  const parsed = scenarioSchema.safeParse(Object.fromEntries(form));

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/admin/simulation?status=invalid", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
  }

  await prisma.simulationScenario.upsert({
    where: { slug: parsed.data.slug },
    update: parsed.data,
    create: parsed.data
  });

  return NextResponse.redirect(new URL("/admin/simulation?status=saved", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), { status: 303 });
}
