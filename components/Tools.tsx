"use client";
import { useEffect, useMemo, useState } from "react";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";

type Tool = "jwt" | "b64" | "cidr" | "gen";
const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlB1dHJhIiwicm9sZSI6Im1haGFzaXN3YSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODkzNDU2MDAwfQ.c2lnbmF0dXJlLWNvbnRvaA";

const field = "w-full rounded-xl border border-line bg-bg px-4 py-3 font-mono text-[15px]";
const out = "overflow-x-auto break-all rounded-xl border border-line bg-bg-soft p-4 font-mono text-[14px] leading-relaxed whitespace-pre-wrap";

function b64urlDecode(s: string) {
  const b = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b + "=".repeat((4 - (b.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
const toB64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const fromB64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));

function jwtInfo(token: string) {
  const p = token.trim().split(".");
  if (p.length !== 3) return null;
  try {
    const header = JSON.parse(b64urlDecode(p[0]));
    const payload = JSON.parse(b64urlDecode(p[1]));
    const dates: string[] = [];
    for (const k of ["iat", "nbf", "exp"]) if (typeof payload[k] === "number") dates.push(`${k}: ${new Date(payload[k] * 1000).toISOString()}`);
    return { header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2), dates, none: String(header.alg).toLowerCase() === "none" };
  } catch { return null; }
}

function cidr(input: string) {
  const m = input.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) return null;
  const o = m.slice(1, 5).map(Number);
  const p = Number(m[5]);
  if (o.some((n) => n > 255) || p > 32) return null;
  const ip = ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
  const net = (ip & mask) >>> 0;
  const bc = (net | (~mask >>> 0)) >>> 0;
  const s = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  const hosts = p === 32 ? 1 : p === 31 ? 2 : 2 ** (32 - p) - 2;
  const first = p >= 31 ? net : net + 1;
  const last = p === 32 ? net : p === 31 ? bc : bc - 1;
  return { Network: `${s(net)}/${p}`, Netmask: s(mask), Wildcard: s(~mask >>> 0), Broadcast: s(bc), "First host": s(first >>> 0), "Last host": s(last >>> 0), Hosts: hosts.toLocaleString("en-US") };
}

function randInt(max: number) {
  const lim = Math.floor(0x100000000 / max) * max;
  const a = new Uint32Array(1);
  do { crypto.getRandomValues(a); } while (a[0] >= lim);
  return a[0] % max;
}
const SETS = { lower: "abcdefghijkmnopqrstuvwxyz", upper: "ABCDEFGHJKLMNPQRSTUVWXYZ", digits: "23456789", symbols: "!@#$%^&*-_=+?" } as const;

