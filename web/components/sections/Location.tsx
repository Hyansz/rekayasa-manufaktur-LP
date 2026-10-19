import { MapPin, Truck, Wrench, Navigation, Clock, Phone } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  ADDRESS_FULL,
  PHONE_NUMBER,
  WA_DISPLAY,
  waUrlWithText,
  WA_DEFAULT_MESSAGE,
} from "@/lib/contact";
import {
  OPENING_HOURS,
  OPENING_HOURS_TEXT,
  MAPS_URL,
  MAPS_EMBED_URL,
} from "@/lib/business";

const mapsUrl = MAPS_URL;

const services = [
  {
    icon: Truck,
    title: "Pengiriman Seluruh Indonesia",
    text: "Produk dikirim ke seluruh Indonesia memakai logistik terpercaya dengan asuransi, sehingga aman sampai tujuan.",
  },
  {
    icon: Wrench,
    title: "Layanan Pemasangan",
    text: "Untuk area Jabodetabek, kami menyediakan pemasangan oleh tim berpengalaman. Luar kota bisa diatur dengan biaya khusus.",
  },
];

export default function Location() {
  return (
    <section id="lokasi" className="bg-gray-50 py-16 sm:py-20 md:py-28">
      <div className="container-brand">
        <ScrollReveal className="mb-10 max-w-2xl sm:mb-12 md:mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
            Lokasi & Layanan
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-800 md:text-4xl">
            Lokasi Bengkel &amp; Area Layanan
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg">
            Workshop kami berlokasi di Solo, Jawa Tengah, dan melayani
            pengiriman ke seluruh Indonesia.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2">
          <ScrollReveal className="md:col-span-1">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                  <MapPin className="h-5 w-5 text-brand" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-800">
                  Alamat Workshop
                </h3>
                <address className="mt-3 not-italic text-sm leading-relaxed text-gray-500">
                  {ADDRESS_FULL}
                </address>

                {/* Jam operasional */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Jam Operasional
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {OPENING_HOURS_TEXT}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-gray-100 active:scale-95"
                >
                  <Phone className="h-4 w-4 text-brand" aria-hidden />
                  {WA_DISPLAY}
                </a>
                <a
                  href={waUrlWithText(WA_DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark active:scale-95"
                >
                  Chat via WhatsApp
                </a>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-navy-700 active:scale-[0.98]"
              >
                <Navigation className="h-4 w-4" aria-hidden />
                Buka di Google Maps
              </a>
            </div>
          </ScrollReveal>

          {/* Peta embed — kanan di desktop, bawah di mobile */}
          <ScrollReveal className="md:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <div className="aspect-video w-full">
                <iframe
                  src={MAPS_EMBED_URL}
                  loading="lazy"
                  title="Peta lokasi Rekayasa Manufaktur di Surakarta, Jawa Tengah"
                  className="h-full w-full rounded-t-2xl border-0"
                  allowFullScreen
                />
              </div>
            </div>
          </ScrollReveal>

          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={0.1 * (i + 1)} className="md:col-span-1">
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                  <service.icon className="h-5 w-5 text-brand" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-navy-800">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {service.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Butuh survei lokasi atau penawaran? Hubungi kami di{" "}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="font-semibold text-navy-800 transition-colors hover:text-brand"
            >
              {WA_DISPLAY}
            </a>{" "}
            atau{" "}
            <a
              href={waUrlWithText(WA_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand transition-colors hover:text-brand-dark"
            >
              chat via WhatsApp
            </a>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
