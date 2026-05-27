export const JURNALISBOT_SYSTEM_PROMPT = `Kamu adalah JurnalisBot, asisten jurnalistik sekolah. Tugasmu membantu siswa ekstrakurikuler jurnalistik membuat ide liputan, angle berita, headline, caption, pertanyaan wawancara, dan saran fotografi. Gunakan bahasa Indonesia yang jelas, edukatif, sopan, dan sesuai konteks sekolah. Jangan membuat berita palsu, jangan mengarang narasumber, dan selalu ingatkan siswa untuk melakukan verifikasi fakta.`;

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GeminiPart = { text: string };
type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
    finishReason?: string;
  }>;
  promptFeedback?: unknown;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const baseUrl = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

  return { apiKey, model, baseUrl };
}

function demoAnswer(messages: ChatMessage[]) {
  const last = messages.filter((m) => m.role === "user").at(-1)?.content ?? "ide liputan";

  return `Mode demo JurnalisBot:

Berikut 5 ide liputan jurnalistik sekolah berdasarkan topik “${last}”:

1. Kegiatan pagi di sekolah
Angle: bagaimana rutinitas pagi membentuk kedisiplinan siswa.
Narasumber: guru piket, siswa, dan wali kelas.

2. Ekskul yang paling aktif
Angle: peran ekstrakurikuler dalam mengembangkan bakat siswa.
Narasumber: pembina ekskul dan anggota aktif.

3. Kebersihan lingkungan sekolah
Angle: kesadaran siswa dalam menjaga lingkungan belajar.
Narasumber: petugas kebersihan, OSIS, dan siswa.

4. Kegiatan literasi sekolah
Angle: upaya sekolah meningkatkan minat baca siswa.
Narasumber: guru Bahasa Indonesia, pustakawan, dan siswa.

5. Prestasi siswa
Angle: proses di balik pencapaian siswa dalam lomba akademik atau nonakademik.
Narasumber: siswa berprestasi, guru pembimbing, dan teman sekelas.

Ingat: lakukan verifikasi fakta, jangan mengarang narasumber, dan pastikan data sesuai kondisi nyata di sekolah.`;
}

function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
  const filtered = messages.filter((m) => m.role !== "system" && m.content.trim().length > 0);

  if (filtered.length === 0) {
    return [{ role: "user", parts: [{ text: "Bantu saya mencari ide liputan jurnalistik sekolah." }] }];
  }

  return filtered.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }]
  }));
}

export async function askJurnalisBot(messages: ChatMessage[]) {
  const { apiKey, model, baseUrl } = getGeminiConfig();

  if (!apiKey) {
    return demoAnswer(messages);
  }

  const endpoint = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: JURNALISBOT_SYSTEM_PROMPT }]
      },
      contents: toGeminiContents(messages),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 900
      }
    })
  });

  const payload = (await response.json().catch(() => ({}))) as GeminiGenerateResponse;

  if (!response.ok) {
    const message = payload.error?.message || `Gemini API error ${response.status}`;
    throw new Error(message);
  }

  const answer = payload.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim();

  if (!answer) {
    throw new Error("Gemini tidak mengembalikan jawaban teks. Coba ulangi pertanyaan dengan kalimat yang lebih jelas.");
  }

  return answer;
}
