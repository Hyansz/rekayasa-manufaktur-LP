import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/shared/lenis-provider";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import ScrollToTop from "@/components/shared/ScrollToTop";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { SITE_URL, SITE_NAME, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, LOCALE } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const title = "Furnitur Stainless Steel Custom Solo | Rekayasa Manufaktur";
const description =
  "Furnitur stainless steel & mild steel custom di Solo: meja, kabinet, tempat tidur susun & trolley. CNC laser cutting presisi ±0.1mm. Konsultasi gratis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: LOCALE,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Proses fabrikasi furnitur stainless steel di bengkel Rekayasa Manufaktur Solo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <LocalBusinessJsonLd />
        <WhatsAppFloat />
        <ScrollToTop />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
