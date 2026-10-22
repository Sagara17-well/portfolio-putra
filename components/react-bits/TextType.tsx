"use client";
import { useEffect, useState } from "react";
import useReducedMotion from "./useReducedMotion";

export default function TextType({ texts, speed = 55, pause = 1600, className = "" }: {
  texts: string[]; speed?: number; pause?: number; className?: string;
}) {
  const rm = useReducedMotion();
  const [t, setT] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (rm) return;
    const cur = texts[t];
    let id: ReturnType<typeof setTimeout> | undefined;
    if (!del && n < cur.length) id = setTimeout(() => setN(n + 1), speed);
    else if (!del) id = setTimeout(() => setDel(true), pause);
    else if (n > 0) id = setTimeout(() => setN(n - 1), speed / 2);
    else { setDel(false); setT((t + 1) % texts.length); }
    return () => clearTimeout(id);
  }, [n, t, del, rm, texts, speed, pause]);
  return (
    <span className={className} aria-label={texts[0]}>
      <span aria-hidden>{rm ? texts[0] : texts[t].slice(0, n)}<span className="caret" /></span>
    </span>
  );
}
