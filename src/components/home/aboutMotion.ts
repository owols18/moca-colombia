import type { ProjectsGeometry } from "./projectsMotion";
import type { ImpactGeometry } from "./impactMotion";

export const ABOUT_TIMING = {
  unblur: [0, .12],
  travel: [.02, .60],
  house: [.08, .30],
  grains: [[.28, .49], [.24, .45]],
  overlay: [.61, .71],
  title: [.66, .79],
  paragraph: [.78, .85],
  cta: [.84, .90],
  gallery: [.89, .96],
} as const;
export const FINAL_HOUSE_ANCHOR = { x: .76, y: .71, width: .54 } as const;
export const COCOA_ANCHORS = {
  right: { x: .63, y: .73, width: .54 },
  left: { y: .61, width: .54, hiddenFraction: .32 },
} as const;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const phase = (n: number, range: readonly [number, number]) => clamp((n - range[0]) / (range[1] - range[0]));
const ease = (n: number) => n * n * (3 - 2 * n);
const out = (n: number) => 1 - (1 - n) ** 3;
type Asset = { width: number; height: number };

export function getAboutGeometry(w: number, h: number, projects: ProjectsGeometry, impact: ImpactGeometry, assets: { house: Asset; grains: readonly Asset[] }) {
  const way = projects.way;
  const width = way.width * FINAL_HOUSE_ANCHOR.width;
  const height = width * assets.house.height / assets.house.width;
  const x = way.x + way.width * FINAL_HOUSE_ANCHOR.x - width / 2;
  const house = { x, y: way.y + way.height * FINAL_HOUSE_ANCHOR.y - height, width, height, entryX: w + 4 - x };
  const finalPan = h - (way.y + way.height);
  const grains = assets.grains.map((asset, i) => {
    const width = way.width * (i === 0 ? COCOA_ANCHORS.right.width : COCOA_ANCHORS.left.width);
    const height = width * asset.height / asset.width;
    const x = i === 0 ? way.x + way.width * COCOA_ANCHORS.right.x : -width * COCOA_ANCHORS.left.hiddenFraction;
    const y = way.y + way.height * (i === 0 ? COCOA_ANCHORS.right.y : COCOA_ANCHORS.left.y);
    // Start below the viewport even at the last camera position.
    return { x, y, width, height, entryY: Math.max(h * .55, h + 4 - y - finalPan) };
  });
  return { house, grains, finalPan, extraPan: finalPan - impact.finalPan, viewportHeight: h };
}
export type AboutGeometry = ReturnType<typeof getAboutGeometry>;

export function getAboutFrame(progress: number, geometry: AboutGeometry) {
  const travel = ease(phase(progress, ABOUT_TIMING.travel));
  return {
    visible: progress > 0,
    extraPan: geometry.extraPan * travel,
    blurFactor: 1 - ease(phase(progress, ABOUT_TIMING.unblur)),
    houseX: geometry.house.entryX * (1 - out(phase(progress, ABOUT_TIMING.house))),
    houseVisible: progress > ABOUT_TIMING.house[0],
    grainY: geometry.grains.map((grain, i) => grain.entryY * (1 - out(phase(progress, ABOUT_TIMING.grains[i])))),
    grainVisible: ABOUT_TIMING.grains.map(range => progress > range[0]),
    overlay: .50 * ease(phase(progress, ABOUT_TIMING.overlay)),
    title: phase(progress, ABOUT_TIMING.title),
    paragraph: out(phase(progress, ABOUT_TIMING.paragraph)),
    cta: out(phase(progress, ABOUT_TIMING.cta)),
    gallery: ease(phase(progress, ABOUT_TIMING.gallery)),
  };
}
export function getAboutLetter(progress: number, index: number, count: number) {
  const opacity = out(clamp(progress * (1 + (count - 1) * .16) - index * .16));
  return { opacity, blur: 12 * (1 - opacity), y: 18 * (1 - opacity) };
}
export function getGalleryOffset(index: number, active: number, count: number) {
  return ((index - active + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
}
