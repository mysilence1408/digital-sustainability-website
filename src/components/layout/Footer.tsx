import site from "@/content/site";
const copy = site.footer;

import Link from "next/link";
import FooterSymbols from "./footer-symbols";

const pages = [
  { color: "hover:text-[#c8fad4] focus-visible:text-[#c8fad4]" },
  { color: "hover:text-[#feebca] focus-visible:text-[#feebca]" },
  { color: "hover:text-[#f8d0f5] focus-visible:text-[#f8d0f5]" },
  { color: "hover:text-[#bed9ee] focus-visible:text-[#bed9ee]" },
];

export default function Footer() {
  return (
    <footer data-nav-theme="dark" aria-labelledby="footer-title" className="relative isolate overflow-hidden bg-[#111914] px-5 pb-6 pt-16 text-[#fdf8f4] sm:px-9 sm:pt-20 lg:px-12 lg:pt-24">
      <div className="mx-auto max-w-[1800px]">
        <div className="grid gap-14 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-32">
          <nav aria-label="Footer navigation">
            <p className="mb-6 font-mono text-[9px] uppercase tracking-[.18em] text-[#a6b4a9]">{copy.navigationLabel}</p>
            <ul className="space-y-1">
              {site.navigation.map(({ href, label }, index) => <li key={href}>
                <Link href={href} className={`group inline-flex items-center gap-5 rounded-sm py-1 text-[clamp(2rem,4.8vw,5rem)] font-medium leading-[1.07] tracking-[-.055em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${pages[index].color}`}>
                  {label}<svg aria-hidden="true" viewBox="0 0 32 24" className="h-[.45em] w-[.65em] -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 12h26M20 4l8 8-8 8" /></svg>
                </Link>
              </li>)}
            </ul>
          </nav>
          <div className="max-w-md md:pt-1">
            <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#a6b4a9]">{copy.brand}</p>
            <h2 id="footer-title" className="mt-7 text-[clamp(1.75rem,2.8vw,3rem)] font-normal leading-[1.12] tracking-[-.045em]">{copy.title}<br /><span className="text-[#c8fad4]">{copy.titleAccent}</span></h2>
            <p className="mt-5 max-w-[22rem] text-sm leading-[1.85] text-[#acb9ae]">{copy.description}</p>
            <a href={copy.universityUrl} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex items-center gap-8 border-b border-[#a6b4a9]/35 pb-3 text-sm transition-colors hover:border-[#c8fad4] hover:text-[#c8fad4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8fad4]">
              {copy.universityLabel}<span className="sr-only"> (opens in a new tab)</span><span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none">&#8599;</span>
            </a>
            <p className="mt-3 text-[10px] text-[#84968a]">{copy.universityCaption}</p>
          </div>
        </div>
        <div data-footer-symbol-home aria-hidden="true" className="relative mt-7 h-40 sm:h-48 lg:mt-0 lg:h-56" />
        <p className="border-t border-[#a6b4a9]/20 pt-6 text-[clamp(2.4rem,8.4vw,9rem)] font-medium leading-[1] tracking-[-.065em] text-[#e4ecdf]">{copy.statement}<span className="text-[#c8fad4]">{copy.statementAccent}</span></p>
        <div className="mt-8 flex flex-wrap justify-between gap-x-8 gap-y-3 font-mono text-[8px] uppercase tracking-[.12em] text-[#91a494] sm:text-[9px]">
          <span>{copy.bottomLeft}</span>
          <span>{copy.bottomMiddle}</span>
          <span>{copy.bottomRight}</span>
        </div>
      </div>
      <FooterSymbols />
    </footer>
  );
}
