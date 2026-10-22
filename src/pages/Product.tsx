import { AnimatePresence, motion, useInView } from 'motion/react'
import { BadgeCheck, ChevronDown, Heart, Minus, Plus, RotateCcw, Truck, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ProductCard } from '../components/ProductCard'
import { EASE, Magnetic } from '../components/motion'
import { FREE_SHIPPING_THRESHOLD, checkoutUrl, discountPct, getProduct, img, money, products } from '../lib/catalog'
import { useShop } from '../store/shop'
import NotFound from './NotFound'

export default function ProductPage() {
  const { handle = '' } = useParams()
  const product = getProduct(handle)
  const add = useShop((s) => s.add)
  const wished = useShop((s) => s.wishlist.includes(handle))
  const toggleWish = useShop((s) => s.toggleWish)

  const [variantId, setVariantId] = useState(() => (product?.variants.find((v) => v.available) ?? product?.variants[0])?.id)
  const [imageIdx, setImageIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const buyRef = useRef<HTMLDivElement>(null)
  const buyVisible = useInView(buyRef)

  const variant = product?.variants.find((v) => v.id === variantId) ?? product?.variants[0]
  const gallery = product ? [...new Set([variant?.image, ...product.images].filter(Boolean) as string[])] : []

  useEffect(() => setImageIdx(0), [variantId])

  if (!product || !variant) return <NotFound />

  const off = discountPct(variant.price, variant.compareAt)
  const options = product.variants.filter((v) => v.title)
  const related = products.filter((p) => p.category === product.category && p.handle !== product.handle && p.available).slice(0, 4)

  return (
    <div className="pb-24">
      <div className="container-x pt-6">
        <nav className="text-xs text-mute">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>{' '}
          /{' '}
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">
            {product.category}
          </Link>{' '}
          / <span className="text-ink">{product.title}</span>
        </nav>
      </div>

      <div className="container-x mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-square overflow-hidden rounded-[36px] bg-gradient-to-br from-shell to-petal lg:aspect-auto lg:h-[min(72vh,720px)]">
            <AnimatePresence mode="wait">
              <motion.img decoding="async"
                key={gallery[imageIdx]}
                src={img(gallery[imageIdx], 1200)}
                alt={product.title}
                initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-0 size-full object-contain p-[10%] mix-blend-multiply"
              />
            </AnimatePresence>
            {off > 0 && <span className="absolute left-5 top-5 rounded-full bg-berry px-3 py-1.5 text-xs font-bold text-white">Save {off}%</span>}
            <button
              onClick={() => toggleWish(product.handle)}
              aria-pressed={wished}
              aria-label="Toggle wishlist"
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/80 backdrop-blur transition hover:scale-110"
            >
              <Heart className={`size-5 ${wished ? 'fill-berry text-berry' : ''}`} />
            </button>
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {gallery.map((g, i) => (
                <button
                  key={g}
                  onClick={() => setImageIdx(i)}
                  className={`size-20 shrink-0 overflow-hidden rounded-2xl bg-petal ring-2 transition ${i === imageIdx ? 'ring-ink' : 'ring-transparent hover:ring-ink/20'}`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img decoding="async" src={img(g, 200)} alt="" className="size-full object-contain p-1.5 mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="eyebrow hover:underline">
              {product.brand}
            </Link>
            <h1 className="mt-3 font-display text-4xl leading-[1] md:text-6xl">{product.title}</h1>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{money(variant.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-mute line-through">{money(variant.compareAt!)}</span>
                  <span className="rounded-full bg-petal px-2.5 py-1 text-xs font-bold text-berry">You save {money(variant.compareAt! - variant.price)}</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-mute">{variant.price * qty >= FREE_SHIPPING_THRESHOLD ? 'Ships free 🎉' : `Free delivery over $${FREE_SHIPPING_THRESHOLD}`}</p>
          </motion.div>

          {options.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm">
                <span className="text-mute">{options.length > 1 ? 'Shade / option:' : 'Size:'}</span> <b className="capitalize">{variant.title}</b>
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    aria-pressed={v.id === variant.id}
                    className={`group relative flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm capitalize transition ${
                      v.id === variant.id ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white hover:border-ink/40'
                    } ${!v.available ? 'opacity-45' : ''}`}
                  >
                    {v.image ? (
                      <span className="size-8 overflow-hidden rounded-full bg-petal">
                        <img decoding="async" src={img(v.image, 80)} alt="" className="size-full object-cover" />
                      </span>
                    ) : (
                      <span className="size-1" />
                    )}
                    <span className={!v.available ? 'line-through' : ''}>{v.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={buyRef} className="mt-8 flex flex-wrap gap-3">
            <div className="flex h-14 items-center rounded-full bg-white ring-1 ring-ink/10">
              <button className="grid size-14 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center tabular-nums">{qty}</span>
              <button className="grid size-14 place-items-center" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <Plus className="size-4" />
              </button>
            </div>
            <Magnetic strength={0.15} className="flex-1">
              <button disabled={!variant.available} onClick={() => add(product.handle, variant.id, qty)} className="btn-ink h-14 w-full whitespace-nowrap px-5 disabled:cursor-not-allowed disabled:opacity-40">
                {variant.available ? `Add to bag · ${money(variant.price * qty)}` : 'Sold out'}
              </button>
            </Magnetic>
            {variant.available && (
              <a href={checkoutUrl([{ variantId: variant.id, qty }])} className="btn-blush h-14 w-full">
                <Zap className="size-4" /> Buy it now
              </a>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { icon: BadgeCheck, t: '100% authentic' },
              { icon: Truck, t: '3–4 day delivery' },
              { icon: RotateCcw, t: 'Easy support' },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-2xl bg-petal/60 px-2 py-4">
                <Icon className="mx-auto mb-1.5 size-5 text-berry" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {product.description && <Accordion title="Details" open>{product.description}</Accordion>}
            <Accordion title="Delivery">
              {`Delivered anywhere in Lebanon within 3–4 business days.\nFree delivery on orders over $${FREE_SHIPPING_THRESHOLD}.\nNew here? Use WELCOME10 for 10% off your first order.`}
            </Accordion>
            <Accordion title="Authenticity promise">{'Every product is original and sourced from trusted brand channels. If anything isn’t right, message us on Instagram @jamali_lb and we’ll make it right.'}</Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x mt-28">
          <h2 className="mb-10 font-display text-4xl md:text-6xl">
            You may also <em className="text-berry">love</em>
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
            {related.map((p, i) => (
              <ProductCard key={p.handle} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile/desktop buy bar once the main button scrolls away */}
      <AnimatePresence>
        {!buyVisible && variant.available && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-2xl items-center gap-3 rounded-full bg-ink/90 p-2 pl-2 text-white shadow-2xl backdrop-blur-xl"
          >
            <span className="size-11 shrink-0 overflow-hidden rounded-full bg-white">
              <img decoding="async" src={img(variant.image ?? product.images[0], 100)} alt="" className="size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{product.title}</span>
              <span className="block text-xs capitalize text-white/60">
                {variant.title ? `${variant.title} · ` : ''}
                {money(variant.price)}
              </span>
            </span>
            <button onClick={() => add(product.handle, variant.id, qty)} className="btn shrink-0 bg-blush px-5 py-3 text-ink hover:bg-white">
              Add to bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Accordion({ title, children, open: initial = false }: { title: string; children: string; open?: boolean }) {
  const [open, setOpen] = useState(initial)
  return (
    <div>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left font-medium">
        {title}
        <ChevronDown className={`size-4 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
            <p className="whitespace-pre-line pb-6 text-sm leading-relaxed text-plum/80">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
