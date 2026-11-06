# Home — Part A (English review)

Preview: `/en`. Spanish home and interior pages retain their existing content.
Part A is approved. Part B is implemented for review; see `home-part-b.md`.
Do not publish without reviewing the complete home.

## Editing

- Copy and image URLs: `content/en/home.json`, `partA`.
- Layout, title size, clouds, sun loop: `src/components/home/HomeStory.module.css`.
- Scroll phases and title entry: `src/components/home/HomeStory.tsx`.
- Header: existing SiteHeader, light-hero colors only on `/en`; leaves the viewport on scroll.

## Timing

Part A retains 260svh of scroll inside a sticky 100svh stage. Scroll is native, not intercepted.
Its progress is independent of the additional Part B distance.

- Title: initially hidden; circular mask expands from bottom-left over .008–.20,
  holds for exactly 450 CSS pixels of scroll after .20, then contracts over
  the next .09 of progress. No automatic title animation. Adjust `TITLE_HOLD_PX` to change the hold.
- Sun: rise over .30–.53, clockwise full turn every 80 seconds.
- Statement: appears over .49–.55; reveals in reading order over .66–.90.
- Cloud loops: cloud1 crosses fully offscreen left to right, cloud2 right to left.
  They restart outside the original edge without reversing direction. Durations are
  scaled from 20.429 / 25.103 seconds to preserve previous average pixel speed over
  the longer route, recalculated for each viewport. Cloud3 retains its 30.841s loop.
  Cloud3 moves from centered to the right with a 6vw gap, then back.
- Scroll arrow: 7px vertical travel, 1.8s loop.
- Text is above clouds, clouds above sun. Decorative images ignore pointer events.

The visible pause button was removed at the user's request; scroll remains native.
Reduced motion / no JS presents both messages in normal flow, no pinned journey or loops.
Offscreen and background-tab loops are paused. Event listeners and animations clean up on navigation.

## Assets

Copied unchanged from the supplied Home animado folder into `public/images/home/`.
Original exports are not all 2560px: sun 940×940; clouds 1250×799, 1170×600, 1180×680.
All have an alpha channel. Sun display capped at 940 CSS px, clouds at 800/700/630.
Higher-density screens may benefit from higher-resolution source exports later.
