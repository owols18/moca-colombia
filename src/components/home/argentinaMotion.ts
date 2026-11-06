// C.1 is independent: approved A/B/B.1/C scroll distances remain unchanged.
export const ARGENTINA_TIMING = {
  entrance: [0, .14],
  reading: [.16, .88],
  ctaReveal: .04, // Begin only after the last word is fully revealed.
  photos: [[.36, .44], [.64, .72]],
} as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, range: readonly [number, number]) => clamp((value - range[0]) / (range[1] - range[0]));
const ease = (value: number) => value * value * (3 - 2 * value);

export function getArgentinaFrame(progress: number, textHeight = 0, windowHeight = 0) {
  const entrance = ease(phase(progress, ARGENTINA_TIMING.entrance));
  const reading = phase(progress, ARGENTINA_TIMING.reading);
  const changes = ARGENTINA_TIMING.photos.map(range => ease(phase(progress, range)));
  const overflow = Math.max(0, textHeight - windowHeight);
  return {
    visible: progress > 0,
    riseVh: (1 - entrance) * 110,
    opacity: entrance,
    reading,
    ctaOpacity: ease(phase(progress, [ARGENTINA_TIMING.reading[1], ARGENTINA_TIMING.reading[1] + ARGENTINA_TIMING.ctaReveal])),
    // Begin panning only once the revealed words reach the lower reading area.
    copyY: -Math.min(overflow, Math.max(0, reading * textHeight - windowHeight * .8)),
    activePhoto: changes[1] >= .5 ? 2 : changes[0] >= .5 ? 1 : 0,
    photoY: [-100 * changes[0], 100 * (1 - changes[0]) - 100 * changes[1], 100 * (1 - changes[1])],
  };
}

export function getArgentinaWordOpacity(reading: number, index: number, count: number) {
  return clamp(reading * count - index);
}
