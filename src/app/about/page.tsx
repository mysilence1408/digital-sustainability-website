import about from "@/content/about";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/seo/page-structured-data";
import Team from "@/sections/aboutus/Team";

export const metadata = pageMetadata("/about", about.metadata);

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageStructuredData path="/about" title={about.metadata.title} description={about.metadata.description} />
      <Team />
    </main>
  );
}
