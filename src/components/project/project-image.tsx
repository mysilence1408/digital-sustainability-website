import Image from "next/image";

export default function ProjectImage({ src, alt, priority = false, sizes = "100vw", reveal = false }: { src: string; alt: string; priority?: boolean; sizes?: string; reveal?: boolean }) {
  return <div data-image-clip className={`absolute inset-0 overflow-hidden ${reveal ? "motion-safe:[clip-path:inset(100%_0_0_0)]" : ""}`}>
    <div data-image-drift className="absolute -inset-y-[8%] inset-x-0">
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
    </div>
  </div>;
}
