# JAMALI جمالي — storefront redesign

A headless, animation-first storefront for [jamalilb.com](https://jamalilb.com), running on the store's **live Shopify catalog**.

**Stack:** React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · Motion (scroll & layout animation) · Lenis (smooth scroll) · Zustand (cart / wishlist) · React Router 7 · Lucide icons

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run sync       # re-pull products, prices, variants & collections from jamalilb.com
```

## How it connects to Shopify (no API token needed)

| Piece | How |
| --- | --- |
| Catalog | `scripts/sync-catalog.mjs` reads the store's public `/products.json` and `/collections/*/products.json`, derives brand + category, and writes `src/data/catalog.json`. Run `npm run sync` (or in CI before `build`) whenever products change. |
| Images | Served from the store's own `/cdn/shop/...` with Shopify's `width=` resizing. |
| Checkout | Shopify **cart permalinks** (`/cart/{variantId}:{qty},…`) — the bag hands off to the real Shopify checkout with the selected variants. |
| Newsletter | Posts to Shopify's native customer form, so sign-ups land in Shopify → Customers tagged `newsletter`. |

## What's in it

- **Home:** brand intro curtain, parallax hero with floating products, velocity-reactive brand marquee, scroll-lit manifesto, tabbed product edit, pinned horizontal "Shop by mood" scroller, interactive **Blush lab** shade finder, Huda Beauty sticky spotlight, Sol de Janeiro clip-reveal banner, draggable reels rail, perks, real customer reviews, seasonal Pink October band (auto-shows in October), newsletter.
- **Shop / collections:** URL-driven filters (category, brand, stock), sorting, animated re-layout, mobile filter sheet.
- **Product page:** variant swatches with variant images, gallery, qty, add to bag, buy-now straight to checkout, sticky add-to-bag bar, related products.
- **Global:** mega menu, ⌘K instant search, slide-out bag with free-delivery progress and upsells, persisted cart + wishlist, `prefers-reduced-motion` respected.

## Tuning

- Blush lab picks: `src/sections/FlushFinder.tsx` (`MOODS` → variant ids).
- Brand/category rules: `BRANDS` / `CATEGORIES` in `scripts/sync-catalog.mjs`.
- Copy for collections: `COLLECTIONS` in `src/lib/catalog.ts`.

## Deploy

Static SPA — deploy `dist/` to Vercel (`vercel.json`) or Netlify (`public/_redirects`). Point a subdomain or the root domain at it; checkout stays on Shopify.
