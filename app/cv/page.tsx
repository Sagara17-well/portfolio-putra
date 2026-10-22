import type { Metadata } from "next";
import CvView from "@/components/CvView";

export const metadata: Metadata = {
  title: "CV | Putra Baadi Zaelani",
  description: "CV Putra Baadi Zaelani: Web Developer & Cybersecurity.",
};

export default function Page() {
  return <CvView />;
}
