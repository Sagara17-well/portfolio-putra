import type { Metadata } from "next";
import SecurityPage from "@/components/SecurityPage";

export const metadata: Metadata = {
  title: "Keamanan situs | Putra Baadi Zaelani",
  description: "Header keamanan yang dipasang, praktik privasi, batasan yang diketahui, dan cara melaporkan temuan.",
};

export default function Page() {
  return <SecurityPage />;
}
