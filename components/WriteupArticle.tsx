"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "./Nav";
import { Footer } from "./Site";
import { fmtDate } from "./WriteupList";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";
import type { WriteupMeta } from "@/lib/writeups";

export default function WriteupArticle({ meta, children }: { meta: WriteupMeta; children: ReactNode }) {
  const { t, lang } = useSite();
  return (
    <div id="top">
      <Nav base="/" />
      <main id="main" className="mx-auto w-full max-w-3xl px-5 pb-24 pt-32">
        <Link href="/writeups" className="font-mono text-sm text-muted underline-offset-4 hover:text-ink hover:underline">&larr; {t(ui.writeups.back)}</Link>
        <header className="mt-8">
          <p className="font-mono text-[13px] text-muted">{fmtDate(meta.date, lang)} · {meta.minutes} {t(ui.writeups.min)}</p>
          <h1 className="mt-3 font-display text-[clamp(32px,6vw,56px)] font-extrabold leading-[1.05] tracking-tight">{meta.title}</h1>
          <ul className="mt-5 flex flex-wrap gap-2">
            {meta.tags.map((tg) => <li key={tg} className="rounded-full border border-line px-3 py-0.5 font-mono text-[13px]">{tg}</li>)}
          </ul>
        </header>
        {meta.sample && <p className="mt-8 rounded-2xl border border-accent p-4 text-[15px] text-muted">{t(ui.writeups.sampleNote)}</p>}
        <article className="mt-6 text-[17px] sm:text-[18px]">{children}</article>
      </main>
      <Footer />
    </div>
  );
}
