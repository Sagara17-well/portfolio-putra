import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import { caseStudies, projects } from "@/data/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.case && caseStudies[p.slug]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title} | Putra Baadi Zaelani`,
    description: p.desc.en,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!caseStudies[slug]) notFound();
  return <CaseStudy slug={slug} />;
}
