"use client";

import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useEffect } from "react";
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
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                      <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.11 1.39 4.52.84 1.55 1.98 3.09 3.3 4.55 1.58 1.72 3.57 2.93 5.68 3.36 1.55.31 3.14.4 4.69.25.01 1.54-.04 3.1.12 4.64.37 3.19 1.99 6.17 4.22 9.07 2.23 2.9 5.33 4.26 5.92 5.35.61 1.17.63 2.62.33 4.04-.04.15-.13.31-.27.37-1.34.55-2.76.76-3.99.78h.01c-.07 0-.15-.01-.22-.02-1.42-.19-2.89-.32-4.31-.59-1.46-.27-2.88-.73-4.22-1.48-1.28-.7-2.49-1.69-3.6-2.83-1.08-1.1-2.05-2.3-2.87-3.6-1.1-1.8-.8-3.5.01-4.9.31-.57.77-1.09 1.3-1.52.42-.36.92-.54 1.42-.56.57-.02 1.14.05 1.7.24.03.01.05.02.08.03.73.26 1.45.57 2.14.94 1.13.56 2.16 1.11 3.02 1.6 1.4.77 2.58 1.41 3.5 1.72.84.28 1.66.32 2.42.15.84-.18 1.57-.72 2.07-1.35.5-.63.8-1.42.77-2.26-.03-.84-.3-1.66-.83-2.4-.58-.82-1.44-1.48-2.39-1.92-.82-.39-1.69-.63-2.53-.73-.75-.09-1.52-.06-2.21.17-.05.02-.09.03-.13.05-1.48.52-2.95 1.09-4.3 1.71-2.78 1.3-5.07 2.14-5.33 2.31-.01 0-.02.01-.03.01-.02 0-.03-.01-.04-.01-2.14-.97-4.58-1.93-4.77-2.09-.02-.01-.04 0-.06.01-.13.14-.27.28-.4.42-1.68 1.82-3.98 3.56-5.88 3.93-.02.01-.04.01-.06.01-1.16.22-2.4.22-3.66-.22-1.42-.48-2.78-1.37-3.76-2.71-1.17-1.59-1.72-3.5-1.94-5.39-.21-1.79.14-3.64 1.1-5.21.12-.19.2-.41.35-.59 1.66-2.13 3.98-3.68 6.26-4.02.02 0 .03-.01.05-.01.12-.05.25-.07.38-.08 1.14-.12 2.25-.26 3.3-.94.04-.02.08-.05.12-.08 1.02-.58 1.92-1.34 2.68-2.25.66-.78 1.18-1.66 1.48-2.62.26-.84.3-1.72.14-2.58-.2-.96-.73-1.84-1.45-2.51-.08-.08-.16-.15-.25-.2-.27-.18-.55-.35-.83-.51-.35-.2-.71-.37-1.07-.51-.53-.21-1.08-.33-1.64-.36-.34-.02-.68-.02-1.01-.01-.69.02-1.37.12-2 .28-.58.15-1.14.37-1.64.72-.27.18-.52.39-.75.62-.33.35-.6.79-.73 1.21-.2 1.03-.26 2.07-.02 3.05.26 1.09.72 2.1 1.32 3.02.6 1.02 1.36 1.94 2.22 2.68.91.78 1.96 1.41 2.98 1.73.02.01.04.02.06.03.02.01.04.02.06.03l.01.01c.01 0 .02-.01.03-.01.02-.01.04-.02.06-.03 1.12-.35 2.27-.99 3.16-1.86.27-.27.52-.58.73-.91.16-.25.29-.52.4-.79.03-.07.04-.14.04-.21 0-.3-.04-.59-.14-.87-.12-.35-.28-.69-.4-.99-.02-.05-.04-.09-.07-.14-2.49-1.35-5.42-1.78-8.26-1.3-1.04.16-2.09.31-3.1.58-.02 0-.04.01-.06.01-1.13.3-2.31.78-3.33 1.52-.96.69-1.83 1.58-2.46 2.67-.61 1.05-1.01 2.17-1.23 3.34-.03.15-.04.31-.02.46.04.35.18.69.39 1 .09.14.18.28.28.41.09.12.18.23.27.35.01.02.02.04.03.06.01.02.02.04.03.06.01.01.01.02.02.03 1.02.57 2.1.97 3.1.97.02 0 .03-.01.05-.01.02 0 .03.01.05.01.19 0 .37-.02.55-.07.63-.17 1.18-.46 1.67-.83.02-.02.04-.03.06-.05.03-.02.06-.04.08-.07.62-.32 1.2-.73 1.72-1.19.02-.02.04-.04.06-.06.03-.03.06-.06.09-.09.33-.27.63-.57.88-.89.27-.35.48-.74.62-1.12.02-.07.04-.14.04-.21 0-.12-.03-.23-.08-.33-.03-.06-.06-.11-.1-.16l-.01-.01c-.01 0-.01 0-.02-.01-1.08-.57-2.03-1.33-2.82-2.22-.79-1.16-1.27-2.46-1.43-3.85-.01-.14-.03-.27-.08-.39-.1-.25-.23-.49-.38-.72-.02-.03-.04-.06-.07-.08l.01-.01zm0 2.163c-.65 0-1.29.05-1.92.16-.02.01-.05.02-.07.03-.02.01-.04.03-.06.04-1.37.65-2.56 1.7-3.39 2.97-.81 1.23-1.31 2.6-1.46 3.97-.14 1.17.07 2.37.56 3.43.1.19.21.37.34.53.02.03.04.06.07.08l.01.01c.01 0 .01 0 .02-.01.01-.01.02-.02.03-.03.83-1.2 1.9-2.21 3.1-2.98.95-.61 1.99-1.06 3.07-1.33.39-.1 1.18-.13 1.76-.09zM10.15 8.163a1.953 1.953 0 110 3.906 1.953 1.953 0 010-3.906zm3.69 11.08a1.953 1.953 0 110-3.906 1.953 1.953 0 010 3.906z" />
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
                <Script
                  id="histats-tracking"
                  strategy="lazyOnload"
                  dangerouslySetInnerHTML={{
                    __html: `var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,5055514,4,22,130,30,00011111']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
hs.src = ('//s10.histats.com/js15_as.js');
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();`,
                  }}
                />
                <noscript>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="//sstatic1.histats.com/0.gif?5055514&101"
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