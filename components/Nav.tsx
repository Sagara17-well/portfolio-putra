"use client";
import { useEffect, useState } from "react";
import { useSite } from "./Providers";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import { openPalette } from "@/lib/toast";

const pill = "rounded-full border border-line bg-bg/85 backdrop-blur-md";
const btn =
  "grid h-10 min-w-10 place-items-center rounded-full px-2 text-muted transition-colors hover:text-ink focus-visible:text-ink";

function Sun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function Moon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

/** base: "" di halaman utama, "/" di halaman lain agar tautan kembali ke beranda. */
export default function Nav({ base = "", current }: { base?: string; current?: string }) {
  const { t, lang, toggleLang, theme, toggleTheme } = useSite();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (base !== "") return;
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const top = () => { if (window.scrollY < 200) setActive(""); };
    window.addEventListener("scroll", top, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", top); };
  }, [base]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const href = (id: string) => `${base}#${id}`;
  const cur = current ?? active;
  const menu = sections.filter((s) => s.inNav);
  const themeLabel = t(theme === "dark" ? ui.ctl.toLight : ui.ctl.toDark);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 print:hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-on-accent">
        {t(ui.skip)}
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <a href={base === "" ? "#top" : "/"} aria-label="PBZ" className={`${pill} px-4 py-2 font-mono text-sm font-medium text-ok`}>
          PBZ<span className="text-muted">_</span>
        </a>

        <nav aria-label="Primary" className={`${pill} hidden items-center gap-0.5 px-1.5 py-1 md:flex`}>
          {menu.map((s) => (
            <a
              key={s.id}
              href={s.href ?? href(s.id)}
              aria-current={cur === s.id ? "true" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[15px] transition-colors ${
                cur === s.id ? "bg-accent/15 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t(s.label)}
            </a>
          ))}
        </nav>

        <div className={`${pill} flex items-center px-1 py-0.5`}>
          <button type="button" onClick={openPalette} aria-label={t(ui.ctl.palette)} title="Ctrl+K" className={`${btn} hidden gap-2 sm:grid sm:grid-flow-col`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <kbd>Ctrl K</kbd>
          </button>
          <button type="button" onClick={toggleLang} aria-label={t(ui.ctl.lang)} className={`${btn} font-mono text-[13px]`}>
            <span><span className={lang === "id" ? "text-ink" : ""}>ID</span><span className="px-1 opacity-40">/</span><span className={lang === "en" ? "text-ink" : ""}>EN</span></span>
          </button>
          <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className={btn}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={t(open ? ui.nav.close : ui.nav.menu)} className={`${btn} md:hidden`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="fade-up mx-auto mt-2 max-w-6xl rounded-2xl border border-line bg-panel/95 p-2 backdrop-blur-md md:hidden">
          {menu.map((s) => (
            <a key={s.id} href={s.href ?? href(s.id)} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-lg text-ink hover:bg-accent/10">
              {t(s.label)}
            </a>
          ))}
          <button type="button" onClick={() => { setOpen(false); openPalette(); }} className="mt-1 block w-full rounded-2xl px-4 py-3 text-left font-mono text-sm text-muted hover:bg-accent/10">
            &gt; {t(ui.ctl.palette)}
          </button>
        </nav>
      )}
    </header>
  );
}
