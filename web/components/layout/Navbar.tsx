"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Cog,
  HelpCircle,
  Home,
  Mail,
  Menu,
  Package,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import { PHONE_NUMBER, WA_DISPLAY } from "@/lib/contact";

const links = [
  { label: "Beranda", href: "#hero", icon: Home },
  { label: "Koleksi", href: "#showcase", icon: Package },
  { label: "Proses", href: "#process", icon: Cog },
  { label: "FAQ", href: "#faq", icon: HelpCircle },
  { label: "Kontak", href: "#cta", icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("rm:mobile-nav", { detail: { open } })
    );
  }, [open]);

  const solid = scrolled || active !== "#hero";

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 sm:h-[72px] transition-all duration-300",
        solid
          ? "border-b border-gray-200/60 bg-white/95 shadow-[0_1px_3px_-1px_rgba(15,23,42,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-brand flex h-full items-center justify-between px-4 sm:px-0">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollTo(e, "#hero")}
          className="group flex items-center gap-3"
        >
          <span className="rounded-lg bg-white/15 p-0.5">
            <Image
              src="/logo-rm.jpeg"
              alt="Rekayasa Manufaktur"
              width={32}
              height={32}
              className="h-8 w-8 rounded-[7px] object-cover"
            />
          </span>
          <span
            className={cn(
              "hidden text-[13px] font-bold tracking-[0.06em] transition-colors sm:inline",
              solid ? "text-navy-800" : "text-white"
            )}
          >
            REKAYASA MANUFAKTUR
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative text-[13px] font-medium transition-colors duration-200",
                  solid
                    ? "text-gray-600 hover:text-navy-800"
                    : "text-white/70 hover:text-white",
                  isActive && (solid ? "text-navy-800" : "text-white")
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-brand transition-all duration-300 group-hover:w-full",
                    isActive && "w-full"
                  )}
                />
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className={cn(
              "flex items-center gap-2 text-[13px] font-medium transition-colors",
              solid ? "text-gray-600 hover:text-navy-800" : "text-white/70 hover:text-white"
            )}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            +62 851 8666 6865
          </a>
          <a href="#cta" onClick={(e) => scrollTo(e, "#cta")}>
            <Button className="h-9 rounded-full px-5 text-[13px] font-semibold shadow-sm transition-all duration-300 hover:shadow-md">
              Minta Penawaran
            </Button>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Buka menu"
          onClick={() => setOpen(true)}
          className={cn(
            "lg:hidden flex items-center justify-center rounded-full border transition-all duration-300",
            solid
              ? "h-8 w-8 border-gray-200 bg-white text-navy-800 shadow-sm"
              : "h-8 w-8 border-white/30 bg-white/10 text-white"
          )}
        >
          <Menu className="h-4 w-4" />
        </button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className="!w-[300px] !pt-[env(safe-area-inset-top,0px)] sm:!w-[320px]"
          >
            <SheetHeader className="px-5 pt-6 pb-3 sm:px-6">
              <SheetTitle className="flex items-center gap-3">
                <span className="rounded-xl bg-gray-100 p-1.5">
                  <Image
                    src="/logo-rm.jpeg"
                    alt="Rekayasa Manufaktur"
                    width={28}
                    height={28}
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                </span>
                <span className="text-[13px] font-semibold tracking-[0.04em] text-navy-800">
                  REKAYASA MANUFAKTUR
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-1 flex flex-col gap-1 px-3 sm:px-4">
              {links.map((link) => {
                const isActive = active === link.href;
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group flex items-center gap-3 border-l-[3px] rounded-xl py-3 pr-4 pl-3 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "border-brand bg-brand/5 text-navy-800"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-navy-800 active:bg-gray-100"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center transition-colors duration-200",
                        isActive
                          ? "text-brand"
                          : "text-gray-400 group-hover:text-navy-700"
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    {link.label}
                  </a>
                );
              })}
              <a
                href="#cta"
                onClick={(e) => scrollTo(e, "#cta")}
                className="mt-2"
              >
                <Button className="h-11 w-full rounded-xl">
                  Minta Penawaran
                </Button>
              </a>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4 sm:mt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      Hubungi kami
                    </p>
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="block truncate text-sm font-semibold text-navy-800 transition-colors hover:text-brand"
                    >
                      {WA_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}