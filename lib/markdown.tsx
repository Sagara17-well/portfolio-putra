import type { ReactNode } from "react";

// Pengubah markdown sederhana ke elemen React (tanpa HTML mentah, jadi aman dari injeksi).
// Mendukung: ## judul, paragraf, daftar, kutipan, blok kode, `kode`, **tebal**, *miring*, [tautan](https://...).
const safeHref = (u: string) => /^(https:\/\/|\/|#)/.test(u);

function inline(text: string, k: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0, n = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0], key = `${k}-${n++}`;
    if (m[1]) out.push(<code key={key} className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[0.9em]">{tok.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key} className="font-semibold">{tok.slice(2, -2)}</strong>);
    else if (m[3]) out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    else {
      const mm = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (mm && safeHref(mm[2])) {
        const ext = mm[2].startsWith("https://");
        out.push(<a key={key} href={mm[2]} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="underline decoration-accent underline-offset-4 hover:text-accent">{mm[1]}</a>);
      } else out.push(mm ? mm[1] : tok);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMarkdown(src: string): ReactNode[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const nodes: ReactNode[] = [];
  let i = 0, k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const key = `b${k++}`;
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      nodes.push(<pre key={key} className="mt-5 overflow-x-auto rounded-2xl border border-line bg-panel p-4 font-mono text-[13.5px] leading-relaxed"><code>{buf.join("\n")}</code></pre>);
    } else if (line.startsWith("### ")) {
      nodes.push(<h3 key={key} className="mt-8 font-display text-xl font-extrabold">{inline(line.slice(4), key)}</h3>); i++;
    } else if (line.startsWith("## ")) {
      nodes.push(<h2 key={key} className="mt-12 border-b border-line pb-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{inline(line.slice(3), key)}</h2>); i++;
    } else if (/^(- |\* )/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(- |\* )/.test(lines[i])) items.push(lines[i++].slice(2));
      nodes.push(<ul key={key} className="mt-4 list-disc space-y-2 pl-6">{items.map((t, j) => <li key={j}>{inline(t, `${key}-${j}`)}</li>)}</ul>);
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ""));
      nodes.push(<ol key={key} className="mt-4 list-decimal space-y-2 pl-6">{items.map((t, j) => <li key={j}>{inline(t, `${key}-${j}`)}</li>)}</ol>);
    } else if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) buf.push(lines[i++].slice(2));
      nodes.push(<blockquote key={key} className="mt-5 border-l-2 border-accent pl-5 text-muted">{inline(buf.join(" "), key)}</blockquote>);
    } else {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(```|#{2,3} |- |\* |\d+\. |> )/.test(lines[i])) buf.push(lines[i++]);
      nodes.push(<p key={key} className="mt-4 leading-relaxed">{inline(buf.join(" "), key)}</p>);
    }
  }
  return nodes;
}
