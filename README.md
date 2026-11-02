# Venera | ونرا

A Persian-first (RTL) fine-jewellery storefront with a working PostgreSQL backend and a
**demo-only** checkout. Designed as an editorial magazine rather than a template store:
ivory paper, plum ink, rose-gold hairlines, museum-plate photography, and deliberate
asymmetry.

> This is a demonstration project. No payment gateway is connected, no payment is taken,
> and the contact details are placeholders. Orders are stored in PostgreSQL with the status
> `DEMO_PLACED` («سفارش آزمایشی ثبت شد»).

- **Brand line:** «اکسسوری لوکس ونرا» / «بهترین قیمت و بیشترین تنوع»
- **Currency:** integer Toman, formatted with Persian digits (`Intl.NumberFormat('fa-IR')`)
- **Language:** Persian UI, `lang="fa" dir="rtl"`; Latin only for the logotype and folios

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js **16.4.3** (App Router, React Server Components, Turbopack) |
| UI | React **19.3.1**, TypeScript **5.9**, Tailwind CSS **4.3** + custom CSS tokens |
| Data | PostgreSQL 18, Prisma ORM **6.19** |
| Auth | First-party credential sessions: bcryptjs (cost 12) + signed JWT cookie (`jose`, HS256) |
| Validation | Zod **4.6** on the server for every mutation |
| Forms | React Hook Form + `@hookform/resolvers` for auth, address, contact |
| Icons | Lucide |
| Tests | Playwright **1.64** driving installed Microsoft Edge (`channel: 'msedge'`) |

Auth.js was evaluated and deliberately not used: v5 is still beta and its credentials +
Next 16 integration adds a moving part without improving security here. The custom session
implementation is documented below and keeps every check on the server.

---

## Quick start

Requirements: Node ≥ 20.9, PostgreSQL ≥ 14 (a local cluster or Neon).

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
#    edit DATABASE_URL and generate AUTH_SECRET:
#    openssl rand -base64 32

# 3. Create the schema
npx prisma migrate deploy        # applies prisma/migrations/*
npm run db:seed                  # idempotent: 4 categories, 22 products, demo users

# 4. Run
npm run dev                      # http://localhost:3000
```

The repository was built and verified against a workspace-local PostgreSQL 18 cluster
(`postgresql://venera@127.0.0.1:5433/venera`), which is **not** part of the repository.

### Demo accounts (seed only)

| Role | Email | Password |
| --- | --- | --- |
| Customer | `demo@venera.example` | `VeneraDemo!1404` |
| Admin | `admin@venera.example` | `VeneraAdmin!1404` |