export default function Tools() {
  const { t } = useSite();
  const [tool, setTool] = useState<Tool>("jwt");
  const [jwt, setJwt] = useState(SAMPLE_JWT);
  const [text, setText] = useState("Halo, Putra!");
  const [mode, setMode] = useState<"e64" | "d64" | "eu" | "du">("e64");
  const [net, setNet] = useState("192.168.1.10/24");
  const [len, setLen] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [pw, setPw] = useState("");
  const [copied, setCopied] = useState(false);

  const gen = () => {
    const keys = (Object.keys(opts) as (keyof typeof opts)[]).filter((k) => opts[k]);
    const pool = keys.map((k) => SETS[k]).join("");
    const chars = keys.map((k) => SETS[k][randInt(SETS[k].length)]);
    while (chars.length < len) chars.push(pool[randInt(pool.length)]);
    for (let i = chars.length - 1; i > 0; i--) { const j = randInt(i + 1); [chars[i], chars[j]] = [chars[j], chars[i]]; }
    setPw(chars.slice(0, len).join(""));
    setCopied(false);
  };
  useEffect(() => {
    gen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, opts]);

  const j = useMemo(() => jwtInfo(jwt), [jwt]);
  const conv = useMemo(() => {
    try {
      if (mode === "e64") return toB64(text);
      if (mode === "d64") return fromB64(text);
      if (mode === "eu") return encodeURIComponent(text);
      return decodeURIComponent(text);
    } catch { return null; }
  }, [text, mode]);
  const c = useMemo(() => cidr(net), [net]);
  const poolSize = (Object.keys(opts) as (keyof typeof opts)[]).filter((k) => opts[k]).reduce((n, k) => n + SETS[k].length, 0);
  const bits = Math.round(len * Math.log2(poolSize || 1));

  const tabs: [Tool, string][] = [["jwt", t(ui.tools.jwt)], ["b64", t(ui.tools.b64)], ["cidr", t(ui.tools.cidr)], ["gen", t(ui.tools.gen)]];
  const modes: ["e64" | "d64" | "eu" | "du", string][] = [["e64", t(ui.tools.enc64)], ["d64", t(ui.tools.dec64)], ["eu", t(ui.tools.encUrl)], ["du", t(ui.tools.decUrl)]];
  const pill = (on: boolean) => `rounded-full border px-4 py-1.5 font-mono text-[13px] transition-colors ${on ? "border-accent bg-accent-strong text-on-accent" : "border-line text-muted hover:text-ink"}`;

  return (
    <div>
      <h3 className="font-display text-2xl font-extrabold">{t(ui.tools.title)}</h3>
      <p className="mt-2 text-muted">{t(ui.tools.note)}</p>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={t(ui.tools.title)}>
        {tabs.map(([k, label]) => <button key={k} type="button" aria-pressed={tool === k} onClick={() => setTool(k)} className={pill(tool === k)}>{label}</button>)}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-panel p-5 md:p-6">
        {tool === "jwt" && (
          <div className="space-y-4">
            <label htmlFor="jwt" className="block font-mono text-sm text-accent">{t(ui.tools.jwtLabel)}</label>
            <textarea id="jwt" rows={4} value={jwt} onChange={(e) => setJwt(e.target.value)} spellCheck={false} className={field} />
            {!jwt.trim() ? null : j ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div><p className="mb-2 font-mono text-[13px] text-muted">Header</p><pre className={out}>{j.header}</pre></div>
                <div><p className="mb-2 font-mono text-[13px] text-muted">Payload</p><pre className={out}>{j.payload}</pre></div>
                {j.dates.length > 0 && <pre className={`${out} md:col-span-2`}>{j.dates.join("\n")}</pre>}
                {j.none && <p className="text-bad md:col-span-2">{t(ui.tools.jwtNone)}</p>}
              </div>
            ) : <p className="text-bad" role="alert">{t(ui.tools.invalid)}</p>}
            <p className="text-[14px] text-muted">{t(ui.tools.jwtWarn)}</p>
          </div>
        )}
        {tool === "b64" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Mode">
              {modes.map(([k, label]) => <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} className={pill(mode === k)}>{label}</button>)}
            </div>
            <label htmlFor="b64in" className="block font-mono text-sm text-accent">{t(ui.tools.input)}</label>
            <textarea id="b64in" rows={3} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} className={field} />
            <p className="font-mono text-[13px] text-muted">{t(ui.tools.output)}</p>
            {conv === null ? <p className="text-bad" role="alert">{t(ui.tools.invalid)}</p> : <pre className={out}>{conv}</pre>}
          </div>
        )}
        {tool === "cidr" && (
          <div className="space-y-4">
            <label htmlFor="cidr" className="block font-mono text-sm text-accent">{t(ui.tools.cidrLabel)}</label>
            <input id="cidr" value={net} onChange={(e) => setNet(e.target.value)} spellCheck={false} placeholder="192.168.1.10/24" className={field} />
            {c ? (
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {Object.entries(c).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 border-b border-line py-2">
                    <dt className="text-muted">{k}</dt><dd className="font-mono text-[15px]">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : net.trim() ? <p className="text-bad" role="alert">{t(ui.tools.invalid)}</p> : null}
          </div>
        )}
        {tool === "gen" && (
          <div className="space-y-5">
            <p className={`${out} text-[17px]`} aria-label={t(ui.tools.gen)}>{pw}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={gen} className="rounded-full bg-accent-strong px-6 py-2.5 font-semibold text-on-accent transition-opacity hover:opacity-90">{t(ui.tools.again)}</button>
              <button type="button" onClick={() => { void navigator.clipboard?.writeText(pw).then(() => setCopied(true)); }}
                className="rounded-full border border-line px-6 py-2.5 font-semibold transition-colors hover:border-accent">{copied ? `✓ ${t(ui.tools.copied)}` : t(ui.tools.copy)}</button>
              <span className="font-mono text-[13px] text-muted">≈ {bits} bit</span>
            </div>
            <label className="flex flex-wrap items-center gap-3 font-mono text-sm">
              {t(ui.tools.length)}: <span className="text-ink">{len}</span>
              <input type="range" min={8} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-full max-w-xs accent-[var(--accent)]" aria-label={t(ui.tools.length)} />
            </label>
            <div className="flex flex-wrap gap-4">
              {(Object.keys(SETS) as (keyof typeof SETS)[]).map((k) => (
                <label key={k} className="flex items-center gap-2 text-[15px]">
                  <input type="checkbox" checked={opts[k]} disabled={opts[k] && Object.values(opts).filter(Boolean).length === 1}
                    onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />
                  {t(ui.tools[k])}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
