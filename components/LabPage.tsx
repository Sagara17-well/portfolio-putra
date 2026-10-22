"use client";
import Link from "next/link";
import Nav from "./Nav";
import { Footer } from "./Site";
import Labs from "./Labs";
import Ctf from "./Ctf";
import Tools from "./Tools";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";

export default function LabPage() {
  const { t } = useSite();
  return (
    <div id="top">
      <Nav base="/" current="lab" />
      <main id="main" className="mx-auto w-full max-w-6xl px-5 pb-24 pt-32">
        <Link href="/#lab" className="font-mono text-sm text-muted underline-offset-4 hover:text-ink hover:underline">&larr; {t(ui.sec.back)}</Link>
        <h1 className="mt-8 font-display text-[clamp(34px,6vw,56px)] font-extrabold leading-[1.05] tracking-tight">{t(ui.lab.title)}</h1>
        <p className="mt-5 max-w-[62ch] text-[17px] text-muted sm:text-[18px]">{t(ui.lab.sub)}</p>
        <div className="mt-10"><Labs /></div>
        <div id="ctf" className="mt-20"><Ctf /></div>
        <div id="tools" className="mt-20"><Tools /></div>
      </main>
      <Footer />
    </div>
  );
}
