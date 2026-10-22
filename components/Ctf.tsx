"use client";
import { useEffect, useState } from "react";
import { useSite } from "./Providers";
import { ctf } from "@/data/ctf";
import { ui } from "@/data/ui";

const KEY = "pbz-ctf";

async function sha256(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function Ctf() {
  const { t } = useSite();
  const [solved, setSolved] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [val, setVal] = useState<Record<string, string>>({});
  const [res, setRes] = useState<Record<string, "ok" | "bad">>({});

  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(r)) setSolved(r.filter((x): x is string => typeof x === "string"));
    } catch { /* penyimpanan tidak tersedia */ }
  }, []);

  const save = (a: string[]) => {
    setSolved(a);
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* abaikan */ }
  };
  const submit = async (id: string, hash: string) => {
    const ok = (await sha256((val[id] || "").trim())) === hash;
    setRes((m) => ({ ...m, [id]: ok ? "ok" : "bad" }));
    if (ok && !solved.includes(id)) save([...solved, id]);
  };
  const points = ctf.filter((c) => solved.includes(c.id)).reduce((n, c) => n + c.points, 0);
  const total = ctf.reduce((n, c) => n + c.points, 0);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-extrabold">{t(ui.ctf.title)}</h3>
          <p className="mt-2 max-w-[60ch] text-muted">{t(ui.ctf.sub)}</p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="font-mono text-[13px] text-muted">{t(ui.ctf.progress)}: <span className="text-ink">{solved.length}/{ctf.length}</span> · {points}/{total} {t(ui.ctf.pts)}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line sm:w-56" role="progressbar" aria-valuemin={0} aria-valuemax={ctf.length} aria-valuenow={solved.length}>
            <div className="h-full rounded-full bg-accent-strong transition-[width] duration-500" style={{ width: `${(solved.length / ctf.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {solved.length === ctf.length && <p role="status" className="mt-6 rounded-2xl border border-accent p-4 text-accent">{t(ui.ctf.done)}</p>}

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {ctf.map((c) => {
          const done = solved.includes(c.id);
          return (
            <li key={c.id} {...(c.attr ? { "data-catatan": c.attr } : {})} className="rounded-2xl border border-line bg-panel p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-lg font-extrabold leading-snug">{t(c.title)}</h4>
                <span className={`shrink-0 rounded-full border px-3 py-0.5 font-mono text-[13px] ${done ? "border-ok text-ok" : "border-line text-muted"}`}>
                  {done ? "✓ " : ""}{c.points} {t(ui.ctf.pts)}
                </span>
              </div>
              <p className="mt-3 text-[16px] text-muted">{t(c.body)}</p>
              {c.payload && <p className="mt-3 overflow-x-auto rounded-xl border border-line bg-bg-soft p-3 font-mono text-[14px] break-all">{c.payload}</p>}
              <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void submit(c.id, c.hash); }}>
                <input value={val[c.id] || ""} onChange={(e) => { setVal({ ...val, [c.id]: e.target.value }); setRes((m) => { const n = { ...m }; delete n[c.id]; return n; }); }}
                  placeholder="PBZ{...}" aria-label={`Flag: ${t(c.title)}`} autoComplete="off" spellCheck={false}
                  className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-2.5 font-mono text-[15px]" />
                <button type="submit" className="rounded-full bg-accent-strong px-6 py-2.5 font-semibold text-on-accent transition-opacity hover:opacity-90">{t(ui.ctf.submit)}</button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]" aria-live="polite">
                <button type="button" onClick={() => setHint(hint === c.id ? null : c.id)} aria-expanded={hint === c.id}
                  className="font-mono text-muted underline decoration-accent underline-offset-4 hover:text-ink">
                  {t(hint === c.id ? ui.ctf.hideHint : ui.ctf.hint)}
                </button>
                {res[c.id] === "ok" && <span className="text-ok">{t(ui.ctf.right)}</span>}
                {res[c.id] === "bad" && <span className="text-bad">{t(ui.ctf.wrong)}</span>}
              </div>
              {hint === c.id && <p className="mt-2 text-[15px] text-muted">{t(c.hint)}</p>}
            </li>
          );
        })}
      </ul>
      {solved.length > 0 && (
        <button type="button" onClick={() => { save([]); setRes({}); setVal({}); }}
          className="mt-6 font-mono text-[13px] text-muted underline decoration-accent underline-offset-4 hover:text-ink">{t(ui.ctf.reset)}</button>
      )}
    </div>
  );
}
