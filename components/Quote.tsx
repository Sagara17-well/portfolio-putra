"use client";
import { useEffect, useState } from "react";
import { useSite } from "./Providers";
import { quotes } from "@/data/content";
import { ui } from "@/data/ui";

// Satu kutipan per hari, dipilih dari tanggal setelah halaman siap.
export default function Quote() {
  const { t } = useSite();
  const [i, setI] = useState(0);
  useEffect(() => {
    const d = new Date();
    const day = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);
    setI(day % quotes.length);
  }, []);
  return (
    <figure className="mt-8 max-w-xl border-l-2 border-accent pl-5">
      <figcaption className="font-mono text-[13px] text-accent">{t(ui.quote.label)}</figcaption>
      <blockquote className="mt-2 font-display text-xl font-semibold leading-snug">{t(quotes[i])}</blockquote>
    </figure>
  );
}
