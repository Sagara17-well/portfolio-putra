"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";
import {
  ALGOS, SAMPLE_BAD, SAMPLE_GOOD, analyzeHeaders, analyzePassword, bitDiff, digest, flipLastBit, formatDuration,
} from "@/lib/labs";
import type { Algo, Status } from "@/lib/labs";
import { copyText, toast } from "@/lib/toast";

type Tab = "password" | "hash" | "headers";
const TABS: Tab[] = ["password", "hash", "headers"];

const field = "w-full rounded-2xl border border-line bg-bg-soft px-4 py-3 font-mono text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";
const ghost = "rounded-full border border-line px-4 py-1.5 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-ink";

const LEVEL_COLOR = ["var(--bad)", "var(--bad)", "var(--warn)", "var(--ok)", "var(--ok)"];
const STATUS_COLOR: Record<Status, string> = { pass: "var(--ok)", warn: "var(--warn)", fail: "var(--bad)", info: "var(--muted)" };
const STATUS_ICON: Record<Status, string> = { pass: "✓", warn: "!", fail: "✕", info: "i" };

/* ---------- Password ---------- */
function PasswordLab() {
  const { t, lang } = useSite();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const r = useMemo(() => (pw ? analyzePassword(pw) : null), [pw]);
  const c = ui.lab.pw;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <label htmlFor="pw" className="mb-2 block font-mono text-sm text-accent">{t(c.label)}</label>
        <div className="relative">
          <input id="pw" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="off" spellCheck={false} className={`${field} pr-28`} placeholder="••••••••••••" />
          <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 font-mono text-[13px] text-muted hover:text-ink">
            {t(show ? c.hide : c.show)}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">{t(c.hint)}</p>

        <div className="mt-6" aria-live="polite">
          {r ? (
            <>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl font-extrabold" style={{ color: LEVEL_COLOR[r.level] }}>{t(c.levels[r.level])}</span>
                <span className="font-mono text-sm text-muted">{Math.round(r.bits)} bit</span>
              </div>
              <div className="meter mt-2 h-2.5 overflow-hidden rounded-full" role="meter" aria-valuemin={0} aria-valuemax={4} aria-valuenow={r.level} aria-label={t(c.levels[r.level])}>
                <i style={{ width: `${(r.level + 1) * 20}%`, background: LEVEL_COLOR[r.level] }} />
              </div>
              <p className="mt-4 text-[16px] text-muted">
                {t(c.crack)}: <strong className="font-medium text-ink">{formatDuration(r.seconds, lang)}</strong>
              </p>
            </>
          ) : (
            <p className="text-muted">{t(c.empty)}</p>
          )}
        </div>
      </div>

      <div>
        <ul className="space-y-2.5">
          {(Object.keys(c.checks) as (keyof typeof c.checks)[]).map((k) => {
            const ok = r ? r.checks[k] : null;
            return (
              <li key={k} className="flex items-center gap-3 text-[16px]">
                <span aria-hidden className="grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[13px]" style={{ borderColor: ok === null ? "var(--line)" : ok ? "var(--ok)" : "var(--bad)", color: ok === null ? "var(--muted)" : ok ? "var(--ok)" : "var(--bad)" }}>
                  {ok === null ? "" : ok ? "✓" : "✕"}
                </span>
                <span className={ok === false ? "text-ink" : "text-muted"}>{t(c.checks[k])}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 rounded-2xl border border-line bg-bg-soft p-4 text-[15px] text-muted">{t(c.tip)}</p>
        <p className="mt-3 text-sm text-muted">{t(c.note)}</p>
      </div>
    </div>
  );
}

/* ---------- Hash ---------- */
function HashLab() {
  const { t } = useSite();
  const [text, setText] = useState("halo dunia");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [h1, setH1] = useState("");
  const [h2, setH2] = useState("");
  const [bad, setBad] = useState(false);
  const c = ui.lab.hash;
  const alt = useMemo(() => flipLastBit(text), [text]);

  useEffect(() => {
    let live = true;
    if (!globalThis.crypto?.subtle) { setBad(true); return; }
    Promise.all([digest(algo, text), digest(algo, alt)]).then(([a, b]) => { if (live) { setH1(a); setH2(b); } }).catch(() => setBad(true));
    return () => { live = false; };
  }, [text, alt, algo]);

  const diff = h1 && h2 ? bitDiff(h1, h2) : 0;
  const total = h1.length * 4;
  const copy = async () => { if (await copyText(h1)) toast(t(c.copied)); };

  if (bad) return <p className="text-bad">{t(c.unsupported)}</p>;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <label htmlFor="ht" className="mb-2 block font-mono text-sm text-accent">{t(c.label)}</label>
        <textarea id="ht" rows={4} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} className={`${field} resize-y`} />
        <div className="mt-4 flex flex-wrap items-center gap-2" role="radiogroup" aria-label={t(c.algo)}>
          {ALGOS.map((a) => (
            <button key={a} type="button" role="radio" aria-checked={algo === a} onClick={() => setAlgo(a)}
              className={`rounded-full border px-4 py-1.5 font-mono text-sm transition-colors ${algo === a ? "border-accent bg-accent/15 text-ink" : "border-line text-muted hover:text-ink"}`}>
              {a}
            </button>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-muted">{t(c.one)}</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-ok">{t(c.result)}</span>
          <button type="button" onClick={copy} className={ghost}>{t(c.copy)}</button>
        </div>
        <output className="term mt-2 block break-all rounded-2xl p-4 font-mono text-[14px] leading-relaxed" aria-live="polite">{h1 || "…"}</output>

        <div className="mt-6">
          <p className="font-mono text-sm text-ok">{t(c.avalanche)}</p>
          <p className="mt-1 text-[15px] text-muted">{t(c.avalancheText)}</p>
          <output className="term mt-2 block break-all rounded-2xl p-4 font-mono text-[14px] leading-relaxed">
            {h2.split("").map((ch, i) => (
              <span key={i} style={h1[i] !== ch ? { color: "var(--accent)", fontWeight: 700 } : { opacity: 0.55 }}>{ch}</span>
            ))}
          </output>
          {total > 0 && (
            <p className="mt-2 font-mono text-sm text-muted">
              <span className="text-ink">{diff}</span> / {total} {t(c.bits)} ({Math.round((diff / total) * 100)}%)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Header ---------- */
function HeadersLab() {
  const { t } = useSite();
  const [raw, setRaw] = useState("");
  const res = useMemo(() => analyzeHeaders(raw), [raw]);
  const c = ui.lab.hdr;
  const label: Record<Status, string> = { pass: t(c.pass), warn: t(c.warn), fail: t(c.fail), info: t(c.info) };
  const gradeColor = res ? (res.score >= 85 ? "var(--ok)" : res.score >= 55 ? "var(--warn)" : "var(--bad)") : "var(--muted)";
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <label htmlFor="hh" className="mb-2 block font-mono text-sm text-accent">{t(c.label)}</label>
        <textarea id="hh" rows={11} value={raw} onChange={(e) => setRaw(e.target.value)} spellCheck={false} placeholder={"strict-transport-security: max-age=63072000\nx-content-type-options: nosniff\n..."} className={`${field} resize-y text-[13.5px]`} />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setRaw(SAMPLE_GOOD)} className={ghost}>{t(c.sampleGood)}</button>
          <button type="button" onClick={() => setRaw(SAMPLE_BAD)} className={ghost}>{t(c.sampleBad)}</button>
          {raw && <button type="button" onClick={() => setRaw("")} className={ghost}>{t(c.clear)}</button>}
        </div>
        <p className="mt-4 text-[15px] text-muted">
          {t(c.how)} <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[13px] text-ink">curl -sI https://situs-kamu.com</code> {t(c.or)}
        </p>
        <p className="mt-1 text-sm text-muted">{t(c.why)}</p>
      </div>

      <div aria-live="polite">
        {!res ? (
          <p className="text-muted">{t(c.empty)}</p>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border-2 font-display text-4xl font-extrabold" style={{ borderColor: gradeColor, color: gradeColor }}>{res.grade}</div>
              <div>
                <p className="font-mono text-sm text-muted">{t(c.score)}</p>
                <p className="font-display text-3xl font-extrabold">{res.score}<span className="text-lg text-muted">/100</span></p>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {res.checks.map((k) => (
                <li key={k.id} className="flex gap-3 rounded-2xl border border-line bg-bg-soft px-3.5 py-2.5">
                  <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[13px]" style={{ borderColor: STATUS_COLOR[k.status], color: STATUS_COLOR[k.status] }}>{STATUS_ICON[k.status]}</span>
                  <div className="min-w-0">
                    <p className="font-mono text-[13.5px]"><span className="sr-only">{label[k.status]}: </span>{k.name}</p>
                    <p className="text-[15px] leading-snug text-muted">{t(k.detail)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Wadah ---------- */
export default function Labs() {
  const { t } = useSite();
  const [tab, setTab] = useState<Tab>("password");
  const refs = useRef<Record<Tab, HTMLButtonElement | null>>({ password: null, hash: null, headers: null });

  useEffect(() => {
    const open = (e: Event) => {
      const id = (e as CustomEvent).detail as Tab;
      if (TABS.includes(id)) setTab(id);
    };
    const h = window.location.hash.slice(1) as Tab;
    if (TABS.includes(h)) setTab(h);
    window.addEventListener("app:lab", open);
    return () => window.removeEventListener("app:lab", open);
  }, []);

  const onKey = (e: ReactKeyboardEvent) => {
    const i = TABS.indexOf(tab);
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = TABS.length - 1;
    else return;
    e.preventDefault();
    setTab(TABS[n]);
    refs.current[TABS[n]]?.focus();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div role="tablist" aria-label="Lab" onKeyDown={onKey} className="flex flex-wrap gap-1.5">
          {TABS.map((id) => (
            <button
              key={id}
              ref={(el) => { refs.current[id] = el; }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-[15px] transition-colors ${tab === id ? "bg-accent-strong text-on-accent" : "text-muted hover:text-ink"}`}
            >
              {t(ui.lab.tabs[id])}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-2 font-mono text-[13px] text-ok"><i className="inline-block h-2 w-2 rounded-full bg-ok" />{t(ui.lab.local)}</span>
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="p-5 sm:p-8">
        {tab === "password" && <PasswordLab />}
        {tab === "hash" && <HashLab />}
        {tab === "headers" && <HeadersLab />}
      </div>
    </div>
  );
}
