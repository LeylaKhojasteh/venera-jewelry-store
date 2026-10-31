# DIRECTION — Venera v3

**Brief (self-authored from the owner's instruction).** A storefront for Venera, a Tehran
accessories atelier selling steel jewellery. The visitor should understand in ten seconds: this
is a small, contemporary collection, made of 316 steel, and they can browse four necklaces now.
The one action: open the collection. The owner asked for a completely new visual taste, no product
photo as the hero, and real motion inside the visual — not decoration around it.

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

Scale: 13 / 16 / 20 / 32–44 / 56–110. Radius: 0 everywhere (the objects are sharp; only the bead is
round). Grid: 12 columns, 1440 max, 5vw margins. Spacing: 8px base, sections 7–10rem.

## Richness and grammar

Richness source: **self-drawing line art with real pointer and scroll response**, plus the product
photography used as plates in the rail — never as a hero backdrop. The visitor's questions decide
the sections:

1. What is this? → hero: the line, the name, one sentence, one action.
2. What do you sell? → four-piece rail: name, steel, price.
3. How will it sit on me? → length guide: 40 / 45 / 50 cm on a drawn neckline.
4. What is it made of? → one materials statement, set as a sentence.
5. Which one? → index: four rows, name and price, no cards.
6. How do I reach you? → close with the atelier's contact and the footer.

Five to six sections; no features, no testimonials, no FAQ, no logo strip.

## Signature

**The chain draw.** On load the necklace path draws from the clasp down and back up (1.8s, ease-out),
beads arrive 60ms apart on springs, the pendant settles with a damped swing. Pointer movement tilts
the whole drawing ±7° through springs; scroll lifts it 40px. The pendant keeps swinging at 7s when
idle. Reduced motion: the path is fully drawn at first paint, no beads pop, no swing, pointer tilt is
disabled. Content is visible without JavaScript.

## Voice

Plain, specific, quiet. No "elevate", no "timeless", no two-beat aphorism. Prices in Toman. Product
names stay Persian; the logotype stays Latin.
