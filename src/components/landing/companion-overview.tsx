import SiteIcon from "@/components/ui/site-icon";
import site from "@/content/site";
import home from "@/content/home";

export default function CompanionOverview() {
  return (
    <figure className="m-0 w-full max-w-[800px] rounded-3xl border border-[var(--ink)]/15 bg-[var(--panel)] p-5 text-[var(--ink)] sm:p-10">
      <figcaption className="mb-6 text-center text-body font-medium">{home.about.card.tag}</figcaption>
      <div className="overflow-hidden rounded-2xl border border-[var(--ink)]/20 bg-[var(--page)]">
        <div className="flex items-center gap-3 border-b border-[var(--ink)]/15 px-5 py-4 sm:px-7">
          <SiteIcon name={site.icons.brand} className="size-7 shrink-0" />
          <p className="text-body font-medium leading-relaxed">{home.art.dashboardHeading}</p>
        </div>
        <div className="grid gap-7 p-6 sm:grid-cols-[1fr_1.25fr] sm:items-center sm:p-8">
          <div className="text-center">
            <div aria-hidden="true" className="mx-auto flex aspect-square size-32 h-auto max-w-full items-center justify-center rounded-full border-[10px] border-[var(--line)] border-t-[var(--accent)] sm:size-40 sm:h-auto">
              <span className="text-heading font-semibold">{home.art.scoreLabel}</span>
            </div>
            <p className="mt-4 text-body font-medium">{home.art.scoreLabel} — {home.art.scoreCaption}</p>
          </div>
          <ul className="space-y-5">
            {home.art.dimensions.map((label, index) => (
              <li key={label}>
                <p className="mb-2 text-body font-medium">{label}</p>
                <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-[var(--accent)]/10">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${[70, 55][index]}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-5 text-center text-body leading-relaxed">{home.cardNote}</p>
    </figure>
  );
}
