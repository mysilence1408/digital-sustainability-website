import "server-only";
import type { Metadata } from "next";
import site from "@/content/site";
import shareImage from "@/app/opengraph-image.png";

export const siteUrl = new URL(site.url);
export const publicRoutes = ["/", "/about", "/project", "/contact"] as const;
export type PublicRoute = (typeof publicRoutes)[number];

export const indexable = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function pageMetadata(path: PublicRoute, content: { title: string; description: string }): Metadata {
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      siteName: site.title,
      url: absoluteUrl(path),
      title: content.title,
      description: content.description,
      // Repeat images when replacing the page's Open Graph object: nested
      // metadata does not deep-merge the parent's sharing image.
      images: [{ url: absoluteUrl(shareImage.src), width: shareImage.width, height: shareImage.height, alt: site.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [{ url: absoluteUrl(shareImage.src), alt: site.title }],
    },
    robots: {
      index: indexable,
      follow: true,
      ...(indexable ? { googleBot: { index: true, follow: true, "max-image-preview": "large" as const } } : {}),
    },
  };
}
