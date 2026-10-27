# Venera — art direction & interaction specification

> This document is the contract for the implemented UI. Every token, composition and motion rule below is
> present in the codebase (`src/app/globals.css`, `src/components/**`). It was written before the page
> components, then updated to match what was built.
>
> **Revision (October 2026):** the small folio/eyebrow captions above page and section titles were removed
> at the owner’s request. The header now hides on scroll-down and returns on scroll-up, with an animated
> mega-menu and staggered mobile drawer; the footer was rebuilt compactly and the oversized wordmark was
> removed. Everything else below still applies.

## 1. Brand concept

Venera is a quiet atelier, not a storefront template. The site reads like a Persian literary magazine that
happens to sell jewellery: warm ivory paper, plum ink, rose-gold hairlines, generous margins, and photography
treated as museum plates. Two typographic voices carry the brand — a high-contrast Persian serif for display
lines (Markazi Text) and a calm Persian sans for everything functional (Vazirmatn) — with Cormorant Garamond
reserved for the Latin wordmark, folios and numerals in editorial labels. Nothing shouts; composition,
cropping and pacing do the work. The brand line is **«جزئیاتی که با تو می‌مانند»**.

## 2. Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F7F2EA` | page background |
| `--paper-soft` | `#FCF9F4` | raised surfaces, form fields |
| `--paper-deep` | `#EFE6D9` | alternating editorial bands |
| `--plum` | `#602D3B` | primary actions, brand accents |
| `--plum-ink` | `#3A1B24` | display type, dark bands |
| `--plum-deep` | `#2A1118` | footer / final CTA |
| `--charcoal` | `#242424` | body copy |
| `--ink-soft` | `#5B534E` | secondary copy (AA on paper) |
| `--gold` | `#B68A6E` | hairlines, folio rules, focus ring — never body text |
| `--gold-soft` | `#D8C0AE` | decorative rules on dark |
| `--blush` | `#E8DAD0` | image mats, hover fills |
| `--line` | `rgb(96 45 59 / 0.16)` | 1px hairline borders |
| `--line-dark` | `rgb(247 242 234 / 0.18)` | hairlines on dark |
| `--success` | `#3F6B4F` | persisted / in-stock feedback |
| `--error` | `#A23B2E` | validation, destructive |
| `--sale` | `#8A2F3F` | discount price / badge |

Only these tokens are used; no purple gradients, no glass, no glow, no coloured shadows. Shadows are limited
to a single soft, warm elevation for sticky summaries (`--shadow-card`).

## 3. Typography

- `--font-body`: Vazirmatn Variable (100–900), Persian + Latin, `font-feature-settings: "ss01"`.
- `--font-display`: Markazi Text (400–700) — headlines, pull quotes, prices are **not** display.
- `--font-latin`: Cormorant Garamond (300–700, italic) — wordmark, folios (`01`), Latin eyebrows.

Fluid scale (clamp, min @320 / max @1440):

| Step | Range | Use |
| --- | --- | --- |
| `--text-xs` | 11 → 12 px | folios, captions, legal |
| `--text-sm` | 13 → 14 px | labels, meta |
| `--text-base` | 15 → 17 px | body |
| `--text-lg` | 17 → 20 px | lead paragraphs |
| `--text-xl` | 22 → 28 px | card titles, h3 |
| `--text-2xl` | 28 → 40 px | section h2 |
| `--text-3xl` | 36 → 56 px | page titles |
| `--text-4xl` | 46 → 78 px | hero display |
| `--text-5xl` | 56 → 110 px | statement lines |

Persian line-height: 1.9 body, 1.35 display, 1.6 UI. Display text uses `text-wrap: balance` and explicit
`<br>` breaks at art-directed points. Latin labels are uppercase with `letter-spacing: .28em`. All prices and
counts are rendered with Persian digits through `Intl.NumberFormat("fa-IR")`; direction-sensitive values
(postal codes, phone numbers, order numbers) use `dir="ltr"` inline spans.

## 4. Layout, grid, surfaces

- Container: `max-width: 1360px`, fluid gutter `clamp(20px, 4vw, 64px)`.
- 12-column grid, `gap: clamp(16px, 2.2vw, 34px)`; editorial asymmetry is deliberate (7/5, 5/7, 8/4).
- Section rhythm: `padding-block: clamp(64px, 8.5vw, 132px)`; hairline separation instead of cards.
- Radii: 2px on media, 1px on controls, 0 on bands. No uniform oversized radii.
- Borders: 1px hairlines; images sit on `--blush` mats with 2px inner offset.
- Buttons: rectangular, `padding: 15px 30px`, letter-spacing on Persian labels kept at 0; primary = plum
  fill / paper text; ghost = hairline ink border; quiet = underline that grows from the right (RTL).
- Inputs: underline-only fields on `--paper-soft`; label above, 13px; focus moves the rule to plum and
  thickens to 1.5px. Errors replace the hint in `--error` with an alert icon, and keep layout height stable.
- Cards: no border, no shadow; a 1px bottom rule separates text from image; hover = second image cross-fade +
  1.03 scale over 750ms.

## 5. Page compositions

**Hero (desktop).** 12-column stage, minimum 86vh. Text occupies columns 1–6 (right in RTL), image columns
7–12 bleeding to the right edge of the viewport. A 1px gold inset frame is offset 18px inside the image, and a
rotated Latin caption (`VENERA — FINE JEWELLERY`) runs along its inner edge. Folio `۰۱ / کالکشن` top-right,
display line `«زیبایی، در جزئیات زندگی می‌کند.»` at `--text-4xl`, supporting copy at `--text-lg` with a max
of 48 characters per line, then two CTAs. A thin index strip at the bottom lists the four categories with
numerals. Mobile recomposes: portrait crop (4/5) on top with the plum text block overlapping its lower-left
corner by 24px, display line reduced to `--text-3xl`, CTAs in one row at ≥360px and stacked below that. The
jewellery focal point is protected by a `object-position` per-image override.

