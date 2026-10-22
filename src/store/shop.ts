import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct, type Product, type Variant } from '../lib/catalog'

export type CartLine = { variantId: number; handle: string; qty: number }

type ShopState = {
  lines: CartLine[]
  wishlist: string[]
  cartOpen: boolean
  searchOpen: boolean
  lastAdded: number
  add: (handle: string, variantId: number, qty?: number) => void
  setQty: (variantId: number, qty: number) => void
  remove: (variantId: number) => void
  toggleWish: (handle: string) => void
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      lines: [],
      wishlist: [],
      cartOpen: false,
      searchOpen: false,
      lastAdded: 0,
      add: (handle, variantId, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variantId === variantId)
          const lines = existing
            ? s.lines.map((l) => (l.variantId === variantId ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { handle, variantId, qty }]
          return { lines, cartOpen: true, lastAdded: Date.now() }
        }),
      setQty: (variantId, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.variantId !== variantId) : s.lines.map((l) => (l.variantId === variantId ? { ...l, qty } : l)),
        })),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      toggleWish: (handle) =>
        set((s) => ({ wishlist: s.wishlist.includes(handle) ? s.wishlist.filter((h) => h !== handle) : [...s.wishlist, handle] })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    { name: 'jamali-shop', partialize: (s) => ({ lines: s.lines, wishlist: s.wishlist }) },
  ),
)

export type ResolvedLine = CartLine & { product: Product; variant: Variant }

export const resolveLines = (lines: CartLine[]): ResolvedLine[] =>
  lines.flatMap((l) => {
    const product = getProduct(l.handle)
    const variant = product?.variants.find((v) => v.id === l.variantId)
    return product && variant ? [{ ...l, product, variant }] : []
  })

export const useCart = () => {
  const lines = useShop((s) => s.lines)
  const resolved = resolveLines(lines)
  const count = resolved.reduce((n, l) => n + l.qty, 0)
  const subtotal = resolved.reduce((n, l) => n + l.qty * l.variant.price, 0)
  const savings = resolved.reduce((n, l) => n + l.qty * Math.max(0, (l.variant.compareAt ?? l.variant.price) - l.variant.price), 0)
  return { lines: resolved, count, subtotal, savings }
}
