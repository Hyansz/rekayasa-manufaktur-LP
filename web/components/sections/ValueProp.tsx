import { Ruler, ShieldCheck, Repeat, Layers } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function ValueProp() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Material Premium",
      text: "Stainless Steel SS 304 &amp; SS 201 dengan finishing BA dan HL, serta Mild Steel dengan treatment anti karat dan powder coating. Tahan karat, awet, dan sesuai kebutuhan estetik maupun fungsional.",
      chips: ["SS 304", "SS 201", "Mild Steel", "BA Finish", "HL Finish", "Anti Karat"],
    },
    {
      icon: Ruler,
      title: "Presisi Teknik",
      text: "Toleransi machining ±0.1mm. Setiap joint, weld, dan surface finish diuji kualitasnya.",
      chips: ["±0.1mm", "TIG Welding", "CNC Laser"],
    },
    {
      icon: Repeat,
      title: "Produksi Cepat",
      text: "Proses fabrikasi &amp; machining terotomatisasi (laser cutting, welding, CNC) untuk lead time produksi yang efisien.",
      chips: ["Laser Cutting", "TIG Welding", "CNC"],
    },
    {
      icon: Layers,
      title: "Desain Timeless",
      text: "Estetika minimalis yang tidak lekang oleh waktu. Cocok untuk berbagai gaya interior — dari industrial hingga modern kontemporer.",
      chips: ["Minimalis", "Industrial", "Modern"],
    },
  ];

  return (
    <section id="value" className="bg-gray-50 py-16 sm:py-20 md:py-28">
      <div className="container-brand">
        <ScrollReveal className="mb-10 max-w-2xl sm:mb-12 md:mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            Standar Material Kami
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
            Standar Engineering untuk Ruang Anda
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg">
            Tiga pilar yang menopang setiap produk: material premium tahan
            karat, presisi machining, dan desain yang tidak lekang oleh waktu.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.1}>
              <div className="card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-md">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                  <card.icon className="h-5 w-5 text-brand" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-800">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {card.text}
                </p>
                <div className="relative mt-auto flex flex-wrap gap-2 pt-5">
                  {card.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-navy-600"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}