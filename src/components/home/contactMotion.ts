import type { DonationGeometry } from "./donationMotion";

export const CONTACT_TIMING = {
  exitDonation: [0, .14],
  camera: [.08, .44],
  grains: [.08, .40],
  photo: [.43, .64],
  title: [.48, .70],
  paragraph: [.66, .77],
  cta: [.78, .88],
  fruits: [.66, .89],
} as const;
export const CONTACT_GRAINS = { overlapPrevious: .20, widthVw: 0.90, minWidthVh: 1.90, finalTopVh: -.12 } as const;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const phase = (n: number, range: readonly [number, number]) => clamp((n - range[0]) / (range[1] - range[0]));
const ease = (n: number) => n * n * (3 - 2 * n);

export function getContactGeometry(w: number, h: number, donation: DonationGeometry, assets: readonly { width: number; height: number }[]) {
  // Native aspect ratios, no stretching. Both piles overlap the lower 20% of grain3.
  const y = donation.grains.y + donation.grains.height * (1 - CONTACT_GRAINS.overlapPrevious);
  const width = Math.max(w * CONTACT_GRAINS.widthVw, h * CONTACT_GRAINS.minWidthVh);
  const grains = assets.map((asset, i) => {
    // Interlock the transparent silhouettes, not just their rectangular bounds.
    const x = w * .5 - width * (i === 0 ? .79 : .25);
    return {
      x,
      y: y + h * (i === 0 ? -.1 : -.08),
      width,
      height: width * asset.height / asset.width,
      entryX: i === 0 ? -width - x - 4 : w - x + 4 };
  });
  return { grains, finalPan: h * CONTACT_GRAINS.finalTopVh - y };
}
export type ContactGeometry = ReturnType<typeof getContactGeometry>;

export function getContactFrame(progress: number, geometry: ContactGeometry) {
  const enter = ease(phase(progress, CONTACT_TIMING.grains));
  const exit = 1 - ease(phase(progress, CONTACT_TIMING.exitDonation));
  return {
    visible: progress > 0,
    donationOpacity: exit,
    blurFactor: exit,
    pan: geometry.finalPan * ease(phase(progress, CONTACT_TIMING.camera)),
    grainsVisible: progress > CONTACT_TIMING.grains[0],
    grainX: geometry.grains.map(grain => grain.entryX * (1 - enter)),
    photo: ease(phase(progress, CONTACT_TIMING.photo)),
    title: phase(progress, CONTACT_TIMING.title),
    paragraph: ease(phase(progress, CONTACT_TIMING.paragraph)),
    cta: ease(phase(progress, CONTACT_TIMING.cta)),
    fruits: ease(phase(progress, CONTACT_TIMING.fruits)),
  };
}
