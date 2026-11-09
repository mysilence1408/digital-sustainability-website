import home from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/seo/page-structured-data";
import About from "@/sections/home/About";
import Challenge from "@/sections/home/Challenge";
import Features from "@/sections/home/Features";
import Hero from "@/sections/home/Hero";
import Solution from "@/sections/home/Solution";

export const metadata = pageMetadata("/", home.metadata);

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageStructuredData path="/" title={home.metadata.title} description={home.metadata.description} />
      <Hero />
      <About />
      <Challenge />
      <Solution />
      <Features />
    </main>
  );
}
