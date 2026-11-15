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
      <p className="text-sm font-semibold text-[var(--accent)]">{eyebrow}</p>
      <h2 id={id} className="mt-3 max-w-3xl text-[1.75rem] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--ink)] sm:text-[2rem] lg:text-[2.25rem]">
        {title}{" "}{accent}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-[1.75] text-[var(--copy)] sm:text-lg">{description}</p>
    </header>
  );
}
