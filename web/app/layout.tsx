import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/shared/lenis-provider";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import ScrollToTop from "@/components/shared/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rekayasamanufaktur.id"),
  title: {
    default: "Rekayasa Manufaktur — Precision in Every Piece",
    template: "%s | Rekayasa Manufaktur",
  },
  description:
    "Furnitur stainless steel & mild steel premium, dirancang dengan presisi teknik untuk kehidupan modern. Katalog kursi, meja, rak & aksesoris metal engineering-grade.",
  keywords: [
    "furnitur stainless steel",
    "furnitur mild steel",
    "kursi stainless steel",
    "standing desk",
    "rak stainless steel",
    "manufaktur logam",
    "furnitur premium",
  ],
  openGraph: {
    title: "Rekayasa Manufaktur — Precision in Every Piece",
    description:
      "Furnitur stainless steel & mild steel premium, dirancang dengan presisi teknik untuk kehidupan modern.",
    type: "website",
    url: "https://rekayasamanufaktur.id",
    siteName: "Rekayasa Manufaktur",
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
        <WhatsAppFloat />
        <ScrollToTop />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
