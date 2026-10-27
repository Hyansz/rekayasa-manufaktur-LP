"use client";

import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll";
import { ADDRESS_FULL } from "@/lib/contact";
import { SOCIALS, OPENING_HOURS_TEXT } from "@/lib/business";

const anchorLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Koleksi", href: "#showcase" },
  { label: "Proses", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Lokasi", href: "#lokasi" },
  { label: "Kontak", href: "#cta" },
];

export default function Footer() {
  const onHome = usePathname() === "/";
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  const [histatsEnabled, setHistatsEnabled] = useState(false);

  useEffect(() => {
    if (histatsEnabled) return;
    let timer: NodeJS.Timeout | null = null;
    const enable = () => {
      if (histatsEnabled) return;
      setHistatsEnabled(true);
    };
    const load = () => timer = setTimeout(enable, 6000);
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    events.forEach((ev) => window.addEventListener(ev, enable, { once: true, passive: true }));
    load();
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, enable));
      if (timer) clearTimeout(timer);
    };
  }, [histatsEnabled]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onHome) return;
    scrollToSection(href, e);
  };

  // Badge counter Histats di-inject oleh script pihak ketiga sebagai <a> tanpa
  // teks (gagal audit "link-name"). Tracking tetap jalan; kita hanya keluarkan
  // tautan tak-bernama itu dari urutan tab & accessibility tree.
  useEffect(() => {
    const sanitize = () => {
      document
        .querySelectorAll<HTMLAnchorElement>("#histats_counter a")
        .forEach((a) => {
          a.setAttribute("tabindex", "-1");
          a.setAttribute("aria-hidden", "true");
        });
    };
    sanitize();
    const timers = [setTimeout(sanitize, 1500), setTimeout(sanitize, 3500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <footer className="bg-navy-900 text-white/80">
      <div className="container-brand py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand + deskripsi + sosial */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-white/15 p-0.5">
                <Image
                  src="/logo-rm.jpeg"
                  alt="Rekayasa Manufaktur"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-[7px] object-cover"
                />
              </span>
              <span className="text-[13px] font-semibold tracking-wide text-white">
                REKAYASA MANUFAKTUR
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Precision in Every Piece. Furnitur stainless steel &amp; mild
              steel premium, dirancang dengan presisi teknik untuk kehidupan
              modern.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
                >
                  {social.key === "instagram" && (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                  {social.key === "tiktok" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                      fill="currentColor"
                    >
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.085V2h-3.556v13.672a2.896 2.896 0 0 1-2.888 2.806 2.896 2.896 0 0 1-2.888-2.898 2.896 2.896 0 0 1 4.195-2.595V9.35a6.45 6.45 0 0 0-1.307-.133 6.455 6.455 0 0 0-6.444 6.455 6.455 6.455 0 0 0 6.444 6.455 6.455 6.455 0 0 0 6.444-6.455V8.687a8.29 8.29 0 0 0 4.85 1.564V6.695a4.83 4.83 0 0 1-1.08-.009Z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi (termasuk link produk) */}
          <div>
            <h3 className="text-[13px] font-semibold text-white">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5">
              {anchorLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={hrefFor(link.href)}
                    onClick={(e) => scrollTo(e, link.href)}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2.5">
                <a
                  href={hrefFor("#showcase")}
                  onClick={(e) => scrollTo(e, "#showcase")}
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Lihat Katalog Produk
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak + jam operasional */}
          <div>
            <h3 className="text-[13px] font-semibold text-white">Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                <span>
                  {ADDRESS_FULL}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white/30" />
                <a
                  href="mailto:entrijm@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  entrijm@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-white/30" />
                <a
                  href="tel:+6285186666865"
                  className="transition-colors hover:text-white"
                >
                  +62 851 8666 6865
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                <span>
                  {OPENING_HOURS_TEXT}
                </span>
              </li>
              <li>
                <div id="histats_counter" />
                {histatsEnabled && (
                  <Script
                    id="histats-tracking"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                      __html: `var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,5055514,4,22,130,30,00011111']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
hs.src = ('https://s10.histats.com/js15_as.js');
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();`,
                    }}
                  />
                )}
                <noscript>
                  <a href="https://rekayasa-manufaktur.com" target="_blank" rel="nofollow noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://sstatic1.histats.com/0.gif?5055514&101"
                      alt=""
                      width={1}
                      height={1}
                    />
                  </a>
                </noscript>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-brand flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Rekayasa Manufaktur.</p>
          <p>Precision in Every Piece</p>
        </div>
      </div>
    </footer>
  );
}