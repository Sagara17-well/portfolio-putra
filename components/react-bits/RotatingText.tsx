"use client";
import { useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

export default function RotatingText({ items, interval = 2400, className = "" }: { items: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  const rm = useReducedMotion();
  useEffect(() => {
    if (rm || items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items.length, interval, rm]);
  return (
    <span className={`inline-grid overflow-hidden align-bottom ${className}`}>
      <span key={i} className="rot">{items[i]}</span>
    </span>
  );
}
