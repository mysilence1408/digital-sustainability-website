import SiteIcon from "@/components/ui/site-icon";
import Link from "next/link";
import site from "@/content/site";

const copy = site.footer;
const linkClass = "rounded-sm hover:text-[#ead5bd] hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ead5bd]";

export default function Footer() {
  return (
    <footer data-nav-theme="dark" aria-labelledby="footer-title" className="border-t border-[#8c967e]/40 bg-[var(--footer-background)] px-6 py-12 text-[#f2eadf] sm:px-9 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-20">
          <div className="max-w-xl">
            <div className="flex items-start gap-3">
              <SiteIcon name={site.icons.brand} className="mt-1 size-7 shrink-0 text-[#ead5bd]" />
              <h2 id="footer-title" className="max-w-sm text-subheading font-medium leading-snug">{copy.brand}</h2>
            </div>
            <p className="mt-5 text-body leading-relaxed text-[#ead5bd]">{copy.title} {copy.titleAccent}</p>
            <p className="mt-3 max-w-lg text-body leading-relaxed text-[#ded2c4]">{copy.description}</p>
            <a href={copy.universityUrl} target="_blank" rel="noopener noreferrer" className={`mt-5 inline-flex min-h-11 items-center gap-2 text-body ${linkClass}`}>
              {copy.universityLabel}<SiteIcon name={site.icons.externalLink} className="size-4" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-1 text-body leading-relaxed text-[#ded2c4]">{copy.universityCaption}</p>
          </div>
          <nav aria-label="Footer navigation" className="md:justify-self-end md:min-w-48">
            <p className="mb-3 text-body text-[#ead5bd]">{copy.navigationLabel}</p>
            <ul>
              {site.navigation.map(({ href, label }) => (
                <li key={href}><Link href={href} className={`inline-flex min-h-11 items-center py-1 text-body font-medium ${linkClass}`}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-[#ded2c4]/25 pt-6 text-body leading-relaxed text-[#ded2c4]">
          <span>{copy.bottomLeft}</span>
          <span>{copy.bottomMiddle}</span>
          <span>{copy.bottomRight}</span>
        </div>
      </div>
    </footer>
  );
}
