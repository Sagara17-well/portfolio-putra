"use client";
import { useRef } from "react";
import type { PointerEvent } from "react";
import { useSite } from "./Providers";
import { profile, stack } from "@/data/content";
import { ui } from "@/data/ui";

export default function IdCard() {
  const { t } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 12}deg) rotateY(${px * 14}deg)`;
    el.style.setProperty("--hx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--hy", `${(py + 0.5) * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  const skills = stack.flatMap((g) => g.items.slice(0, 2));

  return (
    <div className="mx-auto w-full max-w-[290px]">
      <div className="mx-auto h-5 w-14 rounded-t-xl border border-b-0 border-line bg-panel" aria-hidden />
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className="id-card relative rounded-3xl p-5">
        <div className="flex items-center justify-between font-mono text-[13px] text-muted">
          <span>{ui.card.id} · PBZ</span>
          <span className="flex items-center gap-1.5 text-ok"><i className="inline-block h-2 w-2 rounded-full bg-ok" />{t(profile.status)}</span>
        </div>
        <div className="id-screen id-photo relative mx-auto mt-4 aspect-square w-full overflow-hidden rounded-2xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dev-coding.png" alt="Ilustrasi developer sedang ngoding di depan monitor" className="id-art" />
          <i aria-hidden className="id-tint" />
          <i aria-hidden className="id-scan" />
        </div>
        <p className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight">
          {profile.name[0]}<br />{profile.name[1]}
        </p>
        <p className="font-mono text-[13px] text-accent">{t(ui.card.role)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills">
          {skills.map((x) => <span key={x} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11.5px] text-muted">{x}</span>)}
        </div>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-3 font-mono text-[13px]">
          <div className="flex justify-between gap-3"><dt className="text-muted">{t(ui.card.campus)}</dt><dd className="text-right">UTB</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">{t(ui.card.city)}</dt><dd className="text-right">{profile.city.split(",")[0]}</dd></div>
        </dl>
        <div className="barcode mt-4 rounded-sm" aria-hidden />
      </div>
    </div>
  );
}
