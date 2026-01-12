import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hasandurmus.com'),
  title: {
    default: "Hasan Durmuş - Blog",
    template: "%s | Hasan Durmuş"
  },
  description: "Hasan Durmuş Blog - E-ticaret, SEO ve Dijital Pazarlama üzerine güncel içerikler ve rehberler.",
  keywords: ["blog", "e-ticaret", "seo", "dijital pazarlama", "pazaryerleri", "shopify", "amazon fba"],
  authors: [{ name: "Hasan Durmuş", url: "https://hasandurmus.com" }],
  creator: "Hasan Durmuş",
  publisher: "Hasan Durmuş",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://hasandurmus.com",
    title: "Hasan Durmuş - Blog",
    description: "E-ticaret ve dijital pazarlama üzerine uzman görüşleri ve rehberler.",
    siteName: "Hasan Durmuş Blog",
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Hasan Durmuş Blog',
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasan Durmuş - Blog",
    description: "E-ticaret ve dijital pazarlama üzerine uzman görüşleri.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

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

