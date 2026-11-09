import Team from "@/sections/aboutus/Team";

export const metadata: Metadata = {
  title: about.metadata.title,
  description: about.metadata.description,
};

export default function Page() {
  return (
    <>
      <Team />
    </>
  );
}
import type { Metadata } from "next";
import about from "@/content/about";
