import { useId } from "react";
import home from "@/content/home";

const copy = home.art;

export type CompanionCardKind = "about" | "challenge" | "solution";

function Symbol({ kind }: { kind: "leaf" | "power" | "folder" | "cloud" }) {
  return <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    {kind === "leaf" && <><path d="M-18 17C-30-12-8-29 25-26c3 32-13 53-40 46Z" /><path d="m-23 28 36-39M-6 8-8-8M3 0l16-1" /></>}
    {kind === "power" && <path d="m4-31-24 35H0l-4 27L22-7H1Z" />}
    {kind === "folder" && <><path d="M-29-17h23l8 8h27v34h-58Z" /><path d="M-29-8h58M-15 7h23" /></>}
    {kind === "cloud" && <path d="M-23 20c-20 0-24-29-5-35 1-26 42-29 47-3 29-2 30 38 3 38Z" />}
  </g>;
}

export default function CompanionCardArt({ kind, active }: { kind: CompanionCardKind; active: number }) {
  const id = useId().replace(/:/g, "");
  return <svg viewBox="0 0 640 340" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[55%] w-full overflow-visible">
    <defs><pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.12" /></pattern></defs>
    <rect x="25" y="0" width="590" height="330" fill={`url(#${id}-grid)`} />
    {kind === "about" && <>
      <g data-art-float transform="translate(183 187)"><g data-art-rotate><circle r="78" fill="currentColor" /><g style={{ color: "var(--card-pale)" }}><Symbol kind="leaf" /></g></g></g>
      <g data-art-float transform="translate(443 100)"><g data-art-rotate><circle r="61" fill="currentColor" /><g style={{ color: "var(--card-pale)" }}><Symbol kind="power" /></g></g></g>
      <g data-art-float transform="translate(440 250)"><g data-art-rotate><circle r="43" fill="currentColor" /><g transform="scale(.7)" style={{ color: "var(--card-pale)" }}><Symbol kind="folder" /></g></g></g>
      <circle data-art-pulse cx="94" cy="50" r="25" fill="currentColor" opacity=".09" />
      <circle data-art-pulse cx="328" cy="120" r="15" fill="currentColor" opacity=".13" />
      <circle data-art-pulse cx="324" cy="286" r="20" fill="currentColor" opacity=".1" />
      <path data-art-line d="M247 153c80-80 90 4 144-28M258 217c62 12 86 22 133 30" fill="none" stroke="currentColor" opacity=".28" strokeWidth="2" strokeDasharray="5 9" />
      <g transform="translate(290 16)"><rect width="105" height="31" rx="15" fill="currentColor" fillOpacity=".1" /><text x="52" y="20" textAnchor="middle" fontSize="11" letterSpacing="1" fill="currentColor">{copy.deviceLabel}</text></g>
    </>}
    {kind === "challenge" && <>
      <g data-art-float transform="translate(72 59) rotate(-10 85 62)">
        <rect width="170" height="125" rx="13" fill="var(--card-pale)" stroke="currentColor" strokeWidth="2" /><path d="M0 30h170" stroke="currentColor" strokeWidth="2" /><circle cx="15" cy="15" r="3" fill="currentColor" /><circle cx="27" cy="15" r="3" fill="currentColor" /><path d="M20 54h95M20 70h70M20 86h110" stroke="currentColor" strokeOpacity=".3" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g data-art-float transform="translate(408 154) rotate(12)"><rect width="137" height="122" rx="15" fill="currentColor" /><g transform="translate(69 55)" style={{ color: "var(--card-pale)" }}><Symbol kind="folder" /></g><text x="68" y="103" fill="var(--card-pale)" textAnchor="middle" fontSize="12">{copy.unusedFiles}</text></g>
      <g data-art-float transform="translate(322 121)"><circle r="76" fill="currentColor" /><circle r="60" fill="none" stroke="var(--card-pale)" strokeOpacity=".25" strokeWidth="2" /><path data-art-hand d="M0-38V0l25 17" fill="none" stroke="var(--card-pale)" strokeWidth="6" strokeLinecap="round" /><circle r="5" fill="var(--card-pale)" /></g>
      <g data-art-float transform="translate(153 263)"><circle r="39" fill="currentColor" fillOpacity=".13" /><g transform="scale(.7)"><Symbol kind="cloud" /></g></g>
      <path data-art-line d="M240 215c37 40 73 45 139 36" stroke="currentColor" strokeWidth="2" strokeDasharray="5 9" fill="none" opacity=".3" />
      <g transform="translate(253 250)"><rect width="140" height="34" rx="17" fill="var(--card-pale)" /><text x="70" y="22" fontSize="12" fill="currentColor" textAnchor="middle">{copy.challengeBadges[active]}</text></g>
    </>}
    {kind === "solution" && <>
      <g data-art-float transform="translate(105 17) rotate(-4 208 135)">
        <rect width="430" height="268" rx="19" fill="var(--card-pale)" stroke="currentColor" strokeWidth="2" />
        <path d="M0 39h430" stroke="currentColor" strokeOpacity=".2" /><circle cx="19" cy="20" r="4" fill="currentColor" /><circle cx="33" cy="20" r="4" fill="currentColor" opacity=".3" /><text x="62" y="24" fill="currentColor" fontSize="11" letterSpacing="1.5">{copy.dashboardHeading}</text>
        <g transform="translate(104 146)"><circle r="67" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="13" /><circle data-art-score r="67" transform="rotate(-90)" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeDasharray="421" strokeDashoffset={160 - active * 40} /><text y="4" textAnchor="middle" fontSize="31" fontWeight="600" fill="currentColor">{copy.scoreLabel}</text><text y="26" textAnchor="middle" fontSize="10" fill="currentColor">{copy.scoreCaption}</text></g>
        {copy.dimensions.map((label, i) => <g key={label} transform={`translate(213 ${87 + i * 55})`}><text fill="currentColor" fontSize="13">{label}</text><rect y="12" width="174" height="8" rx="4" fill="currentColor" fillOpacity=".1" /><rect data-art-bar y="12" width={[122, 96, 145][i]} height="8" rx="4" fill="currentColor" /></g>)}
      </g>
      <g data-art-float transform="translate(343 258) rotate(5)"><rect width="235" height="50" rx="13" fill="currentColor" /><circle cx="26" cy="25" r="12" fill="var(--card-pale)" /><path d="m20 25 4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" /><text x="47" y="29" fontSize="12" fill="var(--card-pale)">{copy.solutionBadges[active]}</text></g>
    </>}
  </svg>;
}
