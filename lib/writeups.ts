import fs from "node:fs";
import path from "node:path";

export type WriteupMeta = { slug: string; title: string; date: string; tags: string[]; summary: string; sample: boolean; minutes: number };

const DIR = path.join(process.cwd(), "content", "writeups");

function parse(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const fm: Record<string, string> = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return { fm, body };
}

function meta(slug: string, fm: Record<string, string>, body: string): WriteupMeta {
  return {
    slug,
    title: fm.title || slug,
    date: fm.date || "",
    tags: (fm.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
    summary: fm.summary || "",
    sample: fm.sample === "true",
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
  };
}

// Tulisan ada di content/writeups/<slug>.md (nama berkas = alamat halaman).
export function getWriteups(): WriteupMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => /^[a-z0-9-]+\.md$/.test(f))
    .map((f) => {
      const { fm, body } = parse(fs.readFileSync(path.join(DIR, f), "utf8"));
      return meta(f.replace(/\.md$/, ""), fm, body);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getWriteup(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { fm, body } = parse(fs.readFileSync(file, "utf8"));
  return { meta: meta(slug, fm, body), body };
}
