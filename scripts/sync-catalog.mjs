// Pulls the live Shopify catalog from jamalilb.com (public /products.json endpoints,
// no API token needed) and writes a normalized snapshot to src/data/catalog.json.
//
//   npm run sync
//
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const STORE = process.env.SHOPIFY_STORE ?? 'https://jamalilb.com'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/catalog.json')

const COLLECTIONS = [
  'best-seller',
  'new-arrivals',
  'sale-collection',
  'limited-beauty',
  'makeup',
  'skin-care',
  'huda-beauty-collection',
  'sol-de-janeiro',
  'sheglam',
  'dali',
  'ruby-beauty',
  'sephora-favorites-kits',
]

const BRANDS = [
  [/sephora/i, 'Sephora Favorites'],
  [/la roche/i, 'La Roche-Posay'],
  [/nars/i, 'NARS'],
  [/glow recipe/i, 'Glow Recipe'],
  [/kiko/i, 'KIKO Milano'],
  [/makeup by mario/i, 'Makeup by Mario'],
  [/dior/i, 'Dior'],
  [/rare beauty/i, 'Rare Beauty'],
  [/huda|easy bake/i, 'Huda Beauty'],
  [/summer fridays/i, 'Summer Fridays'],
  [/tlm/i, 'TLM'],
  [/labello/i, 'Labello'],
  [/rhode/i, 'Rhode'],
  [/shiseido/i, 'Shiseido'],
  [/mavala/i, 'Mavala'],
  [/vaseline/i, 'Vaseline'],
  [/maybelline/i, 'Maybelline'],
  [/laneige/i, 'Laneige'],
  [/essence/i, 'Essence'],
  [/ruby beauty/i, 'Ruby Beauty'],
  [/medicube/i, 'Medicube'],
  [/sol de janeiro|rio radiance/i, 'Sol de Janeiro'],
  [/dali/i, 'Dali'],
  [/sheglam|hot goss|matte fresh|hydra jelly|plump addict/i, 'SHEGLAM'],
]

// First match wins, so the more specific rules come first.
const CATEGORIES = [
  [/kit|set\b|value|minis/i, 'Sets & Gifts'],
  [/mist|perfume|body oil|gel oil|tan lines|fragrance/i, 'Body & Fragrance'],
  [/hair/i, 'Hair'],
  [/brush|curler|nail/i, 'Tools'],
  [/blush|flush|highlighter|glow stick|glaze stick/i, 'Cheeks'],
  [/lip|gloss|lipstick|plump/i, 'Lips'],
  [/mascara|eyeliner|eye\b|eyeshadow|palette|brow|liner/i, 'Eyes'],
  [/foundation|concealer|powder|primer|corrector|setting|eraser|double touch/i, 'Face'],
  [/serum|toner|cream|mask|balm|cleans|micellar|moistur|sunscreen|baume/i, 'Skincare'],
]

const fetchJson = async (path) => {
  const res = await fetch(`${STORE}${path}`, { headers: { 'user-agent': 'Mozilla/5.0 jamali-sync' } })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

const match = (rules, text, fallback) => rules.find(([re]) => re.test(text))?.[1] ?? fallback

// Serve images through the storefront's own /cdn/shop proxy so they live on the brand domain.
const img = (src) => src.replace(/^https:\/\/cdn\.shopify\.com\/s\/files\/[^/]+\/[^/]+\/[^/]+\/[^/]+\//, `${STORE}/cdn/shop/`)

const clean = (s) => s.replace(/\s+/g, ' ').replace(/\s*-\s*$/, '').trim()

const stripHtml = (html) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h\d|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;|\u00a0/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&quot;/g, '"')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')

const { products } = await fetchJson('/products.json?limit=250')
const membership = {}
for (const handle of COLLECTIONS) {
  const { products: list } = await fetchJson(`/collections/${handle}/products.json?limit=250`)
  for (const p of list) (membership[p.handle] ??= []).push(handle)
}

const catalog = products.map((p) => {
  const title = clean(p.title)
  const variants = p.variants.map((v) => ({
    id: v.id,
    title: v.title === 'Default Title' ? null : clean(v.title),
    price: Number(v.price),
    compareAt: v.compare_at_price ? Number(v.compare_at_price) : null,
    available: v.available,
    image: v.featured_image ? img(v.featured_image.src) : null,
  }))
  return {
    id: p.id,
    handle: p.handle,
    title,
    brand: match(BRANDS, title, 'Jamali'),
    category: match(CATEGORIES, title, 'Face'),
    description: stripHtml(p.body_html ?? ''),
    price: Math.min(...variants.map((v) => v.price)),
    compareAt: variants[0].compareAt,
    available: variants.some((v) => v.available),
    images: p.images.map((i) => img(i.src)),
    variants,
    collections: membership[p.handle] ?? [],
    createdAt: p.created_at,
  }
})

await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, JSON.stringify({ syncedAt: new Date().toISOString(), store: STORE, products: catalog }, null, 2))
console.log(`✓ ${catalog.length} products → ${OUT}`)
