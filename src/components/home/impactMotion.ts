import type { ProjectsGeometry } from "./projectsMotion";

// Anchors are centers/feet on way.webp's platforms 2, 3, 4 and 5.
// Width is relative to the path, preserving the foreground perspective.
export const HOUSE_ANCHORS = [
  { x: .75, y: .195, width: .41, direction: 1 },
  { x: .24, y: .315, width: .43, direction: -1 },
  { x: .74, y: .445, width: .66, direction: 1 },
  { x: .27, y: .575, width: .49, direction: -1 },
] as const;
export const IMPACT_TIMING = {
  projectsExit: [0, .18],
  firstPair: [.025, .25],
  firstTravel: [0, .28],
  secondPair: [.34, .58],
  secondTravel: [.32, .65],
  blur: [.65, .77],
  title: [.72, .83],
  paragraph: [.80, .90],
  cta: [.90, .95],
} as const;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const phase = (n: number, range: readonly [number, number]) => clamp((n - range[0]) / (range[1] - range[0]));
const ease = (n: number) => n * n * (3 - 2 * n);
const out = (n: number) => 1 - (1 - n) ** 3;

export function getImpactGeometry(w: number, h: number, projects: ProjectsGeometry, assets: readonly { width: number; height: number }[]) {
  const houses = assets.map((asset, i) => {
    const anchor = HOUSE_ANCHORS[i];
    const width = projects.way.width * anchor.width;
    const height = width * asset.height / asset.width;
    const x = projects.way.x + projects.way.width * anchor.x - width / 2;
    const y = projects.way.y + projects.way.height * anchor.y - height;
    const entryX = anchor.direction > 0 ? w + 4 - x : -x - width - 4;
    return { x, y, width, height, entryX };
  });
  // First pair occupies the same view before continuing to the foreground pair.
  // Bottom of the visible frame cuts house4 exactly halfway through its height.
  const finalPan = Math.min(0, h - (houses[3].y + houses[3].height * .5));
  const firstPan = finalPan * .65;
  return { houses, firstPan, finalPan };
}
export type ImpactGeometry = ReturnType<typeof getImpactGeometry>;

export function getImpactFrame(progress: number, geometry: ImpactGeometry) {
  const first = out(phase(progress, IMPACT_TIMING.firstPair));
  const second = out(phase(progress, IMPACT_TIMING.secondPair));
  return {
    visible: progress > 0,
    projectsOpacity: 1 - ease(phase(progress, IMPACT_TIMING.projectsExit)),
    pan: geometry.firstPan * ease(phase(progress, IMPACT_TIMING.firstTravel))
      + (geometry.finalPan - geometry.firstPan) * ease(phase(progress, IMPACT_TIMING.secondTravel)),
    houseX: geometry.houses.map((house, i) => house.entryX * (1 - (i < 2 ? first : second))),
    houseVisible: geometry.houses.map((_, i) => (i < 2 ? first : second) > 0),
    blur: 12 * ease(phase(progress, IMPACT_TIMING.blur)),
    title: phase(progress, IMPACT_TIMING.title),
    paragraph: phase(progress, IMPACT_TIMING.paragraph),
    cta: out(phase(progress, IMPACT_TIMING.cta)),
  };
}

// Fold letters around their vertical axis instead of another upward text slide.
export function getImpactLetter(progress: number, index: number, count: number) {
  const reveal = out(clamp((progress * (1 + (count - 1) * .12) - index * .12)));
  return { opacity: reveal, rotate: (1 - reveal) * -85, x: (1 - reveal) * (index % 2 ? 18 : -18) };
}
export function getImpactLine(progress: number, index: number, count: number) {
  return out(clamp(progress * (1 + (count - 1) * .18) - index * .18));
}
