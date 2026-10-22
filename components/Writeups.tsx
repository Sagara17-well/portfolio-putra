"use client";
import Link from "next/link";
import { WriteupCard } from "./WriteupList";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";
import type { WriteupMeta } from "@/lib/writeups";

export default function Writeups({ items }: { items: WriteupMeta[] }) {
  const { t } = useSite();
  return (
    <div className="mt-12">
      {items.length === 0 ? <p className="text-muted">{t(ui.writeups.none)}</p> : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => <li key={w.slug}><WriteupCard w={w} /></li>)}
        </ul>
      )}
      <Link href="/writeups" className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent">
        {t(ui.writeups.all)} <span aria-hidden>&rarr;</span>
      </Link>
    </div>
  );
}
