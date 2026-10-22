"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useSite } from "./Providers";
import { caseStudies, profile, projects } from "@/data/content";
import { sections } from "@/data/sections";
import { ui } from "@/data/ui";
import { copyText, toast } from "@/lib/toast";

type Item = { id: string; group: string; label: string; hint?: string; keys: string; run: () => void };

const LABS = [
  { id: "password", label: ui.lab.tabs.password },
  { id: "hash", label: ui.lab.tabs.hash },
  { id: "headers", label: ui.lab.tabs.headers },
] as const;

export default function CommandPalette() {
  const { t, toggleLang, toggleTheme } = useSite();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<Element | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  useEffect(() => {
    const show = () => { opener.current = document.activeElement; setOpen(true); setIdx(0); };
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => { if (!v) { opener.current = document.activeElement; setIdx(0); } return !v; });
      }
    };
    window.addEventListener("keydown", key);
    window.addEventListener("app:palette", show);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("app:palette", show); };
  }, []);

  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 0); }, [open]);

  const items = useMemo<Item[]>(() => {
    const onHome = () => window.location.pathname === "/";
    const go = (id: string) => () => {
      if (onHome()) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.assign(`/#${id}`);
    };
    const list: Item[] = sections.map((s) => ({
      id: `nav-${s.id}`, group: t(ui.palette.nav), label: t(s.label), hint: s.href ?? `#${s.id}`, keys: s.alias, run: s.href ? () => window.location.assign(s.href as string) : go(s.id),
    }));
    LABS.forEach((lab) =>
      list.push({
        id: `lab-${lab.id}`, group: t(ui.palette.action), label: `${t(ui.palette.openLab)} ${t(lab.label)}`, keys: `lab ${lab.id} demo`,
        run: () => {
          if (window.location.pathname === "/lab") window.dispatchEvent(new CustomEvent("app:lab", { detail: lab.id }));
          else window.location.assign(`/lab#${lab.id}`);
        },
      }),
    );
    list.push(
      { id: "ctf", group: t(ui.palette.action), label: t(ui.ctf.title), hint: "/lab", keys: "ctf flag tantangan mini", run: () => window.location.assign("/lab#ctf") },
      { id: "tools", group: t(ui.palette.action), label: t(ui.tools.title), hint: "/lab", keys: "alat tools jwt base64 cidr password generator", run: () => window.location.assign("/lab#tools") },
    );
    projects.filter((p) => p.case && caseStudies[p.slug]).forEach((p) =>
      list.push({
        id: `case-${p.slug}`, group: t(ui.palette.action), label: `${t(ui.palette.caseStudy)} ${p.title}`, keys: `studi kasus case study proyek ${p.slug}`,
        run: () => window.location.assign(`/projects/${p.slug}`),
      }),
    );
    list.push(
      { id: "cv", group: t(ui.palette.action), label: t(ui.palette.cv), hint: "PDF", keys: "cv resume unduh download pdf", run: () => window.open("/cv?print=1", "_blank", "noopener") },
      { id: "theme", group: t(ui.palette.action), label: t(ui.palette.theme), keys: "tema theme dark light gelap terang mode", run: toggleTheme },
      { id: "lang", group: t(ui.palette.action), label: t(ui.palette.lang), keys: "bahasa language indonesia english id en", run: toggleLang },
      {
        id: "email", group: t(ui.palette.action), label: t(ui.palette.email), hint: profile.email, keys: "email surel salin copy kontak",
        run: async () => toast((await copyText(profile.email)) ? t(ui.contact.copied) : profile.email),
      },
    );
    return list;
  }, [t, toggleLang, toggleTheme]);

  const results = useMemo(() => {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return items;
    return items
      .map((it) => {
        const hay = `${it.label} ${it.keys}`.toLowerCase();
        if (!tokens.every((tk) => hay.includes(tk))) return null;
        const score = it.label.toLowerCase().startsWith(tokens[0]) ? 0 : hay.indexOf(tokens[0]) + 1;
        return { it, score };
      })
      .filter((x): x is { it: Item; score: number } => !!x)
      .sort((a, b) => a.score - b.score)
      .map((x) => x.it);
  }, [items, q]);

  useEffect(() => { setIdx(0); }, [q]);

  const run = (it?: Item) => { if (!it) return; close(); setTimeout(it.run, 60); };

  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); run(results[idx]); }
    else if (e.key === "Tab") e.preventDefault();
  };

  useEffect(() => {
    if (open) document.getElementById(`opt-${idx}`)?.scrollIntoView({ block: "nearest" });
  }, [idx, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center px-3 pt-[12vh] print:hidden" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={close} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="fade-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono text-ok" aria-hidden>&gt;</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[idx] ? `opt-${idx}` : undefined}
            aria-label={t(ui.palette.placeholder)}
            placeholder={t(ui.palette.placeholder)}
            autoComplete="off"
            spellCheck={false}
            style={{ outline: "none" }}
            className="w-full bg-transparent py-4 font-mono text-[15px] text-ink outline-none placeholder:text-muted"
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-muted">{t(ui.palette.empty)}</li>}
          {results.map((it, i) => (
            <li
              key={it.id}
              id={`opt-${i}`}
              role="option"
              aria-selected={i === idx}
              onMouseMove={() => setIdx(i)}
              onClick={() => run(it)}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-3 py-2.5 ${i === idx ? "bg-accent/15" : ""}`}
            >
              <span className="min-w-0 truncate text-[16px]">{it.label}</span>
              <span className="flex shrink-0 items-center gap-3 font-mono text-[13px] text-muted">
                {it.hint && <span className="hidden truncate sm:inline">{it.hint}</span>}
                <span className="rounded-full border border-line px-2 py-0.5">{it.group}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-line px-4 py-2 font-mono text-[13px] text-muted">{t(ui.palette.hints)}</p>
      </div>
    </div>
  );
}
