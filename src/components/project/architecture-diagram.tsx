"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import SiteIcon from "@/components/ui/site-icon";
import project from "@/content/project";
import { createArchitectureConnections, type ArchitectureConnection, type ArchitectureNodeId, type NodeBox } from "./architecture-layout";

const copy = project.research.architecture;
type NodeId = ArchitectureNodeId;
const order: NodeId[] = ["monitoring", "analysis", "recommendations", "dashboard", "storage"];
const placement: Record<NodeId, string> = {
  monitoring: "md:col-start-1 md:row-start-1",
  analysis: "md:col-start-2 md:row-start-1",
  recommendations: "md:col-start-3 md:row-start-1",
  storage: "md:col-start-2 md:row-start-2",
  dashboard: "md:col-start-1 md:row-start-2",
  cloud: "",
  cloudStorage: "",
  ai: "",
  researchDatabase: "",
};

export default function ArchitectureDiagram() {
  const [selected, setSelected] = useState<NodeId>("monitoring");
  const [drawing, setDrawing] = useState<{ width: number; height: number; wide: boolean; paths: ArchitectureConnection[] }>({ width: 1, height: 1, wide: false, paths: [] });
  const graph = useRef<HTMLDivElement>(null);
  const marker = `architecture-${useId().replace(/:/g, "")}`;
  const active = copy.nodes[selected];
  const isConnected = (connection: ArchitectureConnection) => connection.from === selected || connection.to === selected;
  const orderedPaths = [...drawing.paths.filter(connection => !isConnected(connection)), ...drawing.paths.filter(isConnected)];

  useLayoutEffect(() => () => setSelected("monitoring"), []);

  useEffect(() => {
    const root = graph.current!;
    let frame = 0;
    let disposed = false;
    const measure = () => {
      const bounds = root.getBoundingClientRect();
      const boxes = {} as Record<NodeId, NodeBox>;
      root.querySelectorAll<HTMLElement>("[data-architecture-node]").forEach(element => {
        const r = element.getBoundingClientRect();
        boxes[element.dataset.architectureNode as NodeId] = { x: r.left - bounds.left, y: r.top - bounds.top, width: r.width, height: r.height };
      });
      const wide = matchMedia("(min-width: 768px)").matches;
      const paths = createArchitectureConnections(boxes, bounds.width, wide, selected);
      setDrawing({ width: bounds.width, height: bounds.height, wide, paths });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (!disposed) measure(); }); };
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    root.querySelectorAll("[data-architecture-node]").forEach(element => resize.observe(element));
    schedule();
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); };
  }, [selected]);

  const selectNode = (id: NodeId) => {
    setSelected(id);
  };

  const node = (id: NodeId, number: string) => (
    <button data-architecture-node={id} type="button" aria-pressed={selected === id} aria-controls="architecture-details" aria-label={`${copy.selectLabel} ${copy.nodes[id].title}`} onClick={() => selectNode(id)}
      className={`relative z-20 h-full min-h-40 w-full cursor-pointer rounded-xl border p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${selected === id ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]" : "border-[var(--line)] bg-[var(--page)] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--hover)]"}`}>
      <span className="flex flex-wrap items-center justify-between gap-3"><SiteIcon name={copy.nodes[id].icon} className="size-6" /><span className="text-body tabular-nums">{number}</span></span>
      <span className="mt-4 block text-body font-semibold leading-snug">{copy.nodes[id].title}</span>
      <span className={`mt-2 block text-body leading-relaxed ${selected === id ? "text-[var(--on-accent)]" : "text-[var(--copy)]"}`}>{copy.nodes[id].summary}</span>
    </button>
  );

  return (
    <div className="mt-8 text-[var(--ink)]">
      <div ref={graph} data-architecture-graph className="relative">
        <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${drawing.width} ${drawing.height}`} className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible" fill="none">
          <defs>
            {[false, true].map(highlighted => <marker key={String(highlighted)} id={`${marker}-${highlighted ? "selected" : "muted"}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 8 4-8 4" fill="none" stroke={highlighted ? "var(--accent)" : "var(--line)"} strokeWidth="1.5" /></marker>)}
          </defs>
          {(drawing.wide ? orderedPaths : drawing.paths).map((connection) => {
            const highlighted = isConnected(connection);
            const arrow = `url(#${marker}-${highlighted ? "selected" : "muted"})`;
            return <g key={`${connection.from}-${connection.to}`} data-connection={`${connection.from}-${connection.to}`} className={highlighted ? undefined : "hidden md:block"} opacity={drawing.wide && !highlighted ? 0.4 : 1}>
              <path d={connection.d} stroke={highlighted ? "var(--accent)" : "var(--line)"} strokeWidth={drawing.wide ? (highlighted ? 3 : 1.1) : (highlighted ? 2.2 : 1.3)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={connection.optional ? "1 5" : undefined} markerEnd={arrow} markerStart={connection.both ? arrow : undefined} />
            </g>;
          })}
        </svg>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-6 pb-8 pt-6 sm:px-8 md:px-10 md:pb-16">
          <p className="relative z-20 text-body font-semibold">{copy.localLabel}</p>
          <p className="relative z-20 mt-2 max-w-2xl text-body leading-relaxed text-[var(--copy)]">{copy.localDescription}</p>
          <div className="mt-7 grid gap-y-10 md:grid-cols-3 md:gap-x-12 md:gap-y-20">
            {order.map((id, index) => <div key={id} className={placement[id]}>{node(id, `0${index + 1}`)}</div>)}
          </div>
        </div>
        <div className="relative mt-16 grid grid-cols-1 px-6 sm:px-8 md:grid-cols-3 md:gap-x-12 md:px-10">
          <div className="md:col-start-2">{node("cloud", "06")}</div>
        </div>
        <div className="relative mt-16 rounded-2xl border border-dashed border-[var(--line)] px-6 pb-8 pt-6 sm:px-8 md:px-10">
          <p className="relative z-20 text-body font-semibold">{copy.externalLabel}</p>
          <div className="mt-7 grid gap-y-10 md:grid-cols-3 md:gap-x-12">
            <div>{node("cloudStorage", "07")}</div>
            <div>{node("ai", "08")}</div>
            <div>{node("researchDatabase", "09")}</div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-3 text-body leading-relaxed text-[var(--copy)] sm:grid-cols-2">
        <p className="flex items-start gap-3"><span aria-hidden="true" className="mt-2 block w-8 shrink-0 border-t border-[var(--accent)]" />{copy.storageConnection}</p>
        <p className="flex items-start gap-3"><span aria-hidden="true" className="mt-2 block w-8 shrink-0 border-t-2 border-dotted border-[var(--accent)]" />{copy.cloudConnection}</p>
      </div>
      <p className="mt-4 max-w-3xl text-body leading-relaxed text-[var(--copy)]">{copy.ipcConnection}</p>
      <p className="mt-3 max-w-3xl text-body leading-relaxed text-[var(--copy)]">{copy.externalDescription}</p>
      <h3 className="mt-4 text-body font-semibold">{copy.cloudLabel}</h3>
      <p className="mt-2 max-w-3xl text-body leading-relaxed text-[var(--copy)]">{copy.cloudDescription}</p>
      <div id="architecture-details" aria-live="polite" aria-atomic="true" className="mt-7 min-h-72 rounded-r-xl border-l-2 border-[var(--accent)] bg-[var(--page)] p-6 sm:p-8">
        <p className="text-body font-medium uppercase tracking-[.1em] text-[var(--accent)]">{copy.detailsLabel}</p>
        <h3 className="mt-2 text-subheading font-semibold">{active.title}</h3>
        <p className="mt-3 max-w-[65ch] text-body leading-relaxed text-[var(--copy)]">{active.description}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-body leading-relaxed text-[var(--copy)]">{active.items.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
    </div>
  );
}
