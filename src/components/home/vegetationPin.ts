// Space kept below the viewport before the painted vegetation ends.
// Smaller margin = scroll farther before pinning. Larger margin = stop earlier.
export const VEGETATION_PIN_MARGIN_PX = 24;
export const VEGETATION_MAX_TRAVEL_VH = .35;

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

export function getVegetationPinTravel(height: number, opaqueBottom: number) {
  return height * .28; //clamp(opaqueBottom - height - Math.max(4, VEGETATION_PIN_MARGIN_PX), height * VEGETATION_MAX_TRAVEL_VH);
}

export function getVegetationPinFrame(scrollAfterC1: number, projectsDistance: number, travel: number) {
  const release = projectsDistance * .05; // Let C.1 fade out before normal scrolling.
  const travelled = clamp(scrollAfterC1 - release, travel);
  return {
    mode: scrollAfterC1 < release ? "intro" : scrollAfterC1 < release + travel ? "flow" : "pinned",
    travelled,
    progressD: clamp((scrollAfterC1 - travelled) / Math.max(1, projectsDistance), 1),
    release,
  };
}

// Read the actual composite alpha, including transparent image edges. This runs
// only on asset load / resize, never on scroll. Original assets are not modified.
export function measureVegetationPinTravel(
  width: number,
  height: number,
  layers: readonly { x: number; y: number; width: number }[],
  images: readonly HTMLImageElement[],
) {
  if (!layers.length || images.length !== layers.length || images.some(image => !image.complete || !image.naturalWidth)) return 0;
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 768 / width);
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * (1 + VEGETATION_MAX_TRAVEL_VH) * scale);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return 0;
  try {
    layers.forEach((layer, i) => {
      const image = images[i];
      context.drawImage(image, layer.x * scale, layer.y * scale, layer.width * scale, layer.width * image.naturalHeight / image.naturalWidth * scale);
    });
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    // Find the first exposed pixel below the current viewport. A safety margin
    // absorbs subpixel/resampling differences between this probe and the browser.
    let row = Math.floor(height * scale) - 1;
    for (; row < canvas.height; row++) {
      let solid = true;
      for (let x = 0; x < Math.floor(width * scale); x++) {
        if (pixels[(row * canvas.width + x) * 4 + 3] < 250) { solid = false; break; }
      }
      if (!solid) break;
    }
    return getVegetationPinTravel(height, row / scale);
  } catch {
    // If a future remote asset disallows canvas reads, do not expose its edge.
    return 0;
  }
}
