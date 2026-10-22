"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";
import type { WriteupMeta } from "@/lib/writeups";

export function fmtDate(d: string, lang: string) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString(lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function WriteupCard({ w }: { w: WriteupMeta }) {
  const { t, lang } = useSite();
  return (
    <Link href={`/writeups/${w.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-accent md:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-muted">
        <span>{fmtDate(w.date, lang)}</span>
        <span>{w.minutes} {t(ui.writeups.min)}</span>
        {w.sample && <span className="rounded-full border border-accent px-2 py-0.5 text-accent">{t(ui.writeups.sample)}</span>}
      </div>
      <h3 className="mt-3 text-xl font-extrabold leading-snug group-hover:text-accent">{w.title}</h3>
      <p className="mt-2 text-[16px] text-muted">{w.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {w.tags.map((tg) => <li key={tg} className="rounded-full border border-line px-3 py-0.5 font-mono text-[13px]">{tg}</li>)}
      </ul>
    </Link>
  );
}

export default function WriteupList({ items }: { items: WriteupMeta[] }) {
  const { t } = useSite();
  const [tag, setTag] = useState("");
  const [q, setQ] = useState("");
  const tags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags))).sort(), [items]);
  const shown = items.filter((i) => (!tag || i.tags.includes(tag)) && (i.title + " " + i.summary + " " + i.tags.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tag">
          {["", ...tags].map((tg) => (
            <button key={tg || "all"} type="button" aria-pressed={tag === tg} onClick={() => setTag(tg)}
              className={`rounded-full border px-4 py-1.5 font-mono text-[13px] transition-colors ${tag === tg ? "border-accent bg-accent-strong text-on-accent" : "border-line text-muted hover:text-ink"}`}>
              {tg || t(ui.writeups.allTags)}
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(ui.writeups.search)} aria-label={t(ui.writeups.search)}
          className="w-full rounded-xl border border-line bg-panel px-4 py-2.5 md:w-72" />
      </div>
      {shown.length === 0 ? (
        <p className="mt-10 text-muted">{t(ui.writeups.none)}</p>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {shown.map((w) => <li key={w.slug}><WriteupCard w={w} /></li>)}
        </ul>
      )}
    </div>
  );
}
