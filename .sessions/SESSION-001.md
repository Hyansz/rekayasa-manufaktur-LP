# Session 001 — Project Setup + Full Website Build

**Tanggal:** 2026-08-28
**Scope:** Step 1–7 (seluruh proyek) + Infrastruktur session/backup
**Status:** Selesai

## Yang Dikerjakan

### Infrastruktur Session & Backup
- Folder `.sessions/` untuk laporan per session (`SESSION-001.md`, `README.md`)
- Script backup `scripts/backup.sh` (snapshot + git commit + tag per session)
- Git repo diinisialisasi di root proyek

### Step 1: Setup Project
- Next.js 15.5.24 + TypeScript strict + Tailwind v4 + ESLint
- shadcn/ui (base-nova): button, card, badge, sheet, separator, input, textarea, select, dialog
- Deps: `gsap`, `@gsap/react`, `lenis`, `lucide-react`
- Data: `04_PRODUCTS.json` → `web/data/products.json` + `lib/types.ts` + `lib/data.ts`
- `next.config.ts` dengan `output: 'export'` + `images.unoptimized`

### Step 2: Layout & Global
- Design system di `globals.css` (navy/brand palette, Inter font, utilitas)
- `layout.tsx`: Inter font, metadata global, LenisProvider
- Navbar (glassmorphism + scroll transition + mobile Sheet), Footer 4-kolom, SiteShell, ScrollToTop

### Step 3: Homepage
- Hero (GSAP stagger, gradient navy), ValueProp (3 card), FeaturedProducts (6 unggulan)
- Craftsmanship (2 kolom), Testimonial (navy + logo klien), CTASection (gradient)

### Step 4: Katalog (`/katalog`)
- Header gradient, filter bar sticky (pills kategori + search + sort), grid 4/3/2/1, pagination 8/item, empty state

### Step 5: Detail Produk (`/produk/[slug]`)
- `generateStaticParams` (8 produk), gallery + thumbnail, specs, 2 CTA, related, sticky CTA mobile, JSON-LD Product schema

### Step 6: Tentang & Kontak
- `/tentang`: hero, story, stats, values, CTA
- `/kontak`: form + validasi + success state, info kontak, map placeholder

### Step 7: Polish & SEO
- `sitemap.ts`, `robots.ts`, `not-found.tsx` (404), `icon.svg`

## Hasil Verifikasi
- [x] `npm run build` sukses tanpa error — 19 halaman statis di-export ke `web/out/`
- [x] `npm run lint` / `npx tsc --noEmit` bersih
- [x] Konten homepage, detail, kontak terverifikasi di HTML export
- [x] Static export menghasilkan semua file HTML (home, katalog, kontak, tentang, 8 produk, 404, sitemap, robots)

## Catatan
- Katalog page menggunakan client-side filtering → grid produk dirender saat hydration (normal untuk static export). SEO produk diliput via halaman detail SSG + sitemap.

## Langkah Berikutnya (belum / opsi lanjutan)
- Ganti placeholder `placehold.co` dengan foto produk real
- Tambah halaman manajemen konten / backend bila diperlukan (v2)
- Deploy static export ke Vercel/Netlify

## Cara Lanjutkan
```
Baca .sessions/README.md
bash scripts/backup.sh "SESSION-001 - Project Setup + Website"
cd web && npm run dev
```
