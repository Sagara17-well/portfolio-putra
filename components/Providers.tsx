"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { L } from "@/data/content";

export type Lang = "id" | "en";
export type Theme = "dark" | "light";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (x: L) => string;
};

const C = createContext<Ctx | null>(null);

function safeGet(k: string) {
  try { return localStorage.getItem(k); } catch { return null; }
}
function safeSet(k: string, v: string) {
  try { localStorage.setItem(k, v); } catch { /* penyimpanan diblokir: abaikan */ }
}

export default function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = safeGet("lang");
    if (saved === "id" || saved === "en") setLangState(saved);
    else if (!navigator.language.toLowerCase().startsWith("id")) setLangState("en");
    const th = document.documentElement.dataset.theme;
    setTheme(th === "light" ? "light" : "dark");
  }, []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = useCallback((l: Lang) => { setLangState(l); safeSet("lang", l); }, []);
  const toggleLang = useCallback(() => setLang(lang === "id" ? "en" : "id"), [lang, setLang]);
  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    safeSet("theme", next);
  }, [theme]);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, toggleLang, theme, toggleTheme, t: (x: L) => x[lang] }),
    [lang, setLang, toggleLang, theme, toggleTheme],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useSite() {
  const v = useContext(C);
  if (!v) throw new Error("useSite harus dipakai di dalam <Providers>");
  return v;
}
