import project from "@/content/project";
import ArchitectureDiagram from "@/components/project/architecture-diagram";

export default function ProjectArchitecture() {
  const copy = project.research.architecture;
  return (
    <section aria-labelledby="architecture-title" className="border-y border-[var(--line)] bg-[var(--panel)] px-6 py-14 text-[var(--ink)] sm:px-9 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-body font-medium text-[var(--accent)]">{copy.eyebrow}</p>
        <h2 id="architecture-title" className="mt-4 text-subheading font-semibold leading-snug tracking-tight">{copy.title}</h2>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-[var(--copy)]">{copy.introduction}</p>
        <ArchitectureDiagram />
      </div>
    </section>
  );
}
