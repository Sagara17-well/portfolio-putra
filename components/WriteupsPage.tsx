"use client";
import Link from "next/link";
import Nav from "./Nav";
import { Footer } from "./Site";
import WriteupList from "./WriteupList";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";
import type { WriteupMeta } from "@/lib/writeups";

export default function WriteupsPage({ items }: { items: WriteupMeta[] }) {
  const { t } = useSite();
  return (
    <div id="top">
      <Nav base="/" />
      <main id="main" className="mx-auto w-full max-w-5xl px-5 pb-24 pt-32">
        <Link href="/#writeups" className="font-mono text-sm text-muted underline-offset-4 hover:text-ink hover:underline">&larr; {t(ui.sec.back)}</Link>
        <h1 className="mt-8 font-display text-[clamp(40px,8vw,72px)] font-extrabold leading-none tracking-tighter">{t(ui.writeups.title)}</h1>
        <p className="mt-5 max-w-[56ch] text-muted">{t(ui.writeups.sub)} {t(ui.writeups.idOnly)}</p>
        <div className="mt-10"><WriteupList items={items} /></div>
      </main>
      <Footer />
    </div>
  );
}
