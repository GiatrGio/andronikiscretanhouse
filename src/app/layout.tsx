import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocalBusinessJsonLd, CookingClassJsonLd } from "@/components/StructuredData";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://andronikiscretanhouse.com"
  ),
  title: {
    default: "Androniki's Cretan House | Authentic Greek Cooking Classes in Rethymno",
    template: "%s | Androniki's Cretan House",
  },
  description:
    "Experience authentic Cretan cooking classes in Rethymno, Crete. Join Androniki & Pantelis for traditional Greek cooking lessons in a beautiful courtyard with wood oven.",
  keywords: [
    "Cretan cooking classes",
    "Greek cooking lessons",
    "Rethymno",
    "traditional Cretan cuisine",
    "cooking classes Crete",
    "authentic Greek recipes",
    "wood oven cooking",
    "Crete cooking experience",
    "Mediterranean cooking class",
  ],
  authors: [{ name: "Androniki's Cretan House" }],
  creator: "Androniki's Cretan House",
  publisher: "Androniki's Cretan House",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Androniki's Cretan House | Authentic Greek Cooking Classes",
    description:
      "Join Androniki for traditional Greek cooking lessons in Rethymno, Crete. Learn authentic recipes in a beautiful courtyard with wood oven.",
    type: "website",
    locale: "en_US",
    siteName: "Androniki's Cretan House",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Androniki's Cretan House | Authentic Greek Cooking Classes",
    description:
      "Join Androniki for traditional Greek cooking lessons in Rethymno, Crete.",
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
  alternates: {
    canonical: "/",
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <LocalBusinessJsonLd />
        <CookingClassJsonLd />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
