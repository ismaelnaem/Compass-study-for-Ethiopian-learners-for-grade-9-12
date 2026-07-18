import React, { useEffect, useRef, useState } from "react";
import { TRANSLATIONS, Language } from "../translations";
import { apiCall } from "../utils/apiClient";
import { auth } from "../lib/firebase";

interface ChatThreadProps {
  language: Language;
  studentId: string;
  studentName: string;
  onBack: () => void;
}

function useT(language: Language) {
  return (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAtMs: number;
}

export default function ChatThread({ language, studentId, studentName, onBack }: ChatThreadProps) {
  const t = useT(language);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState<"report" | "block" | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function refresh() {
    try {
      const data = await apiCall(`/api/list-messages?studentId=${encodeURIComponent(studentId)}`);
      setMessages(data.messages || []);
      setBlocked(!!data.blocked);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000); // simple polling — no realtime listener wired for this yet
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      await apiCall("/api/send-message", { method: "POST", body: { studentId, text: text.trim() } });
      setText("");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleReportOrBlock(action: "report" | "block") {
    try {
      await apiCall("/api/report-chat", { method: "POST", body: { studentId, action } });
      setShowConfirm(null);
      if (action === "report") setError(t("chat.report_confirm"));
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const myUid = auth.currentUser?.uid;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-black/10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="opacity-70">
            ←
          </button>
          <span className="font-semibold">{studentName}</span>
        </div>
        <div className="flex gap-3 text-sm opacity-70">
          <button onClick={() => setShowConfirm("report")}>{t("chat.report_button")}</button>
          <button onClick={() => setShowConfirm("block")}>{t("chat.block_button")}</button>
        </div>
      </div>

      {error && <div className="p-3 text-sm opacity-80">{error}</div>}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && <p className="text-center opacity-50 text-sm">{t("no_messages")}</p>}
        {messages.map((m) => {
          const mine = m.senderId === myUid;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] px-4 py-2 rounded-2xl text-sm"
                style={{
                  background: mine ? "var(--color-accent, #3b82f6)" : "rgba(0,0,0,0.08)",
                  color: mine ? "#fff" : "inherit",
                }}
              >
                {!mine && <div className="text-xs opacity-70 mb-0.5">{m.senderName}</div>}
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {blocked ? (
        <div className="p-4 text-center text-sm opacity-70">{t("chat.blocked_notice")}</div>
      ) : (
        <div className="p-4 flex gap-2 border-t border-black/10">
          <input
            className="flex-1 p-3 rounded-xl bg-black/10"
            placeholder={t("type_message")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            disabled={sending || !text.trim()}
            onClick={handleSend}
            className="px-4 py-3 rounded-xl font-semibold"
            style={{ background: "var(--color-accent, #3b82f6)", color: "#fff" }}
          >
            {t("send_message")}
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-5 rounded-2xl max-w-sm w-full space-y-4">
            <p>{showConfirm === "report" ? t("chat.report_confirm") : t("chat.blocked_notice")}</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(null)} className="flex-1 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.08)" }}>
                {t("cancel")}
              </button>
              <button
                onClick={() => handleReportOrBlock(showConfirm)}
                className="flex-1 py-2 rounded-xl font-semibold"
                style={{ background: "var(--color-danger, #ef4444)", color: "#fff" }}
              >
                {showConfirm === "report" ? t("chat.report_button") : t("chat.block_button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
