# Home — Part E (English preview)

Part D's manually approved values remain unchanged: vegetation travel 0.28 × viewport height, tree2 +0.05 × viewport height, path top 0.70 + 0.12 × viewport height.

## Controls

- `src/components/home/impactMotion.ts`: HOUSE_ANCHORS coordinates are proportional to the complete way.webp. x = platform center, y = feet position, width = proportion of path width. Entries correspond to platforms 2, 3, 4, 5. Keep houses attached to the path; do not use unrelated viewport offsets.
- IMPACT_TIMING: Projects exit, simultaneous first pair, second pair, camera travel, blur, title, paragraph, CTA. Values are fractions of Part E only; none alters A–D.
- getImpactGeometry finalPan: `h - (house4.y + house4.height * .5)` cuts the viewport at half of house4. The existing stage overflow clips the rest of the road. No image is cut or replaced.
- `HomeStory.module.css`: --part-e-scroll (650svh) determines Part E duration.
- `ImpactScene.module.css`: --impact-title-color sets title color; .copy bottom controls text framing. Foreground houses 3/4 stay sharp; rear houses and scenery blur without a white overlay.
- `content/en/home.json`: partE holds the text, line grouping, images and CTA. EXPLORE OUR IMPACT links to /en/impact.

## Motion and accessibility

### Vegetation behind the path

`content/en/home.json → partD.vegetationPath` references the original transparent 2560×3840 WebP. In `projectsMotion.ts`, PATH_VEGETATION controls width and overlap with the preceding vegetation. Its top blends over 14% of viewport height, ending at the church's base. It travels in the same landscape as the path, behind trees/church/road/houses but above mountains. The existing Impact background blur includes it. No house scale, approved timing, or source image is changed.

Projects fades 100%→0%. Houses enter horizontally in opposite directions by pair. Impact letters unfold around the vertical axis; paragraph lines reveal sideways; the CTA opens from its center. All values derive directly from scroll and reverse without timers. Hidden controls are inert. With reduced motion or without JavaScript, Impact remains readable in normal page flow, without the decorative animation.

## Verification

Run `node scripts/check-home-part-e.cjs` for image metadata, platform anchors, preserved manual D settings, reverse timeline and the final house4 midpoint across desktop/tablet/mobile aspect ratios.
