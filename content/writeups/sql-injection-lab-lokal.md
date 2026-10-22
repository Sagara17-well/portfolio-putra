---
title: Contoh: SQL injection di lab lokal dan cara menambalnya
date: 2026-10-18
tags: web, sql-injection, owasp
summary: Satu pola celah klasik, cara mengujinya di lab milik sendiri, dan tambalan dengan prepared statement.
sample: true
---
Ini contoh format write-up. Ganti isinya dengan pengalamanmu sendiri, lalu hapus baris `sample: true` di bagian atas berkas.

## Konteks
Uji hanya pada aplikasi yang kamu miliki atau lab yang memang disediakan untuk latihan, misalnya aplikasi rentan yang dipasang di komputermu sendiri.

## Celah
Query dibuat dengan menempelkan input pengguna langsung ke teks SQL:

```php
$q = "SELECT * FROM users WHERE email = '$email'";
$row = $db->query($q)->fetch_assoc();
```

Karena input tidak dipisahkan dari perintah SQL, pengguna bisa mengubah makna query.

## Cara menguji
Masukkan satu tanda kutip tunggal di kolom email dan amati. Jika muncul pesan error SQL atau perilaku halaman berubah, input kemungkinan masuk langsung ke query. Catat respons yang kamu lihat, bukan hanya kesimpulannya.

## Tambalan
Pisahkan perintah dari data dengan prepared statement:

```php
$stmt = $db->prepare("SELECT id, hash FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
```

## Pelajaran
- Jangan pernah menyusun query dengan menempelkan input pengguna.
- Validasi di server, bukan hanya di formulir.
- Tampilkan pesan error umum ke pengguna dan simpan detailnya di log.
- Rujukan: [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).
