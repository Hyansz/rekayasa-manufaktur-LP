"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Apakah produk bisa custom ukuran?",
    a: "Tentu. Semua produk kami bisa dikustomisasi, mulai dari dimensi, profil, hingga finishing. Tim engineering kami akan mendiskusikan kebutuhan Anda dan memberikan rekomendasi terbaik.",
  },
  {
    q: "Berapa lama proses produksi?",
    a: "Untuk produk standar, estimasi produksi 7–14 hari kerja. Untuk produk custom, 14–30 hari kerja tergantung kompleksitas desain dan volume. Kami selalu informasikan timeline di awal.",
  },
  {
    q: "Apakah ada garansi?",
    a: "Ya. Setiap produk dilindungi garansi 5 tahun untuk rangka produk dan garansi 1 tahun untuk finishing. Komitmen kami pada kualitas tercermin di setiap produk.",
  },
  {
    q: "Apakah melayani pengiriman ke luar kota?",
    a: "Kami melayani pengiriman ke seluruh Indonesia. Pengiriman menggunakan pihak logistik terpercaya dengan asuransi, sehingga produk Anda aman sampai tujuan.",
  },
  {
    q: "Bagaimana cara melakukan pemesanan?",
    a: "Hubungi kami melalui formulir di bawah, telepon, atau WhatsApp. Tim kami akan merespons dalam 1x24 jam untuk konsultasi, survei, dan penawaran harga.",
  },
  {
    q: "Apakah tersedia layanan pemasangan?",
    a: "Untuk area Jabodetabek, kami menyediakan layanan pemasangan oleh tim berpengalaman. Untuk luar kota, bisa diatur dengan biaya khusus.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-16 sm:py-20 md:py-28">
      <div className="container-brand max-w-3xl">
        <ScrollReveal className="mb-10 text-center sm:mb-12">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
            Tidak menemukan jawaban? Hubungi kami — tim kami siap membantu.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger className="border-t border-gray-200">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-gray-200">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  )}
                >
                  <span className="text-base font-medium text-navy-800 sm:text-[17px]">
                    {faq.q}
                  </span>
                  <Plus
                    aria-hidden
                    className={cn(
                      "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300",
                      isOpen && "rotate-45"
                    )}
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-5 text-sm leading-relaxed text-gray-500 sm:pb-6 sm:text-[15px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}