"use client";
import type { ReactNode } from "react";
import useInView from "./useInView";
import useReducedMotion from "./useReducedMotion";

export default function FadeContent({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  const rm = useReducedMotion();
  const show = seen || rm;
  return (
    <div ref={ref} className={className} style={{
      opacity: show ? 1 : 0, transform: show ? "none" : "scale(.98)",
      transition: `opacity .9s ${delay}s ease, transform .9s ${delay}s ease`,
    }}>{children}</div>
  );
}
