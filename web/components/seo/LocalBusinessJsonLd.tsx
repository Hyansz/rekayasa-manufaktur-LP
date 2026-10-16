import {
  BRAND_NAME,
  PHONE_NUMBER,
  EMAIL,
  ADDRESS_STREET,
  ADDRESS_AREA,
  ADDRESS_CITY,
} from "@/lib/contact";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";

/**
 * Structured data LocalBusiness untuk halaman utama.
 * Catatan: testimoni & rating sengaja TIDAK disertakan — bukan data
 * terverifikasi, dan Google melarang review/review-aggregate yang direview
 * oleh pemilik situs sendiri.
 *
 * TODO(owner): lengkapi field yang belum tersedia:
 *   - "geo": koordinat lintang/bujur bengkel  → TODO(owner)
 *   - "openingHoursSpecification": jam operasional  → TODO(owner)
 *   - "sameAs": URL media sosial resmi (Instagram/Facebook) → TODO(owner)
 */
export default function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND_NAME,
    url: SITE_URL,
    image: OG_IMAGE,
    telephone: PHONE_NUMBER,
    email: EMAIL,
    description:
      "Fabrikasi furnitur stainless steel & mild steel custom di Solo: meja, kabinet, tempat tidur susun, trolley. CNC laser cutting, TIG welding, presisi ±0.1mm.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ADDRESS_STREET}, ${ADDRESS_AREA}`,
      addressLocality: "Surakarta",
      addressRegion: "Jawa Tengah",
      postalCode: "57127",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    // TODO(owner): jam operasional belum tersedia.
    // "openingHoursSpecification": [],
    // TODO(owner): koordinat bengkel belum tersedia.
    // "geo": { "@type": "GeoCoordinates", latitude: ..., longitude: ... },
    // TODO(owner): media sosial resmi belum tersedia.
    // "sameAs": [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
