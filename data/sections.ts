import { ui } from "./ui";
import { showMusic } from "@/lib/social";

// Urutan bagian di beranda. inNav: tampil di menu atas (menu dibuat pendek; sisanya lewat Ctrl+K).
// href: arahkan ke halaman lain (mis. Lab punya halaman sendiri). Musik hilang otomatis kalau datanya kosong; Sertifikat selalu tampil (kosong = pesan).
export type SectionDef = { id: string; label: (typeof ui.nav)[keyof typeof ui.nav]; alias: string; inNav?: boolean; href?: string };

export const sections: SectionDef[] = [
  { id: "about", label: ui.nav.about, alias: "tentang about", inNav: true },
  { id: "education", label: ui.nav.edu, alias: "pendidikan sekolah kuliah education school" },
  { id: "skills", label: ui.nav.skills, alias: "skill keahlian skills" },
  { id: "projects", label: ui.nav.projects, alias: "proyek projects portfolio", inNav: true },
  { id: "writeups", label: ui.nav.writeups, alias: "write-up writeup tulisan catatan blog", inNav: true },
  { id: "lab", label: ui.nav.lab, alias: "lab demo tools alat ctf", inNav: true, href: "/lab" },
  { id: "certificates", label: ui.nav.certs, alias: "sertifikat certificates", inNav: true },
  { id: "experience", label: ui.nav.exp, alias: "pengalaman experience" },
  { id: "learning", label: ui.nav.learning, alias: "belajar learning" },
  ...(showMusic ? [{ id: "music", label: ui.nav.music, alias: "musik music playlist lagu spotify" }] : []),
  { id: "contact", label: ui.nav.contact, alias: "kontak contact email hubungi", inNav: true },
];
