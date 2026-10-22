import { l } from "./content";
import type { L } from "./content";

// Tantangan Mini CTF. Flag tidak disimpan polos: hanya hash SHA-256 yang dibandingkan di browser.
// Untuk membuat tantangan baru, hitung hash flag-nya, mis. di terminal:
//   node -e "console.log(require('crypto').createHash('sha256').update('PBZ{flag_baru}').digest('hex'))"
export type Challenge = {
  id: string;
  title: L;
  body: L;
  payload?: string; // teks yang ditampilkan sebagai bahan tantangan
  attr?: string; // nilai atribut data-catatan pada kartu (untuk tantangan "periksa elemen")
  hint: L;
  hash: string;
  points: number;
};

export const ctf: Challenge[] = [
  {
    id: "caesar", points: 10, hash: "65ae310de5d2ee3779e8fc3ce8608999a7c6a4be821d8b63852d33a28ed92bcb",
    title: l("Geser huruf", "Shifted letters"),
    body: l("Pesan ini digeser 3 huruf ke kanan. Kembalikan, lalu bungkus dengan PBZ{...}.", "This message was shifted 3 letters to the right. Undo it, then wrap it in PBZ{...}."),
    payload: "vdodp_vlehu",
    hint: l("Caesar cipher: geser setiap huruf 3 langkah ke arah sebaliknya.", "Caesar cipher: move each letter 3 steps the other way."),
  },
  {
    id: "base64", points: 10, hash: "b40088f974358fe2dd2408e4249b2031bee5bb576fba14f6ec41d859d34cb239",
    title: l("Bukan enkripsi", "Not encryption"),
    body: l("Teks ini tampak acak, tapi hanya disandikan. Ini flag-nya, bacalah.", "This text looks random, but it is only encoded. It holds the flag; read it."),
    payload: "UEJae2Jhc2U2NF9idWthbl9lbmtyaXBzaX0=",
    hint: l("Akhiran = sering menandakan Base64. Coba alat Base64 di bawah.", "A trailing = often signals Base64. Try the Base64 tool below."),
  },
  {
    id: "source", points: 20, hash: "0b66a55cec6e302781f843e54add5985f5355420c9a22d204eb522080114288b",
    title: l("Periksa elemen", "Inspect the element"),
    body: l("Flag ini tidak terlihat di layar, tetapi ada di halaman ini. Cari di mana browser menyimpannya.", "This flag is not visible on screen, but it is on this page. Find where the browser keeps it."),
    attr: "PBZ{lihat_sumber_halaman}",
    hint: l("Buka DevTools (F12), tab Elements, lalu periksa atribut pada kartu tantangan ini.", "Open DevTools (F12), the Elements tab, and look at the attributes on this challenge card."),
  },
  {
    id: "hex", points: 20, hash: "c60a40d89da8a11a969e55e6041818603690bcce9ac545a34323446558842a83",
    title: l("Heksadesimal", "Hexadecimal"),
    body: l("Setiap pasangan angka adalah satu karakter ASCII. Susun kembali pesannya.", "Each pair of digits is one ASCII character. Rebuild the message."),
    payload: "50 42 5a 7b 68 65 78 5f 6d 75 64 61 68 7d",
    hint: l("50 adalah huruf P. Cari tabel ASCII atau pakai alat konversi.", "50 is the letter P. Look up an ASCII table or use a converter."),
  },
];
