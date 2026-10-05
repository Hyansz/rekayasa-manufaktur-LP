# Deploy ke Hostinger (hosting statis + PHP)

## Yang sudah disiapkan

| File | Fungsi |
|---|---|
| `hostinger-deploy.zip` | Folder rakit siap upload: statis `web/out` + `contact.php` + `.htaccess` + `config.php` |
| `hostinger/contact.php` | Endpoint `/api/contact` versi PHP (Turnstile + Resend + rate-limit + template email sama persis) |
| `hostinger/.htaccess` | Rewrite `POST /api/contact` → `contact.php` (frontend TIDAK perlu diubah) |
| `hostinger/config.php` | Secret TURNSTILE/RESEND/RECIPIENT (sudah di-isi dari `.dev.vars`, **git-ignored**) |
| `hostinger/config.example.php` | Template kosong bila perlu rekonfigurasi |

## Cara upload (pilih satu)

### A. hPanel → File Manager (paling mudah)
1. Login hPanel (hpanel.hostinger.com) → **File Manager**
2. Masuk folder **`public_html`**
3. Hapus semua isi lama `public_html` (BACKUP dulu kalau masih dipakai)
4. **Upload zip**: tombol Upload → pilih `hostinger-deploy.zip` di root proyek ini
5. Klik kanan file zip → **Extract**
6. Pastikan tersisa isi seperti: `index.html`, `_next/`, `contact.php`, `.htaccess`, `config.php`
7. Selesai. Buka situs kamu.

### B. FTP (FileZilla / WinSCP)
1. Login FTP (kredensial di hPanel → FTP Accounts)
2. Upload **isi folder `hostinger-deploy/`** (bukan foldernya) ke `public_html/`
3. Pastikan `.htaccess` ikut ter-upload (hidden file — aktifkan "show hidden files")

## Verifikasi setelah deploy

Buka browser → buka halaman situs → isi form kontak → kirim.
- Email harus masuk ke `RECIPIENT_EMAIL` dengan template neubrutalism
- Kalau form error, cek:
  - `/api/contact` harus melempar ke `contact.php` (pastikan `.htaccess` ada & mod_rewrite aktif)
  - `config.php` isi secret benar
  - Resend: `entrijm@gmail.com` sudah diverifikasi di resend.com

## Catatan

- Widget Turnstile di form **hanya jalan di domain yang terdaftar** di dashboard widget-nya
  (dash.cloudflare.com → Turnstile). Pastikan `rekayasa-manufaktur.com` sudah ditambahkan
  di kolom Domains widget, kalau tidak form tidak bisa diklik/error.
- Secret di `hostinger/config.php` TIDAK ikut git (lihat `.gitignore`).
- Kalau secret Cloudflare Pages berubah, samakan juga di `hostinger/deploy-fragment` → `config.php`, lalu re-upload file itu saja ke `public_html/config.php`.
- CORS whitelist: jika situs dibuka lewat domain baru, tambahkan origin-nya ke `allowed_origins` di `config.php` (dan `ALLOWED_ORIGINS` di `functions/api/contact.js` untuk Cloudflare).