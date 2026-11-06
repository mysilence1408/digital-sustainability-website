type FeatureCardProps = {
  index: number;
  title: string;
  description: string;
  color: string;
  borderColor: string;
};

const paths = [
  "M20 75V50m20 25V35m20 40V45m20 30V20",
  "M50 80V35m0 20C25 55 15 40 18 20c22 0 34 12 32 35Zm0 12c0-22 12-35 32-35 2 22-10 35-32 35Z",
  "m23 50 18 18 36-36",
  "m50 15 10 23 25 3-19 17 5 25-21-13-21 13 5-25-19-17 25-3Z",
];

export default function FeatureCard({
  index,
  title,
  description,
  color,
  borderColor,
}: FeatureCardProps) {
  return (
    <article data-feature-card className="min-w-0 text-center">
      <div
        style={{ backgroundColor: color, borderColor: borderColor }}
        className="relative flex aspect-square items-center border-4 justify-center rounded-[1.25rem] text-[#222222] sm:rounded-[1.75rem]"
      >
        <span className="absolute left-5 top-5 text-xs font-medium tabular-nums opacity-60">
          0{index + 1}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="size-[38%]"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={paths[index]} />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-56 text-sm leading-relaxed text-[#222222]/65">
        {description}
      </p>
    </article>
  );
}
