import HomeSectionHeading from "@/components/landing/home-section-heading";
import home from "@/content/home";
import CompanionOverview from "@/components/landing/companion-overview";

const copy = home.about;

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="flex flex-col items-center gap-8 bg-[var(--panel)] px-6 py-16 text-[var(--ink)] sm:px-9 lg:px-12 lg:py-24">
      <HomeSectionHeading id={"about-title"} eyebrow={copy.eyebrow} title={copy.title} accent={copy.accent} description={copy.description} />
      <CompanionOverview />
      <p className="mx-auto max-w-2xl text-center text-body leading-relaxed">{copy.caption}</p>
    </section>
  );
}
