"use client";
import Link from "next/link";
import Nav from "./Nav";
import { Footer } from "./Site";
import { useSite } from "./Providers";
import { caseStudies, projects } from "@/data/content";
import { ui } from "@/data/ui";

const h2 = "font-display text-3xl font-extrabold tracking-tight sm:text-4xl";

export default function CaseStudy({ slug }: { slug: string }) {
  const { t } = useSite();
  const p = projects.find((x) => x.slug === slug);
  const c = caseStudies[slug];
  if (!p || !c) return null;
  const others = projects.filter((x) => x.case && x.slug !== slug);

  return (
    <div id="top">
      <Nav base="/" />
      <main id="main" className="mx-auto w-full max-w-4xl px-5 pb-24 pt-32">
        <Link href="/#projects" className="font-mono text-sm text-muted underline-offset-4 hover:text-ink hover:underline">&larr; {t(ui.cs.back)}</Link>

        <header className="mt-10">
          <p className="font-mono text-sm text-accent">{t(ui.cs.eyebrow)} · {t(p.status)}</p>
          <h1 className="mt-3 font-display text-[clamp(40px,8vw,84px)] font-extrabold leading-[.95] tracking-tighter">{p.title}</h1>
          <p className="mt-6 max-w-[48ch] text-[clamp(20px,2.4vw,26px)] leading-snug">{t(c.intro)}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((tg) => <li key={tg} className="rounded-full border border-line px-3 py-1 font-mono text-[13px]">{tg}</li>)}
          </ul>
        </header>

        <section className="mt-20">
          <h2 className={h2}>{t(ui.cs.problem)}</h2>
          <p className="mt-4 max-w-[62ch] text-muted">{t(c.problem)}</p>
        </section>

        <section className="mt-20">
          <h2 className={h2}>{t(ui.cs.approach)}</h2>
          <ol className="mt-6 space-y-4">
            {c.approach.map((a, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent font-mono text-sm text-accent">{i + 1}</span>
                <p className="pt-0.5">{t(a)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20">
          <h2 className={h2}>{t(ui.cs.attacks)}</h2>
          <div className="mt-6 space-y-5">
            {c.attacks.map((a) => (
              <article key={a.name.en} className="overflow-hidden rounded-2xl border border-line bg-panel">
                <h3 className="border-b border-line px-6 py-3 font-mono text-sm text-bad">{t(a.name)}</h3>
                <div className="grid gap-px bg-line md:grid-cols-2">
                  <div className="bg-panel p-6">
                    <p className="font-mono text-[13px] text-muted">{t(ui.cs.how)}</p>
                    <p className="mt-2 text-[16px]">{t(a.how)}</p>
                  </div>
                  <div className="bg-panel p-6">
                    <p className="font-mono text-[13px] text-ok">{t(ui.cs.fix)}</p>
                    <p className="mt-2 text-[16px]">{t(a.fix)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className={h2}>{t(ui.cs.code)}</h2>
          <p className="mt-2 text-sm text-muted">{t(ui.cs.codeNote)}</p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <figure className="term overflow-hidden rounded-2xl">
              <figcaption className="border-b border-line px-5 py-2.5 font-mono text-[13px] text-bad">&#10005; {t(ui.cs.before)}</figcaption>
              <pre className="code-block p-5" tabIndex={0}><code>{c.badSql}</code></pre>
            </figure>
            <figure className="term overflow-hidden rounded-2xl">
              <figcaption className="border-b border-line px-5 py-2.5 font-mono text-[13px] text-ok">&#10003; {t(ui.cs.after)}</figcaption>
              <pre className="code-block p-5" tabIndex={0}><code>{c.goodSql}</code></pre>
            </figure>
          </div>
        </section>

        <section className="mt-20 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className={h2}>{t(ui.cs.outcome)}</h2>
            <ul className="mt-5 space-y-3">
              {c.outcome.map((o, i) => <li key={i} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ok" />{t(o)}</li>)}
            </ul>
          </div>
          <div>
            <h2 className={h2}>{t(ui.cs.limits)}</h2>
            <ul className="mt-5 space-y-3 text-muted">
              {c.limits.map((o, i) => <li key={i} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-warn" />{t(o)}</li>)}
            </ul>
          </div>
        </section>

        {others.length > 0 && (
          <section className="mt-20 border-t border-line pt-10">
            <p className="font-mono text-sm text-muted">{t(ui.cs.next)}</p>
            <ul className="mt-4 space-y-2">
              {others.map((o) => (
                <li key={o.slug}><a href={`/projects/${o.slug}`} className="font-display text-2xl font-extrabold underline decoration-accent underline-offset-4">{o.title} &rarr;</a></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
