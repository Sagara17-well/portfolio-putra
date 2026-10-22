"use client";

import { useSite } from "./Providers";
import { music } from "@/data/content";
import { ui } from "@/data/ui";

function spotifyEmbed(raw: string) {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" || url.hostname !== "open.spotify.com") return null;
    const match = url.pathname.match(/^\/(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
    if (!match) return null;
    const [, type, id] = match;
    return {
      src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      href: `https://open.spotify.com/${type}/${id}`,
      height: type === "track" || type === "episode" ? 152 : 352,
    };
  } catch {
    return null;
  }
}

export default function Music() {
  const { t } = useSite();
  const sp = spotifyEmbed(music.spotify || "https://open.spotify.com/playlist/1fSoqAKAZaAizojmXkmDGw");

  if (!sp) {
    if (process.env.NODE_ENV === "production") return null;
    return <p className="mt-12 rounded-2xl border border-dashed border-line p-8 text-muted">{t(ui.music.dev)}</p>;
  }

  const bars = [38, 62, 46, 80, 54, 92, 66, 48, 74, 40];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.7fr]">
      <div
        aria-hidden="true"
        className="relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-accent bg-accent p-6 text-on-accent md:p-8"
        style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--on-accent) 22%, transparent) 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }}
      >
        <div className="flex h-24 items-end gap-2 md:h-32">
          {bars.map((h, i) => (
            <span
              key={i}
              className="eq-bar block w-3 rounded-sm bg-on-accent md:w-4"
              style={{ height: `${h}%`, animationDelay: `${i * 0.12}s`, animationDuration: `${0.8 + (i % 4) * 0.25}s` }}
            />
          ))}
        </div>
        <p className="mt-6 text-right font-mono text-[13px] font-semibold uppercase tracking-widest">
          &#9834; {t(ui.music.repeat)}
        </p>
      </div>

      <div className="min-w-0 rounded-2xl border border-line bg-panel p-5 md:p-6">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 9.5c4.7-1.3 9.6-.9 13.6 1.4" />
              <path d="M6 13.2c3.8-1 7.6-.7 10.8 1.1" />
              <path d="M7 16.7c2.9-.7 5.7-.5 8.1.8" />
            </svg>
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-extrabold leading-tight md:text-2xl">{t(ui.music.card)}</h3>
            <p className="font-mono text-[13px] text-muted">{t(ui.music.sub2)}</p>
          </div>
        </div>

        <iframe
          id="spotify-player"
          title={t(ui.music.spotify)}
          src={sp.src}
          width="100%"
          height={sp.height}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ minHeight: sp.height }}
          className="mt-5 w-full rounded-xl border border-line bg-panel"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 flex-1 text-[14px] text-muted">{t(ui.music.note)}</p>
          <a href={sp.href} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 font-semibold text-on-accent transition-opacity hover:opacity-90">
            {t(ui.music.open)} <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
