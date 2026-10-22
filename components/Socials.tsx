"use client";
import { socials } from "@/lib/social";
import type { SocialKey } from "@/lib/social";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";

const dev = process.env.NODE_ENV !== "production";

function Icon({ k }: { k: SocialKey }) {
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (k) {
    case "instagram":
      return (<svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>);
    case "tiktok":
      return (<svg {...p}><path d="M14 4v10.2a3.7 3.7 0 1 1-3.7-3.7" /><path d="M14 4c.3 2.4 2 4 4.5 4.2" /></svg>);
    case "linkedin":
      return (<svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 7.8v.1M11.5 16v-3.2a2 2 0 0 1 4 0V16M11.5 10.5V16" /></svg>);
    default:
      return (<svg {...p}><path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.5 6l-3 12" /></svg>);
  }
}

export default function Socials({ variant = "cards" }: { variant?: "cards" | "icons" }) {
  const { t } = useSite();
  const items = socials().filter((s) => s.href || dev);
  if (items.length === 0) return null;

  if (variant === "icons") {
    return (
      <ul className="flex flex-wrap gap-2">
        {items.map((s) => (
          <li key={s.key}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
                <Icon k={s.key} />
              </a>
            ) : (
              <span title={`${s.label}: ${t(ui.social.empty)}`} className="grid h-10 w-10 place-items-center rounded-full border border-dashed border-line text-muted/50"><Icon k={s.key} /></span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => {
        const body = (
          <>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bg-soft text-accent"><Icon k={s.key} /></span>
            <span className="min-w-0">
              <span className="block font-semibold leading-tight">{s.label}</span>
              <span className="block truncate text-[14px] text-muted">{s.href ? s.handle || t(ui.social.open) : t(ui.social.empty)}</span>
            </span>
          </>
        );
        return (
          <li key={s.key}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-3.5 transition-colors hover:border-accent">{body}</a>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-3.5 opacity-60">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
