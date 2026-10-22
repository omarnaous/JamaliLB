import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, Heart, MessageCircle, Minus, Plus, Truck, Zap } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Description, hasDescription } from '../components/Description'
import { ProductCard } from '../components/ProductCard'
import { EASE, Magnetic } from '../components/motion'
import { FREE_SHIPPING_THRESHOLD, INSTAGRAM_URL, WELCOME_CODE, checkoutUrl, discountPct, getProduct, img, money, products, type Product } from '../lib/catalog'
import { useCart, useShop } from '../store/shop'
import NotFound from './NotFound'

const MAX_QTY = 10
const SIZE_LIKE = /\b\d+(\.\d+)?\s?(ml|g|oz|pcs|x)\b/i

/** Same category first, then same brand, then best sellers, so there are always four. */
function relatedTo(product: Product) {
  const pool = [
    ...products.filter((p) => p.category === product.category),
    ...products.filter((p) => p.brand === product.brand),
    ...products.filter((p) => p.collections.includes('best-seller')),
  ]
  const seen = new Set([product.handle])
  return pool.filter((p) => p.available && !seen.has(p.handle) && seen.add(p.handle)).slice(0, 4)
}

export default function ProductPage() {
  const { handle = '' } = useParams()
  const product = getProduct(handle)
  const add = useShop((s) => s.add)
  const wished = useShop((s) => s.wishlist.includes(handle))
  const toggleWish = useShop((s) => s.toggleWish)
  const { subtotal: bagSubtotal } = useCart()

  const [variantId, setVariantId] = useState(() => (product?.variants.find((v) => v.available) ?? product?.variants[0])?.id)
  const [[imageIdx, dir], setImage] = useState<[number, number]>([0, 0])
  const [qty, setQty] = useState(1)
  const buyRef = useRef<HTMLDivElement>(null)
  // The sticky bar only appears once the shopper has scrolled *past* the buy buttons.
  const [pastBuy, setPastBuy] = useState(false)

  const variant = product?.variants.find((v) => v.id === variantId) ?? product?.variants[0]
  const gallery = product ? [...new Set([variant?.image, ...product.images].filter(Boolean) as string[])] : []

  useEffect(() => setImage([0, 0]), [variantId])

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPastBuy(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [product])

  useEffect(() => {
    if (product) document.title = `${product.title} — JAMALI جمالي`
    return () => {
      document.title = 'JAMALI جمالي — Pretty starts here'
    }
  }, [product])

  if (!product || !variant) return <NotFound />

  const off = discountPct(variant.price, variant.compareAt)
  const options = product.variants.filter((v) => v.title)
  const optionLabel = options.every((v) => SIZE_LIKE.test(v.title!)) ? 'Size' : 'Shade'
  const related = relatedTo(product)
  const showImage = (i: number) => setImage(([cur]) => [(i + gallery.length) % gallery.length, i > cur ? 1 : -1])
  const afterThis = bagSubtotal + variant.price * qty
  const toFree = FREE_SHIPPING_THRESHOLD - afterThis
  const longTitle = product.title.length > 48

  return (
    <div className="pb-24">
      <div className="container-x pt-6">
        <nav className="flex min-w-0 items-center gap-1.5 text-xs text-mute" aria-label="Breadcrumb">
          <Link to="/" className="shrink-0 hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="shrink-0 hover:text-ink">
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate text-ink">{product.title}</span>
        </nav>
      </div>

      <div className="container-x mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-square overflow-hidden rounded-[36px] bg-gradient-to-br from-shell to-petal lg:aspect-auto lg:h-[min(72vh,720px)]">
            <AnimatePresence initial={false} custom={dir}>
              <motion.img
                decoding="async"
                key={gallery[imageIdx]}
                src={img(gallery[imageIdx], 1200)}
                alt={product.title}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: EASE }}
                drag={gallery.length > 1 ? 'x' : false}
                dragSnapToOrigin
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) showImage(imageIdx + 1)
                  else if (info.offset.x > 60) showImage(imageIdx - 1)
                }}
                draggable={false}
                className={`absolute inset-0 size-full touch-pan-y object-contain p-[10%] mix-blend-multiply ${gallery.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
              />
            </AnimatePresence>
            {off > 0 && variant.available && <span className="absolute left-5 top-5 rounded-full bg-berry px-3 py-1.5 text-xs font-bold text-white">Save {off}%</span>}
            {!variant.available && <span className="absolute left-5 top-5 rounded-full bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Sold out</span>}
            <button
              onClick={() => toggleWish(product.handle)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/80 transition hover:scale-110"
            >
              <Heart className={`size-5 ${wished ? 'fill-berry text-berry' : ''}`} />
            </button>
            {gallery.length > 1 && (
              <>
                <button onClick={() => showImage(imageIdx - 1)} aria-label="Previous image" className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 transition hover:bg-white">
                  <ChevronLeft className="size-5" />
                </button>
                <button onClick={() => showImage(imageIdx + 1)} aria-label="Next image" className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 transition hover:bg-white">
                  <ChevronRight className="size-5" />
                </button>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-xs tabular-nums">
                  {imageIdx + 1} / {gallery.length}
                </span>
              </>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {gallery.map((g, i) => (
                <button
                  key={g}
                  onClick={() => showImage(i)}
                  className={`size-16 shrink-0 overflow-hidden rounded-2xl bg-petal ring-2 transition sm:size-20 ${i === imageIdx ? 'ring-ink' : 'ring-transparent hover:ring-ink/20'}`}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === imageIdx}
                >
                  <img decoding="async" loading="lazy" src={img(g, 200)} alt="" className="size-full object-contain p-1.5 mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <Link to={`/shop?brand=${encodeURIComponent(product.brand)}`} className="eyebrow hover:underline">
              {product.brand}
            </Link>
            <h1 className={`mt-3 text-balance font-display leading-[1.02] ${longTitle ? 'text-3xl md:text-4xl xl:text-5xl' : 'text-4xl md:text-5xl xl:text-6xl'}`}>{product.title}</h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="text-3xl font-semibold">{money(variant.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-lg text-mute line-through">{money(variant.compareAt!)}</span>
                  <span className="rounded-full bg-petal px-2.5 py-1 text-xs font-bold text-berry">You save {money(variant.compareAt! - variant.price)}</span>
                </>
              )}
            </div>
            {variant.available && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-mute">
                <Truck className="size-3.5" />
                {toFree > 0 ? (
                  <span>
                    Add <b className="text-ink">{money(toFree)}</b> more{bagSubtotal > 0 ? ' (with your bag)' : ''} for free delivery
                  </span>
                ) : (
                  <span className="text-berry">This order ships free 🎉</span>
                )}
              </p>
            )}
          </motion.div>

          {options.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm">
                <span className="text-mute">{optionLabel}:</span> <b className="capitalize">{variant.title}</b>
                {!variant.available && <span className="ml-2 text-berry">· sold out</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVariantId(v.id)
                      setQty(1)
                    }}
                    aria-pressed={v.id === variant.id}
                    title={v.available ? v.title! : `${v.title} — sold out`}
                    className={`relative flex max-w-full items-center gap-2 rounded-full border py-1.5 pr-4 text-sm capitalize transition ${v.image ? 'pl-1.5' : 'pl-4'} ${
                      v.id === variant.id ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white hover:border-ink/40'
                    } ${!v.available ? 'opacity-50' : ''}`}
                  >
                    {v.image && (
                      <span className="size-8 shrink-0 overflow-hidden rounded-full bg-petal">
                        <img decoding="async" loading="lazy" src={img(v.image, 80)} alt="" className="size-full object-cover" />
                      </span>
                    )}
                    <span className={`truncate ${!v.available ? 'line-through' : ''}`}>{v.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={buyRef} className="mt-8 flex flex-wrap gap-3">
            {variant.available ? (
              <>
                <div className="flex h-14 items-center rounded-full bg-white ring-1 ring-ink/10">
                  <button className="grid size-14 place-items-center disabled:opacity-30" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                    <Minus className="size-4" />
                  </button>
                  <span className="w-6 text-center tabular-nums" aria-live="polite">
                    {qty}
                  </span>
                  <button className="grid size-14 place-items-center disabled:opacity-30" disabled={qty >= MAX_QTY} onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} aria-label="Increase quantity">
                    <Plus className="size-4" />
                  </button>
                </div>
                <Magnetic strength={0.15} className="min-w-[200px] flex-1">
                  <button onClick={() => add(product.handle, variant.id, qty)} className="btn-ink h-14 w-full whitespace-nowrap px-5">
                    Add to bag · {money(variant.price * qty)}
                  </button>
                </Magnetic>
                <a href={checkoutUrl([{ variantId: variant.id, qty }])} className="btn-blush h-14 w-full">
                  <Zap className="size-4" /> Buy it now
                </a>
              </>
            ) : (
              <div className="w-full rounded-3xl bg-petal p-5">
                <p className="font-semibold">{options.length > 1 && product.available ? 'This shade is sold out' : 'Sold out for now'}</p>
                <p className="mt-1 text-sm text-plum/75">
                  {options.length > 1 && product.available ? 'Pick another shade above, or ask us about a restock.' : 'Message us and we’ll let you know when it’s back.'}
                </p>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-ink mt-4">
                  <MessageCircle className="size-4" /> Ask on Instagram
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { icon: BadgeCheck, t: '100% authentic' },
              { icon: Truck, t: '3–4 day delivery' },
              { icon: MessageCircle, t: 'Help on Instagram' },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="rounded-2xl bg-petal/60 px-2 py-4">
                <Icon className="mx-auto mb-1.5 size-5 text-berry" />
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {hasDescription(product.description) && (
              <Accordion title="Details" open>
                <Description text={product.description} />
              </Accordion>
            )}
            <Accordion title="Delivery" open={!hasDescription(product.description)}>
              <p>Delivered anywhere in Lebanon within 3–4 business days.</p>
              <p>Free delivery on orders over ${FREE_SHIPPING_THRESHOLD}.</p>
              <p>
                New here? Use <b className="text-ink">{WELCOME_CODE}</b> for 10% off your first order.
              </p>
            </Accordion>
            <Accordion title="Authenticity promise">
              <p>Every product is original and sourced from trusted brand channels. If anything isn’t right, message us on Instagram @jamali_lb and we’ll make it right.</p>
            </Accordion>
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

      <AnimatePresence>
        {pastBuy && variant.available && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-2xl items-center gap-3 rounded-full bg-ink/95 p-2 text-white shadow-2xl"
          >
            <span className="size-11 shrink-0 overflow-hidden rounded-full bg-white">
              <img decoding="async" src={img(variant.image ?? product.images[0], 100)} alt="" className="size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{product.title}</span>
              <span className="block truncate text-xs capitalize text-white/60">
                {variant.title ? `${variant.title} · ` : ''}
                {qty > 1 ? `${qty} × ` : ''}
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

function Accordion({ title, children, open: initial = false }: { title: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial)
  return (
    <div>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left font-medium">
        {title}
        <ChevronDown className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
            <div className="space-y-2 pb-6 text-sm leading-relaxed text-plum/80">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
