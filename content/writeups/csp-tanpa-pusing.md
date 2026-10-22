---
title: Contoh: Membaca Content-Security-Policy tanpa pusing
date: 2026-10-20
tags: web, header, csp
summary: Arti tiap direktif CSP yang sering muncul, cara mencobanya dengan aman, dan batasan unsafe-inline.
sample: true
---
Ini contoh format write-up. Ganti dengan catatanmu sendiri, lalu hapus baris `sample: true` di bagian atas berkas.

## Apa itu CSP
Content-Security-Policy adalah header yang memberi tahu browser dari mana saja halaman boleh memuat skrip, gaya, gambar, dan sumber lain. Jika penyerang berhasil menyisipkan skrip, browser menolak menjalankannya kalau sumbernya tidak ada di daftar.

## Contoh dasar
```http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'
```

- `default-src 'self'` berarti sumber lain hanya boleh dari domain sendiri.
- `object-src 'none'` menutup plugin lama.
- `frame-ancestors 'none'` mencegah halamanmu dipasang di iframe orang lain (anti-clickjacking).

## Cara mencoba dengan aman
Mulai dari mode laporan saja, yaitu `Content-Security-Policy-Report-Only`. Browser hanya mencatat pelanggaran di konsol tanpa memblokir apa pun, sehingga kamu bisa melihat apa yang akan rusak sebelum menegakkan aturan.

## Batasan `unsafe-inline`
Banyak kerangka kerja menyisipkan skrip kecil di halaman, sehingga CSP sering diberi `'unsafe-inline'`. Itu melemahkan perlindungan terhadap XSS. Cara yang lebih kuat adalah memberi setiap skrip sebuah nonce acak per permintaan dan hanya mengizinkan skrip yang membawa nonce itu.

## Pelajaran
- Terapkan bertahap: laporan dulu, tegakkan kemudian.
- Daftar sumber sekecil mungkin.
- Uji hasilnya di [securityheaders.com](https://securityheaders.com).
