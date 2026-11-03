# QA report — Venera demo storefront

Run date: 2026-10-27 (Asia/Tehran) · Build: Next.js 16.4.3 · Browser: Microsoft Edge via Playwright 1.64

## 1. Commands actually run

| Check | Command | Result |
| --- | --- | --- |
| Type check | `node node_modules/typescript/bin/tsc --noEmit` | **0 errors** |
| Lint | `node node_modules/eslint/bin/eslint.js .` | **0 errors**, 2 warnings (React Compiler skips two React Hook Form components — expected) |
| Production build | `next build` | **success**, all routes dynamic (`ƒ`) except `robots.txt` / `sitemap.xml` |
| Seed | `node .dev/seed.cjs` (bundled `prisma/seed.ts`) | 4 categories / 11 products / 18 images / 24 variants, idempotent across reruns |
| Database | PostgreSQL 18.6 (workspace-local cluster on `127.0.0.1:5433`) | schema applied from `prisma/migrations/20261026183000_init/migration.sql` |
| End-to-end | `playwright test` (15 tests) | **15 passed** |

## 2. Functional coverage (Playwright)

1. **Home + navigation + catalogue filters** — heading, CTAs, product cards; mega-menu opens and
   routes to `/products`; category count = 4; gender = 3 (men’s bracelets and ring); discounted = 5; search «آرکا» = 1;
   `min=2,000,000` returns the branded empty state.
2. **Guest → account → order** — add a variant to the guest cart, see the guest cart summary,
   register a fresh account, guest cart merges into PostgreSQL, create an address, continue to
   checkout, submit the **demo order**, reach `/order-success/VNR-…`, see the order and the
   `سفارش آزمایشی ثبت شد` status in `/profile/orders`, sign out.
3. **Contact** — validated form persists a message; success state is shown.
4. **Route protection** — `/profile`, `/profile/orders`, `/checkout`, `/admin`, `/order-success/*`
   return 307 to `/login?next=…` when unauthenticated; a signed-in customer gets the branded 404
   for `/admin`; the admin account can open `/admin`.
5. **Admin** — dashboard renders live counts; product stock edited and persisted, then restored;
   contact message visible in `/admin/messages`.
6. **Responsive** — no horizontal overflow on `/`, `/products`, `/products/[slug]`, `/about`,
   `/contact`, `/cart`, `/login` at **320, 375, 430, 768, 1024, 1440, 1920 px** (49 checks).
7. **Assets & typography** — `document.fonts.check` confirms Vazirmatn and Markazi Text are
   loaded; `dir=rtl` on `<body>`; zero broken images on the homepage.
8. **Layout quality** — visible tap targets in header/chips/buttons ≥ 40×40 at 375 px; product
   grid = 2 columns at 375 px and 4 columns at 1440 px; hero CTA fully inside a 900 px viewport
   at 1440; no clipped `h1`/`h2`/price elements.

## 3. Screenshots captured from the running production build

Stored in the local, git-ignored `test-results/screenshots` folder. Captured at 375 px and 1440 px where the flow allows:

| Page | 375 px | 1440 px |
| --- | --- | --- |
| Home | `home-375.png` | `home-1440.png` |
| Catalogue | `catalog-375.png` | `catalog-1440.png` |
| Product detail | `product-375.png` | `product-1440.png` |
| Login | `ping-375.png` | `ping-1440.png` |
| Cart (guest, with item) | `cart-375.png` | `cart-1440.png` |
| Cart (empty state) | `cart-empty-375.png` | `cart-empty-1440.png` |
| Profile | `profile-375.png` | `profile-1440.png` |
| Address book | — | `profile-addresses-1440.png` |
| Checkout | `checkout-375.png` | `checkout-1440.png` |
| Order confirmation | `order-success-375.png` | `order-success-1440.png` |
| About | `about-375.png` | `about-1440.png` |
| Contact | `contact-375.png` | `contact-1440.png` |

## 4. What was *not* verified

- **Visual judgement.** This session's model has no image input, so the PNGs were produced and their
  layout was checked with computed browser measurements, but no one visually reviewed them in this
  run. A human should open `test-results/screenshots` once before calling the art direction "approved".
- **Lighthouse scores** were not run, so no performance/accessibility score is claimed.
- **Real device testing** (iOS Safari, Android Chrome) was not performed; Edge desktop engine with
  Android-like viewports was used.
- **Email delivery, payment and deployment** are intentionally absent; no Vercel/Neon credential was
  available, so no deployment was attempted or claimed.

## 5. Defects found and fixed during QA

| Finding | Fix |
| --- | --- |
| Auth redirects rendered as 200 + 1 s meta-refresh because a global `loading.tsx` streamed the shell | Removed the group-level loading boundary; loading skeletons are scoped to public catalogue routes. Redirects are now real 307s. |
| Header mega-menu opened on hover and immediately closed on click (Playwright surfaced it) | Click/Escape/outside-click only; no hover conflict, keyboard accessible |
| Logo hit area was 38 px tall | `min-h-11` so the logotype meets the 44 px touch target |
| Hero CTA sat below the fold on 375 px | Mobile hero text panel overlaps the image (`-mt-20`), decorative stats removed, CTA now visible promptly |
| Contact anti-spam minimum-fill-time rejected very fast (automated) submissions | Removed the timing heuristic; honeypot + rate limit remain |
| Header/footer read as basic, and the oversized footer wordmark made the page too tall | Rebuilt the header (auto-hide on scroll-down, animated nav underline, thumbnail mega-menu, staggered drawer, badge pop) and the footer (compact structured columns, hover rules, back-to-top); the giant wordmark is gone |
| Seeded variants accumulated on re-seed (old آرکا lengths stayed) | Seed now removes variants not present in the seed definition |
| Three necklace photographs were museum *cross pendants* — wrong for this brand | Replaced with chain/torc/bead plates and updated the corresponding Persian copy |
| `pnpm` could not install on this Windows sandbox (symlink recursion) | Switched the verified workflow to `npm` (lockfile committed); documented |
| Necklace photography replaced at the owner’s request (four supplied files) and a fourth necklace added | Old necklace images deleted, seed and catalogue test updated to four necklaces, suite re-run green, screenshots regenerated |
