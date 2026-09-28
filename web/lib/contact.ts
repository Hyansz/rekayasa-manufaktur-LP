/**
 * Source of truth untuk data kontak & identitas bisnis.
 * Semua komponen (Navbar, Footer, ProductShowcase, FinalCTA, widget WA)
 * harus mengambil dari sini — hindari hardcode nomor di banyak file.
 */

/** Nomor WhatsApp internasional (format wa.me), tanpa awalan 0/+ */
export const WA_NUMBER = "6285186666865";

/** Nomor yang benar sesuai update terbaru (menggantikan 6281228817191 lama) */
export const PHONE_NUMBER = "+6285186666865";

/** Tampilan nomor khas Indonesia: 0851-8666-6865 */
export const WA_DISPLAY = "0851-8666-6865";

/** Nama brand resmi */
export const BRAND_NAME = "Rekayasa Manufaktur";

/** Tagline utama di footer & brand block */
export const BRAND_TAGLINE =
  "Wujudkan Ruang Impian Anda dengan Furniture Premium";

/** Alamat operasional: Randusari, Mojosongo, Jebres, Surakarta */
export const ADDRESS_STREET = "Randusari RT 01/RW 30";
export const ADDRESS_AREA = "Kelurahan Mojosongo, Kecamatan Jebres";
export const ADDRESS_CITY = "Kota Surakarta, Jawa Tengah 57127";
export const ADDRESS_FULL = `${ADDRESS_STREET}, ${ADDRESS_AREA}, ${ADDRESS_CITY}`;

/** Email kontak */
export const EMAIL = "entrijm@gmail.com";
export const WEBSITE = "https://rekayasamanufaktur.id";

/** Membangun URL WhatsApp dengan pesan pra-terisi */
export function waUrlWithText(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** URL WhatsApp polos tanpa pesan */
export const waUrl = `https://wa.me/${WA_NUMBER}`;

/** Pesan pra-terisi untuk konsultasi umum */
export const WA_DEFAULT_MESSAGE =
  "Halo Rekayasa Manufaktur, saya ingin konsultasi furnitur stainless steel & mild steel premium. Mohon info lebih lanjut.";
