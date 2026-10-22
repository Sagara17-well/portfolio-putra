"use client";
import useInView from "./useInView";
import useReducedMotion from "./useReducedMotion";

export default function BlurText({ text, delay = 80, className = "" }: {
  text: string; delay?: number; className?: string;
}) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.2);
  const rm = useReducedMotion();
  const on = seen || rm;
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block" style={{
          marginRight: "0.25em",
          opacity: on ? 1 : 0,
          filter: on ? "blur(0)" : "blur(12px)",
          transform: on ? "none" : "translateY(16px)",
          transition: `opacity .7s ${i * delay}ms, filter .7s ${i * delay}ms, transform .7s ${i * delay}ms`,
        }}>{w}</span>
      ))}
    </span>
  );
}
