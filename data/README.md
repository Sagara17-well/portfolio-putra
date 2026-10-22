# Peta data: mau ubah apa, di mana

| Yang ingin diubah | Berkas |
| --- | --- |
| Nama, kampus, email, status, tautan sosial, `siteUrl`, Spotify, kutipan | `data/content.ts` |
| Proyek, pengalaman, bahan belajar, sertifikat | `data/content.ts` |
| Semua teks antarmuka (Indonesia dan Inggris) | `data/ui.ts` |
| Urutan bagian beranda dan isi menu atas | `data/sections.ts` (`inNav` = tampil di menu) |
| Tantangan Mini CTF | `data/ctf.ts` |
| Isi halaman Keamanan situs | `data/security.ts` |
| Tulisan write-up | `content/writeups/*.md` |
| Gambar proyek dan sertifikat | `public/` |
| Header keamanan | `next.config.ts` |

Tips: jika kamu mengubah header di `next.config.ts`, perbarui juga `data/security.ts` agar halaman /security tetap jujur.
