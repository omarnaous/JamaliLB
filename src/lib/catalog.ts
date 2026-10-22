import data from '../data/catalog.json'

export type Variant = {
  id: number
  title: string | null
  price: number
  compareAt: number | null
  available: boolean
  image: string | null
}

export type Product = {
  id: number
  handle: string
  title: string
  brand: string
  category: string
  description: string
  price: number
  compareAt: number | null
  available: boolean
  images: string[]
  variants: Variant[]
  collections: string[]
  createdAt: string
}

export const STORE_URL = data.store
export const FREE_SHIPPING_THRESHOLD = 50
export const WELCOME_CODE = 'WELCOME10'
export const INSTAGRAM_URL = 'https://www.instagram.com/jamali_lb'
export const TIKTOK_URL = 'https://www.tiktok.com/@jamali.lb'

export const products = data.products as Product[]

const byHandle = new Map(products.map((p) => [p.handle, p]))
export const getProduct = (handle: string) => byHandle.get(handle)

export const COLLECTIONS: Record<string, { title: string; blurb: string }> = {
  all: { title: 'Shop all', blurb: 'Every authentic favourite we carry, in one place.' },
  'best-seller': { title: 'Best sellers', blurb: 'What Lebanon keeps coming back for.' },
  'new-arrivals': { title: 'New in', blurb: 'Fresh drops, just landed in Beirut.' },
  'sale-collection': { title: 'On sale', blurb: 'Luxury favourites at up to 60% off.' },
  'limited-beauty': { title: 'Limited beauty', blurb: 'Cult icons in small quantities — when they’re gone, they’re gone.' },
  makeup: { title: 'Makeup', blurb: 'Blush, lips, base and lashes from the brands you love.' },
  'skin-care': { title: 'Skin care', blurb: 'K-beauty serums, balms and daily essentials.' },
  'huda-beauty-collection': { title: 'Huda Beauty', blurb: 'The FAUXFILTER family, lip stains and more.' },
  'sol-de-janeiro': { title: 'Sol de Janeiro', blurb: 'Smell like summer, all year long.' },
  sheglam: { title: 'SHEGLAM', blurb: 'Trend-led makeup at feel-good prices.' },
  dali: { title: 'Dali', blurb: 'Everyday essentials, beautifully priced.' },
  'ruby-beauty': { title: 'Ruby Beauty', blurb: 'Liners, glow sticks and tools.' },
  'sephora-favorites-kits': { title: 'Sephora Favorites', blurb: 'Value sets made for gifting (or keeping).' },
}

export const CATEGORIES = ['Lips', 'Cheeks', 'Face', 'Eyes', 'Skincare', 'Body & Fragrance', 'Sets & Gifts', 'Hair', 'Tools'] as const

export const inCollection = (handle: string) =>
  handle === 'all' ? products : products.filter((p) => p.collections.includes(handle))

export const pick = (handles: string[]) => handles.map(getProduct).filter((p): p is Product => !!p)

export const discountPct = (price: number, compareAt: number | null) =>
  compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0

export const money = (n: number) => `$${n.toFixed(2)}`

/** Shopify CDN resize — `width` is honoured by the storefront /cdn/shop proxy. */
export const img = (src: string | null | undefined, width = 800) =>
  src ? `${src}${src.includes('?') ? '&' : '?'}width=${width}` : ''

/** Shopify cart permalink: creates a cart on the live store and lands on its checkout. */
export const checkoutUrl = (lines: { variantId: number; qty: number }[]) =>
  `${STORE_URL}/cart/${lines.map((l) => `${l.variantId}:${l.qty}`).join(',')}`

export const brands = [...new Set(products.map((p) => p.brand))].sort()
