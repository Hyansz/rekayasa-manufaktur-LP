"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { products } from "@/lib/data";
import TiltCard from "@/components/3d/TiltCard";
import ScrollReveal from "@/components/shared/ScrollReveal";
import MaterialGradeInfo from "@/components/shared/MaterialGradeInfo";
import ProductWatermark from "@/components/shared/ProductWatermark";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

function ProductCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  // Single image → plain image, no carousel chrome
  if (count <= 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={images[0]}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-contain"
        style={{ transform: "translateZ(40px)" }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Slides — pointer-events-none supaya klik tembus ke panah/dots */}
      <div
        className="pointer-events-none flex h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`${alt} — foto ${i + 1}`}
            loading="lazy"
            draggable={false}
            className="h-full w-full shrink-0 select-none object-contain"
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label={`Foto sebelumnya: ${alt}`}
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-800 opacity-100 shadow-sm transition-all hover:bg-white active:scale-90 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label={`Foto berikutnya: ${alt}`}
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-800 opacity-100 shadow-sm transition-all hover:bg-white active:scale-90 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Ke foto ${i + 1} dari ${count}`}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index
                ? "w-4 bg-white"
                : "w-1.5 bg-white/60 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const showcase = products.filter((p) => p.featured).slice(0, 8);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    scrollToSection(href, e);
  };

  return (
    <section id="showcase" className="bg-white py-16 sm:py-20 md:py-28">
      <div className="container-brand">
        <ScrollReveal className="mb-10 max-w-2xl sm:mb-12 md:mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            Koleksi Unggulan
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
            Produk Pilihan Kami
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg">
            Dirancang dengan presisi dan material premium — setiap produk
            melalui proses engineering yang ketat.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map((product) => (
              <TiltCard key={product.id} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-colors duration-150 hover:border-brand/40">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 ring-1 ring-inset ring-black/5">
                    <ProductCarousel
                      images={
                        product.gallery.length > 0
                          ? product.gallery
                          : [product.image]
                      }
                      alt={product.name}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium tracking-wide text-navy-700 shadow-sm">
                      {product.categoryName}
                    </span>
                    <ProductWatermark />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-sm font-semibold leading-snug text-navy-800 sm:text-[15px]">
                      <Link
                        href={`/produk/${product.slug}`}
                        className="transition-colors hover:text-brand"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {product.highlights.slice(0, 2).map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-1.5 text-xs leading-relaxed text-gray-500"
                        >
                          <span
                            className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-brand"
                            aria-hidden
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <MaterialGradeInfo
                      grade={product.materialGrade}
                      className="mt-3"
                    />
                    <div className="mt-auto flex justify-end pt-3">
                      <Link
                        href={`/produk/${product.slug}`}
                        className="flex items-center gap-1 text-[11px] font-semibold text-brand transition-colors hover:text-brand-dark"
                      >
                        Lihat Detail
                        <ArrowUpRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-12 text-center">
          <a
            href="#cta"
            onClick={(e) => scrollTo(e, "#cta")}
            className="group inline-flex items-center gap-2 rounded-full bg-navy-800 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-700 active:scale-[0.98]"
          >
            Minta Katalog Lengkap
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
      </div>
    </section>
  );
}
