"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useSite } from "./Providers";
import { certs, experience, profile, projects, stack, education } from "@/data/content";
import { ui } from "@/data/ui";

function Sec({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-7 break-inside-avoid print:mt-4">
      <h2 className="border-b border-neutral-300 pb-1 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-500">
        {title}
      </h2>
      <div className="mt-3 print:mt-2">{children}</div>
    </section>
  );
}

export default function CvView() {
  const { t, lang, toggleLang } = useSite();

  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("print") === "1"
    ) {
      const id = window.setTimeout(() => window.print(), 600);
      return () => window.clearTimeout(id);
    }
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen bg-bg-soft px-4 py-8 print:bg-white print:p-0"
    >
      <div className="mx-auto mb-5 flex max-w-205 flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="font-mono text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          &larr; {t(ui.cv.back)}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-line px-4 py-2 font-mono text-sm text-muted hover:text-ink"
          >
            {lang === "id" ? "EN" : "ID"}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-accent-strong px-5 py-2 font-medium text-on-accent"
          >
            {t(ui.cv.print)}
          </button>
        </div>
      </div>

      <p className="mx-auto mb-4 max-w-205 font-mono text-[13px] text-muted print:hidden">
        {t(ui.cv.tip)}
      </p>

      <article className="mx-auto max-w-205 bg-white p-10 text-[15px] leading-relaxed text-neutral-900 shadow-xl print:max-w-none print:p-0 print:text-[12.5px] print:leading-snug print:shadow-none sm:p-14">
        <header>
          <h1 className="font-display text-4xl font-extrabold leading-none tracking-tight">
            {profile.name.join(" ")}
          </h1>

          <p className="mt-2 font-mono text-sm text-neutral-600">
            Web Developer · Cybersecurity
          </p>

          <p className="mt-3 font-mono text-[12.5px] text-neutral-600">
            {profile.email} · {profile.city}
            {profile.github && (
              <>
                {" · "}
                {profile.github.replace(/^https?:\/\//, "")}
              </>
            )}
            {profile.linkedin && (
              <>
                {" · "}
                {profile.linkedin.replace(/^https?:\/\//, "")}
              </>
            )}
          </p>
        </header>

        <Sec title={t(ui.cv.summary)}>
          <p>{t(profile.about)}</p>
        </Sec>

        <Sec title={t(ui.cv.edu)}>
          <div className="space-y-2">
            {[...education].reverse().map((e) => (
              <div key={e.school}>
                <p className="font-semibold">{e.school}</p>
                <p className="text-neutral-600">{[e.detail ? t(e.detail) : t(e.level), t(e.years)].join(" · ")}</p>
              </div>
            ))}
          </div>
        </Sec>

        <Sec title={t(ui.cv.skills)}>
          <dl className="space-y-1.5">
            {stack.map((g) => (
              <div key={g.group.en} className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold">
                  {t(g.group)}
                </dt>
                <dd className="text-neutral-700">
                  {g.items.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </Sec>

        <Sec title={t(ui.cv.projects)}>
          <ul className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <p>
                  <span className="font-semibold">{p.title}</span>{" "}
                  <span className="font-mono text-[13px] text-neutral-500">
                    · {p.tags.join(", ")}
                  </span>
                </p>
                <p className="text-neutral-700">{t(p.desc)}</p>
              </li>
            ))}
          </ul>
        </Sec>

        <Sec title={t(ui.cv.exp)}>
          <ul className="space-y-3">
            {experience.map((e) => (
              <li key={e.title.en} className="break-inside-avoid">
                <div className="flex justify-between gap-4">
                  <p>
                    <span className="font-semibold">{t(e.title)}</span>
                    {", "}
                    {typeof e.org === "string" ? e.org : t(e.org)}
                  </p>
                  <p className="whitespace-nowrap font-mono text-sm text-neutral-600">
                    {t(e.when)}
                  </p>
                </div>
                <p className="text-neutral-700">{t(e.desc)}</p>
              </li>
            ))}
          </ul>
        </Sec>

        {certs.length > 0 && (
          <Sec title={t(ui.cv.certs)}>
            <ul className="space-y-1">
              {certs.map((c) => (
                <li
                  key={c.title}
                  className="flex justify-between gap-4"
                >
                  <span>
                    {c.title}, {c.by}
                  </span>
                  <span className="whitespace-nowrap font-mono text-sm text-neutral-600">
                    {c.year}
                  </span>
                </li>
              ))}
            </ul>
          </Sec>
        )}
      </article>
    </div>
  );
}