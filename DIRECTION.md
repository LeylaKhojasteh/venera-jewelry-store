# DIRECTION — Venera v3

**Brief (self-authored from the owner's instruction).** A storefront for Venera, a Tehran
accessories atelier selling steel necklaces, bracelets, earrings and rings. The visitor should
understand in ten seconds: this is a small, contemporary accessories collection, made of 316 steel,
and they can browse it now. The one action: open the collection. The owner asked for a completely new
visual taste, no product photo as the hero, real motion inside the visual, a light theme using the
previous brand palette, and the header/footer hover motion carried over from the old build.

## The category default being refused

The old site (and almost every jewellery site) is *The Paper Edition*: warm ivory ground, a Persian
serif headline, plum and rose-gold, a photograph of a necklace beside the type, hairlines between
sections. It is tasteful and completely interchangeable. Venera v3 refuses it: no ivory, no serif
display, no product photo in the hero, no hairline dividers, no card grid.

## Concept

**Venera is a night vitrine: the collection is drawn in one continuous line, and the line answers
your hand.** The first screen is a dark room with a single steel line hanging in it; the line draws
itself, the beads settle, and when you move the pointer the whole chain tilts and the pendant
swings. The jewellery is shown as a drawing before it is shown as a photograph — which is honest,
because these are line-shaped objects.

Three explorations considered:

1. *Night vitrine* (chosen) — dark field, bone line art, copper bead, Persian grotesque.
2. *Steel counter* — bone-grey light field, industrial expanded type, product photos enormous;
   rejected: it moves toward the same museum/counter language the old site already had.
3. *Velvet stage* — oxblood colour field with a serif display and kinetic type; rejected: it
   replaces one luxury cliché (ivory) with another (velvet and serif).

## Tokens

| Role | Value |
| --- | --- |
| Ground | `#0B0A0C` |
| Raised ground | `#141216` |
| Line / hairline | `rgba(237,230,216,.16)` |
| Ink (primary text) | `#EDE6D8` |
| Muted text | `#A79E90` (contrast 8.6:1 on ground) |
| Accent (one job: the pendant bead, focus, active state) | `#C4714C` |
| Type — Persian | **Estedad** 400 body / 800 display |
| Type — Latin logotype and numerals | **Bodoni Moda** 500 |

Two grounds, one geometry. **Light** is the default: the brand's ivory/plum/rose-gold palette —
paper `#F7F2EA`, raised `#EFE6D9`, ink `#3A1B24`, muted `#5A4740`, accent `#A25E4A`. **Night** is the
optional dark ground (ground `#0B0A0C`, bone `#EDE6D8`, copper `#C4714C`). Type, grid, line art and
motion are identical in both. The header toggle stores the choice in `localStorage`; an inline boot
script applies the saved dark theme before first paint, so there is no flash.

Scale: 13 / 16 / 20 / 32–44 / 56–110. Radius: 0 everywhere (the objects are sharp; only the bead is
round). Grid: 12 columns, 1440 max, 5vw margins. Spacing: 8px base, sections 7–10rem.

## Richness and grammar

Richness source: **self-drawing line art with real pointer and scroll response**, plus the product
photography used as plates in the rail — never as a hero backdrop. The visitor's questions decide
the sections:

1. What is this? → hero: the line, the name, one sentence, one action.
2. What do you sell? → accessories rail: one necklace, one bracelet, one pair of earrings, one ring,
   each with steel and price.
3. How will it sit on me? → necklace length guide: 40 / 45 / 50 cm on a drawn neckline (other sizes
   live on each product page).
4. What is it made of? → one materials statement, set as a sentence.
5. Which one? → the full index: name, category and price, no cards.
6. How do I reach you? → close with the atelier's contact and the footer.

Five to six sections; no features, no testimonials, no FAQ, no logo strip.

## Signature

**The chain draw.** On load the necklace path draws from the clasp down and back up (1.8s, ease-out),
beads arrive 60ms apart on springs, the pendant settles with a damped swing. Pointer movement tilts
the whole drawing ±7° through springs; scroll lifts it 40px. The pendant keeps swinging at 7s when
idle. Reduced motion: the path is fully drawn at first paint, no beads pop, no swing, pointer tilt is
disabled. Content is visible without JavaScript.

**The 3D stage (v5).** The hero is now a real-time Three.js scene: a torus-link chain with an extruded
crescent pendant, a double bangle, pearl-drop earrings and a pearl ring, all in brushed steel with
white pearls. Custom light-formers build the reflection map without downloading an HDRI; a contact
shadow grounds the set.
The group follows the pointer on damped springs, with a slow idle sway. It is lazy-loaded after a
WebGL capability check: a neutral plate holds the space while the scene arrives (never the old line
animation), then the group scales in over 0.9s. WebGL-less browsers get a static line drawing, and
reduced motion gets a still frame. Framing is computed for the 3.5:1 to 1:1 hero aspect range, so all
four pieces stay inside the canvas from 320px to 1920px.

**Carried over from the old build.** Header links grow a copper rule from the right on hover/focus
(300ms, scaleX 0→1); the logotype opens its tracking from .30em to .38em; footer links grow a 12px
copper rule before the label and warm to the accent. All three are CSS-only and respect reduced
motion.

## v4 — the motion layer

Six additions, all on the same geometry:

1. **Cinematic menu** — the panel opens as a circular curtain from the menu button, five links rise
   in sequence, hovering dims the others, and a category photograph previews on the right. Focus is
   trapped, Escape closes, focus returns.
2. **Magnetic CTA + theme wipe** — the primary action drifts after a fine pointer on a spring; the
   theme toggle uses the View Transitions API to reveal the new ground as a circle from the button
   (instant fallback, reduced-motion respected).
3. **Quick view** — a product card morphs into a dialog with image, description, sizes, price and
   add-to-cart, so the old product page is no longer the only way in.
4. **Cart drawer** — the header bag opens a slide-over with lines, quantity steppers, subtotal,
   shipping and checkout; adding from quick view opens it.
5. **Category story** — a 2.4-screen pinned section where the line drawing changes from necklace to
   bracelet, earring and ring, with the matching piece and price beside it. Below 900px it becomes a
   plain four-row list.
6. **Scroll progress + image settle** — a 2px copper progress rule, and images settle from a slight
   scale as they enter; both CSS-only.

The sources for these patterns were AIMRAN's editorial menu, magnetic button and expanding card,
useLayouts' theme toggle and scroll-stack patterns, and Watermelon's block catalogue. The glass,
gradient-border and gooey variants were deliberately not used.

**Migrated pages (v4).** The catalogue, product page, checkout, cart, order-success page, the account
panel (overview, orders, order detail, addresses), the auth pages and about/contact now live in the
`(v3)` route group and use the same header, footer, type, grid and motion: filters on the server, a
product grid that opens quick view, a gallery and buybox with variants and quantity, the fit diagram,
the details accordion, related pieces, a checkout with address cards, a cart with quantity controls
and suggestions, an account panel with a v4 sidebar and order rows, and a product mega-menu that opens
under its nav item (hover, click, and a mobile accordion). The homepage also restores the best-seller
and discounted rows, in the same grid. The admin panel now shares the same v4 shell, including its theme
toggle and product, order and message screens.

## Voice

Plain, specific, quiet. No "elevate", no "timeless", no two-beat aphorism. Prices in Toman. Product
names stay Persian; the logotype stays Latin.
