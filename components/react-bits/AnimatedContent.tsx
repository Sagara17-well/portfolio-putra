"use client";
import type { ReactNode } from "react";
import useInView from "./useInView";
import useReducedMotion from "./useReducedMotion";

export default function AnimatedContent({ children, distance = 40, delay = 0, className = "" }: {
  children: ReactNode; distance?: number; delay?: number; className?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12);
  const rm = useReducedMotion();
  const show = seen || rm;
  return (
    <div ref={ref} className={className} style={{
      opacity: show ? 1 : 0,
      transform: show ? "none" : `translateY(${distance}px)`,
      transition: `opacity .7s ${delay}s, transform .7s ${delay}s cubic-bezier(.2,.7,.2,1)`,
    }}>{children}</div>
  );
}
