import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Providers from "@/components/Providers";
import Loader from "@/components/Loader";
import ProgressBar from "@/components/ProgressBar";
import Toast from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";
import { siteUrl } from "@/lib/site";

const base = siteUrl();

export const metadata: Metadata = {
  metadataBase: base ? new URL(base) : undefined,
  title: "Putra Baadi Zaelani | Web Developer & Cybersecurity",
  description:
    "Portofolio Putra Baadi Zaelani: mahasiswa Teknik Informatika yang membangun aplikasi web lalu mengujinya sendiri. Coba lab keamanan interaktifnya. / Portfolio of a CS student who builds web apps and then tries to break them. Try the interactive security lab.",
  openGraph: {
    title: "Putra Baadi Zaelani | Web Developer & Cybersecurity",
    description: "Web apps, security and an interactive lab you can try in the browser.",
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04060f" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
};

// Dijalankan sebelum cat pertama agar tema tersimpan tidak berkedip.
const initScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');d.dataset.theme=(t==='light'||t==='dark')?t:'dark';if(sessionStorage.getItem('booted')==='1')d.dataset.booted='1'}catch(e){d.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <noscript><style>{".boot{display:none!important}"}</style></noscript>
        <Providers>
          <Loader />
          <ProgressBar />
          <Toast />
          <CommandPalette />
          {children}
        </Providers>
      </body>
    </html>
  );
}
