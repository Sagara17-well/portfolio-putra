"use client";
import useInView from "./useInView";
import useReducedMotion from "./useReducedMotion";

export default function Radar({ data, size = 380 }: { data: { label: string; value: number }[]; size?: number }) {
  const [ref, seen] = useInView<SVGSVGElement>(0.3);
  const rm = useReducedMotion();
  const on = seen || rm;
  const c = size / 2, R = size / 2 - 56, n = data.length;
  const pt = (i: number, v: number): [number, number] => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + Math.cos(a) * R * v, c + Math.sin(a) * R * v];
  };
  const poly = (f: (i: number) => number) => data.map((_, i) => pt(i, f(i)).join(",")).join(" ");
  return (
    <svg ref={ref} viewBox={`0 0 ${size} ${size}`} role="img" className="w-full max-w-[440px]"
      aria-label={"Radar kemampuan: " + data.map((d) => `${d.label} ${d.value}`).join(", ")}>
      {[0.25, 0.5, 0.75, 1].map((k) => <polygon key={k} points={poly(() => k)} fill="none" stroke="var(--line)" />)}
      {data.map((d, i) => {
        const [x, y] = pt(i, 1);
        const [lx, ly] = pt(i, 1.2);
        return (
          <g key={d.label}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="var(--line)" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="var(--muted)" fontSize="12" fontFamily="var(--font-mono)">{d.label}</text>
          </g>
        );
      })}
      <g style={{ transformOrigin: `${c}px ${c}px`, transform: on ? "scale(1)" : "scale(0)", transition: "transform .9s cubic-bezier(.2,.7,.2,1)" }}>
        <polygon points={poly((i) => data[i].value / 100)} fill="var(--accent)" fillOpacity=".25" stroke="var(--accent)" strokeWidth="2" />
        {data.map((d, i) => {
          const [x, y] = pt(i, d.value / 100);
          return <circle key={d.label} cx={x} cy={y} r="4.5" fill="var(--ok)" />;
        })}
      </g>
    </svg>
  );
}
