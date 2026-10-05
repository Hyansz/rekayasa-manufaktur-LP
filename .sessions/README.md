# Session & Backup Workflow

Sistem ini memastikan kamu (atau agent) bisa **melanjutkan kapan pun** tanpa kehilangan konteks.

## Alur per Session

1. **Mulai laguna** — buat laporan baru di `.sessions/SESSION-NNN.md` berisi: tanggal, scope, status.
2. **Kerjakan** pekerjaan sesuai `05_PROMPT.md` (Part 8: Step 1..7).
3. **Akhiri session** — update laporan `.sessions/SESSION-NNN.md` dengan:
   - Apa yang selesai
   - Hasil build/lint
   - Langkah berikutnya (belum dikerjakan)
4. **Backup otomatis** — jalankan:
   ```bash
   bash scripts/backup.sh "SESSION-NNN - Label"
   ```
   Ini akan:
   - Menyalin snapshot proyek ke `backups/<timestamp>-<label>/`
   - Membuat git commit + tag untuk restore mudah

## Cara Melanjutkan Lain Kali

1. Baca `.sessions/` untuk laporan terakhir (mulai dari SESSION terbesar).
2. Ke `web/` dan jalankan `npm run dev` untuk melihat hasil.
3. Lanjut kerjakan step berikutnya dari laporan.
4. Setelah selesai, jalankan `bash scripts/backup.sh` lagi.

## Status Steps (`05_PROMPT.md` Part 8)

Update checklist di bawah setiap session:

- [x] Step 1: Setup project (Next.js 15 + shadcn + deps)
- [x] Step 2: Layout & Global (Navbar, Footer, Container)
- [x] Step 3: Homepage sections
- [x] Step 4: Katalog page
- [x] Step 5: Detail Produk (dynamic route)
- [x] Step 6: Tentang & Kontak
- [x] Step 7: Polish & SEO

## Status Video Proses (`Process.tsx`)

- Step 02 "Pemotongan & Pembentukan" + Step 03 "Pengelasan & Perakitan" → **ter-wire** footage trim 8.5s loop (mp4/webm/poster), terverifikasi live di build baru (port 4338).
- Step 01 & Step 04 → **tetap placeholder** ("Video segera hadir") sampai footage metode/langkah dikirim menyusul oleh client (keputusan eksplisit user sesi 2026-09-18).

## Riwayat Session

- `SESSION-001.md` — Setup proyek + build seluruh website (Step 1–7)
- `SESSION-002.md` — Bug fix navbar (transparan/scroll) + polish UI + navbar mobile ala iPhone
- `SESSION-003.md` — Trim footage proses dari footage ASLI (root) → wire step-02/03 ke build → serve static 4338 → verifikasi build baru di browser → **initial commit `0a61722`** (repo belum punya commit sebelumnya; step-01/04 placeholder sampai footage tiba)
