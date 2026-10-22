import { music, profile } from "@/data/content";

// Bagian musik tampil di situs publik hanya jika tautan Spotify diisi (saat pengembangan selalu tampil agar mudah dicek).
export const showMusic = Boolean(music.spotify) || process.env.NODE_ENV !== "production";

export type SocialKey = "instagram" | "tiktok" | "linkedin" | "github";
export type Social = { key: SocialKey; label: string; href: string; handle: string };

const httpsUrl = (v: string) => {
  try { const u = new URL(v); return u.protocol === "https:" ? u.toString() : ""; } catch { return ""; }
};
const lastSegment = (url: string) => {
  try { return new URL(url).pathname.split("/").filter(Boolean).pop()?.replace(/^@/, "") ?? ""; } catch { return ""; }
};

// Terima username atau tautan penuh. Kosong berarti tidak ditampilkan.
function build(key: SocialKey, raw: string): { href: string; handle: string } {
  const v = raw.trim();
  if (!v) return { href: "", handle: "" };
  if (/^https?:\/\//i.test(v)) {
    const href = httpsUrl(v);
    return { href, handle: href ? lastSegment(href) : "" };
  }
  const h = v.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
  if (!/^[\w.\-]+$/.test(h)) return { href: "", handle: "" };
  const base: Record<string, string> = {
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/@",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/",
  };
  return { href: base[key] + h, handle: `@${h}` };
}

const LABELS: Record<SocialKey, string> = { instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn", github: "GitHub" };
const ORDER: SocialKey[] = ["instagram", "tiktok", "linkedin", "github"];

export function socials(): Social[] {
  return ORDER.map((key) => ({ key, label: LABELS[key], ...build(key, profile[key] ?? "") }));
}