**Categories.** Four unequal panels: necklace 7 columns (3/4), bracelet 5 columns (4/5), earrings 5 columns
(4/5), ring 7 columns (3/4). Overlay typography is bottom-aligned, numerals top-left, and the hover state
lifts the image scale and reveals a «کشف» line. Below 768px: two stacked full-width panels and two half-width
panels, never a shrunken four-across grid.

**Best sellers / discounts.** Four-up product row on desktop (horizontal snap rail at ≤767px), heading with a
left-aligned folio and a right-aligned quiet link. Discount band uses a 5/7 split: a tall editorial image plus
a 2×2 product cluster.

**Brand story.** 5/7 split on `--paper-deep`: portrait image plate on the right, text on the left with a
pull quote in display type, a numbered list of three craft notes and a quiet link.

**Gender panels.** Two 50/50 full-height panels (زنانه / مردانه) with image and a bottom gradient scrim;
hover/focus slides the CTA up 8px. Mobile: stacked 4/5 panels.

**Catalog.** Editorial header + toolbar. Desktop: 3-column grid with a 3-column filter rail (sticky).
Mobile: 2-column grid ≥360px, filter drawer with chips, reset and live result count. Pagination is page links,
not infinite scroll.

**PDP.** 7/5 split: gallery left, sticky details right. Thumbnails are a vertical rail on desktop and a
scroll-snap strip on mobile. The add-to-cart block sits above accordions. Below 767px a fixed bottom bar holds
price + add-to-cart with safe-area padding.

**Auth.** 5/7 split: form on paper, full-bleed portrait image with a single quote on dark plum. On mobile the
image becomes a 240px banner above the form.

**Profile.** Sidebar (240px) on desktop with hairline dividers; on mobile a horizontally scrollable tab bar
with 44px targets. Summary uses a 2×2 metric grid, recent orders as an editorial list.

**Cart / checkout.** 7/5 split with a sticky summary card (the only elevated surface). Checkout adds a
three-step indicator and address cards; demo notice sits directly above the submit button.

## 6. Image art direction

- Product plates: 4/5, subject centred, warm neutral backdrop, consistent grade (slight warmth, lifted
  shadows, restrained saturation). Two images per product where the source allows: full plate + macro detail.
- Categories: 3/4 and 4/5 crops, negative space at the bottom for overlay type.
- Hero: one desktop 16/10 landscape and one mobile 4/5 portrait, different crops of the same campaign frame.
- Editorial: 3/2 and 4/5 plates for story, gender panels and the final CTA.
- Licensing: every downloaded photograph is recorded with author, licence and source in
  `docs/asset-manifest.md`. No competitor catalogue imagery, no hotlinks at runtime.

## 7. Motion language

Tokens: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-soft: cubic-bezier(.65,0,.35,1)`,
`--dur-ui: 160ms`, `--dur-panel: 280ms`, `--dur-reveal: 620ms`, `--dur-image: 900ms`.

| Element | Motion | Why |
| --- | --- | --- |
| Header | background/height shift 300ms after 24px scroll; slides away on scroll-down and returns on scroll-up (suppressed while a menu/dialog is open) | keeps context, gives content the screen back |
| Mega-menu | 240ms fade + 6px rise, thumbnails scale on hover | signals depth without noise |
| Mobile drawer | 280ms slide, links stagger at 45ms, body scroll locked | spatial clarity, editorial pacing |
| Nav links | gold hairline grows from the right (RTL) | one precise hover signal |
| Hero | 900ms staged opacity/translate (image, then 4 text groups at 90ms intervals) | editorial entrance |
| Section reveals | 18px rise + fade, 620ms, once, `IntersectionObserver` | pacing, never blocks input |
| Product image hover | cross-fade + 1.03 scale 900ms, ease-out | tactile browsing |
| Add to cart | button label swap 160ms, check icon, live-region announcement, badge pop | truthful feedback |
| Drawer / dialog | 280ms translate + scrim 200ms, focus trapped | spatial clarity |
| Filter chips | 160ms background/colour | immediate state |
| Footer links | hairline grows on hover, back-to-top arrow lifts 300ms | quiet motion at the end of the page |
| Reduced motion | all transforms removed, reveals start visible, transitions ≤1ms | accessibility |

No scroll hijacking, no perpetual marquees, no fake counters, no parallax on text.

## 8. Primitives vs custom sections

Primitives (`src/components/ui`): Button, IconButton, Field/Input/Textarea/Select, Checkbox, Chip, Badge,
Breadcrumbs, Dialog/Drawer, QuantityStepper, Accordion, Reveal, EmptyState, PageHeader, Pagination, Toaster.
Custom sections: Hero, CategoryMosaic, EditorialSplit, StoryBand, GenderPanels, SaleEditorial, FinalCTA,
ProductGallery, FilterPanel, CartSummary, AddressCard, OrderTimeline, AdminTable.

## 9. Responsive acceptance

Breakpoints inspected: 320, 375, 430, 768, 1024, 1440, 1920. At 320px: header row fits (logo, cart, menu),
prices never clip, checkout summary stacks, no horizontal overflow anywhere. Hover-only actions always have a
visible touch equivalent. Drawers are side sheets below 768px and centred dialogs above. Persian typography is
never letter-spaced; Latin labels keep tracking.
