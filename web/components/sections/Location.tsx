import {
  MapPin,
  Truck,
  Wrench,
  Navigation,
  Clock,
  Phone,
  CalendarDays,
  CalendarX,
} from "lucide-react";

import ScrollReveal from "@/components/shared/ScrollReveal";

import {
  ADDRESS_FULL,
  PHONE_NUMBER,
  WA_DISPLAY,
  waUrlWithText,
  WA_DEFAULT_MESSAGE,
} from "@/lib/contact";

import {
  MAPS_URL,
  MAPS_EMBED_URL,
} from "@/lib/business";

const operatingHours = [
  {
    icon: Clock,
    label: "Senin–Jumat",
    hours: "08.00–16.00 WIB",
  },
  {
    icon: CalendarDays,
    label: "Sabtu",
    hours: "08.00–14.00 WIB",
  },
  {
    icon: CalendarX,
    label: "Minggu",
    hours: "Libur",
    closed: true,
  },
];

const services = [
  {
    icon: Truck,
    title: "Pengiriman Seluruh Indonesia",
    text: "Produk dikirim ke seluruh Indonesia menggunakan layanan logistik terpercaya. Opsi asuransi dapat dipertimbangkan untuk membantu menjaga keamanan pengiriman.",
  },
  {
    icon: Wrench,
    title: "Layanan Pemasangan",
    text: "Layanan pemasangan tersedia untuk area Jabodetabek oleh tim berpengalaman. Untuk lokasi di luar area tersebut, ketersediaan layanan dan biaya tambahan dapat dikonsultasikan terlebih dahulu.",
  },
];

const LOCATION_WA_MESSAGE =
  "Halo Rekayasa Manufaktur, saya ingin bertanya mengenai lokasi workshop dan layanan yang tersedia.";

const QUOTATION_WA_MESSAGE =
  "Halo Rekayasa Manufaktur, saya ingin berkonsultasi mengenai kebutuhan produk atau meminta penawaran.";

export default function Location() {
  const locationWhatsAppUrl = waUrlWithText(LOCATION_WA_MESSAGE);
  const quotationWhatsAppUrl = waUrlWithText(QUOTATION_WA_MESSAGE);

  return (
    <section
      id="lokasi"
      aria-labelledby="location-heading"
      className="scroll-mt-24 bg-gray-50/80 py-12 sm:py-16 lg:py-20"
    >
      <div className="container-brand">
        {/* Section heading */}
        <ScrollReveal className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand sm:text-[13px]">
            Lokasi &amp; Layanan
          </p>

          <h2
            id="location-heading"
            className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-navy-800 sm:text-3xl lg:text-4xl"
          >
            Lokasi Bengkel &amp; Area Layanan
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Workshop kami berlokasi di Solo, Jawa Tengah, dengan
            layanan pengiriman ke seluruh Indonesia.
          </p>
        </ScrollReveal>

        {/* Main location layout */}
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Workshop information */}
          <ScrollReveal className="min-w-0 lg:col-span-5">
            <div className="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6 lg:p-7">
              {/* Address */}
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <MapPin
                    className="h-5 w-5 text-brand"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Workshop Kami
                  </p>

                  <h3 className="mt-1 text-lg font-bold tracking-tight text-navy-800 sm:text-xl">
                    Alamat Workshop
                  </h3>

                  <address className="mt-2 break-words text-sm not-italic leading-6 text-gray-500">
                    {ADDRESS_FULL}
                  </address>
                </div>
              </div>

              {/* Operating hours */}
              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Clock
                    className="h-4 w-4 shrink-0 text-brand"
                    aria-hidden="true"
                  />

                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Jam Operasional
                  </h4>
                </div>

                <div className="space-y-3">
                  {operatingHours.map((schedule) => {
                    const Icon = schedule.icon;

                    return (
                      <div
                        key={schedule.label}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2 text-gray-600">
                          <Icon
                            className="h-4 w-4 shrink-0 text-gray-400"
                            aria-hidden="true"
                          />

                          <span>{schedule.label}</span>
                        </span>

                        <span
                          className={
                            schedule.closed
                              ? "shrink-0 font-semibold text-gray-400"
                              : "shrink-0 font-semibold tabular-nums text-navy-800"
                          }
                        >
                          {schedule.hours}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-3 border-t border-gray-200/80 pt-3 text-xs leading-5 text-gray-400">
                  Seluruh jadwal menggunakan Waktu Indonesia Barat (WIB).
                </p>
              </div>

              {/* Contact actions */}
              <div className="mt-5 grid gap-2.5">
                <a
                  href={`tel:${PHONE_NUMBER}`}
                  aria-label={`Telepon ${WA_DISPLAY}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.99]"
                >
                  <Phone
                    className="h-4 w-4 text-brand"
                    aria-hidden="true"
                  />

                  <span>{WA_DISPLAY}</span>
                </a>

                <a
                  href={locationWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hubungi workshop melalui WhatsApp"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.99]"
                >
                  Chat via WhatsApp
                </a>
              </div>

              {/* Google Maps action */}
              <div className="mt-3">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-700 active:scale-[0.99]"
                >
                  <Navigation className="h-4 w-4" aria-hidden />
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Google Maps */}
          <ScrollReveal
            className="min-w-0 lg:col-span-7"
            delay={0.08}
          >
            <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm sm:min-h-[480px] lg:min-h-0">
              {/* Map heading */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-navy-800 sm:text-base">
                    Temukan Lokasi Kami
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                    Solo, Jawa Tengah
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <MapPin
                    className="h-4 w-4 text-brand"
                    aria-hidden="true"
                  />
                </span>
              </div>

              {/* Responsive map */}
              <div className="relative min-h-[300px] flex-1 sm:min-h-[360px] lg:min-h-[440px]">
                <iframe
                  src={MAPS_EMBED_URL}
                  loading="lazy"
                  title="Peta lokasi workshop Rekayasa Manufaktur di Solo, Jawa Tengah"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Directions link */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lihat petunjuk arah menuju workshop"
                className="flex min-h-12 items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 text-sm font-semibold text-navy-800 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:px-6"
              >
                <span>Lihat petunjuk arah</span>

                <Navigation
                  className="h-4 w-4 shrink-0 text-brand"
                  aria-hidden="true"
                />
              </a>
            </div>
          </ScrollReveal>

          {/* Service cards */}
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <ScrollReveal
                key={service.title}
                delay={0.08 * (index + 1)}
                className="h-full min-w-0 lg:col-span-6"
              >
                <article className="flex h-full items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6 lg:p-7">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                    <Icon
                      className="h-5 w-5 text-brand"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug tracking-tight text-navy-800 sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {service.text}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Closing CTA */}
        <ScrollReveal delay={0.12} className="mt-6 sm:mt-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6 lg:px-8">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-navy-800 sm:text-lg">
                Butuh survei lokasi atau penawaran?
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Hubungi tim kami untuk konsultasi kebutuhan produk,
                layanan pemasangan, atau permintaan penawaran.
              </p>
            </div>

            <a
              href={quotationWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Konsultasi dan minta penawaran melalui WhatsApp"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.99] sm:w-auto"
            >
              Chat via WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}