// Independent Part C timeline. Entry begins halfway through mountain6's return.
export const VEGETATION_TIMING = {
  sides: [0, .32],
  front: [.54, .82],
} as const;

// Desktop visible-width fractions; portrait crops further to keep bases offscreen.
export const VEGETATION_LAYERS = [
  { visibleWidth: .90, top: .25, minHeight: .90, crop: "left", zIndex: 70 },
  { visibleWidth: .75, top: .13, minHeight: .90, crop: "right", zIndex: 80 },
  { visibleWidth: .90, top: .35, minHeight: .72, crop: "right", zIndex: 90 },
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, range: readonly [number, number]) => clamp((value - range[0]) / (range[1] - range[0]));
const ease = (value: number) => value * value * (3 - 2 * value);
const mix = (start: number, end: number, value: number) => start + (end - start) * value;

export type VegetationGeometry = {
  width: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
};

export function getVegetationGeometry(
  viewportWidth: number,
  viewportHeight: number,
  assets: readonly { width: number; height: number }[],
): VegetationGeometry[] {
  const widths = VEGETATION_LAYERS.map((layer, index) => Math.max(
    viewportWidth / layer.visibleWidth,
    viewportHeight * layer.minHeight * assets[index].width / assets[index].height,
  ));
  // On ultrawide screens, lift the whole composition to close gaps between slopes.
  // A shared lift preserves the exact 10svh separation of vegetation1 and 3.
  const tallestSide = Math.max(...widths.slice(0, 2).map((width, index) => width * assets[index].height / assets[index].width));
  const lift = Math.max(0, tallestSide - viewportHeight * 1.05) * .65;
  return VEGETATION_LAYERS.map((layer, index) => {
    const width = widths[index];
    const x = index === 2 ? 0 : layer.crop === "left"
      ? -Math.min(width, viewportWidth / layer.visibleWidth) * (1 - layer.visibleWidth)
      : viewportWidth - width * layer.visibleWidth;
    // Narrow viewports show a smaller horizontal slice: reduce the rear pair's
    // vertical gap so vegetation2 does not mask almost all of vegetation1.
    const portraitOffset = index === 1 ? .09 * clamp((1 - viewportWidth / viewportHeight) / .5) : 0;
    const y = viewportHeight * (layer.top + portraitOffset) - lift;
    return {
      width, x, y,
      startX: index === 0 ? -width - 2 : index === 1 ? viewportWidth + 2 : x,
      startY: index === 2 ? viewportHeight + 2 : y,
    };
  });
}

export function getVegetationProgress(
  scrollFromMissionStart: number,
  missionDistance: number,
  extraDistance: number,
  mountain6Entry: readonly [number, number],
) {
  // At the midpoint, smoothstep also equals .5: half of mountain6's movement.
  const start = missionDistance * (mountain6Entry[0] + mountain6Entry[1]) / 2;
  const duration = Math.max(1, missionDistance - start + extraDistance);
  return clamp((scrollFromMissionStart - start) / duration);
}

export function getVegetationFrame(progress: number, geometry: readonly VegetationGeometry[]) {
  const sides = ease(phase(progress, VEGETATION_TIMING.sides));
  const front = ease(phase(progress, VEGETATION_TIMING.front));
  return geometry.map((layer, index) => ({
    x: mix(layer.startX, layer.x, index === 2 ? 1 : sides),
    y: mix(layer.startY, layer.y, index === 2 ? front : 1),
    visible: index === 2 ? front > 0 : sides > 0,
  }));
}
