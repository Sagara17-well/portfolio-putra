"use client";
import { useEffect, useRef } from "react";
import useReducedMotion from "./useReducedMotion";

export default function DotGrid({ gap = 28, className = "" }: { gap?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rm = useReducedMotion();
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    let base = "#26304d", hot = "#7b6cff";
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      base = css.getPropertyValue("--dot").trim() || base;
      hot = css.getPropertyValue("--accent").trim() || hot;
    };
    readColors();
    let w = 0, h = 0, raf = 0;
    const m = { x: -999, y: -999 };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          const t = Math.max(0, 1 - Math.hypot(x - m.x, y - m.y) / 150);
          ctx.fillStyle = t > 0 ? hot : base;
          ctx.globalAlpha = 0.4 + 0.6 * t;
          ctx.beginPath();
          ctx.arc(x, y, 1.4 + t * 2.8, 0, 6.283);
          ctx.fill();
        }
      }
    };
    const resize = () => {
      const r = c.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      w = r.width; h = r.height;
      c.width = w * d; c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      draw();
    };
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      m.x = e.clientX - r.left; m.y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (!rm) window.addEventListener("pointermove", move);
    return () => { ro.disconnect(); mo.disconnect(); window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [gap, rm]);
  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}
