# Build progress — honest status

Last updated: 2026-10-27 · build `next build` passing · Playwright 15/15 · tsc clean · eslint 0 errors

## Delivered

| Area | Status | Notes |
| --- | --- | --- |
| Design direction document | ✅ | `docs/design-direction.md` (tokens, page compositions, motion, image art direction) |
| Brand system | ✅ | Ivory/plum/rose-gold tokens, Vazirmatn + Markazi Text + Cormorant, fluid scale, folios |
| Local imagery | ✅ | 30 rendered files, 4.6 MB; four necklace photos, the necklace category image and the hero are owner-supplied and documented in `docs/asset-manifest.md` |
| Homepage | ✅ | Asymmetric hero, brand line, unequal category mosaic, best sellers from DB, photo-essay story, gender panels, discounted products from DB, craft notes, final CTA |
| Catalogue | ✅ | Server queries, search/category/gender/price/stock/discount, 5 sorts, pagination, URL state, mobile filter drawer, active chips, empty state |
| Product detail | ✅ | Gallery + thumbnails, variants with per-variant stock, quantity, add-to-cart, stock states, accordions, related products, JSON-LD, 404 |
| Cart | ✅ | Guest (localStorage, revalidated against server) and authenticated (PostgreSQL) cart, merge on login, notices, totals |
| Checkout | ✅ | Address selection, review, note, **demo order only**, server revalidation, serialisable transaction, row locks, idempotency |
| Order confirmation | ✅ | Owner-only, order number, snapshots, Persian date |
| Auth | ✅ | Register/login/logout, bcrypt 12, JWT httpOnly session, rate limits, password toggle, Persian errors |
| Profile | ✅ | Overview metrics, recent orders, default address, full order history and detail |
| Addresses | ✅ | Create/edit/delete/set default, Iranian mobile + postal-code normalisation, ownership checks |
| Contact | ✅ | Client/server validation, honeypot, rate limit, persistence, admin inbox, success state |
| Admin | ✅ | Separate protected shell; product price/compare/stock/flags; order status; contact status |
| Responsive | ✅ | Verified 320–1920 px with no horizontal overflow; mobile drawer/tabs/sticky buy bar |
| SEO | ✅ | Persian metadata, canonical, OG/Twitter, robots, sitemap, product + breadcrumb JSON-LD |
| Accessibility | ✅ | Semantic landmarks, labels, focus rings, native dialog focus/Escape, live regions, reduced motion, 44 px targets |
| Error/loading/empty states | ✅ | Branded 404 (root + store), route error boundary, scoped skeletons, empty cart/orders/filters |
| Tests | ✅ | `e2e/store.spec.ts`, 15 tests, screenshots at 375/1440 |
| Documentation | ✅ | README, design direction, asset manifest, QA report, this file |

## Deliberately not implemented (and why)

| Item | Status | Reason |
| --- | --- | --- |
| Payment gateway | ❌ by design | Brief forbids it; order model is prepared for a future gateway (status enum + snapshots) |
| Email delivery / password reset | ❌ | No mail credentials; contact and auth flows never claim an email was sent |
| Order cancellation restocking | ❌ | Documented demo rule: cancellation changes status only |
| Product create/delete in admin | ❌ | Brief scopes admin to modifying products/pricing/stock/flags; editing is implemented |
| Colour/finish variants | ⚠️ partial | Schema supports `COLOR`/`FINISH`; seed only defines sizes, so only sizes are exercised |
| Shared rate-limit store | ⚠️ | In-process limiter is correct for one demo instance; noted for Redis/Upstash |
| CSP | ❌ | Would require nonce middleware; security headers otherwise present |
| Lighthouse numbers | ❌ not run | No score is claimed anywhere |
| Vercel deployment | ❌ not performed | No account/credentials available; exact steps documented |
| Human visual review of screenshots | ⚠️ | Screenshots captured; this session's model cannot view images, so layout was verified by computed measurements |

## Verification snapshot

```
tsc --noEmit                 0 errors
eslint .                     0 errors, 2 warnings (React Compiler + React Hook Form)
next build                   success
playwright test              15 passed
horizontal overflow          7 widths × 7 routes — none
```

## Suggested next steps

1. Open `docs/screenshots` and review the two viewports; adjust crops/rhythm if the art direction
   needs a final human pass.
2. Replace archival plates with a commissioned shoot when available (same aspect ratios and paths,
   so no code changes are needed beyond the manifest).
3. Move rate limiting to Upstash Redis and add a CSP nonce middleware before public traffic.
4. Add password reset once transactional email is configured.
