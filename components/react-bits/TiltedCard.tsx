"use client";
import { useRef } from "react";
import type { PointerEvent } from "react";
import useReducedMotion from "./useReducedMotion";

export default function TiltedCard({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rm = useReducedMotion();
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (rm || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-py * 10}deg) rotateY(${px * 12}deg) scale(1.02)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave}
      className={`overflow-hidden rounded-xl border border-line bg-panel transition-transform duration-200 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="block aspect-video w-full object-cover" />
    </div>
  );
}
