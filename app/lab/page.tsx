import type { Metadata } from "next";
import LabPage from "@/components/LabPage";

export const metadata: Metadata = {
  title: "Lab | Putra Baadi Zaelani",
  description: "Alat keamanan, Mini CTF, dan utilitas yang berjalan di browser.",
};

export default function Page() {
  return <LabPage />;
}
