"use client";
import Link from "next/link";
import Nav from "./Nav";
import { Footer } from "./Site";
import { useSite } from "./Providers";
import { profile } from "@/data/content";
import { secHeaders, secLimits, secPrivacy, securityUpdated } from "@/data/security";
import { ui } from "@/data/ui";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-14 border-b border-line pb-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{children}</h2>
);

export default function SecurityPage() {
  const { t } = useSite();
  return (
    <div id="top">
      <Nav base="/" />
      <main id="main" className="mx-auto w-full max-w-4xl px-5 pb-24 pt-32">
        <Link href="/" className="font-mono text-sm text-muted underline-offset-4 hover:text-ink hover:underline">&larr; {t(ui.sec.back)}</Link>
        <p className="mt-8 font-mono text-[13px] text-accent">{t(ui.sec.eyebrow)}</p>
        <h1 className="mt-2 font-display text-[clamp(34px,6vw,56px)] font-extrabold leading-[1.05] tracking-tight">{t(ui.sec.title)}</h1>
        <p className="mt-5 max-w-[62ch] text-[17px] text-muted sm:text-[18px]">{t(ui.sec.lead)}</p>
        <p className="mt-3 font-mono text-[13px] text-muted">{t(ui.sec.updated)}: {securityUpdated}</p>

        <H2>{t(ui.sec.headers)}</H2>
        <ul className="mt-6 grid gap-4">
          {secHeaders.map((h) => (
            <li key={h.name} className="rounded-2xl border border-line bg-panel p-5">
              <p className="font-mono text-[14px] font-medium text-accent">{h.name}</p>
              <p className="mt-2 overflow-x-auto break-words rounded-xl border border-line bg-bg-soft p-3 font-mono text-[13px] leading-relaxed">{h.value}</p>
              <p className="mt-3 text-[16px] text-muted">{t(h.why)}</p>
            </li>
          ))}
        </ul>

        <H2>{t(ui.sec.privacy)}</H2>
        <ul className="mt-6 space-y-3">
          {secPrivacy.map((p) => (
            <li key={p.en} className="flex gap-3 text-[17px]"><span aria-hidden className="mt-0.5 text-ok">&#10003;</span><span>{t(p)}</span></li>
          ))}
        </ul>

        <H2>{t(ui.sec.limits)}</H2>
        <ul className="mt-6 space-y-3">
          {secLimits.map((p) => (
            <li key={p.en} className="flex gap-3 text-[17px]"><span aria-hidden className="mt-0.5 text-warn">&#9888;</span><span>{t(p)}</span></li>
          ))}
        </ul>

        <H2>{t(ui.sec.report)}</H2>
        <p className="mt-6 max-w-[62ch] text-[17px]">{t(ui.sec.reportText)}</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] text-muted">
          {ui.sec.rules.map((r) => <li key={r.en}>{t(r)}</li>)}
        </ul>
        <p className="mt-6 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}?subject=Security%20report`} className="rounded-full bg-accent-strong px-6 py-3 font-semibold text-on-accent transition-opacity hover:opacity-90">{profile.email}</a>
          <a href="/.well-known/security.txt" className="font-mono text-sm text-muted underline decoration-accent underline-offset-4 hover:text-ink">security.txt</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
