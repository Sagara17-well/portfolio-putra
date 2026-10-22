"use client";
import { useEffect, useRef, useState } from "react";

export default function Toast() {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      setMsg(String((e as CustomEvent).detail));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(""), 2200);
    };
    window.addEventListener("app:toast", on);
    return () => { window.removeEventListener("app:toast", on); clearTimeout(timer.current); };
  }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4 print:hidden">
      {msg && (
        <div className="fade-up rounded-full border border-line bg-panel px-5 py-2 font-mono text-sm text-ink shadow-lg">
          <span className="mr-2 text-ok">&#10003;</span>{msg}
        </div>
      )}
    </div>
  );
}
