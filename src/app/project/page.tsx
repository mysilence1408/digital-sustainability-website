import project from "@/content/project";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/seo/page-structured-data";
import ProjectIntroduction from "@/sections/project/ProjectIntroduction";
import ProjectOverview from "@/sections/project/ProjectOverview";
import ProjectArchitecture from "@/sections/project/ProjectArchitecture";
import ProjectEvaluation from "@/sections/project/ProjectEvaluation";
import ProjectContributions from "@/sections/project/ProjectContributions";

export const metadata = pageMetadata("/project", project.metadata);

export default function Page() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      data-page-entrance
      className="bg-[var(--page)] text-[var(--ink)]"
    >
      <PageStructuredData
        path="/project"
        title={project.metadata.title}
        description={project.metadata.description}
      />
      <ProjectIntroduction />
      <ProjectOverview />
      <ProjectArchitecture />
      <ProjectEvaluation />
      <ProjectContributions />
    </main>
  );
}
