import React, { useEffect, useState } from "react";
import { TRANSLATIONS, Language } from "../translations";
import { apiCall } from "../utils/apiClient";

interface FamilyDashboardProps {
  language: Language;
  onOpenChat: (studentId: string, studentName: string) => void;
}

function useT(language: Language) {
  return (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
}

interface ConnectionRecord {
  id: string;
  status: "pending" | "accepted" | "declined";
  studentId: string;
  studentName?: string;
  streak?: number;
  weakSubjects?: string[];
  strongSubjects?: string[];
}

export default function FamilyDashboard({ language, onOpenChat }: FamilyDashboardProps) {
  const t = useT(language);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [childIdInput, setChildIdInput] = useState("");
  const [sending, setSending] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("/api/list-connections");
      setConnections(data.connections || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConnect() {
    if (!childIdInput.trim()) return;
    setSending(true);
    setError(null);
    try {
      await apiCall("/api/request-connection", {
        method: "POST",
        body: { targetCompassId: childIdInput.trim() },
      });
      setChildIdInput("");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  const pending = connections.filter((c) => c.status === "pending");
  const accepted = connections.filter((c) => c.status === "accepted");

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-2xl font-bold">{t("family.dashboard_title")}</h1>

      {error && (
        <div className="glass-card p-3 rounded-xl text-sm" style={{ color: "var(--color-danger, #ef4444)" }}>
          {error}
        </div>
      )}

      <div className="glass-card p-4 rounded-xl space-y-3">
        <label className="text-sm font-medium opacity-80">{t("family.add_child_id")}</label>
        <div className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-xl bg-black/10"
            placeholder="ABCD1234"
            value={childIdInput}
            onChange={(e) => setChildIdInput(e.target.value.toUpperCase())}
          />
          <button
            disabled={sending}
            onClick={handleConnect}
            className="px-4 py-3 rounded-xl font-semibold"
            style={{ background: "var(--color-accent, #3b82f6)", color: "#fff" }}
          >
            {t("family.connect_button")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-4 rounded-xl">{t("loading")}</div>
      ) : (
        <>
          {connections.length === 0 && (
            <div className="glass-card p-4 rounded-xl text-center">
              <p>{t("family.no_children_yet")}</p>
            </div>
          )}

          {pending.map((c) => (
            <div key={c.id} className="glass-card p-3 rounded-xl opacity-70 text-sm">
              Waiting for them to accept…
            </div>
          ))}

          {accepted.map((c) => (
            <div key={c.id} className="glass-card p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{c.studentName}</span>
                <span className="text-sm opacity-70">
                  {t("teacher.student_card_streak")}: {c.streak ?? 0}
                </span>
              </div>
              {(c.weakSubjects?.length || 0) > 0 && (
                <p className="text-xs opacity-70">
                  {t("weak_topics")}: {c.weakSubjects!.join(", ")}
                </p>
              )}
              {!c.weakSubjects?.length && !c.strongSubjects?.length && (
                <p className="text-xs opacity-50">No quiz data yet.</p>
              )}
              <button
                onClick={() => onOpenChat(c.studentId, c.studentName || "")}
                className="w-full py-2 rounded-xl font-medium"
                style={{ background: "rgba(0,0,0,0.08)" }}
              >
                {t("family.message_teacher_button").replace("{childName}", c.studentName || "")}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
