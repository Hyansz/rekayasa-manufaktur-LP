"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import gsap from "gsap";
import { scrollToSection } from "@/lib/scroll";

const headline = "Precision in Every Piece";

// GANTI DI SINI: URL foto hero proses produksi/produk (Cloudinary).
// f_auto,q_auto,w_1920 bikin Cloudinary otomatis pilih format & kualitas
// terbaik, lalu resize ke 1920px supaya tetap tajam saat full-screen.
const heroImage =
  "https://res.cloudinary.com/dtsrtikhr/image/upload/f_auto,q_auto,w_1920/v1789530994/two-worker-making-gates-smithy_1_vw6qlr.jpg";

// Kunci fokus foto di dalam frame (default "center").
// Ubah mis. ke "50% 30%" kalau subjek foto ada di sepertiga atas.
const heroImagePosition = "center";

// Alt text deskriptif untuk SEO & aksesibilitas.
const heroImageAlt =
  "Dua pekerja sedang mengelas rangka stainless steel di bengkel produksi Rekayasa Manufaktur";

// Placeholder blur 1x1 gelap (senada navy), mencegah flash putih sebelum foto termuat.
const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// useLayoutEffect tidak berlaku di server (SSR) dan memicu warning React.
// Fallback ke useEffect saat window belum ada, tanpa mengubah perilaku di browser.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reduced-motion: elemen defaultnya tersembunyi via class (opacity-0),
      // jadi langsung set ke final state biar tidak permanen tak terlihat.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(
          [
            ".hero-label",
            ".hero-headline .char",
            ".hero-sub",
            ".hero-cta",
            ".hero-stats",
            ".scroll-indicator",
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      // gsap.to() — starting state (opacity-0 / translateY) sudah ada sebagai
      // class Tailwind statis di markup, jadi tidak ada flash teks penuh.
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(".hero-label", { y: 0, opacity: 1, duration: 0.7 })
        .to(
          ".hero-headline .char",
          { y: 0, opacity: 1, stagger: 0.022, duration: 1.1 },
          "-=0.3"
        )
        // Lepas will-change setelah animasi char selesai — mencegah browser
        // terus menyiapkan compositing layer per-karakter selamanya.
        .set(".hero-headline .char", { willChange: "auto" })
        .to(".hero-sub", { y: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .to(
          ".hero-cta",
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7 },
          "-=0.5"
        )
        .to(".hero-stats", { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .to(".scroll-indicator", { opacity: 1, duration: 0.6 }, "-=0.2");
    }, ref);
    return () => ctx.revert();
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    scrollToSection(href, e);
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-navy-900"
    >
      {/* Foto hero — LCP element. priority + fill + sizes="100vw" biar langsung dimuat Full HD penuh tanpa lazy loading. */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={heroImageAlt}
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover"
          style={{ objectPosition: heroImagePosition }}
        />
      </div>

      {/* Gradient bottom-up: gelap HANYA di area teks (tengah-bawah), foto di
          atas & samping tetap jelas terlihat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 via-30% to-navy-900/10 to-70%"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-transparent"
      />

      {/* Grid pattern tipis sebagai aksen brand, tidak mengganggu foto */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)",
        }}
      />

      <div className="container-brand relative z-10 pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="hero-label text-[13px] font-semibold uppercase tracking-[0.22em] text-brand-light opacity-0 [transform:translateY(20px)]">
            Rekayasa Manufaktur
          </p>

          <h1 className="hero-headline mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[64px] lg:leading-[1.04]">
            {headline.split(" ").map((word, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="char inline-block will-change-transform opacity-0 [transform:translateY(60px)]"
                  >
                    {char}
                  </span>
                ))}
                {wi < headline.split(" ").length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-6 max-w-2xl text-base leading-relaxed text-white/70 opacity-0 [transform:translateY(30px)] sm:text-lg">
            Furnitur stainless steel &amp; mild steel premium dengan presisi
            teknik — dirakit dengan toleransi ±0.1mm untuk ruang yang modern,
            kokoh, dan berkelas.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#showcase"
              onClick={(e) => scrollTo(e, "#showcase")}
              className="hero-cta group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-navy-900 opacity-0 [transform:translateY(24px)] transition-colors duration-300 hover:bg-white/90 active:scale-[0.98]"
            >
              Jelajahi Koleksi
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href="#cta"
              onClick={(e) => scrollTo(e, "#cta")}
              className="hero-cta inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/90 opacity-0 [transform:translateY(24px)] transition-colors duration-300 hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
            >
              Minta Penawaran
            </a>
          </div>

          <div className="hero-stats mt-12 flex items-center justify-center gap-8 border-t border-white/10 pt-6 opacity-0 [transform:translateY(20px)] sm:gap-12">
            <div>
              <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                ±0.1mm
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
                Toleransi CNC
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" aria-hidden />
            <div>
              <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                10+
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
                Tahun Pengalaman
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" aria-hidden />
            <div>
              <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                500+
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
                Project Selesai
              </p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#social"
        onClick={(e) => scrollTo(e, "#social")}
        className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0"
        aria-label="Scroll to explore"
      >
        <span className="flex flex-col items-center gap-2 text-white/50 transition-colors hover:text-white">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
            Scroll to explore
          </span>
          <span className="animate-bounce">
            <ArrowDown className="h-4 w-4" aria-hidden />
          </span>
        </span>
      </a>
    </section>
  );
}