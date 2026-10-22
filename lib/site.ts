import { profile } from "@/data/content";

// Alamat situs: isi profile.siteUrl, atau set NEXT_PUBLIC_SITE_URL. Di Vercel, alamat produksi terbaca otomatis.
export function siteUrl(): string {
  const raw =
    profile.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return raw.replace(/\/+$/, "");
}
