import type { AboutGeometry } from "./aboutMotion";

export const DONATION_TIMING = {
  exitAbout: [0, .16],
  overlayOut: [0, .18],
  trees: [.04, .48],
  // .26 is exactly halfway through the trees' smoothstep travel.
  grains: [.26, .62],
  blur: [.65, .77],
  cta: [.74, .88],
} as const;
export const COCOA_TREE_LAYOUT = { widthVw: .58, minWidthVh: .46, edgeOverflow: .06 } as const;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const phase = (n: number, range: readonly [number, number]) => clamp((n - range[0]) / (range[1] - range[0]));
const ease = (n: number) => n * n * (3 - 2 * n);
type Asset = { width: number; height: number };

export function getDonationGeometry(w: number, h: number, about: AboutGeometry, readingTravel: number, assets: { trees: readonly Asset[]; grains: Asset }) {
  // Tree crowns reach the middle of house5, using the same final world coordinates.
  const houseMidpoint = about.house.y + about.house.height * .5 + about.finalPan - readingTravel;
  const trees = assets.trees.map((asset, index) => {
    const width = Math.max(w * COCOA_TREE_LAYOUT.widthVw, h * COCOA_TREE_LAYOUT.minWidthVh);
    const height = width * asset.height / asset.width;
    const x = index === 0 ? -w * COCOA_TREE_LAYOUT.edgeOverflow : w - width + w * COCOA_TREE_LAYOUT.edgeOverflow;
    return { x, y: houseMidpoint, width, height, entryY: Math.max(0, h + 4 - houseMidpoint) };
  });
  // CONTROLES EDITABLES
  const grainScale = 1.20;   // Tamaño: 1 = actual; 1.20 = 20% mayor
  const grainOffsetX = 0;    // Posición horizontal: .05 = derecha; -.05 = izquierda
  const grainOffsetY = -0.1;    // Posición vertical: .05 = abajo; -.05 = arriba

  const width = w * grainScale;
  const height = width * assets.grains.height / assets.grains.width;

  // Mantiene la imagen centrada al cambiar su tamaño.
  const x = (w - width) / 2 + w * grainOffsetX;
  const y = Math.max(h * .50, h - height * .80) + h * grainOffsetY;

  return {
    trees,
    grains: {
    x,
    y,
    width,
    height,
    entryY: Math.max(0, h + 4 - y),
    },
  };
}
export type DonationGeometry = ReturnType<typeof getDonationGeometry>;

export function getDonationFrame(progress: number, geometry: DonationGeometry) {
  const trees = ease(phase(progress, DONATION_TIMING.trees));
  const grains = ease(phase(progress, DONATION_TIMING.grains));
  const exit = ease(phase(progress, DONATION_TIMING.exitAbout));
  return {
    visible: progress > 0,
    backdropVisible: progress >= DONATION_TIMING.cta[0],
    aboutOpacity: 1 - exit,
    aboutExit: exit,
    overlayFactor: 1 - ease(phase(progress, DONATION_TIMING.overlayOut)),
    treeY: geometry.trees.map(tree => tree.entryY * (1 - trees)),
    treesVisible: progress > DONATION_TIMING.trees[0],
    grainY: geometry.grains.entryY * (1 - grains),
    grainsVisible: progress > DONATION_TIMING.grains[0],
    blur: 12 * ease(phase(progress, DONATION_TIMING.blur)),
    cta: ease(phase(progress, DONATION_TIMING.cta)),
  };
}
