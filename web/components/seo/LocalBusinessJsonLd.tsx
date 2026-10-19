import {
  BRAND_NAME,
  PHONE_NUMBER,
  EMAIL,
  ADDRESS_STREET,
  ADDRESS_AREA,
} from "@/lib/contact";
import { OG_IMAGE } from "@/lib/seo";
import { GEO, MAPS_URL, SOCIALS, OPENING_HOURS, SITE_URL } from "@/lib/business";

/**
 * Structured data LocalBusiness untuk halaman utama.
 * Catatan: testimoni & rating sengaja TIDAK disertakan — bukan data
 * terverifikasi, dan Google melarang review/review-aggregate yang direview
 * oleh pemilik situs sendiri.
 *
 * TODO(owner): Nama listing di Google Maps adalah "PT. ENTRI JAYA MAKMUR",
 * berbeda dengan nama brand di situs ("Rekayasa Manufaktur").
 * Nama di situs dan nama di Maps berbeda; konfirmasi konsistensi branding.
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
    openingHoursSpecification: OPENING_HOURS
      .filter((h) => !h.closed && h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.dayOfWeek,
        opens: h.opens!.replace(".", ""),
        closes: h.closes!.replace(".", ""),
      })),
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.lat,
      longitude: GEO.lng,
    },
    sameAs: SOCIALS.map((s) => s.url),
    hasMap: MAPS_URL,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