These are read from `SEED_ADMIN_*` / `SEED_CUSTOMER_*`. The seed refuses to run without
them, and the login page labels the customer account as demo-only.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | `prisma generate && next build` |
| `npm start` | serve the production build |
| `npm run lint` | ESLint (flat config, Next core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:deploy` | apply committed migrations |
| `npm run db:seed` | idempotent seed |
| `npm run test:e2e` | Playwright suite (requires a running server on :3000) |

---

## Routes

| Route | What it does |
| --- | --- |
| `/` | Editorial homepage: 3D jewellery hero, category mosaic, best sellers (DB), discount row (DB), pinned 3D category story, FAQ |
| `/products` | Server-side catalogue: search, category, gender, price range, stock, discount, sort, pagination, mobile filter drawer, active chips |
| `/products/[slug]` | Gallery, variants with per-variant stock, quantity, add-to-cart, accordions, related products, JSON-LD, real 404 |
| `/cart` | Guest (localStorage) and authenticated (PostgreSQL) cart, live revalidation, totals |
| `/checkout` | Address selection, review, demo order placement (auth required) |
| `/order-success/[id]` | Owner-only confirmation with order number |
| `/login`, `/register` | Credential auth with merge of the guest cart |
| `/forgot-password`, `/reset-password` | Hashed, single-use password recovery (Resend email in production) |
| `/profile` | Summary, recent orders, default address |
| `/profile/addresses` | Create / edit / delete / set default |
| `/profile/orders`, `/profile/orders/[id]` | Own order history and details |
| `/about`, `/contact` | Editorial story; validated contact form persisted to PostgreSQL |
| `/admin` | Protected dashboard (products, categories, orders, customers, messages); role-gated in layout **and** every action |
| `/admin/products/new`, `/admin/products/[id]` | Create/edit products, upload JPEG/PNG/WebP images, manage variants |
| `/admin/orders/[id]` | Full order, customer, address and line-item view |
| `/admin/categories`, `/admin/customers` | Category editor and customer overview |

`not-found`, route-level `error`, scoped `loading` skeletons, empty states and breadcrumbs
are implemented. `/profile`, `/checkout`, `/admin`, `/cart`, `/order-success`, `/login`,
`/register` are `noindex`.

---

## Architecture

```
prisma/
  schema.prisma            PostgreSQL models, enums, indexes, check constraint
  migrations/…/migration.sql
  seed.ts                  idempotent seed (22 products, variants, demo users)
src/
  app/
    (v3)/                   v4 storefront layout (header/footer/cart provider) + all pages
    (admin)/admin/          v4 admin shell, requireAdmin in the layout
    layout.tsx              <html lang="fa" dir="rtl">, metadata, font preloads
    v3.css                  v4 tokens, components, motion, reduced-motion
  actions/                  server actions: auth, cart, checkout, addresses, contact, admin
  components/
    v3/                     storefront components (3D hero, catalog, cart, profile, auth)
    admin/                  admin components
    ui/                     shared dialog and field primitives
  lib/
    db.ts auth/ catalog.ts cart.ts pricing.ts validation.ts money.ts dates.ts …
  types/index.ts
e2e/                        Playwright specs + helpers
docs/                       screenshots and QA notes
```

Server Components fetch data directly; Client Components exist only for interaction
(drawers, menus, forms, cart state, product options). Money is never trusted from the client.

---

## Data and demo-order rules

- All prices are integers in **Toman**. `compareAtPrice` is enforced with a database CHECK
  constraint to be strictly greater than `price`, so discount percentages are computed from
  real numbers.
- The catalogue holds 22 products (5 necklaces, 6 bracelets, 6 earrings, 5 rings). All product
  photographs are the owner-supplied files from `incoming/`, converted to 1200×1500 JPEG.
  Active prices run from 580,000 to 2,450,000 Toman; five products carry a 30% or 40% discount
  and six are marked as best sellers. Prices and discount/best-seller flags are demo merchandising
  data and should be confirmed by the owner.
- Seeding is idempotent: products/categories are upserted by slug; images are recreated;
  variants are upserted and stale variants are removed; demo users are upserted.
- **Order placement** (`src/actions/checkout.ts`):
  1. authenticated user + owned address + Zod-validated idempotency key;
  2. serialisable PostgreSQL transaction;
  3. every product row (and variant row) is locked with `SELECT … FOR UPDATE` in a
     deterministic order;
  4. current price, active flag and stock are re-validated server-side;
  5. stock and variant stock are decremented once, inside the same transaction;
  6. `Order` + `OrderItem` snapshots (name, SKU, unit price, image, address JSON) are written;
  7. the cart is cleared;
  8. a unique `idempotencyKey` plus a unique `orderNumber` make double submits converge on a
     single order (both are re-checked inside the transaction).
- Order status starts at `DEMO_PLACED`; admins can move it to `PROCESSING`, `SHIPPED`,
  `DELIVERED` or `CANCELLED`. Cancelling does **not** restock — documented in the admin UI.
- Shipping is a configurable flat fee (`SHIPPING_FLAT_TOMAN`, default 45,000) and free above
  `FREE_SHIPPING_THRESHOLD_TOMAN` (default 5,000,000). It is calculated on the server.
- Every customer-facing total is recomputed from the database at checkout; the client only
  supplies identifiers and quantities.

### Cart

- Guests: a validated `localStorage` array of `{productId, variantId, quantity}`; the cart
  page resolves live prices/stock through a server action.
- Signed-in users: `Cart` / `CartItem` rows with a unique `(cartId, productId, variantKey)`
  constraint (`variantKey` avoids PostgreSQL's NULL-unique pitfall).
- On login/registration the guest cart is merged server-side, clamped to stock, and
  conflicts are reported as Persian notices.

---

## Auth & security notes

- Passwords: bcrypt cost 12, max 72 bytes, minimum 8 characters with a letter and a digit.
- Session: JWT (HS256, `jose`) in an `httpOnly`, `SameSite=Lax`, `Secure` (production)
  cookie, 7-day expiry, issuer/audience checked. `User.sessionVersion` invalidates old
  cookies after a security change.
- All queries that touch user data filter by `userId` from the verified session — never by
  client-supplied IDs.
- Every mutation is a Server Action, which Next.js origin-checks; no ad-hoc route handlers
  mutate data.
- Validation: Zod on the server for login, register, address, cart, checkout, contact,
  admin product/order/message updates.
- Abuse controls: in-process fixed-window rate limits for login (6 / 10 min / IP+email),
  registration (5 / hour / IP), orders (5 / 10 min / user+IP), contact (6 / 10 min / IP) plus a
  honeypot and a minimum fill time. **This limiter is per-instance**; a production deployment
  should move it to Redis/Upstash so limits apply across serverless instances.
- Admin routes call `requireAdmin()` in the layout and re-check the role inside every admin
  action. Public registration cannot choose a role.
- Security headers are set in `next.config.ts`, including a production CSP, HSTS,
  COOP/CORP and `frame-ancestors 'none'`. Uploaded images are checked by magic bytes,
  served with a fixed MIME type and `nosniff`.
- Password recovery tokens are random 32-byte values stored only as SHA-256 hashes,
  expire after 30 minutes, are single-use and invalidate existing sessions.
  `RESEND_API_KEY` and `EMAIL_FROM` enable delivery; without them the link is only
  written to the server log.

---

## Images and fonts

- All imagery is local under `public/images`; product photos are the 22 owner-supplied files from
  `incoming/`, converted to 1200×1500 JPEG. No runtime hotlinks.
- Admin image uploads are stored as `BYTEA` in `ProductImage.data` and served from
  `/api/product-images/[id]`, so they survive Vercel deployments and are included in
  database backups. Keep individual uploads under the server-action limit.
- Sources, authors and licences are recorded in [`docs/asset-manifest.md`](docs/asset-manifest.md).
  The majority are CC0 museum plates (The Met via Wikimedia Commons); three modern ring
  photographs and one torc are CC BY 2.0 and are credited there.
- Persian typography: Estedad (Persian + Latin) and Bodoni Moda (Latin display), self-hosted
  under `public/fonts/v3` (OFL), not fetched from Google at runtime. The legacy font files remain
  only for the old `(store)` error/not-found shell.

---

## Tests and visual QA

The Playwright suite (`e2e/store.spec.ts`) runs against the production server with Microsoft
Edge:

```bash
npm run build && npm start        # terminal 1
npm run test:e2e                  # terminal 2
```

It covers: catalogue counts for category/gender/discount/search/empty filters, guest cart →
registration merge → address creation → demo order → order history, contact persistence,
protected-route redirects, customer rejection from `/admin`, admin stock editing, contact
messages in admin, horizontal-overflow checks at **320/375/430/768/1024/1440/1920**, font
loading, RTL direction, broken images, tap-target sizes, grid column counts and hero CTA
placement. Screenshots are written to `docs/screenshots/`.

See [`docs/qa-report.md`](docs/qa-report.md) for the recorded run and
[`docs/screenshots`](docs/screenshots) for the captures.

---

## Deployment (Vercel + Neon)

1. Create a Neon project through the Vercel Marketplace and copy both connection strings.
2. Set environment variables in Vercel (Production + Preview):

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon **pooled** URL (`…-pooler…`, `sslmode=require&pgbouncer=true`) |
   | `DIRECT_URL` | Neon **direct** URL (used only for migrations) |
   | `AUTH_SECRET` | 32+ random bytes |
   | `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` |
   | `RESEND_API_KEY`, `EMAIL_FROM` | optional; required for real password-recovery email |
   | `SHIPPING_FLAT_TOMAN`, `FREE_SHIPPING_THRESHOLD_TOMAN` | integers |
   | `SEED_*` | only if you intend to seed the deployed database |

3. Build command: `prisma generate && next build` (the `build` script already does this).
4. Apply migrations **before** promoting the deployment, with the direct URL:
   `DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy`.
5. Seed once (optional, demo only): `DATABASE_URL="$DIRECT_URL" npm run db:seed`.
6. No filesystem writes are required at runtime; uploads are not part of this build.

The repository does not contain secrets; `.env` is git-ignored and `.env.example` documents
every key.

---

## Before launch checklist

The code is deployable, but these are product/business decisions, not code gaps:

- [ ] Replace the placeholder phone, email and address in `src/lib/constants.ts` (`demoContact`) and the About page.
- [ ] Replace demo seed credentials and never run the demo seed on the production database with the published passwords.
- [ ] Add the owner photographs for bracelets, earrings and rings; confirm the licence for every image in `docs/asset-manifest.md`.
- [ ] Decide whether checkout stays demo-only (`DEMO_PLACED`) or gets a real payment gateway; the current UI never claims a payment was taken.
- [ ] Add shipping, returns, privacy and terms pages; they are not part of the current routes.
- [ ] Move the in-process rate limiter to Redis/Upstash if the site runs on more than one serverless instance.
- [ ] Replace the current CSP `'unsafe-inline'` allowance with a nonce-based policy before handling high-risk accounts.
- [ ] Set `RESEND_API_KEY` and `EMAIL_FROM` if password-recovery email should actually be delivered.

## Known limitations

- No payment gateway, order cancellation restocking or automated marketing email. Password recovery exists but needs `RESEND_API_KEY` + `EMAIL_FROM` to deliver mail.
- Admin can create/edit products, upload images, manage variants and categories, and inspect orders/customers; bulk import and image reordering are not built.
- The rate limiter is in-process (see above).
- Imagery is archival/museum photography rather than a commissioned campaign; this is called
  out on the About page and in the asset manifest. The four necklace photographs and the necklace
  category image are owner-supplied and their licensing must be confirmed before deployment.
- The discount sort is resolved in application code over the filtered set because Prisma
  cannot order by a computed percentage; at this catalogue size it is negligible.
- Automated screenshots were captured, but this run had no image-capable model to *look* at
  them; layout quality was verified with computed browser checks (overflow, column count,
  tap targets, clipping, CTA position, font/image loading). See the QA report for exactly
  what was and was not inspected.
