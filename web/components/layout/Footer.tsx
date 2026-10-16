"use client";

import { Mail, MapPin, Phone, AtSign, Globe, Share2 } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll";
import { ADDRESS_FULL } from "@/lib/contact";

const anchorLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Koleksi", href: "#showcase" },
  { label: "Proses", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Lokasi", href: "#lokasi" },
  { label: "Kontak", href: "#cta" },
];

const socials = [
  // TODO(owner): tautan sosial belum tersedia (masih "#"). Isi URL resmi
  // Instagram/Facebook/etc. saat sudah ada agar tidak jadi tautan mati.
  { label: "Website", icon: Globe },
  { label: "Email", icon: AtSign },
  { label: "Berbagi", icon: Share2 },
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
        <div className="grid gap-10 md:grid-cols-2">
          {/* Brand */}
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
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact + quick links */}
          <div className="grid gap-8 sm:grid-cols-2">
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
              </ul>
            </div>

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