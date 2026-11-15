import project from "@/content/project";

export default function ProjectIntroduction() {
  const copy = project.research;
  return (
    <section aria-labelledby="project-title" className="border-b border-[var(--ink)]/15 px-6 pb-12 pt-32 sm:px-9 lg:px-12 lg:pb-16 lg:pt-40">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-[.1em] text-[var(--accent)]">{copy.eyebrow}</p>
        <h1 id="project-title" className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.12] tracking-[-.035em] sm:text-5xl">{project.subtitle}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--copy)] sm:text-xl">{copy.introduction}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--accent)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/20 px-3 py-1.5"><span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--accent)]" />{copy.status}</span>
          <span>{copy.institution}</span>
        </div>
      </div>
    </section>
  );
}
