import type { Metadata } from "next";
import ProjectGallery from "@/sections/project/ProjectGallery";
import ProjectStory from "@/sections/project/ProjectStory";
import ProjectFilm from "@/sections/project/ProjectFilm";

export const metadata: Metadata = {
  title: "The Project | Digital Sustainability Companion",
  description: "Exploring a lighter digital footprint through research, thoughtful design, and more considered everyday habits.",
};

export default function Page() {
  return <main className="bg-[#fdf8f4] text-[#293c31]">
    <ProjectGallery />
    <ProjectStory />
    <ProjectFilm />
  </main>;
}
