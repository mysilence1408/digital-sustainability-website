import SiteIcon from "@/components/ui/site-icon";

type FeatureCardProps = {
  index: number;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  icon: string;
};

export default function FeatureCard({
  index,
  title,
  description,
  color,
  borderColor,
  icon,
}: FeatureCardProps) {
  return (
    <article data-feature-card className="min-w-0 text-center">
      <div
        style={{ backgroundColor: color, borderColor: borderColor }}
        className="relative flex aspect-square items-center border justify-center rounded-[1.25rem] text-[var(--accent)] sm:rounded-[1.75rem]"
      >
        <span className="absolute left-5 top-5 text-sm font-medium tabular-nums">
          0{index + 1}
        </span>
        <SiteIcon name={icon} className="size-[38%]" />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-64 text-base leading-relaxed text-[var(--copy)]">
        {description}
      </p>
    </article>
  );
}
