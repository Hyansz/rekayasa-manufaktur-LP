import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MessageCircle, Check, MapPin } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import MaterialGradeInfo from "@/components/shared/MaterialGradeInfo";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {
  featuredProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { getProductContent } from "@/lib/product-content";
import { waUrlWithText, ADDRESS_FULL, WA_DISPLAY } from "@/lib/contact";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return featuredProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const content = getProductContent(slug);
  const image = product.image.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image}`;

  return {
    title: product.name,
    description: content?.metaDescription ?? product.description,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: content?.metaDescription ?? product.description,
      url: `${SITE_URL}/produk/${product.slug}`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${SITE_NAME}`,
      description: content?.metaDescription ?? product.description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.featured) notFound();

  const content = getProductContent(slug);
  const related = getRelatedProducts(product);
  const images = product.gallery.length > 0 ? product.gallery : [product.image];

  const waHref = waUrlWithText(
    `Halo Rekayasa Manufaktur, saya tertarik dengan ${product.name}. Mohon info spesifikasi, kustomisasi, dan penawaran harga.`
  );

  const crumbs = [
    { name: "Beranda", url: "/" },
    { name: "Koleksi", url: "/#showcase" },
    { name: product.name, url: `/produk/${product.slug}` },
  ];

  return (
    <SiteShell>
      <BreadcrumbJsonLd items={crumbs} />

      <article className="bg-white pb-16 pt-24 sm:pt-28 md:pb-24">
        <div className="container-brand">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <li className="flex items-center gap-1.5">
                <Link href="/" className="transition-colors hover:text-navy-800">
                  Beranda
                </Link>
                <ChevronRight className="h-3 w-3" aria-hidden />
              </li>
              <li className="flex items-center gap-1.5">
                <Link
                  href="/#showcase"
                  className="transition-colors hover:text-navy-800"
                >
                  Koleksi
                </Link>
                <ChevronRight className="h-3 w-3" aria-hidden />
              </li>
              <li aria-current="page" className="font-medium text-navy-700">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Galeri */}
            <div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-inset ring-gray-900/5">
                <Image
                  src={images[0]}
                  alt={`${product.name} — tampak utama`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-cover"
                />
              </div>

              {images.length > 1 && (
                <ul className="mt-4 grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((src, i) => (
                    <li
                      key={src}
                      className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 ring-1 ring-inset ring-gray-900/5"
                    >
                      <Image
                        src={src}
                        alt={`${product.name} — foto ${i + 2}`}
                        fill
                        sizes="(min-width: 1024px) 12vw, 25vw"
                        loading="lazy"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Detail */}
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand">
                {product.categoryName}
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
                {product.name}
              </h1>
              <div className="mt-3">
                <MaterialGradeInfo grade={product.materialGrade} defaultOpen />
              </div>

              <ul className="mt-6 space-y-2">
                {product.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      aria-hidden
                    />
                    {highlight}
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-lg font-bold tracking-tight text-navy-800">
                Spesifikasi
              </h2>
              <dl className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-100">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <dt className="text-gray-500">{spec.label}</dt>
                    <dd className="text-right font-medium text-navy-700">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 space-y-4 text-sm leading-relaxed text-gray-600">
                {(content?.paragraphs ?? [product.description]).map(
                  (paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  )
                )}
              </div>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-navy-900 shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Pesan {product.name} via WhatsApp
              </a>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {ADDRESS_FULL} · {WA_DISPLAY}
              </p>
            </div>
          </div>

          {/* Produk terkait */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold tracking-tight text-navy-800">
                Produk Terkait
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/produk/${item.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-colors hover:border-brand/40"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          loading="lazy"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                          {item.categoryName}
                        </span>
                        <h3 className="mt-1.5 text-base font-semibold text-navy-800">
                          {item.name}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                          Lihat Detail
                          <ChevronRight className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10">
            <Link
              href="/#showcase"
              className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              ← Lihat semua koleksi
            </Link>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
