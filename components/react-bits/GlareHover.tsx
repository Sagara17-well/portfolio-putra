"use client";
import type { PointerEvent, ReactNode } from "react";

export default function GlareHover({ children, className = "" }: { children: ReactNode; className?: string }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  return <div onPointerMove={onMove} className={`glare relative overflow-hidden ${className}`}>{children}</div>;
}
