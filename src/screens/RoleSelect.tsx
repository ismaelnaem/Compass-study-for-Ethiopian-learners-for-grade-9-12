import React, { useState } from "react";
import { TRANSLATIONS, Language } from "../translations";
import { apiCall } from "../utils/apiClient";

interface RoleSelectProps {
  language: Language;
  onDone: (role: "student" | "teacher" | "family") => void;
}

function useT(language: Language) {
  return (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS.English[key] || key;
}

export default function RoleSelect({ language, onDone }: RoleSelectProps) {
  const t = useT(language);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose(role: "student" | "teacher" | "family") {
    setSaving(true);
    setError(null);
    try {
      await apiCall("/api/set-role", { method: "POST", body: { role } });
      onDone(role);
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  const options: Array<{ role: "student" | "teacher" | "family"; label: string }> = [
    { role: "student", label: t("role.student") },
    { role: "teacher", label: t("role.teacher") },
    { role: "family", label: t("role.family") },
  ];

  return (
    <div className="p-6 flex flex-col justify-center h-full space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("role.title")}</h1>
      {error && <p className="text-sm text-center opacity-80">{error}</p>}
      <div className="space-y-3">
        {options.map((o) => (
          <button
            key={o.role}
            disabled={saving}
            onClick={() => choose(o.role)}
            className="w-full py-4 rounded-2xl text-lg font-semibold glass-card"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
