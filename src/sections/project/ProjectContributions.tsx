import project from "@/content/project";

export default function ProjectContributions() {
  const copy = project.research.contributions;
  return (
    <section aria-labelledby="contributions-title" className="border-t border-[var(--ink)]/15 bg-[var(--panel)] px-6 py-14 sm:px-9 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-[.1em] text-[var(--accent)]">{copy.eyebrow}</p>
        <h2 id="contributions-title" className="mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{copy.title}</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">{copy.items.map(item => <div key={item.title}><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--copy)]">{item.description}</p></div>)}</div>
      </div>
    </section>
  );
}
