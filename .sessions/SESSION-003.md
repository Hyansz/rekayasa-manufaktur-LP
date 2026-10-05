# Session 003 — Rebuild Process Footage (Step 02/03) + Wire ke Build Static + Initial Commit

**Tanggal:** 2026-09-18
**Scope:** Trim ulang footage kolase **ASLI** root → landskape 16:9 loop 8.5s → wire ke `Process.tsx` (step-02/03) → build `next build` → serve baru port 4338 → verifikasi di browser pada **build baru** (bukan folder lama) → **initial commit**.
**Status:** Selesai + **ter-commit** (initial commit, working tree bersih)

## Yang Dikerjakan

### 1. Mulai dari NOL (laporan sebelumnya DITOLAK user)
- User menolak laporan lama karena source ≠ build yang diklaim. Respons: **rebuild langsung dari footage orisinal root** — buktikan ffmpeg jalan dulu, baru trim, wire, build, serve, verify.
- ffmpeg/ffprobe **terbukti** (WinGet Packages path absolut): `ffmpeg version 9.0.1-full_build` — `ffmpeg -version` output valid.

### 2. Trim footage ASLI (semua file di `assets/rebuild-process/`)
- `trimprocess.ps1` → lokasi ffmpeg/ffprobe absolut (WinGet Packages):
  - `2. Kolase produksi Rekayasa Manufaktur.mp4` (1080x1920, 60fps, ~15s) → `ss=3 t=8.5` → `step-02-cutting.mp4/.webm` + poster
  - `3. Kolase produksi Rekayasa Manufaktur.mp4` → `ss=3 t=8.5` → `step-03-welding.mp4/.webm` + poster
  - crop portrait `1080:608:0:656` → scale `720:404` (16:9 720x404), H.264 + VP9, `+faststart`, muted, loopable (8.5s).
  - Output ke `web/public/videos/process/` + poster `web/public/images/process/`.
- ffprobe verifikasi: durasi 8.5s, 720x404, playable.

### 3. Wire ke `Process.tsx`
- step-02 & step-03 kini punya field `video` (`poster`/`mp4`/`webm`).
- step-03 judul diubah **"Pengelasan & Perakitan"** (cocok footage kolase #3 yang memang pengelasan).
- step-01 & step-04 → **tetap placeholder** ("Video segera hadir") sampai footage dikirim client (keputusan eksplisit user).

### 4. Build & Serve BARU
- `next build` (BE 8 halaman statis) → `web/out` (folder build baru).
- Serve static via node server **port 4338** menyajikan `web/out` (ROOT absolut + fallback handler "/").
- Skrip: `buildserve.ps1` / `startserve.ps1` / `static-server.cjs`.

## Verifikasi (browser live — build BARU)
- URL `http://127.0.0.1:4338/#process`
- `videoCount = 2`: step-02 (dur 8.5s), step-03 (dur 8.5s) — keduanya live di build baru.
- `readyState=4` (HAVE_ENOUGH_DATA, playable), muted, autoplay aktif.
- sources: `step-02-cutting.mp4` + `.webm`, `step-03-welding.mp4` + `.webm` — ter-serve dari `web/out` (HTTP 200).
- step-03 judul live: **"Pengelasan & Perakitan"** ✓; placeholder "Video segera hadir" TIDAK muncul untuk step-02/03 ✓.
- `web/out/videos/process/*` + `images/process/*` — ADA di build baru (12/12).

## Terkunci: Initial Commit + Keputusan Placeholder
- **Initial commit `0a61722`** — `feat(process): wire step-02/03 footage (trim 8.5s loop) ke build static — baseline sesi 2026-09-18`. Working tree **bersih** (0 perubahan).
- Footage mentah root (kolase `1./2./3.`) + artefak pribadi (tempat-tidur*, logo-rm.jpeg, artwork) **di-ignore** `.gitignore` — tidak ikut commit (±70MB).
- Step-01 & step-04 → placeholder sampai footage dikirim menyusul.

## Catatan
- PATH bash rusak/di-mangle → gunakan `.ps1` + `powershell.exe -File` absolut, atau `bash -l -c`; hindari `$_` di bash.
- Server live port **4338** — lihat `http://127.0.0.1:4338/#process`.

## Cara Lanjutkan
```
Baca .sessions/README.md
cd web && npm run dev     # atau serve web/out static port 4338
bash scripts/backup.sh "SESSION-003 - Rebuild process footage + initial commit"
```
