import type { MetadataRoute } from "next";
import { absoluteUrl, publicRoutes, indexable } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {

  return indexable ? publicRoutes.map(path => ({ url: absoluteUrl(path) })) : [];
}
