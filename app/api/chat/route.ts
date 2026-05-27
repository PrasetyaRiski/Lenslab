import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { askJurnalisBot, JURNALISBOT_SYSTEM_PROMPT } from "@/lib/openai";
import { chatSchema } from "@/lib/validators";
import { addDailyScore, POINTS } from "@/lib/score";

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole([Role.STUDENT, Role.ADMIN, Role.MENTOR]);
    const json = await request.json().catch(() => null);
    const parsed = chatSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Pesan tidak valid" }, { status: 400 });
    }

    let conversationId = parsed.data.conversationId;
    if (!conversationId) {
      const conversation = await prisma.chatConversation.create({
        data: { userId: user.id, title: parsed.data.message.slice(0, 60) }
      });
      conversationId = conversation.id;
    }

    await prisma.chatMessage.create({
      data: { conversationId, userId: user.id, role: "USER", content: parsed.data.message }
    });

    const history = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10
    });

    const messages = [
      { role: "system" as const, content: JURNALISBOT_SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role === "ASSISTANT" ? ("assistant" as const) : ("user" as const),
        content: m.content
      }))
    ];

    const answer = await askJurnalisBot(messages);

    await prisma.chatMessage.create({
      data: { conversationId, role: "ASSISTANT", content: answer }
    });

    await addDailyScore(user.id, "USE_CHATBOT", POINTS.USE_CHATBOT, conversationId);

    return NextResponse.json({ conversationId, answer });
  } catch (error) {
    console.error("/api/chat error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada chatbot.";

    const lower = message.toLowerCase();

    return NextResponse.json(
      {
        error:
          lower.includes("api key") || lower.includes("permission") || lower.includes("unauthorized")
            ? "API key Gemini tidak valid atau belum aktif. Periksa GEMINI_API_KEY di file .env lalu restart npm run dev."
            : lower.includes("quota") || lower.includes("rate") || lower.includes("limit")
              ? "Kuota/rate limit Gemini API free tier sedang habis. Coba lagi nanti atau cek limit di Google AI Studio."
              : `Chatbot belum bisa menjawab: ${message}`
      },
      { status: 500 }
    );
  }
}
