import site from "@/content/site";
import { absoluteUrl, type PublicRoute } from "@/lib/seo";

export default function PageStructuredData({ path, title, description }: { path: PublicRoute; title: string; description: string }) {
  const website = {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: site.title,
    description: site.description,
    inLanguage: "en",
  };
  const page = {
    "@type": path === "/about" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage",
    "@id": absoluteUrl(path + "#webpage"),
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
  const data = { "@context": "https://schema.org", "@graph": path === "/" ? [website, page] : [page] };
  // CMS strings stay JSON data, even if they contain HTML-like characters.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
