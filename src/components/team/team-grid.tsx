import SiteIcon from "@/components/ui/site-icon";
import site from "@/content/site";
import Image from "next/image";
import about from "@/content/about";
import SustainabilityMotif from "./sustainability-motif";

export default function TeamGrid() {
  return (
    <div className="grid items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
      {about.members.map((person, index) => (
        <article key={person.name} className="min-w-0">
          <details name="team-profiles" data-team-profile className="group/profile">
            <summary className="group/trigger block cursor-pointer list-none rounded-sm text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
              <span className="group/portrait relative block aspect-square overflow-hidden rounded-2xl bg-[var(--panel)]">
                <Image src={person.image.src} alt={person.image.alt} fill priority={index === 0} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover object-center grayscale transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portrait:scale-[1.06] group-focus-visible/trigger:scale-[1.06] motion-reduce:transition-none motion-reduce:transform-none" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-[var(--accent)]/85 opacity-0 transition-opacity duration-500 group-hover/portrait:opacity-100 group-focus-visible/trigger:opacity-100 group-open/profile:opacity-100 motion-reduce:transition-none">
                  <span className="absolute -right-3 -top-3 block size-28 translate-x-[130%] rotate-[-12deg] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portrait:translate-x-0 group-focus-visible/trigger:translate-x-0 group-open/profile:translate-x-0 motion-reduce:transition-none"><SustainabilityMotif index={index} /></span>
                  <span className="absolute -bottom-4 -left-4 block size-32 -translate-x-[130%] rotate-[12deg] transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/portrait:translate-x-0 group-focus-visible/trigger:translate-x-0 group-open/profile:translate-x-0 motion-reduce:transition-none"><SustainabilityMotif index={index + 1} /></span>
                </span>
              </span>
              <span className="mt-3 flex min-h-14 items-start justify-between gap-3">
                <span className="block min-w-0">
                  <span role="heading" aria-level={2} className="block font-serif text-[1.75rem] font-normal leading-[1.15] tracking-[-.025em]">{person.name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--accent)]">{person.role}</span>
                </span>
                <span className="flex size-11 shrink-0 items-center justify-center" aria-hidden="true"><SiteIcon name={site.icons.profileToggle} className="size-7 transition-transform duration-300 group-open/profile:rotate-45 motion-reduce:transition-none" /></span>
              </span>
              <span className="sr-only">{about.detailsLabel}</span>
            </summary>
            <div data-team-details className="pt-5">
              <div className="flex flex-wrap gap-2 text-sm text-[var(--ink)]">
                <span className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1">{person.role}</span>
                <span className="rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-1">{about.institution}</span>
              </div>
              {person.linkedin && <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--accent)] underline underline-offset-4 hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"><SiteIcon name={site.icons.linkedin} className="size-4" />{about.linkedinLabel}<span className="sr-only"> ({person.name}; opens in a new tab)</span></a>}
              <div className="mt-3 space-y-4 text-base leading-[1.7] text-[var(--copy)]">{person.description.split(/\n\s*\n/).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
