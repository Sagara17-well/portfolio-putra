import { l } from "./content";

// Isi halaman /security. Semua klaim di sini harus tetap sesuai dengan next.config.ts dan kodenya.
export const securityUpdated = "2026-10-20";

export const secHeaders: { name: string; value: string; why: ReturnType<typeof l> }[] = [
  { name: "Content-Security-Policy", value: "default-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://open.spotify.com", why: l("Browser hanya memuat sumber dari domain sendiri. Satu-satunya pengecualian adalah pemutar Spotify.", "The browser only loads sources from this domain. The one exception is the Spotify player.") },
  { name: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload", why: l("Setelah dibuka lewat HTTPS, browser menolak kembali ke HTTP selama dua tahun.", "Once opened over HTTPS, the browser refuses to go back to HTTP for two years.") },
  { name: "X-Frame-Options", value: "DENY", why: l("Halaman tidak bisa dipasang di iframe situs lain, sehingga clickjacking tidak berlaku.", "The page cannot be embedded in another site's iframe, so clickjacking does not apply.") },
  { name: "X-Content-Type-Options", value: "nosniff", why: l("Browser tidak menebak jenis berkas, jadi berkas tidak bisa disamarkan sebagai skrip.", "The browser does not guess file types, so a file cannot be disguised as a script.") },
  { name: "Referrer-Policy", value: "strict-origin-when-cross-origin", why: l("Situs lain hanya menerima nama domain, bukan alamat lengkap halaman.", "Other sites only receive the domain name, not the full page address.") },
  { name: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), autoplay=(self \"https://open.spotify.com\"), encrypted-media=(self \"https://open.spotify.com\"), fullscreen=(self \"https://open.spotify.com\"), picture-in-picture=(self \"https://open.spotify.com\"), clipboard-write=(self \"https://open.spotify.com\")", why: l("Fitur perangkat yang tidak dipakai dimatikan sepenuhnya.", "Device features the site does not use are switched off entirely.") },
  { name: "Cross-Origin-Opener-Policy", value: "same-origin", why: l("Jendela dari situs lain tidak bisa mengakses jendela ini lewat window.opener.", "Windows from other sites cannot reach this one through window.opener.") },
];

export const secPrivacy = [
  l("Situs ini tidak memasang cookie, analitik, atau pelacak sendiri. Satu-satunya pengecualian adalah pemutar Spotify di bagian Musik, yang dikelola oleh Spotify.", "This site sets no cookies, analytics, or trackers of its own. The one exception is the Spotify player in the Music section, which is run by Spotify."),
  l("Penyimpanan lokal browser dipakai hanya untuk tema, bahasa, dan progres Mini CTF. Datanya tidak pernah dikirim ke server.", "Browser local storage is used only for theme, language, and Mini CTF progress. That data is never sent to a server."),
  l("Font dihosting sendiri, jadi tidak ada permintaan ke Google Fonts.", "Fonts are self-hosted, so there are no requests to Google Fonts."),
  l("Pemutar Spotify (jika aktif) dimuat langsung di bagian Musik dan menghubungi spotify.com.", "The Spotify player (when enabled) loads directly in the Music section and contacts spotify.com."),
  l("Alat di bagian Lab berjalan sepenuhnya di browser. Teks yang kamu ketik tidak dikirim ke mana pun.", "The Lab tools run entirely in the browser. What you type is not sent anywhere."),
  l("Situs ini tidak punya login, database, atau formulir yang menyimpan data. Kontak lewat email biasa.", "This site has no login, database, or form that stores data. Contact is by plain email."),
];

export const secLimits = [
  l("CSP masih mengizinkan skrip dan gaya inline karena Next.js membutuhkannya untuk hidrasi. Itu melemahkan perlindungan terhadap XSS dibanding CSP berbasis nonce.", "The CSP still allows inline scripts and styles because Next.js needs them for hydration. That weakens XSS protection compared with a nonce-based CSP."),
  l("Rencana berikutnya: CSP berbasis nonce per permintaan, lalu menulis prosesnya sebagai write-up.", "Next step: a per-request nonce-based CSP, then writing up the process."),
  l("Header diatur oleh aplikasi. Nilai akhirnya bergantung pada hosting, jadi periksa hasilnya di securityheaders.com setelah deploy.", "Headers are set by the application. The final result depends on the host, so check it at securityheaders.com after deploying."),
];
