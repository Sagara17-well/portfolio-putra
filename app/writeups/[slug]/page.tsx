import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WriteupArticle from "@/components/WriteupArticle";
import { renderMarkdown } from "@/lib/markdown";
import { getWriteup, getWriteups } from "@/lib/writeups";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriteups().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getWriteup(slug);
  if (!w) return {};
  return { title: `${w.meta.title} | Putra Baadi Zaelani`, description: w.meta.summary };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWriteup(slug);
  if (!w) notFound();
  return <WriteupArticle meta={w.meta}>{renderMarkdown(w.body)}</WriteupArticle>;
}
