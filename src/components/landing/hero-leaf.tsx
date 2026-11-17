import Image from "next/image";

export default function HeroLeaf() {
  return (
    <div data-hero-leaf className="relative h-full w-full">
      <Image
        src="/images/home/leaf-digital.webp"
        alt="A realistic green leaf with fine metallic circuit veins and subtle geometric details"
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-contain p-6 sm:p-10 lg:p-12"
      />
    </div>
  );
}
