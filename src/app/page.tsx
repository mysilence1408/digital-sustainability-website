import About from "@/sections/home/About";
import Challenge from "@/sections/home/Challenge";
import Features from "@/sections/home/Features";
import Hero from "@/sections/home/Hero";
import Solution from "@/sections/home/Solution";

export const metadata: Metadata = {
  title: home.metadata.title,
  description: home.metadata.description,
};

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Challenge />
      <Solution />
      <Features />
    </>
  );
}
import type { Metadata } from "next";
import home from "@/content/home";
