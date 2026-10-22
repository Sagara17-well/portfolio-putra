"use client";
import { useMemo, useState } from "react";
import { useSite } from "./Providers";
import AnimatedContent from "./react-bits/AnimatedContent";
import TiltedCard from "./react-bits/TiltedCard";
import { projects } from "@/data/content";
import type { Cat, Project } from "@/data/content";
import { ui } from "@/data/ui";

const FILTERS = ["all", "web", "security", "mobile"] as const;
type Filter = (typeof FILTERS)[number];

const GRADIENT: Record<Cat, string> = {
  security: "radial-gradient(70% 90% at 80% 10%, color-mix(in srgb, var(--ok) 38%, transparent), transparent), linear-gradient(135deg, color-mix(in srgb, var(--ok) 20%, var(--bg-soft)), color-mix(in srgb, var(--violet) 30%, var(--bg-soft)))",
  web: "radial-gradient(70% 90% at 80% 10%, color-mix(in srgb, var(--accent) 42%, transparent), transparent), linear-gradient(135deg, color-mix(in srgb, var(--accent) 22%, var(--bg-soft)), color-mix(in srgb, var(--violet) 26%, var(--bg-soft)))",
  mobile: "radial-gradient(70% 90% at 20% 10%, color-mix(in srgb, var(--violet) 42%, transparent), transparent), linear-gradient(135deg, color-mix(in srgb, var(--violet) 24%, var(--bg-soft)), color-mix(in srgb, var(--accent) 24%, var(--bg-soft)))",
};

/** Ilustrasi otomatis bila proyek belum punya screenshot. Ini gambar dekoratif, bukan tangkapan layar. */
function ProjectArt({ p }: { p: Project }) {
  const phone = p.cat === "mobile";
  return (
    <div aria-hidden className="relative aspect-video overflow-hidden rounded-2xl border border-line" style={{ background: GRADIENT[p.cat] }}>
      <div className={`absolute bottom-0 top-5 rounded-t-xl border border-b-0 border-line bg-bg-soft/95 ${phone ? "left-1/2 w-[34%] -translate-x-1/2" : "inset-x-6"}`}>
        {!phone && (
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <i className="h-2 w-2 rounded-full bg-bad/80" /><i className="h-2 w-2 rounded-full bg-warn/80" /><i className="h-2 w-2 rounded-full bg-ok/80" />
            <span className="ml-2 truncate rounded-full bg-line/70 px-3 py-0.5 font-mono text-[12px] text-muted">{p.slug}</span>
          </div>
        )}
        <div className="space-y-2 p-3 sm:p-4">
          <p className={`font-display font-extrabold leading-tight text-ink ${phone ? "text-xs" : "text-base sm:text-lg"}`}>{p.title}</p>
          <div className="h-1.5 w-4/5 rounded-full bg-accent/60" />
          <div className="h-1.5 w-3/5 rounded-full bg-line" />
          <div className="h-1.5 w-2/3 rounded-full bg-line" />
          {!phone && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {p.tags.map((tg) => <span key={tg} className="rounded-full border border-line px-2 py-0.5 font-mono text-[12px] text-muted">{tg}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { t } = useSite();
  const [f, setF] = useState<Filter>("all");
  const list = useMemo(() => (f === "all" ? projects : projects.filter((p) => p.cat === f)), [f]);
  const count = (x: Filter) => (x === "all" ? projects.length : projects.filter((p) => p.cat === x).length);
  const lbl = ui.projects.filters;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter">
        {FILTERS.map((x) => (
          <button key={x} type="button" aria-pressed={f === x} onClick={() => setF(x)}
            className={`rounded-full border px-4 py-1.5 text-[15px] transition-colors ${f === x ? "border-accent bg-accent/15 text-ink" : "border-line text-muted hover:text-ink"}`}>
            {t(lbl[x])} <span className="ml-1 font-mono text-[13px] opacity-60">{count(x)}</span>
          </button>
        ))}
      </div>

      <div className="proj-grid mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {list.length === 0 && <p className="text-muted">{t(ui.projects.none)}</p>}
        {list.map((p, i) => (
          <AnimatedContent key={`${f}-${p.slug}`} delay={(i % 3) * 0.08} className="h-full">
            <article className="proj-card group flex h-full flex-col">
              <div className="cursor-target">
                {p.image ? <TiltedCard src={p.image} alt={`${p.title}`} /> : <ProjectArt p={p} />}
              </div>
              <div className="mt-5 flex items-start justify-between gap-3 md:min-h-[3.5rem]">
                <h3 className="font-display text-xl font-extrabold leading-snug">{p.title}</h3>
                <span className="shrink-0 whitespace-nowrap pt-1 font-mono text-[13px] text-accent">{t(p.status)}</span>
              </div>
              <p className="mt-2 flex-1 text-[16px] text-muted">{t(p.desc)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((tg) => <span key={tg} className="rounded-full border border-line px-3 py-0.5 font-mono text-[13px]">{tg}</span>)}
              </div>
              <p className="mt-4 flex min-h-9 flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
                {p.case && (
                  <a href={`/projects/${p.slug}`} className="rounded-full bg-accent-strong px-4 py-1.5 text-on-accent transition-transform hover:-translate-y-0.5">
                    {t(ui.projects.caseStudy)} &rarr;
                  </a>
                )}
                {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer" className="underline decoration-accent underline-offset-4">{t(ui.projects.code)}</a>}
                {p.demo && (
                  <a href={p.demo} {...(p.demo.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="underline decoration-accent underline-offset-4">
                    {t(p.demoLabel ?? { id: "Demo", en: "Demo" })}
                  </a>
                )}
              </p>
              <p className="proj-stats" aria-hidden>
                <span className="text-accent">&#9670; STATS</span>
                <span>{p.cat}</span>
                <span>{p.tags.length} tech</span>
              </p>
            </article>
          </AnimatedContent>
        ))}
      </div>
    </>
  );
}
