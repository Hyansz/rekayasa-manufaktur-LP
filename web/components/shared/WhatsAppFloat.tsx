"use client";

import { useEffect, useState } from "react";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";
import {
  waUrlWithText,
  WA_DEFAULT_MESSAGE,
  WA_DISPLAY,
  BRAND_NAME,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * Widget WhatsApp mengambang global (fixed kanan-bawah, SEMUA halaman).
 * - Nol dependency baru: tombol svg inline + utilitas dari lib/contact.
 * - Muncul dengan transisi masuk halus (slide+fade) + pulse ring; muncul
 *   setelah delay singkat agar tidak menutupi animasi hero.
 * - Tooltip label hanya muncul saat hover (desktop), aria-label utk aksesibilitas.
 * - Sembunyi (opacity-0 + pointer-events-none) saat mobile nav drawer terbuka
 *   (event `rm:mobile-nav`) supaya tidak menumpuk di atas panel menu.
 */
export default function WhatsAppFloat() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onNav = (e: Event) => {
      setHidden((e as CustomEvent<{ open: boolean }>).detail.open);
    };
    window.addEventListener("rm:mobile-nav", onNav);
    return () => window.removeEventListener("rm:mobile-nav", onNav);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-[70] animate-in fade-in slide-in-from-bottom-4 slide-in-from-right-4 duration-700 delay-1000 transition-opacity duration-300",
        hidden && "pointer-events-none opacity-0"
      )}
    >
      <a
        href={waUrlWithText(WA_DEFAULT_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat ${BRAND_NAME} via WhatsApp di ${WA_DISPLAY}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <span
          aria-hidden
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40"
        />
        <WhatsAppIcon className="relative h-5 w-5 drop-shadow" />
      </a>
    </div>
  );
}