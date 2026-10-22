"use client";
import useInView from "./useInView";
import useReducedMotion from "./useReducedMotion";

export default function ScrollFloat({ text, className = "" }: { text: string; className?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.3);
  const rm = useReducedMotion();
  const on = seen || rm;
  return (
    <span ref={ref} className={className}>
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block" style={{
          opacity: on ? 1 : 0,
          transform: on ? "none" : "translateY(70%) scaleY(1.5)",
          transition: `opacity .8s ${i * 30}ms, transform .8s ${i * 30}ms cubic-bezier(.2,.8,.2,1)`,
        }}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}
