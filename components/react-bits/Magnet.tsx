"use client";
import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import useReducedMotion from "./useReducedMotion";

export default function Magnet({ children, strength = 0.3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (rm || !el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${(e.clientY - r.top - r.height / 2) * strength}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`inline-block transition-transform duration-200 ${className}`}>
      {children}
    </div>
  );
}
