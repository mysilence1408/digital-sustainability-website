import site from "@/content/site";
import { siteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/providers/smooth-scroll";
import PageTransition from "@/components/providers/page-transition";
import "lenis/dist/lenis.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdf8f4] text-[#293c31]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[11000] focus:rounded-full focus:bg-[#222222] focus:px-6 focus:py-3 focus:text-white">Skip to content</a>
        <noscript><style>{"[data-opening-copy]{opacity:1!important;transform:none!important}[data-gallery] [data-image-clip]{clip-path:none!important}"}</style></noscript>
        <Suspense fallback={null}>
          <SmoothScroll />
        </Suspense>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {children}
        <Footer />
        <PageTransition />
      </body>
    </html>
  );
}
