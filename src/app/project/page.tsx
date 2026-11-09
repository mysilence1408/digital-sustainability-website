import type { Metadata } from "next";
import project from "@/content/project";
import ProjectGallery from "@/sections/project/ProjectGallery";
import ProjectStory from "@/sections/project/ProjectStory";
import ProjectFilm from "@/sections/project/ProjectFilm";

export const metadata: Metadata = {
  title: project.metadata.title,
  description: project.metadata.description,
};

export default function Page() {
  return <main className="bg-[#fdf8f4] text-[#293c31]">
    <ProjectGallery />
    <ProjectStory />
    <ProjectFilm />
  </main>;
}
