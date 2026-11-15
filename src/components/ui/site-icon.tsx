import type { IconBaseProps } from "react-icons";
import {
  LuLeaf, LuZap, LuFolder, LuCloud, LuChartColumn, LuTrendingUp,
  LuCheck, LuArrowRight, LuArrowUpRight, LuArrowDown, LuArrowDownUp,
  LuPlus, LuClock, LuPlay, LuPause, LuLightbulb, LuMonitor,
  LuDatabase, LuActivity, LuEllipsis, LuSend, LuLinkedin,
} from "react-icons/lu";

const icons = {
  leaf: LuLeaf, energy: LuZap, folder: LuFolder, cloud: LuCloud,
  chart: LuChartColumn, progress: LuTrendingUp, check: LuCheck,
  "arrow-right": LuArrowRight, "external-link": LuArrowUpRight,
  "arrow-down": LuArrowDown, "vertical-arrows": LuArrowDownUp,
  plus: LuPlus, clock: LuClock, play: LuPlay, pause: LuPause,
  lightbulb: LuLightbulb, monitor: LuMonitor, database: LuDatabase,
  activity: LuActivity, menu: LuEllipsis, send: LuSend, linkedin: LuLinkedin,
};

export default function SiteIcon({ name, ...props }: IconBaseProps & { name: string }) {
  const Icon = Object.hasOwn(icons, name) ? icons[name as keyof typeof icons] : LuLeaf;
  return <Icon aria-hidden="true" focusable="false" data-site-icon={name} {...props} />;
}
