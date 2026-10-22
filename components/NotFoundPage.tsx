"use client";
import Link from "next/link";
import Nav from "./Nav";
import { Footer } from "./Site";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";

export default function NotFoundPage() {
  const { t } = useSite();
  return (
    <div id="top">
      <Nav base="/" />
      <main id="main" className="mx-auto grid min-h-[70vh] w-full max-w-3xl place-items-center px-5 pb-24 pt-32 text-center">
        <div>
          <p className="font-mono text-sm text-accent">HTTP 404</p>
          <h1 className="mt-3 font-display text-[clamp(64px,16vw,140px)] font-extrabold leading-none tracking-tighter">404</h1>
          <p className="mx-auto mt-4 max-w-[44ch] text-muted">{t(ui.nf.text)}</p>
          <p className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-full bg-accent-strong px-6 py-3 font-semibold text-on-accent transition-opacity hover:opacity-90">{t(ui.nf.home)}</Link>
            <Link href="/writeups" className="rounded-full border border-line px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent">{t(ui.nf.writeups)}</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
