// Compass Study theme system.
// 5 selectable themes, persisted locally (not synced to Firebase — this is
// a device display preference, not account data, matching the "Firebase is
// only for serious account data" rule from the architecture doc).

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "original" | "dark" | "gray" | "compass" | "black";

export interface ThemeMeta {
  id: ThemeId;
  labelKey: string; // translation key, see translations.ts theme.* entries
  swatch: [string, string]; // two representative colors, used for the little preview dot in Settings
}

export const THEMES: ThemeMeta[] = [
  { id: "original", labelKey: "theme.original", swatch: ["#8b5cf6", "#06b6d4"] },
  { id: "dark", labelKey: "theme.dark", swatch: ["#3b82f6", "#22d3ee"] },
  { id: "gray", labelKey: "theme.gray", swatch: ["#64748b", "#94a3b8"] },
  { id: "compass", labelKey: "theme.compass", swatch: ["#3596e0", "#f2a765"] },
  { id: "black", labelKey: "theme.black", swatch: ["#ffffff", "#3596e0"] },
];

const STORAGE_KEY = "compass_theme";
const DEFAULT_THEME: ThemeId = "original";

function isValidTheme(value: string | null): value is ThemeId {
  return !!value && THEMES.some((t) => t.id === value);
}

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isValidTheme(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme still
      // works for this session, it just won't persist across reloads.
    }
  }, [theme]);

  const setTheme = (next: ThemeId) => setThemeState(next);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be used inside <ThemeProvider>");
  }
  return ctx;
}
