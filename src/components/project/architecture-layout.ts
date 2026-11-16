export type ArchitectureNodeId = "monitoring" | "analysis" | "recommendations" | "dashboard" | "storage" | "cloud" | "cloudStorage" | "ai" | "researchDatabase";
export type NodeBox = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number };
type Side = "top" | "bottom" | "left" | "right";
export type ArchitectureConnection = { from: ArchitectureNodeId; to: ArchitectureNodeId; d: string; optional?: boolean; both?: boolean };

const relationships: Omit<ArchitectureConnection, "d">[] = [
  { from: "monitoring", to: "analysis" },
  { from: "analysis", to: "recommendations" },
  { from: "monitoring", to: "storage" },
  { from: "analysis", to: "storage", both: true },
  { from: "recommendations", to: "storage", both: true },
  { from: "dashboard", to: "monitoring", both: true },
  { from: "dashboard", to: "analysis", both: true },
  { from: "recommendations", to: "dashboard", both: true },

  { from: "dashboard", to: "storage", both: true },
  { from: "analysis", to: "cloud", optional: true },
  { from: "recommendations", to: "cloud", optional: true, both: true },
  { from: "monitoring", to: "cloudStorage", optional: true, both: true },
  { from: "cloud", to: "ai", optional: true, both: true },
  { from: "cloud", to: "researchDatabase", both: true },
];

export function createArchitectureConnections(boxes: Record<ArchitectureNodeId, NodeBox>, width: number, wide: boolean, selected?: ArchitectureNodeId): ArchitectureConnection[] {
  const point = (id: ArchitectureNodeId, side: Side, fraction = .5): Point => {
    const box = boxes[id];
    return side === "top" || side === "bottom"
      ? { x: box.x + box.width * fraction, y: box.y + (side === "bottom" ? box.height : 0) }
      : { x: box.x + (side === "right" ? box.width : 0), y: box.y + box.height * fraction };
  };
  const horizontalRail = (a: Point, b: Point, y: number): Point[] => [a, { x: a.x, y }, { x: b.x, y }, b];
  const verticalRail = (a: Point, b: Point, x: number): Point[] => [a, { x, y: a.y }, { x, y: b.y }, b];
  const direct = (a: ArchitectureNodeId, b: ArchitectureNodeId, sideA: Side, sideB: Side) => [point(a, sideA), point(b, sideB)];

  const leftRoutes = ["monitoring-storage", "dashboard-monitoring", "dashboard-analysis", "monitoring-cloudStorage", "cloud-ai"];
  const rightRoutes = ["analysis-storage", "recommendations-storage", "analysis-cloud", "recommendations-cloud", "cloud-researchDatabase"];
  const selectedRoutes = new Set(relationships.filter(connection => !selected || connection.from === selected || connection.to === selected).map(connection => `${connection.from}-${connection.to}`));
  return relationships.map((connection) => {
    const { from, to } = connection;
    const key = `${from}-${to}`;
    let points: Point[];
    if (!wide) {
      if (key === "cloud-researchDatabase") {
        const a = point(from, "bottom", .75), b = point(to, "right");
        const y = a.y + 20, x = width - 19;
        points = [a, { x: a.x, y }, { x, y }, { x, y: b.y }, b];
      } else if (["monitoring-analysis", "analysis-recommendations", "recommendations-dashboard", "dashboard-storage"].includes(key)) {
        points = direct(from, to, "bottom", "top");
      } else {
        const left = leftRoutes.includes(key);
        const side = left ? "left" : "right";
        const routes = (left ? leftRoutes : rightRoutes).filter(route => selectedRoutes.has(route));
        const lane = selectedRoutes.has(key) ? 5 + routes.indexOf(key) * 8 : 3;

        const fraction = (id: ArchitectureNodeId) => {
          const attached = routes.filter(route => route.split("-").includes(id));
          return attached.includes(key) ? (attached.indexOf(key) + 1) / (attached.length + 1) : .5;
        };
        points = verticalRail(point(from, side, fraction(from)), point(to, side, fraction(to)), left ? lane : width - lane);
      }
    } else {
      const gapY = (boxes.analysis.y + boxes.analysis.height + boxes.storage.y) / 2;
      switch (key) {
        case "monitoring-analysis":
        case "analysis-recommendations": points = direct(from, to, "right", "left"); break;
        case "analysis-storage": points = direct(from, to, "bottom", "top"); break;
        case "monitoring-storage": points = horizontalRail(point(from, "bottom", .75), point(to, "top", .2), gapY - 12); break;
        case "recommendations-storage": points = verticalRail(point(from, "left", .75), point(to, "right", .35), boxes.recommendations.x - 16); break;
        case "dashboard-monitoring": points = [point(from, "top", .2), point(to, "bottom", .2)]; break;
        case "dashboard-analysis": {
          const a = point(from, "left", .25), b = point(to, "top", .35);
          const top = boxes.analysis.y - 24;
          points = [a, { x: 24, y: a.y }, { x: 24, y: top }, { x: b.x, y: top }, b];
          break;
        }
        case "recommendations-dashboard": {
          const a = point(from, "right", .3), b = point(to, "bottom", .7);
          const bottom = Math.max(boxes.dashboard.y + boxes.dashboard.height, boxes.storage.y + boxes.storage.height) + 24;
          points = [a, { x: width - 24, y: a.y }, { x: width - 24, y: bottom }, { x: b.x, y: bottom }, b];
          break;
        }
        case "dashboard-storage": points = direct(from, to, "right", "left"); break;
        case "analysis-cloud": {
          const a = point(from, "right", .75), b = point(to, "top", .75);
          const rail = boxes.storage.x + boxes.storage.width + 16;
          points = [a, { x: rail, y: a.y }, { x: rail, y: boxes.cloud.y - 24 }, { x: b.x, y: boxes.cloud.y - 24 }, b];
          break;
        }
        case "recommendations-cloud": points = verticalRail(point(from, "right", .7), point(to, "right", .65), width - 8); break;
        case "monitoring-cloudStorage": points = verticalRail(point(from, "left", .25), point(to, "left"), 8); break;
        case "cloud-ai": points = direct(from, to, "bottom", "top"); break;
        case "cloud-researchDatabase": points = horizontalRail(point(from, "bottom", .8), point(to, "top"), boxes.cloud.y + boxes.cloud.height + 32); break;
        default: points = direct(from, to, "bottom", "top");
      }
    }
    return { ...connection, d: points.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ") };
  });
}
