// B.1 has its own scroll distance; these fractions never stretch Part A or B.
export const MISSION_TIMING = {
  titleRise: [.88, .97], // Fraction of the existing Part B, not B.1.
  dock: [0, .20],
  copy: [.14, .30],
  exit: [.66, .94],
  foreground: [[.66, .86], [.70, .94], [.76, 1]],
  titleDockScale: .85,
  copyTravelPx: 48,
  foregroundReadTop: 90,
} as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, range: readonly [number, number]) => clamp((value - range[0]) / (range[1] - range[0]));
const ease = (value: number) => value * value * (3 - 2 * value);
const easeOut = (value: number) => 1 - (1 - value) ** 3;

export function getMissionFrame(mountainProgress: number, progress: number) {
  const rise = easeOut(phase(mountainProgress, MISSION_TIMING.titleRise));
  const dock = ease(phase(progress, MISSION_TIMING.dock));
  const copy = easeOut(phase(progress, MISSION_TIMING.copy));
  const exit = ease(phase(progress, MISSION_TIMING.exit));
  const foreground = MISSION_TIMING.foreground.map(range => ease(phase(progress, range)));
  const copyOpacity = copy * (1 - exit);
  return {
    dock,
    titleRiseVh: (1 - rise) * 90,
    titleScale: (1 - (1 - MISSION_TIMING.titleDockScale) * dock) * (1 - .20 * exit),
    titleOpacity: rise * (1 - exit),
    copyOpacity,
    copyX: -MISSION_TIMING.copyTravelPx * (1 - copy),
    copyScale: 1 - .15 * exit,
    copyInteractive: copyOpacity > .1 && exit < .1,
    foreground,
  };
}

export function getMissionMountainY(index: number, baseY: number, finalTop: number, progress: number) {
  if (index < 3) return baseY;
  const frame = getMissionFrame(1, progress);
  // Lower mountain4 slightly during reading so it doesn't cover the CTA.
  const readingY = index === 3
    ? baseY + (MISSION_TIMING.foregroundReadTop - baseY) * frame.dock
    : baseY;
  return readingY + (finalTop * 100 - readingY) * frame.foreground[index - 3];
}
