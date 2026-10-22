import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Copy, Lock, Minus, Plus, Truck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FREE_SHIPPING_THRESHOLD, WELCOME_CODE, checkoutUrl, img, money, pick } from '../lib/catalog'
import { useCart, useShop } from '../store/shop'
import { EASE } from './motion'

const UPSELLS = ['labello-lip-balm-all-shades', 'ruby-beauty-blush-brush', 'sheglam-hot-goss-plumping-lip-gloss-oh-em-gee', 'essence-lash-without-limits-mascara']

export function CartDrawer() {
  const open = useShop((s) => s.cartOpen)
  const setOpen = useShop((s) => s.setCartOpen)
  const setQty = useShop((s) => s.setQty)
  const add = useShop((s) => s.add)
  const { lines, subtotal, savings, count } = useCart()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD)
  const upsells = pick(UPSELLS).filter((p) => p.available && !lines.some((l) => l.handle === p.handle)).slice(0, 3)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WELCOME_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[460px] flex-col bg-cream sm:inset-y-3 sm:right-3 sm:rounded-[32px] sm:shadow-2xl"
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ duration: 0.6, ease: EASE }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="font-display text-3xl">
                Your bag <span className="align-super font-sans text-sm text-mute">({count})</span>
              </h2>
              <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-ink/10 transition hover:rotate-90" aria-label="Close bag">
                <X className="size-4" />
              </button>
            </div>

            <div className="mx-6 rounded-2xl bg-petal p-4">
              <p className="flex items-center gap-2 text-sm">
                <Truck className="size-4 text-berry" />
                {remaining > 0 ? (
                  <span>
                    You’re <b>{money(remaining)}</b> away from <b>free delivery</b>
                  </span>
                ) : (
                  <span>
                    <b>Free delivery</b> unlocked 🎉
                  </span>
                )}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-blush to-berry" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-4xl italic">Your bag is empty</p>
                  <p className="mt-2 text-sm text-mute">Pretty starts here — let’s find your next favourite.</p>
                  <Link to="/collections/best-seller" onClick={() => setOpen(false)} className="btn-ink mt-6">
                    Shop best sellers <ArrowRight className="size-4" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-ink/5">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.variantId} layout exit={{ opacity: 0, x: 60, height: 0 }} transition={{ duration: 0.4, ease: EASE }} className="flex gap-4 py-4">
                        <Link to={`/products/${l.handle}`} onClick={() => setOpen(false)} className="size-24 shrink-0 overflow-hidden rounded-2xl bg-petal">
                          <img decoding="async" src={img(l.variant.image ?? l.product.images[0], 240)} alt="" className="size-full object-contain p-2 mix-blend-multiply" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">{l.product.brand}</p>
                          <p className="line-clamp-2 text-sm font-medium leading-snug">{l.product.title}</p>
                          {l.variant.title && <p className="mt-0.5 text-xs capitalize text-mute">{l.variant.title}</p>}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full ring-1 ring-ink/10">
                              <button className="grid size-8 place-items-center" onClick={() => setQty(l.variantId, l.qty - 1)} aria-label="Decrease quantity">
                                <Minus className="size-3" />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                              <button className="grid size-8 place-items-center" onClick={() => setQty(l.variantId, l.qty + 1)} aria-label="Increase quantity">
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold tabular-nums">{money(l.variant.price * l.qty)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {upsells.length > 0 && lines.length > 0 && (
                <div className="mt-4">
                  <p className="eyebrow mb-3">Little extras</p>
                  <div className="grid grid-cols-3 gap-2">
                    {upsells.map((p) => (
                      <button key={p.handle} onClick={() => add(p.handle, p.variants.find((v) => v.available)!.id)} className="group rounded-2xl bg-white p-2 text-left ring-1 ring-ink/5 transition hover:ring-ink/20">
                        <div className="aspect-square overflow-hidden rounded-xl bg-petal">
                          <img decoding="async" src={img(p.images[0], 200)} alt="" className="size-full object-contain p-1.5 mix-blend-multiply transition group-hover:scale-110" />
                        </div>
                        <p className="mt-1.5 line-clamp-1 text-[11px]">{p.title}</p>
                        <p className="flex items-center justify-between text-[11px] font-semibold">
                          {money(p.price)} <Plus className="size-3" />
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/5 px-6 pb-6 pt-4">
                <button onClick={copy} className="mb-4 flex w-full items-center justify-between rounded-2xl border border-dashed border-berry/40 px-4 py-3 text-left text-xs">
                  <span>
                    First order? Use <b className="text-berry">{WELCOME_CODE}</b> at checkout for 10% off
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Copy className="size-3.5" /> {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
                {savings > 0 && (
                  <p className="mb-1 flex justify-between text-sm text-berry">
                    <span>You’re saving</span>
                    <span className="tabular-nums">−{money(savings)}</span>
                  </p>
                )}
                <p className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </p>
                <p className="mt-1 text-xs text-mute">Shipping & discount codes are applied at checkout.</p>
                <a href={checkoutUrl(lines)} className="btn-ink mt-4 w-full py-5 text-base">
                  <Lock className="size-4" /> Secure checkout
                </a>
                <p className="mt-3 text-center text-[11px] text-mute">Secure checkout powered by Shopify · Delivery in 3–4 business days 🇱🇧</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
