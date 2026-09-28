"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clients } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 50, suffix: "+", label: "Proyek Selesai" },
  { value: 8, suffix: "", label: "Koleksi Produk" },
  { value: 5, suffix: "", label: "Tahun Berpengalaman" },
  { value: 100, suffix: "%", label: "Kepuasan Klien" },
];

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const counters = document.querySelectorAll<HTMLElement>(".stat-number");

    if (reduced) {
      counters.forEach((el, i) => {
        el.textContent = String(stats[i].value);
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-number",
        { innerText: 0 },
        {
          innerText: (i: number) => stats[i].value,
          duration: 2,
          ease: "power1.out",
          snap: { innerText: 1 },
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".stats-row",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".social-proof-item",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const allClients = [...clients, ...clients];

  return (
    <section
      ref={ref}
      id="social"
      className="overflow-hidden bg-white py-14 sm:py-16"
    >
      <div className="container-brand">
        <p className="social-proof-item text-center text-[13px] font-medium uppercase tracking-[0.2em] text-gray-400">
          Dipercaya oleh 50+ Proyek
        </p>

        {/* Logo marquee */}
        {/*
        <div className="marquee-hover fade-edge-x mt-8 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-14 pr-14">
            {allClients.map((client, i) => (
              <img
                key={`${client.name}-${i}`}
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="h-7 shrink-0 opacity-50 grayscale transition-opacity duration-300 hover:opacity-90"
              />
            ))}
          </div>
        </div>
        */}

        {/* Stats row */}
        <div className="stats-row mt-12 grid grid-cols-2 gap-6 border-t border-gray-100 pt-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-extrabold tracking-tight text-navy-800 sm:text-5xl">
                <span className="stat-number">0</span>
                <span className="text-brand">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}