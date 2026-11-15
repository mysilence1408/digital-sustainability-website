import about from "@/content/about";
import TeamGrid from "@/components/team/team-grid";

export default function Team() {
  return (
    <section aria-labelledby="team-title" className="bg-[var(--page)] px-6 pb-20 pt-32 text-[var(--ink)] sm:px-9 lg:px-[5vw] lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-[1280px]">
        <header className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <p className="text-sm text-[var(--accent)]">{about.eyebrowLine1}</p>
          <h1 id="team-title" className="mt-4 font-serif text-4xl font-normal leading-[1.1] tracking-[-.025em] sm:text-5xl lg:text-6xl">{about.title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--copy)] sm:text-lg">{about.introduction}</p>
        </header>
        <TeamGrid />
      </div>
    </section>
  );
}
