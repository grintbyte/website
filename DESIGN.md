# GrintByte Design Direction

Transcribed from the project owner's brief (2026-10-11). The owner is the author
of this direction; this file records it so every future UI change starts here.

## Identity

- **Brand**: GrintByte, "Digital Products Studio".
- **Feel**: modern SaaS / app studio. Clean, generous whitespace, confident
  typography, product icons prominent. Content-structure reference: yithemes.com
  (catalog cards, clear categories, complete product detail pages). Visual
  reference: fasterapps.com.
- **Dial**: ENERGY 2 / RHYTHM 2 / MOTION 2.
  - ENERGY 2: Stripe/Vercel-level confidence, not an agency showpiece.
  - RHYTHM 2: consistent section grid with one deliberate break per page
    (e.g. the numbered solutions list between two card grids on Home).
  - MOTION 2 (raised from 1 on 2026-10-12, owner supplied animated-hero
    mockups): entrance reveals, gentle float/orbit in the hero, hover states.
    All motion is disabled under prefers-reduced-motion. No parallax/pinning.

## Palette (sampled from the logo files)

| Token | Value | Source |
|---|---|---|
| brand-light | `#4a56d8` | lightest stripe of the logo sphere |
| brand | `#2e39b1` | fill of `grintbyte-thumb.svg`, the "GRINT" blue |
| brand-deep | `#1d2688` | fill of `grintbyte_logotext2.svg` (navy) |
| ink | `#2d2d2d` | "BYTE" dark grey |
| paper / paper-dim | `#ffffff` / `#f7f8fc` | backgrounds |

Core palette is 3 blues + ink; neutrals don't count. The blue→navy **gradient**
(mirroring the logo sphere) is the single deliberate accent: primary CTAs, one
hero accent word, the closing CTA band. Nowhere else.

## Identity motif

The diagonal stripes of the logo sphere, reproduced as a subtle repeating
linear-gradient (`.stripe-motif`) in the hero and the closing band.

## Typography

- **Headings**: Plus Jakarta Sans (600–800). Chosen because its geometric,
  slightly rounded letterforms echo the wordmark's custom letters.
- **Body**: Inter (400–600). Chosen for screen readability at 16px, the minimum
  body size on this site.
- Loaded from Google Fonts with system-ui fallbacks.

## Theme

Light, fixed. The palette and logo are drawn for white backgrounds; there is no
brand reason for a dark mode, and an untested toggle is worse than none.

## Brand assets

- `public/images/brand/grintbyte-logo.png` — header logo (light backgrounds).
- `public/images/brand/grintbyte-logo-padded.png` — default OG image.
- `public/images/brand/grintbyte-thumb-sm.png` — sphere mark (hero visual).
- **Missing**: a white wordmark for dark backgrounds. Both SVGs in the repo are
  raster-embedded, so they cannot be recolored with CSS. Until a real white
  logo file is supplied, dark sections use plain text and the footer stays light.
