import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "RupaDinding | Cat Tekstur & Jasa Aplikator - PT Mitra Dinding Utama",
    template: "%s | RupaDinding",
  },
  description:
    "Cat tekstur RupaDinding oleh PT Mitra Dinding Utama: cat kamprot, pasir, silica, stucco siap pakai dengan harga per kemasan, plus jasa aplikator cat dinding, plafon, dan fasad.",
  keywords: [
    "cat tekstur",
    "cat kamprot",
    "cat dinding retak",
    "jasa aplikator cat",
    "jasa cat tekstur",
    "RupaDinding",
    "PT Mitra Dinding Utama",
  ],
  openGraph: {
    title: "RupaDinding | Cat Tekstur & Jasa Aplikator",
    description:
      "Cat tekstur siap pakai untuk dinding, plafon, dan fasad, lengkap dengan jasa aplikator profesional dan garansi hasil kerja.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
