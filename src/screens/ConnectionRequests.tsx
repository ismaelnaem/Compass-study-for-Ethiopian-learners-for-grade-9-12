import React, { useEffect, useState } from "react";
import { TRANSLATIONS, Language } from "../translations";
import { apiCall } from "../utils/apiClient";

interface ConnectionRequestsProps {
  language: Language;
}

function useT(language: Language) {
  return (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
}

export default function ConnectionRequests({ language }: ConnectionRequestsProps) {
  const t = useT(language);
  const [compassId, setCompassId] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  async function refresh() {
    setLoading(true);
    const [idData, connData] = await Promise.all([
      apiCall("/api/get-my-id"),
      apiCall("/api/list-connections"),
    ]);
    setCompassId(idData.compassId);
    setConnections(connData.connections || []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function respond(id: string, accept: boolean) {
    await apiCall("/api/respond-connection", { method: "POST", body: { connectionId: id, accept } });
    await refresh();
  }

  const pending = connections.filter((c) => c.status === "pending");
  const accepted = connections.filter((c) => c.status === "accepted");

  if (loading) return <div className="glass-card p-4 rounded-xl">{t("loading")}</div>;

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-xl space-y-2">
        <p className="text-sm opacity-70">{t("consent.my_id_label")}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tracking-widest">{compassId}</span>
          <button
            onClick={() => {
              if (compassId) navigator.clipboard.writeText(compassId);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ background: "rgba(0,0,0,0.08)" }}
          >
            {copied ? "✓" : t("consent.copy_id_button")}
          </button>
        </div>
      </div>

      {pending.map((c) => (
        <div key={c.id} className="glass-card p-4 rounded-xl space-y-3">
          <p className="font-semibold">{t("consent.teacher_request_title")}</p>
          <p className="text-sm opacity-80">
            {(c.type === "teacher-student" ? t("consent.teacher_request_body") : t("consent.family_request_body"))
              .replace("{teacherName}", c.initiatorName || "")
              .replace("{name}", c.initiatorName || "")}
          </p>
          <div className="flex gap-2">
            <button onClick={() => respond(c.id, false)} className="flex-1 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.08)" }}>
              {t("consent.decline_button")}
            </button>
            <button
              onClick={() => respond(c.id, true)}
              className="flex-1 py-2 rounded-xl font-semibold"
              style={{ background: "var(--color-accent, #3b82f6)", color: "#fff" }}
            >
              {t("consent.accept_button")}
            </button>
          </div>
        </div>
      ))}

      {accepted.length > 0 && (
        <div className="space-y-2">
          {accepted.map((c) => (
            <div key={c.id} className="glass-card p-3 rounded-xl text-sm opacity-70">
              {c.initiatorName} — {c.type === "teacher-student" ? t("role_teacher") : t("role_parent")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
