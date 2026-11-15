import HomeSectionHeading from "@/components/landing/home-section-heading";
import SiteIcon from "@/components/ui/site-icon";
import home from "@/content/home";

const palettes = {
  challenge: { background: "var(--page)", panel: "var(--panel)", ink: "var(--ink)" },
  solution: { background: "var(--panel)", panel: "var(--page)", ink: "var(--ink)" },
};

export default function CompanionExplainer({ kind }: { kind: "challenge" | "solution" }) {
  const copy = home[kind];
  const palette = palettes[kind];
  return (
    <section id={kind} aria-labelledby={`${kind}-title`} style={{ backgroundColor: palette.background, color: palette.ink }} className="px-6 py-16 sm:px-9 lg:px-12 lg:py-24">
      <HomeSectionHeading id={`${kind}-title`} eyebrow={copy.eyebrow} title={copy.title} accent={copy.accent} description={copy.description} />
      <ol className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
        {copy.card.steps.map((step, index) => (
          <li key={step.label} style={{ backgroundColor: palette.panel }} className="rounded-2xl border border-current/15 p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <SiteIcon name={step.icon} className="size-9 text-[var(--accent)]" />
              <span className="text-sm font-medium tabular-nums">0{index + 1}</span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{step.label}</h3>
            <p className="mt-3 text-base leading-relaxed text-[var(--copy)]">{step.line1} {step.line2}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-8 max-w-3xl text-center text-base leading-relaxed text-[var(--copy)] sm:text-lg">{copy.caption}</p>
    </section>
  );
}
