import { featuredProducts } from "@/lib/products";
import { ADDRESS_FULL } from "@/lib/contact";

// ADDRESS_FULL tersedia untuk komponen yang perlu alamat penuh.
export { ADDRESS_FULL } from "@/lib/contact";

export const PROJECTS_COMPLETED = 50;
export const YEARS_EXPERIENCE = 10;
export const WARRANTY_YEARS = 3;

export const COLLECTION_COUNT = featuredProducts.length;
export const COLLECTION_LABEL = `${COLLECTION_COUNT} Koleksi Produk`;

export const OPENING_HOURS = [
  { days: "Senin – Jumat", opens: "08.00", closes: "16.00", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"] },
  { days: "Sabtu", opens: "08.00", closes: "14.00", dayOfWeek: ["Saturday"] },
  { days: "Minggu", status: "Tutup", dayOfWeek: ["Sunday"], closed: true },
];

export const OPENING_HOURS_TEXT =
  "08.00–16.00 WIB";

export const GEO = {
  lat: -7.5415473,
  lng: 110.8583217,
};

export const MAPS_URL = "https://maps.app.goo.gl/Mqx1t6FNahdvkgEB6";
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${GEO.lat},${GEO.lng}&output=embed`;

// TODO(owner): Nama listing di Google Maps adalah "PT. ENTRI JAYA MAKMUR",
// berbeda dengan nama brand di situs ("Rekayasa Manufaktur"). Perlu konfirmasi resmi.
export const MAPS_LISTING_NAME = "PT. ENTRI JAYA MAKMUR";

export const SOCIALS = [
  {
    label: "Instagram Rekayasa Manufaktur",
    url: "https://www.instagram.com/rekayasamanufaktur/",
    key: "instagram",
  },
  {
    label: "TikTok Rekayasa Manufaktur",
    url: "https://www.tiktok.com/@rekayasamanufaktur",
    key: "tiktok",
  },
];

export const SITE_URL = "https://rekayasa-manufaktur.com";
