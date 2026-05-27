import { prisma } from "@/lib/prisma";

export const POINTS = {
  READ_MATERIAL: 10,
  COMPLETE_QUIZ: 50,
  QUIZ_BONUS_80: 20,
  COMPLETE_SIMULATION: 40,
  SIMULATION_EXCELLENT: 30,
  UPLOAD_WORK: 30,
  WORK_APPROVED: 40,
  WORK_PUBLISHED: 60,
  DOWNLOAD_ASSET: 10,
  USE_CHATBOT: 5
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function addScore(userId: string, activity: keyof typeof POINTS | string, points: number, referenceId?: string) {
  const existing = await prisma.scoreLog.findFirst({
    where: {
      userId,
      activity,
      ...(referenceId ? { referenceId } : {})
    }
  });

  if (existing) return existing;

  const log = await prisma.scoreLog.create({ data: { userId, activity, points, referenceId } });
  await awardScoreBadges(userId);
  return log;
}

export async function addDailyScore(userId: string, activity: keyof typeof POINTS | string, points: number, referenceId?: string) {
  const existing = await prisma.scoreLog.findFirst({
    where: {
      userId,
      activity,
      createdAt: { gte: startOfToday() }
    }
  });

  if (existing) return existing;
  const log = await prisma.scoreLog.create({ data: { userId, activity, points, referenceId } });
  await awardScoreBadges(userId);
  return log;
}

async function awardScoreBadges(userId: string) {
  const total = await getUserTotalScore(userId);
  const badges = await prisma.badge.findMany({ where: { minScore: { not: null, lte: total } } });
  for (const badge of badges) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      update: {},
      create: { userId, badgeId: badge.id }
    });
  }
}

export async function getUserTotalScore(userId: string) {
  const result = await prisma.scoreLog.aggregate({ where: { userId }, _sum: { points: true } });
  return result._sum.points ?? 0;
}

export async function getLeaderboard(className?: string) {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT", ...(className ? { className } : {}) },
    include: { scoreLogs: true, badges: { include: { badge: true } }, works: true }
  });

  return students
    .map((student) => ({
      id: student.id,
      name: student.name,
      className: student.className ?? "-",
      totalScore: student.scoreLogs.reduce((sum, item) => sum + item.points, 0),
      badge: student.badges.at(-1)?.badge.name ?? "Newbie Journalist",
      workCount: student.works.length
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((student, index) => ({ ...student, rank: index + 1 }));
}
