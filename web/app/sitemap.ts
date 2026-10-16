import type { MetadataRoute } from "next";
import { featuredProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const productEntries: MetadataRoute.Sitemap = featuredProducts.map(
    (product) => ({
      url: `${SITE_URL}/produk/${product.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productEntries,
  ];
}
