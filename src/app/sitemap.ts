import type { MetadataRoute } from "next";
import { absoluteUrl, publicRoutes, indexable } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use the production origin, never a temporary preview hostname.
  // Omit lastModified rather than inventing a new content date on every build.
  return indexable ? publicRoutes.map(path => ({ url: absoluteUrl(path) })) : [];
}
