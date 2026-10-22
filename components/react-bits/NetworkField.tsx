"use client";
import { useEffect, useRef } from "react";
import useReducedMotion from "./useReducedMotion";

type Node = { x: number; y: number; vx: number; vy: number; r: number; v: boolean };

/** Latar jaringan node bercahaya (cyan/ungu). Bereaksi pada kursor, diam bila prefers-reduced-motion. */
export default function NetworkField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rm = useReducedMotion();
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    let cyan = "#27e6ff", violet = "#a65cff";
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      cyan = css.getPropertyValue("--accent").trim() || cyan;
      violet = css.getPropertyValue("--violet").trim() || violet;
    };
    readColors();
    let w = 0, h = 0, raf = 0, nodes: Node[] = [];
    const m = { x: -999, y: -999 };
    const LINK = 150;
    const seed = () => {
      const n = Math.min(70, Math.max(18, Math.round((w * h) / 18000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: 1.2 + Math.random() * 2, v: Math.random() > 0.6,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.5;
            ctx.strokeStyle = a.v || b.v ? violet : cyan;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const near = Math.max(0, 1 - Math.hypot(a.x - m.x, a.y - m.y) / 180);
        ctx.globalAlpha = 0.55 + 0.45 * near;
        ctx.fillStyle = a.v ? violet : cyan;
        ctx.shadowColor = a.v ? violet : cyan;
        ctx.shadowBlur = 10 + near * 14;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r + near * 2.5, 0, 6.283); ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    const step = () => {
      for (const a of nodes) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    };
    const resize = () => {
      const r = c.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      w = r.width; h = r.height;
      c.width = w * d; c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      seed(); draw();
    };
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      m.x = e.clientX - r.left; m.y = e.clientY - r.top;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (!rm) { window.addEventListener("pointermove", move); raf = requestAnimationFrame(step); }
    return () => { ro.disconnect(); mo.disconnect(); window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [rm]);
  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}
