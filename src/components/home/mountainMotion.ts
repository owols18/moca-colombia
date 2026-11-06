// All timings below refer only to Part B (0 = its start, 1 = its end).
// Part A retains its own independent 260svh scroll distance.
export const MOUNTAIN_TIMING = {
  cover: [0, .18],
  pullback: [.20, .76],
  missionFraming: [.76, .88],
  blur: [.84, .94],
  mission: [.88, .97],
  closeScale: 2.0,
  blurPixels: 12,
} as const;

// width = fraction of viewport; shift = horizontal offset from center.
// A small safety crop on the opposite edge hides the rounded image endpoints.
export const MOUNTAIN_LAYERS = [
  { width: 1.10, shift: 0, minWidthVh: 1.97, top: .02, missionTop: .02, enter: [0, .18] },
  { width: 1.10, shift: 0, minWidthVh: 1.60, top: .12, missionTop: .12, enter: [.24, .43] },
  { width: 1.20, shift: -.05, minWidthVh: 1.60, top: .22, missionTop: .22, enter: [.32, .51] },
  { width: 1.20, shift: .05, minWidthVh: 1.60, top: .32, missionTop: .74, enter: [.40, .59] },
  { width: 1.10, shift: 0, minWidthVh: 1.60, top: .42, missionTop: 1.12, enter: [.48, .67] },
  { width: 1.20, shift: -.05, minWidthVh: 1.60, top: .52, missionTop: 1.22, enter: [.56, .76] },
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, range: readonly [number, number]) => clamp((value - range[0]) / (range[1] - range[0]));
const ease = (value: number) => value * value * (3 - 2 * value);
const mix = (start: number, end: number, value: number) => start + (end - start) * value;

export function getMountainFrame(progress: number, firstMountainHeightVh = 84) {
  const cover = ease(phase(progress, MOUNTAIN_TIMING.cover));
  const pullback = ease(phase(progress, MOUNTAIN_TIMING.pullback));
  const blur = ease(phase(progress, MOUNTAIN_TIMING.blur));
  const missionFraming = ease(phase(progress, MOUNTAIN_TIMING.missionFraming));
  // Anchor within the solid body, including on short/ultrawide screens.
  const closeTop = -firstMountainHeightVh * .42;
  return {
    visible: progress > 0,
    covered: progress >= MOUNTAIN_TIMING.cover[1],
    cameraScale: mix(MOUNTAIN_TIMING.closeScale, 1, pullback),
    entranceVh: (1 - cover) * (110 - closeTop * MOUNTAIN_TIMING.closeScale),
    blur: blur * MOUNTAIN_TIMING.blurPixels,
    mission: ease(phase(progress, MOUNTAIN_TIMING.mission)),
    layers: MOUNTAIN_LAYERS.map((layer, index) => ({
      // The first mountain is the camera's starting subject, not another slide.
      yVh: index === 0
        ? mix(closeTop, layer.top * 100, pullback)
        : mix(112, layer.top * 100, ease(phase(progress, layer.enter)))
          + (layer.missionTop - layer.top) * 100 * missionFraming,
      // Blur mountain3 and the landscape behind it; foreground and text stay sharp.
      blur: index <= 2 ? blur * MOUNTAIN_TIMING.blurPixels : 0,
    })),
  };
}
