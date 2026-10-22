import type { MetadataRoute } from "next";
import { caseStudies, projects } from "@/data/content";
import { getWriteups } from "@/lib/writeups";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  const paths = [
    "", "/cv", "/lab", "/security", "/writeups",
    ...projects.filter((p) => p.case && caseStudies[p.slug]).map((p) => `/projects/${p.slug}`),
    ...getWriteups().map((w) => `/writeups/${w.slug}`),
  ];
  const now = new Date();
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: now }));
}
