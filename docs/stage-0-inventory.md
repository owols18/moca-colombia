# Stage 0 - source inventory

Inventory date: 2026-09-25

Source root: `C:\Y-CARPETA DE DATOS\5-Moca Office\Fundacion\Moca-Colombia`

The source root was inspected read-only. No original file was renamed, moved, edited or deleted.

## Executive result

The material is sufficient to start the Design System and all interior pages. It includes a packaged Illustrator document, high-resolution masters, organized web exports, vector assets, licensed fonts and an English content draft.

The current Illustrator document contains 10 interior-page artboards at 1920 px wide. The Home is not included and will require a separate narrative, storyboard and asset plan before the final scrollytelling implementation.

## Source totals

| Type | Count | Approximate size |
|---|---:|---:|
| PNG | 73 | 269.24 MB |
| JPG | 42 | 34.10 MB |
| TTF | 20 | 2.13 MB |
| TXT | 6 | 0.05 MB |
| SVG | 3 | 0.02 MB |
| AI | 2 | 241.10 MB |
| ZIP | 1 | 148.31 MB |
| Total | 147 | 0.679 GB |

## Illustrator package

- Primary packaged document: `Moca-Colombia-design-1920_Carpeta/Moca-Colombia-design-1920.ai`.
- Adobe Illustrator 30.8, RGB, sRGB IEC61966-2.1.
- PDF-compatible document with 10 artboards.
- Every artboard is 1920 px wide.
- Artboard heights: 4831.93, 4239.53, 6245.08, 6216.18, 6245.08, 6245.08, 4069.36, 5177.54, 4568 and 3307.74 px.
- Package report shows no missing fonts or missing linked images.
- The packaged AI is the preferred design source. The unpackaged AI is retained only as a historical/source copy.

## Images

The image library has three layers:

1. `Fotografias/Fotografias-originales`: 40 master images.
2. Organized page folders under `Fotografias`: 40 design/web exports.
3. `Diseno-Illustrator/.../Links`: 35 packaged duplicates of linked exports.

Implementation rule: create web derivatives from the 40 masters whenever a master exists. Do not copy the Illustrator `Links` directory into the web project.

### Resolution assessment

- Most hero masters are suitable for 2560 px layouts: several are 4500-6817 px wide.
- Project-detail and editorial masters generally range from 2394 to 4917 px wide.
- Six board portraits have 1650 x 2850 masters and are suitable for responsive cards.
- Georgina Israel currently has only a 550 x 950 source.
- The Partner image master is only 1145 x 417, while its design export is 1920 x 700 and therefore appears to have been upscaled.
- The Our Mission hero master is 1920 x 1081 and has no larger alternative in the supplied folder.
- The shared donation CTA is 1740 x 675, but it can remain sharp if displayed inside a capped content container rather than stretched to the full 2560 px viewport.

### Processing plan

- Preserve masters outside the deployed application.
- Generate AVIF and WebP derivatives from masters.
- Keep SVG for logo and icons.
- Define crop focal points per breakpoint.
- Do not publish duplicate Illustrator-linked exports.
- Avoid transparent PNG for photographic assets when transparency is not required.

## Vector assets

| Asset | ViewBox | Intended use |
|---|---|---|
| `moca-colombia-logo.svg` | 264 x 102 | Header and footer logo |
| `icono-cocoa.svg` | 427.43 x 397.76 | Cacao/Mocacao iconography |
| `teams-cards-background.svg` | 676 x 1014 | Board-member card background |

The SVGs must be cleaned and checked for responsive fill behavior before use, but their source format is correct for the web.

## Fonts

- Comfortaa variable font plus Light, Regular, Medium, SemiBold and Bold static files.
- Manrope variable font plus ExtraLight through ExtraBold static files.
- OFL license files are included for both families.
- Illustrator uses Comfortaa Light/Medium/Bold and Manrope ExtraLight/Light/SemiBold.

Implementation rule: use variable web-font subsets in WOFF2 where practical and retain the OFL notices in project documentation.

## English content coverage

The supplied text covers:

- Our Mission.
- La Argentina.
- Mocacao.
- Nutrition.
- Academic Support.
- Medical Care.
- Impact.
- About Us and seven board biographies.
- Get Involved.
- Contact Us.

### Content gaps

- No Home/scrollytelling copy or scene narrative.
- No dedicated donation-page legal/content specification beyond the Get Involved donation block.
- Impact has explanatory copy but no approved numeric key figures.
- Impact lacks the detailed Project Progress content shown in the earlier sitemap/design.
- Contact-form labels, required-field rules, consent language and success/error messages are not in the text file.
- SEO titles, descriptions, social copy and alt text are absent.
- Spanish content is absent and will be drafted provisionally.
- The `Legal` directory is empty.

### Editorial issues to resolve

- `ts geographic isolation` is missing the initial `I`.
- `buildlasting Change` requires spacing and capitalization correction.
- `Antoquia` should be reviewed; the likely intended spelling is `Antioquia`.
- The Mocacao text duplicates the 95% fine/flavor cacao claim and contains a missing space before that sentence.
- Several statistical and institutional claims require source, publication date and content-owner approval before release.
- English punctuation, hyphenation and heading capitalization require a final editorial pass.

## Duplicate policy

The Illustrator package duplicates 35 organized exports and six font files. The shared donation CTA exists in three byte-identical locations. These duplicates are expected packaging artifacts and will not be imported multiple times.

The generated `source-inventory.csv` records SHA-256 hashes so future imports can detect duplicate files reliably.

## Page readiness

| Page | Design | Images | English copy | Ready for build |
|---|---|---|---|---|
| Our Mission | Complete | Complete | Complete, editorial review pending | Yes |
| La Argentina | Complete | Complete | Complete, editorial review pending | Yes |
| Mocacao | Complete | Complete | Complete, fact review pending | Yes |
| Nutrition | Complete | Complete | Complete, fact review pending | Yes |
| Academic Support | Complete | Complete | Complete, fact review pending | Yes |
| Medical Care | Complete | Complete | Complete, fact review pending | Yes |
| Impact | Complete | Complete | Incomplete metrics/progress | Partial |
| About Us | Complete | Complete; one low-resolution portrait | Complete, approval pending | Yes |
| Get Involved | Complete | Complete; Partner source is limited | Complete | Yes |
| Contact Us | Complete | Complete | Form microcopy incomplete | Partial |
| Donate | Existing-site reference only | Reusable imagery | Legal/payment copy incomplete | Partial |
| Home | Not in current AI package | Not assigned | Missing | No; intentionally final |

## Gate to Stage 1

Stage 1 can start with the information available. The Design System will use the supplied colors, typography, 1920 px artboards, SVG assets and recurring patterns. Missing Home, legal, analytics and Stripe material does not block that work.

