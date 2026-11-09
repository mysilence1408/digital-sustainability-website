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
  title: "Digital Sustainability Companion",
  description:
    "A university research project exploring a lighter digital life through mindful energy use, storage habits, and everyday digital behaviour.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdf8f4] text-[#293c31]">
        <Suspense fallback={null}>
          <SmoothScroll />
        </Suspense>
        <Suspense fallback={null}><Navbar /></Suspense>
        {children}
        <Footer />
        <PageTransition />
      </body>
    </html>
  );
}
