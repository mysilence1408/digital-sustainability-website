import project from "@/content/project";

export default function ProjectEvaluation() {
  const copy = project.research.evaluation;
  return (
    <section aria-labelledby="evaluation-title" className="px-6 py-14 sm:px-9 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-[.1em] text-[var(--accent)]">{copy.eyebrow}</p>
        <h2 id="evaluation-title" className="mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{copy.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--copy)] sm:text-lg">{copy.introduction}</p>
        <dl className="mt-8 grid gap-x-12 md:grid-cols-2">
          {copy.items.map(item => <div key={item.title} className="border-t border-[var(--ink)]/20 py-6"><dt className="text-lg font-semibold">{item.title}</dt><dd className="mt-3 max-w-xl text-base leading-relaxed text-[var(--copy)]">{item.description}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}
