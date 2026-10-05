# LAPORAN SESI — 2026-09-18 · REBUILD LANGSUNG DARI ORIGINAL FOOTAGE (TIDAK ADA KLaim LAMA)

## Ringkas
User menolak laporan sebelumnya karena source ≠ build yang diklaim. Respons: **mulai dari nol** —
buktikan ffmpeg jalan → **trim ulang footage ASLI (kolase root) → landskape 16:9 720x404, 8.5s, loopable**
→ wire ke `Process.tsx` (video step-02 & step-03) → build `next build` → serve STATIC BARU
(port 4338, `web/out`) → verifikasi di browser terhadap **build baru**, bukan server lama.

## Jalur eksekusi (semua file di `assets/rebuild-process/`)
- `trimprocess.ps1` → lokasi ffmpeg/ffprobe absolut (WinGet Packages), ffmpeg `-version` terbukti (9.0.1), trims:
  - `2. Kolase produksi Rekayasa Manufaktur.mp4` (1080x1920, 60fps, 15s) → `ss=3 t=8.5` → `step-02-cutting.mp4/.webm` + poster
  - `3. Kolase produksi Rekayasa Manufaktur.mp4` → `ss=3 t=8.5` → `step-03-welding.mp4/.webm` + poster
  - crop `1080:608:0:656` → scale `720:404` (16:9), h264+vp9, `+faststart`, muted, loopable.
  - Output ke `web/public/videos/process/` + `web/public/images/process/` (poster).
- `Process.tsx` (source) → step-02 & step-03 kini punya field `video` (`poster`/`mp4`/`webm`),
  step-03 judul diubah **"Pengelasan & Perakitan"** (cocok footage kolase #3 yang memang pengelasan).
- `buildserve.ps1` + `startserve.ps1` + `static-server.cjs` → build `next build` (BE 8 halaman statis, build OK),
  lalu node static server di **port 4338** menyajikan `web/out` (kode ROOT absolut + fallback, handler "/").

## Verifikasi build BARU (bukan folder lama) — browser live
- URL `http://127.0.0.1:4338/#process`
- `videoCount = 2`: step-02 (dur 8.5s), step-03 (dur 8.5s)
- keduanya `readyState=4` (HAVE_ENOUGH_DATA, playable), `muted`, `autoplay` aktif (playing=true, current≈0.38s)
- sources array: `step-02-cutting.mp4` + `.webm`, `step-03-welding.mp4` + `.webm` — semua TER-SERVE dari `web/out` (HTTP 200)
- step-03 judul live: **"Pengelasan & Perakitan"** ✓
- placeholder "Video segera hadir" TIDAK muncul untuk step-02/03 ✓
- `web/out/videos/process/*.mp4|webm` + `images/process/*.jpg` — ADA di hasil build baru (`checkout.ps1` Test-Path: 12/12 ADA)

## Status
✅ SELESAI — source ter-wire, build baru valid, diserve fresh di 4338, terverifikasi di browser (dua video step
muter di build yang BENAR-BENAR baru). Tidak ada lagi klaim "build lama yang sudah tidak ada".

## Terkunci: Initial Commit + Keputusan Placeholder
- **Initial commit `0a61722`** — `feat(process): wire step-02/03 footage (trim 8.5s loop) ke build static — baseline sesi 2026-09-18`. Working tree **bersih** (0 perubahan).
- **Step 01 & 04 → tetap placeholder** ("Video segera hadir") sampai footage kolase step-01/04 dikirim menyusul oleh client — keputusan eksplisit user.
- Footage mentah root (kolase `1./2./3.`) + artefak pribadi (tempat-tidur*.png, logo-rm.jpeg) **di-ignore** `.gitignore` (tidak ikut commit ±70MB).
- Server live tetap **port 4338** (`web/out`) — video step-02/03 berputar, step-01/04 placeholder siap diisi saat footage tiba.
