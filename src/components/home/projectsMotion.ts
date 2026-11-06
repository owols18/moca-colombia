// Independent Part D. Only begins after the approved C.1 reading/CTA hold.
export const PROJECTS_TIMING = {
  previousExit: [0, .05],
  trees: [[.17, .31], [.22, .36], [.27, .41]],
  church: [.42, .70],
  projects: [.72, .84],
} as const;

// D.1 adds 10% to the previous 20% increase. Church inherits this only once.
export const PROJECTS_SCALE = { trees: 1.30, way: 1.20 * 1.10 } as const;
// Lower the resting composition without moving vegetation or changing timing.
export const PROJECTS_REST_OFFSET = .12;

// Coordinates within the original way.webp, not within the viewport.
// Keep church and path in one coordinate system at every breakpoint.
export const CHURCH_ANCHOR = { x: .55, y: .055, width: .32 } as const;
// Extra width hides the transparent side margins; overlap blends with Part C.
export const PATH_VEGETATION = { viewportWidth: 1.12, pathWidth: 1.10, overlapVh: .14 } as const;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (value: number, range: readonly [number, number]) => clamp((value - range[0]) / (range[1] - range[0]));
const ease = (value: number) => value * value * (3 - 2 * value);
type Asset = { width: number; height: number };

export function getProjectsGeometry(w: number, h: number, assets: { trees: readonly Asset[]; way: Asset; church: Asset; vegetationPath?: Asset }, vegetationBottom = h * 1.28) {
  const portrait = w < h;
  const restOffset = h * PROJECTS_REST_OFFSET;
  const wayWidth = Math.min(Math.max(w * .88, h * .62), h * 1.45) * PROJECTS_SCALE.way;
  const wayHeight = wayWidth * assets.way.height / assets.way.width;
  const wayX = (w - wayWidth) / 2;
  const wayY = h * .70 + restOffset;
  const churchWidth = wayWidth * CHURCH_ANCHOR.width;
  const churchHeight = churchWidth * assets.church.height / assets.church.width;
  const churchX = wayX + wayWidth * CHURCH_ANCHOR.x - churchWidth / 2;
  const churchY = wayY + wayHeight * CHURCH_ANCHOR.y - churchHeight;
  const vegetationWidth = Math.max(w * PATH_VEGETATION.viewportWidth, wayWidth * PATH_VEGETATION.pathWidth);
  const vegetationPath = assets.vegetationPath ? {
    x: (w - vegetationWidth) / 2,
    y: churchY + churchHeight - h * PATH_VEGETATION.overlapVh,
    width: vegetationWidth,
    height: vegetationWidth * assets.vegetationPath.height / assets.vegetationPath.width,
    blend: h * PATH_VEGETATION.overlapVh,
  } : undefined;
  const widths = portrait ? [.60, .64, .56] : [.24, .30, .25];
  // Left tree, right tree, then the taller rear tree behind the church.
  const centers = portrait ? [.02, .98, .57] : [.19, .84, .55];
  // D.2 keeps the approved C/C.1 landscape framing completely still.
  const backgroundPan = 0;
  const vegetationBase = Math.min(vegetationBottom, h * .98);
  // Trees 1 and 3 share a foreground baseline; the vegetation base stays offscreen.
  // Tree 2 is lowered 5svh
  // from its previous settled position and remains behind the path (CSS z-index).
  const bottoms = [vegetationBase + restOffset, h * .87 + restOffset + h * .05, vegetationBase + restOffset];
  return {
    vegetationPath,
    way: { width: wayWidth, height: wayHeight, x: wayX, y: wayY },
    church: { width: churchWidth, height: churchHeight, x: churchX, y: churchY },
    trees: assets.trees.map((asset, index) => {
      const width = Math.min(w * widths[index], h * .46) * PROJECTS_SCALE.trees;
      const height = width * asset.height / asset.width;
      return { width, height, x: w * centers[index] - width / 2, y: bottoms[index] - height };
    }),
    // Stop at the church: the rest of the complete path extends below the view.
    // All D assets enter at final world coordinates; no second settling motion.
    pan: 0,
    backgroundPan,
    vegetationBase,
    viewportHeight: h,
  };
}

export type ProjectsGeometry = ReturnType<typeof getProjectsGeometry>;

export function getProjectsFrame(progress: number, geometry: ProjectsGeometry) {
  const trees = PROJECTS_TIMING.trees.map(range => ease(phase(progress, range)));
  const church = ease(phase(progress, PROJECTS_TIMING.church));
  const projectsOpacity = ease(phase(progress, PROJECTS_TIMING.projects));
  const previousOpacity = 1 - ease(phase(progress, PROJECTS_TIMING.previousExit));
  // One rigid translation: church stays attached to its platform at every frame.
  const routeY = (geometry.viewportHeight + 2 - Math.min(geometry.church.y, geometry.way.y)) * (1 - church);
  return {
    visible: progress > 0,
    previousOpacity,
    previousInteractive: progress <= 0,
    treeY: trees.map((enter, index) => (geometry.viewportHeight + 2 - geometry.trees[index].y) * (1 - enter)),
    treeVisible: trees.map(enter => enter > 0),
    wayReveal: church > 0 ? 1 : 0,
    wayY: routeY,
    churchY: routeY,
    churchVisible: church > 0,
    panY: 0,
    backgroundY: 0,
    projectsOpacity,
    projectsInteractive: projectsOpacity > .1,
  };
}
