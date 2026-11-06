import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col justify-center px-5 pb-20 pt-32 sm:px-9 lg:px-12">
      <p className="text-xs uppercase tracking-[0.2em] text-[#367348]">Digital Sustainability Companion</p>
      <h1 className="mt-6 text-[clamp(3.5rem,10vw,9rem)] leading-none tracking-[-0.065em]">Projects</h1>
      <p className="mt-8 text-base text-[#293c31]/60">More to come. This page is a placeholder for now.</p>
      <Link href="/" className="mt-8 w-fit border-b border-current pb-1 text-sm">Back to home &rarr;</Link>
    </main>
  );
}
