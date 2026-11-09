import ScrollOpacityText from "@/components/project/scroll-opacity-text";
import { projectStory } from "./project-content";

export default function ProjectStory() {
  return <section aria-label="About the project" className="px-6 pb-24 pt-12 sm:px-10 md:pb-40 md:pt-20 lg:px-[7vw]">
    <div className="max-w-[1500px]"><ScrollOpacityText paragraphs={projectStory} /></div>
  </section>;
}
