import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hasan DURMUŞ - E-ticaret Uzmanı",
    template: "%s | Hasan DURMUŞ"
  },
  description: "E-ticaret danışmanlığı, SEO ve dijital pazarlama konusunda uzman. E-ticaret işletmelerinin büyümesine yardımcı oluyorum.",
  keywords: ["e-ticaret", "seo", "dijital pazarlama", "pazaryerleri", "trendyol", "e-ticaret danışmanlığı"],
  authors: [{ name: "Hasan DURMUŞ" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://hasandurmus.com",
    title: "Hasan DURMUŞ - E-ticaret Uzmanı",
    description: "E-ticaret danışmanlığı, SEO ve dijital pazarlama",
    siteName: "Hasan DURMUŞ Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasan DURMUŞ - E-ticaret Uzmanı",
    description: "E-ticaret danışmanlığı, SEO ve dijital pazarlama",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
