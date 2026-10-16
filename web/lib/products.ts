import { products } from "@/lib/data";
import type { Product } from "@/lib/types";

/** Produk yang tampil di showcase (dan memiliki halaman /produk/[slug]). */
export const featuredProducts: Product[] = products.filter((p) => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Produk terkait untuk halaman detail. Data `related` pada JSON menunjuk ke
 * id produk demo yang tidak memiliki halaman, jadi kita pakai produk unggulan
 * lain sebagai rekomendasi agar tidak ada tautan mati.
 */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return featuredProducts
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}
