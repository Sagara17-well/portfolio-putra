"use client";
import { useEffect, useState } from "react";
import { useSite } from "./Providers";
import { ui } from "@/data/ui";

// Layar boot singkat. Hanya tampil sekali per sesi, dilewati bila pengguna memilih mengurangi gerakan.
export default function Loader() {
  const { t } = useSite();
  const [phase, setPhase] = useState<"show" | "out" | "gone">("show");
  const [step, setStep] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; } catch { /* abaikan */ }
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || calm || window.location.pathname !== "/") { setPhase("gone"); return; }
    try { sessionStorage.setItem("booted", "1"); } catch { /* abaikan */ }
    const ids = [
      setTimeout(() => setStep(1), 380),
      setTimeout(() => setStep(2), 800),
      setTimeout(() => setPhase("out"), 1250),
      setTimeout(() => setPhase("gone"), 1800),
    ];
    return () => ids.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === "gone") return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setPhase("out"); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [phase]);

  useEffect(() => {
    if (phase === "out") { const id = setTimeout(() => setPhase("gone"), 520); return () => clearTimeout(id); }
  }, [phase]);

  if (phase === "gone") return null;
  const lines = ui.loader.lines;
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`boot print:hidden fixed inset-0 z-[200] grid place-items-center bg-bg px-6 ${phase === "out" ? "loader-out" : ""}`}
    >
      <div className="w-full max-w-sm font-mono text-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-display text-2xl font-extrabold tracking-tight">PBZ</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="min-h-[4.5rem] space-y-1 text-ok">
          {lines.slice(0, step + 1).map((ln, i) => <p key={i} className="fade-up">{t(ln)}</p>)}
        </div>
        <div className="meter mt-5 h-1 overflow-hidden rounded-full">
          <i className="bg-accent" style={{ width: `${Math.min(100, (step + 1) * 34)}%` }} />
        </div>
        <button type="button" onClick={() => setPhase("out")} className="mt-6 text-xs text-muted underline-offset-4 hover:text-ink hover:underline">
          {t(ui.loader.skip)} (Esc)
        </button>
      </div>
    </div>
  );
}
