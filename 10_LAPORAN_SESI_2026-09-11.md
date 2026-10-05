# Laporan Sesi — 2026-09-11

Landing page Rekayasa Manufaktur (Next.js 15 + Tailwind v4 + Three.js).
Live di https://rekayasa-manufaktur.pages.dev

## Yang dikerjakan sesi ini

### 1. Perbaikan footer (sebelumnya)
- Akar masalah: kelas `bg-navy-950` tidak terdefinisi karena token tidak ada → footer transparan di atas body putih (teks putih tak terlihat).
- Fix: footer memakai `bg-navy-900`; terverifikasi lokal & edge (hard refresh browser juga).

### 2. Hero 3D (revisi iteratif)
- Objek dibuat langsung di kode (`components/3d/HeroScene.tsx`), bukan file `.glb`.
- Tema: furnitur → manufaktur (gear 12 gigi, pelat 4 baut hex, baut). Loading "fade-in" via double `requestAnimationFrame` + `duration-300`.
- Rotasi bentuk gear diperbaiki (semua di bidang X-Z lalu di-rotate bareng sebagai group).
- Arah spin gear diubah ke `rotation.z` (keputusan user) — gear menghadap kamera.
- Parallax kini track `pointermove` di level **window** → respons di seluruh hero termasuk di atas blok teks (sebelumnya hanya di luar `container-brand`).
- Komposisi akhir: 4 objek di 4 pojok + lighting simetris (key light tengah-atas, fill bawah, 2 pointLight seimbang); kanan-bawah = baut (dari gear).
- Teks hero tetap rata tengah; canvas full-bleed; CTA & stats rata tengah.

### 3. Carousel kartu produk — DIBUAT LALU DIBATALKAN
- Sempat dibuat carousel 3-gambar di `ProductCard` (panah + dots) di Katalog, Produk Terkait, dan home.
- User membatalkan. Semua dikembalikan ke versi gambar tunggal statis. Data `gallery` di `products.json` tetap dipertahankan tanpa diubah.

### 4. Pembersihan menjadi landing page murni
- Hapus rute lama: `/katalog`, `/kontak`, `/produk/[slug]`, `/tentang`.
- Hapus komponen mati: `ui/{badge,card,dialog,input,select,separator,textarea}`, `shared/{Breadcrumb,Container,SectionHeader}`, `product/ProductGallery`, `public/project-report.html`.
- `ProductCard` diubah jadi kartu non-link (tetap dalam TiltCard, hover zoom utuh).
- Hapus export tak terpakai `categories`/`Category` dari `lib/data.ts` & `lib/types.ts`.
- Build kini hanya menghasilkan `/` (+ not-found/robots/sitemap). Semua URL lama → 404.

### 5. Pembersihan root
- Hapus dokumen & artefak lama: `01–09_*.md`, `README.md`, `landing-preview.html`, `web.zip` (153MB), `screenshots.zip`, `screenshots/`, `agent/` (duplikat mirror), `scripts/`.
- Tetap: `.opencode/`, `.claude/`, `.agents/`, `skills-lock.json`, `.gitignore`, `.sessions/`.
- Catatan skill tak terpakai: `SKILLS_NOTE.md` (lokasi + alasan; folder skill dikecualikan dari pembersihan).

## Verifikasi
- Lint: 0 error (1 warning lama `SocialProof` tentang `<img>`).
- Build: sukses; deploy terakhir `a898df91` → live.
- Live check: canvas 3D render (opacity 1), 4–6 kartu produk (tergantung ScrollReveal), 0 error console.