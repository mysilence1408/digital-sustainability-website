import { LuLeaf, LuRecycle, LuZap } from "react-icons/lu";

const motifs = [LuLeaf, LuZap, LuRecycle];

export default function SustainabilityMotif({ index }: { index: number }) {
  const Icon = motifs[index % motifs.length];
  return <Icon aria-hidden="true" focusable="false" className="size-full" strokeWidth={1.1} />;
}
