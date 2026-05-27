import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function LegacyLeaderboardPage() {
  const user = await requireUser();
  redirect(`/${user.role.toLowerCase()}/leaderboard`);
}
