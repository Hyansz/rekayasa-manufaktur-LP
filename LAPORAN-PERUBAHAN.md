# Laporan Perubahan

- Tanggal: 2026-09-23
- Status build produksi: **HIJAU** — `npm run build` sukses (kompilasi + typecheck + lint generasi lolos, 6/6 halaman statis ter-generate).

## Yang diminta
Merapikan bagian landing page yang masih memuat elemen promosi yang belum final / dianggap mengganggu, lalu memastikan build tetap hijau.

## Perubahan yang dikerjakan

### 1. Harga produk disembunyikan
- File: `web/components/sections/ProductShowcase.tsx`
- Harga dihapus dari **kartu grid** (card tetap, tombol "Lihat Detail" tetap ada).
- Harga juga disembunyikan di **modal detail** produk agar konsisten.
- Kode dikomentari agar mudah dimunculkan kembali begitu harga final sudah ditetapkan.

### 2. Bagian Proses (`web/components/sections/Process.tsx`)
- **Watermark logo RM** pada background → dihapus.
- **Strip statistik** (Tahun Pengalaman / Ton Material / ISO) → dihapus.
- **CTA "Lihat Video Fasilitas Produksi Lengkap" + badge sertifikasi** → dihapus (blok render tombol + render modal `<FacilityVideoModal>` dihapus dari output).

## Catatan kondisi akhir (transparan)
Build hijau, namun masih ada **warning lint berjenis "unused" yang bersifat kosmetik** (tidak menggagalkan build):
- `Process.tsx`: fungsi `FacilityVideoModal`, konstanta `certifications`, state `modalOpen`/`setModalOpen`, serta import `ScrollReveal` kini tidak terpakai — peninggalan blok video yang dihapus. Aman untuk dibersihkan pada langkah berikutnya bila diinginkan.
- File lain (`Navbar.tsx`, `SocialProof.tsx`, `FinalCTA.tsx`, `WhatsAppIcon.tsx`): warning unused yang **sudah ada sebelum sesi ini**, di luar lingkup perubahan ini.

## Belum dilakukan / opsional
- Membersihkan kode mati (dead code) di atas agar mencapai nol warning.
- Menampilkan kembali tombol / modal video fasilitas begitu footage final siap.
