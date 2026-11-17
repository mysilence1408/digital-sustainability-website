type HomeSectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
};

export default function HomeSectionHeading({ id, eyebrow, title, accent, description }: HomeSectionHeadingProps) {
  return (
    <header className="mx-auto w-full max-w-6xl border-t border-[var(--line)] pt-6 text-left">
      <p className="text-body font-medium uppercase tracking-[.1em] text-[var(--accent)]">{eyebrow}</p>
      <h2 id={id} className="mt-3 max-w-3xl text-heading font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--ink)]">
        {title}{" "}{accent}
      </h2>
      <p className="mt-5 max-w-[65ch] text-body leading-[1.75] text-[var(--copy)]">{description}</p>
    </header>
  );
}
