"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Message = { role: "user" | "assistant"; content: string };

export function Chatbot() {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo, saya JurnalisBot. Ceritakan ide liputanmu, nanti saya bantu susun angle, headline, caption, atau pertanyaan wawancara." }
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim() || loading) return;

    const current = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: current }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: current })
      });

      const text = await res.text();
      let data: { conversationId?: string; answer?: string; error?: string } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: text };
        }
      }

      if (data.conversationId) setConversationId(data.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer ?? data.error ?? `Server mengembalikan status ${res.status}. Periksa terminal npm run dev.`
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Terjadi kesalahan koneksi ke chatbot."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-100 p-3 text-blue-700"><Bot className="h-6 w-6" /></div>
        <div><h2 className="text-xl font-black">JurnalisBot</h2><p className="text-sm text-slate-500">Konsultasi ide jurnalistik sekolah.</p></div>
      </div>
      <div className="h-[460px] space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4">
        {messages.map((item, index) => (
          <div key={index} className={`max-w-[85%] rounded-2xl p-3 text-sm leading-6 ${item.role === "user" ? "ml-auto bg-amberbrand text-white" : "bg-white text-slate-700 shadow-sm"}`}>{item.content}</div>
        ))}
        {loading ? <div className="max-w-[85%] rounded-2xl bg-white p-3 text-sm text-slate-500 shadow-sm">JurnalisBot sedang menulis...</div> : null}
      </div>
      <div className="mt-4 flex gap-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Contoh: bantu buat angle liputan kegiatan pramuka hari Jumat..."
        />
        <Button type="button" onClick={send} disabled={loading}><Send className="h-4 w-4" /></Button>
      </div>
    </Card>
  );
}
