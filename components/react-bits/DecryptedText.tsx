"use client";
import { useCallback, useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&@!?";

export default function DecryptedText({ text, speed = 40, className = "" }: { text: string; speed?: number; className?: string }) {
  const rm = useReducedMotion();
  const [out, setOut] = useState(text);
  const run = useCallback(() => {
    if (rm) return;
    let i = 0;
    const id = setInterval(() => {
      setOut(text.split("").map((c, k) => (c === " " || k < i ? c : CH[Math.floor(Math.random() * CH.length)])).join(""));
      i += 1;
      if (i > text.length) { clearInterval(id); setOut(text); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, rm]);
  useEffect(() => {
    if (rm) { setOut(text); return; } // gerakan dikurangi: tampilkan teks asli, tanpa acak
    return run();
  }, [run, rm, text]);
  return (
    <span className={className} onMouseEnter={() => { run(); }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{out}</span>
    </span>
  );
}
