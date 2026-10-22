import type { Metadata } from "next";
import WriteupsPage from "@/components/WriteupsPage";
import { getWriteups } from "@/lib/writeups";

export const metadata: Metadata = {
  title: "Write-up | Putra Baadi Zaelani",
  description: "Catatan latihan keamanan: apa yang dicoba, apa yang ditemukan, dan cara menambalnya.",
};

export default function Page() {
  return <WriteupsPage items={getWriteups()} />;
}
