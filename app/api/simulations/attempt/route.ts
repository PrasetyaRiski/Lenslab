import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { scoreCameraAttempt } from "@/lib/camera-score";
import { addScore, POINTS } from "@/lib/score";

export async function POST(request: NextRequest) {
  const user = await requireRole([Role.STUDENT]);
  const body = await request.json();

  let scenario = await prisma.simulationScenario.findFirst({ orderBy: { createdAt: "asc" } });
  if (!scenario) {
    scenario = await prisma.simulationScenario.create({
      data: {
        title: "Manual Practice",
        slug: "manual-practice",
        description: "Simulasi latihan bebas tanpa skenario tetap.",
        idealIso: 400,
        idealAperture: "f/5.6",
        idealShutter: "1/125",
        idealWhiteBalance: "Auto",
        idealFocalLength: "35mm",
        lighting: "mixed",
        movement: "medium",
        goal: "latihan umum"
      }
    });
  }

  const result = scoreCameraAttempt({
    iso: Number(body.iso),
    aperture: body.aperture,
    shutterSpeed: body.shutterSpeed,
    whiteBalance: body.whiteBalance,
    focalLength: body.focalLength
  });

  const attempt = await prisma.simulationAttempt.create({
    data: {
      userId: user.id,
      scenarioId: scenario.id,
      iso: Number(body.iso),
      aperture: body.aperture,
      shutterSpeed: body.shutterSpeed,
      whiteBalance: body.whiteBalance,
      focalLength: body.focalLength,
      exposureScore: result.exposureScore,
      shutterScore: result.shutterScore,
      apertureScore: result.apertureScore,
      isoScore: result.isoScore,
      wbScore: result.wbScore,
      totalScore: result.totalScore,
      feedback: result.feedback
    }
  });

  await addScore(user.id, "COMPLETE_SIMULATION", POINTS.COMPLETE_SIMULATION, scenario.id);
  if (result.totalScore >= 90) await addScore(user.id, "SIMULATION_EXCELLENT", POINTS.SIMULATION_EXCELLENT, scenario.id);

  return NextResponse.json({ id: attempt.id, ...result });
}
