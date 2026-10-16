import { SITE_URL } from "@/lib/seo";

interface Crumb {
  name: string;
  url: string;
}

/**
 * Structured data BreadcrumbList untuk halaman produk.
 * `items` harus sudah termasuk item saat ini sebagai entri terakhir.
 */
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
