"use client";
import { useEffect, useState } from "react";
import useInView from "./useInView";
import useReducedMotion from "./useReducedMotion";

export default function CountUp({ to, duration = 1200, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.5);
  const rm = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (rm) { setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration, rm]);
  return <span ref={ref}>{v}{suffix}</span>;
}
