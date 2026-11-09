import project from "@/content/project";

export const projectImages = project.images;
export const projectStory = project.paragraphs;
const videoSource = project.video as { src?: string; url?: string };
export const projectVideo = { ...project.video, src: videoSource.url?.trim() || videoSource.src || "" };
