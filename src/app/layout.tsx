import site from "@/content/site";
import { siteUrl } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import SmoothScroll from "@/components/providers/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#17251A",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--page)] text-[var(--ink)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[11000] focus:rounded-full focus:bg-[var(--ink)] focus:px-6 focus:py-3 focus:text-[var(--page)]"
        >
          Skip to content
        </a>
        <noscript>
          <style>
            {
              "[data-opening-copy]{opacity:1!important;transform:none!important}[data-gallery] [data-image-clip]{clip-path:none!important}"
            }
          </style>
        </noscript>
        <Suspense fallback={null}>
          <SmoothScroll />
        </Suspense>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
