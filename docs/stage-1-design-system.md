# Stage 1 - technical foundation and Design System

Completion date: 2026-09-25

## Outcome

Stage 1 converts the recurring visual language in the approved 1920 px Illustrator artboards into a reusable, responsive web foundation. It intentionally does not implement the public Home or any interior page.

The live reference is available at `/design-system`; the root route is a development status page. The Design System route is marked `noindex` and is outside the public sitemap.

## Technical baseline

- Next.js App Router with React and strict TypeScript.
- CSS custom properties for global tokens and CSS Modules for component styles.
- Local variable Comfortaa and Manrope fonts loaded through `next/font/local`.
- pnpm lockfile and scripts for lint, type checking and production build.
- Static rendering for the two current routes.
- No analytics, tracking, Stripe secrets or contact delivery in this stage.

## Token foundation

### Color

| Token | Value | Use |
|---|---|---|
| White | `#FFFFFF` | Primary canvas |
| Ivory | `#F7F1E7` | Light surface and inverted text |
| Sand | `#E8D9C2` | Warm section surface |
| Forest | `#245749` | Primary brand color and headings |
| Forest hover | `#173F35` | Primary interactive hover |
| Forest pressed | `#102F27` | Primary interactive pressed |
| Cacao | `#8A5639` | Warm brand accent |
| Muted | `#66736D` | Footer and secondary copy |
| Ink | `#1D2925` | Primary body copy |
| Gold | `#C59B50` | Supporting rules and focus accents |

Gold is provisional because it was sampled from recurring visual rules in the approved Illustrator work rather than supplied in the original color list.

### Typography

- Display: Comfortaa Bold, fluid to 80 px.
- H1: Comfortaa SemiBold, fluid to 52 px.
- H2: Comfortaa Medium, fluid to 42 px.
- Body large: Manrope Light, fluid to 20 px.
- CTAs: Manrope Light, 20 px, uppercase, 24 px horizontal padding, 14 px vertical padding and an adaptive minimum size of 130 x 50 px.
- Captions: Manrope Light, 12 px, uppercase where the design calls for it.

The source TTF variable fonts are self-hosted for this stage. WOFF2 subsetting remains a production optimization task once the final bilingual character set is stable.

### Layout

- Minimum supported layout width: 320 px.
- Fluid side gutter: 20 px to 120 px.
- Maximum content width: 1760 px.
- Readable copy width: approximately 72 characters.
- Fluid section spacing: 72 px to 144 px.
- Breakpoints are content-driven at 760/780 px and 1050 px.
- Full-bleed color and image sections retain capped inner content on 2560 x 1440 screens.

## Reusable components

- `Button` and `ButtonLink`: primary, secondary, light and outline-on-dark variants, with the approved default, hover, pressed and disabled colors.
- `TextField` and `TextAreaField`: label, hint, error state and accessible description wiring.
- `SectionHeading`: standard and inverted section titles.
- `SiteHeaderPreview`: menu, logo and language affordance.
- `CtaPreview`: shared photographic donation/participation pattern.
- `SiteFooterPreview`: muted footer pattern.

The page also records swatches, type scale, spacing scale, form controls, editorial cards, project cards and dark impact surfaces.

## Accessibility and responsive rules

- Visible keyboard focus uses the supporting gold accent.
- Form labels are persistent and error/hint text is programmatically associated.
- CTA controls maintain an adaptive minimum size of 130 x 50 px and grow with longer translated labels.
- Motion tokens respect `prefers-reduced-motion`.
- Heading hierarchy and semantic page sections are preserved.
- Mobile grids collapse to one column and horizontal section navigation remains scrollable.
- The 2560 px experience adds whitespace instead of indefinitely enlarging text or images.

## Asset decisions

- The official logo, cacao icon and team-card vector are preserved as SVG.
- One shared donation image is present as a temporary Design System preview only.
- Interior-page image derivatives will be produced from the original masters in later stages.
- The Illustrator source and all synced source files remain read-only.

## Verification

- ESLint: passed.
- TypeScript with `noEmit`: passed.
- Next.js production build: passed.
- Static generation: `/` and `/design-system` passed.
- Browser review at the local desktop viewport: hero, navigation, colors, type, controls, surfaces and shared site chrome reviewed.
- Responsive behavior is encoded from 320 px through wide screens; dedicated cross-browser/device QA remains a release-stage gate.

## Gate to Stage 2

Stage 2 can begin without additional material. It should establish locale routing, page-level JSON contracts, shared public layout/navigation and the first interior-page shell. Final editorial copy, Stripe credentials, analytics and the Home storyboard remain outside this gate.
