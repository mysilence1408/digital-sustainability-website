import project from "@/content/project";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/seo/page-structured-data";
import ProjectGallery from "@/sections/project/ProjectGallery";
import ProjectStory from "@/sections/project/ProjectStory";
import ProjectFilm from "@/sections/project/ProjectFilm";

export const metadata = pageMetadata("/project", project.metadata);

export default function Page() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-[#fdf8f4] text-[#222222]"
    >
      <PageStructuredData
        path="/project"
        title={project.metadata.title}
        description={project.metadata.description}
      />
      <ProjectGallery />
      <ProjectStory />
      <ProjectFilm />
    </main>
  );
}
