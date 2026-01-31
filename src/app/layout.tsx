import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "main" },
  });

  const baseUrl = "https://hasandurmus.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings?.metaTitle || "Hasan Durmuş - Blog",
      template: `%s | ${settings?.siteName || "Hasan Durmuş"}`,
    },
    description: settings?.metaDescription || "Hasan Durmuş Blog - E-ticaret, SEO ve Dijital Pazarlama üzerine güncel içerikler ve rehberler.",
    keywords: settings?.metaKeywords?.split(",") || ["blog", "e-ticaret", "seo", "dijital pazarlama"],
    authors: [{ name: "Hasan Durmuş", url: baseUrl }],
    creator: "Hasan Durmuş",
    publisher: "Hasan Durmuş",
    icons: {
      icon: settings?.faviconUrl || "/favicon.ico",
      shortcut: settings?.faviconUrl || "/favicon.ico",
      apple: settings?.faviconUrl || "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: baseUrl,
      title: settings?.metaTitle || "Hasan Durmuş - Blog",
      description: settings?.metaDescription || "E-ticaret ve dijital pazarlama üzerine uzman görüşleri.",
      siteName: settings?.siteName || "Hasan Durmuş Blog",
      images: [{
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: settings?.siteName || "Hasan Durmuş Blog",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.metaTitle || "Hasan Durmuş - Blog",
      description: settings?.metaDescription || "E-ticaret ve dijital pazarlama üzerine uzman görüşleri.",
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster position="top-center" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Hasan Durmuş',
              url: 'https://hasandurmus.com',
              jobTitle: 'E-Ticaret Uzmanı',
              sameAs: [
                'https://www.linkedin.com/in/hasandurmus',
                'https://twitter.com/hasandurmus',
                'https://www.instagram.com/hasandurmus'
              ]
            })
          }}
        />
      </body>
    </html>
  );
}

