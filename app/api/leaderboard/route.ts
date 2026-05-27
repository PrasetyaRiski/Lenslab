import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/score";

export async function GET() {
  return NextResponse.json(await getLeaderboard());
}
