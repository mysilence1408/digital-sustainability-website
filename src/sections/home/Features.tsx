import HomeSectionHeading from "@/components/landing/home-section-heading";
import home from "@/content/home";
import FeatureCard from "@/components/landing/feature-card";

const copy = home.features;
const palettes = [
  { color: "var(--panel)", borderColor: "var(--line)" },
  { color: "var(--panel)", borderColor: "var(--line)" },
  { color: "var(--panel)", borderColor: "var(--line)" },
  { color: "var(--panel)", borderColor: "var(--line)" },
];

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-[var(--page)] px-6 py-16 text-[var(--ink)] sm:px-9 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <HomeSectionHeading id={"features-title"} eyebrow={copy.eyebrow} title={copy.title} accent={copy.accent} description={copy.description} />
        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {copy.items.map((item, index) => <FeatureCard key={item.title} index={index} {...palettes[index]} title={item.title} description={item.description} icon={item.icon} />)}
        </div>
      </div>
    </section>
  );
}
