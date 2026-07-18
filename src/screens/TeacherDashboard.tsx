import React, { useEffect, useState } from "react";
import { TRANSLATIONS, Language } from "../translations";
import { apiCall } from "../utils/apiClient";

interface TeacherDashboardProps {
  language: Language;
}

function useT(language: Language) {
  return (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
}

interface ClassRecord {
  id: string;
  className: string;
  schoolName: string;
}

interface ConnectionRecord {
  id: string;
  status: "pending" | "accepted" | "declined";
  classId: string;
  studentName?: string;
  streak?: number;
  weakSubjects?: string[];
  strongSubjects?: string[];
}

export default function TeacherDashboard({ language }: TeacherDashboardProps) {
  const t = useT(language);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall("/api/list-connections");
      setClasses(data.classes || []);
      setConnections(data.connections || []);
      if (!activeClassId && data.classes?.length) setActiveClassId(data.classes[0].id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateClass() {
    if (!newClassName.trim()) return;
    setSending(true);
    try {
      await apiCall("/api/create-class", {
        method: "POST",
        body: { className: newClassName.trim(), schoolName: newSchoolName.trim() },
      });
      setNewClassName("");
      setNewSchoolName("");
      setShowCreateClass(false);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  async function handleAddStudent() {
    if (!studentIdInput.trim() || !activeClassId) return;
    setSending(true);
    setToast(null);
    try {
      await apiCall("/api/request-connection", {
        method: "POST",
        body: { targetCompassId: studentIdInput.trim(), classId: activeClassId },
      });
      setStudentIdInput("");
      setToast("Request sent.");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  const activeConnections = connections.filter((c) => c.classId === activeClassId);
  const pending = activeConnections.filter((c) => c.status === "pending");
  const accepted = activeConnections.filter((c) => c.status === "accepted");

  return (
    <div className="p-4 space-y-4 pb-24">
      <h1 className="text-2xl font-bold">{t("teacher.dashboard_title")}</h1>

      {error && (
        <div className="glass-card p-3 rounded-xl text-sm" style={{ color: "var(--color-danger, #ef4444)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card p-4 rounded-xl">{t("loading")}</div>
      ) : (
        <>
          {classes.length === 0 && !showCreateClass && (
            <div className="glass-card p-4 rounded-xl text-center space-y-3">
              <p>{t("teacher.no_students_yet")}</p>
              <button
                className="px-4 py-2 rounded-full font-semibold"
                style={{ background: "var(--color-accent, #3b82f6)", color: "#fff" }}
                onClick={() => setShowCreateClass(true)}
              >
                + {t("teacher.class_name_label")}
              </button>
            </div>
          )}

          {showCreateClass && (
            <div className="glass-card p-4 rounded-xl space-y-3">
              <input
                className="w-full p-3 rounded-xl bg-black/10"
                placeholder={t("teacher.class_name_label")}
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <input
                className="w-full p-3 rounded-xl bg-black/10"
                placeholder={t("role.school_name_prompt")}
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value.toUpperCase())}
              />
              <p className="text-xs opacity-60">{t("role.school_name_hint")}</p>
              <button
                disabled={sending}
                onClick={handleCreateClass}
                className="w-full py-3 rounded-xl font-semibold"
                style={{ background: "var(--color-accent, #3b82f6)", color: "#fff" }}
              >
                {t("onboarding.get_started")}
              </button>
            </div>
          )}

          {classes.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveClassId(c.id)}
                  className="px-4 py-2 rounded-full whitespace-nowrap font-medium"
                  style={{
                    background: activeClassId === c.id ? "var(--color-accent, #3b82f6)" : "rgba(0,0,0,0.08)",
                    color: activeClassId === c.id ? "#fff" : "inherit",
                  }}
                >
                  {c.className}
                </button>
              ))}
              <button onClick={() => setShowCreateClass(true)} className="px-4 py-2 rounded-full whitespace-nowrap opacity-70">
                +
              </button>
            </div>
          )}

          {activeClassId && (
            <div className="glass-card p-4 rounded-xl space-y-3">
              <label className="text-sm font-medium opacity-80">{t("teacher.add_student_id")}</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 p-3 rounded-xl bg-black/10"
                  placeholder="ABCD1234"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
                />
                <button
                  disabled={sending}
                  onClick={handleAddStudent}
                  className="px-4 py-3 rounded-xl font-semibold"
                  style={{ background: "var(--color-accent, #3b82f6)", color: "#fff" }}
                >
                  {t("teacher.add_student_button")}
                </button>
              </div>
              {toast && <p className="text-sm opacity-70">{toast}</p>}
              <p className="text-xs opacity-60">{t("teacher.privacy_note")}</p>
            </div>
          )}

          {pending.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold opacity-80">{t("teacher.pending_requests")}</h3>
              {pending.map((c) => (
                <div key={c.id} className="glass-card p-3 rounded-xl opacity-70 text-sm">
                  {c.studentName || "…"}
                </div>
              ))}
            </div>
          )}

          {accepted.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold opacity-80">{t("all_students")}</h3>
              {accepted.map((c) => (
                <div key={c.id} className="glass-card p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{c.studentName}</span>
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
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
