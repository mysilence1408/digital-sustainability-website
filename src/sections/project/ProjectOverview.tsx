import project from "@/content/project";

export default function ProjectOverview() {
  const copy = project.research;
  return (
    <section aria-labelledby="project-overview-title" className="px-6 py-14 sm:px-9 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
        <div>
          <h2 id="project-overview-title" className="max-w-xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{copy.overviewTitle}</h2>
          <div className="mt-6 max-w-[68ch] space-y-5 text-base leading-[1.8] text-[var(--copy)] sm:text-lg">
            {project.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <aside aria-labelledby="project-method-title" className="self-start border-l-2 border-[var(--line)] pl-6">
          <p className="text-sm font-medium text-[var(--accent)]">{copy.methodLabel}</p>
          <h3 id="project-method-title" className="mt-3 text-xl font-semibold">{copy.methodTitle}</h3>
          <p className="mt-3 text-base leading-relaxed text-[var(--copy)]">{copy.methodDescription}</p>
        </aside>
      </div>
    </section>
  );
}
