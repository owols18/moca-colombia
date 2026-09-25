# Decision log

## Confirmed

| ID | Decision | Status |
|---|---|---|
| D-001 | Projects is a navigation group that links directly to the four project pages; there is no standalone projects landing page in phase 1. | Confirmed |
| D-002 | English is the fallback locale. A saved user choice has priority over GeoIP and browser-language detection. | Confirmed |
| D-003 | Each page and locale will have its own JSON content file. | Confirmed |
| D-004 | Stripe donations use USD only in phase 1. | Confirmed |
| D-005 | Contact submissions use `fabian.andres82@gmail.com` as the temporary recipient, supplied through an environment variable. | Confirmed |
| D-006 | Google Analytics is deferred to phase 2. | Confirmed |
| D-007 | Privacy-policy publication is deferred, so analytics remains disabled during phase 1 previews. | Confirmed |
| D-008 | GoDaddy is assumed to support the planned Next.js runtime until the exact hosting plan can be verified. | Provisional |
| D-009 | The Home is the last page to be designed and developed, as a scrollytelling experience. | Confirmed |
| D-010 | The primary Codex agent owns architecture, Design System, integration and the Home. Subagents require explicit authorization and only receive bounded work. | Confirmed |
| D-011 | Stage 1 uses Next.js App Router, TypeScript, CSS Modules and self-hosted variable Comfortaa/Manrope fonts. | Confirmed |
| D-012 | The layout is fluid from 320 px, uses full-bleed sections, and caps content at 1760 px for 2560 px screens. | Confirmed |
| D-013 | Gold `#C59B50` is a supporting accent inferred from the approved Illustrator rules and borders; it is not a primary brand surface. | Provisional |
| D-014 | The `/design-system` route is a no-index development reference and is not part of the public sitemap. | Confirmed |
| D-015 | CTAs use Manrope Light at 20 px in uppercase, 24/14 px padding, a 130 x 50 px adaptive minimum, and the approved primary/secondary interaction colors. | Confirmed |
| D-016 | The public header is transparent, positioned over each hero and kept above imagery with `z-index: 100`; only the open navigation receives a solid surface. | Confirmed |
| D-017 | Public URLs use stable English slugs below `/en` and `/es`. Locale priority is saved choice, country, browser language, then English fallback. | Confirmed |

## Pending before production

- Exact GoDaddy hosting plan and supported Node.js runtime.
- Stripe test/live secrets and webhook configuration.
- Production sender for contact email.
- Google Analytics measurement ID.
- Privacy and cookie policy.
- Final Spanish translation and bilingual editorial approval.
- Written confirmation of image usage rights, especially for minors and medical contexts.
