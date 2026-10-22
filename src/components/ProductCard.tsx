import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { discountPct, img, money, type Product } from '../lib/catalog'
import { useShop } from '../store/shop'

const TINTS = ['bg-petal', 'bg-[#fbe9e3]', 'bg-[#f6e6f6]', 'bg-[#fdeee6]', 'bg-[#f3ece6]']

export function ProductCard({ product, index = 0, priority = false }: { product: Product; index?: number; priority?: boolean }) {
  const add = useShop((s) => s.add)
  const wished = useShop((s) => s.wishlist.includes(product.handle))
  const toggleWish = useShop((s) => s.toggleWish)
  const [picking, setPicking] = useState(false)

  const off = discountPct(product.price, product.compareAt)
  const isNew = product.collections.includes('new-arrivals')
  const options = product.variants.filter((v) => v.title)
  const firstAvailable = product.variants.find((v) => v.available)

  // subtle 3D tilt
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 180, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 180, damping: 18 })

  const quickAdd = () => {
    if (!firstAvailable) return
    if (options.length > 1) setPicking((p) => !p)
    else add(product.handle, firstAvailable.id)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseLeave={() => setPicking(false)}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          mx.set((e.clientX - r.left) / r.width)
          my.set((e.clientY - r.top) / r.height)
        }}
        onPointerLeave={() => {
          mx.set(0.5)
          my.set(0.5)
        }}
        className={`relative aspect-[4/5] overflow-hidden rounded-[28px] ${TINTS[index % TINTS.length]}`}
      >
        <Link to={`/products/${product.handle}`} className="absolute inset-0" aria-label={product.title}>
          <img
            src={img(product.images[0], 600)}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className={`absolute inset-0 size-full object-contain p-[12%] mix-blend-multiply transition-all duration-700 ease-silk group-hover:scale-[1.06] ${product.images[1] ? 'group-hover:opacity-0' : ''} ${!product.available ? 'opacity-50 grayscale' : ''}`}
          />
          {product.images[1] && (
            <img
              src={img(product.images[1], 600)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full scale-[1.06] object-contain p-[12%] opacity-0 mix-blend-multiply transition-all duration-700 ease-silk group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {off > 0 && <span className="rounded-full bg-berry px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">−{off}%</span>}
          {isNew && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">New</span>}
          {!product.available && <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Sold out</span>}
        </div>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleWish(product.handle)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 backdrop-blur transition hover:bg-white"
        >
          <Heart className={`size-4 transition ${wished ? 'fill-berry text-berry' : ''}`} />
        </motion.button>

        {product.available && (
          <div className="absolute inset-x-3 bottom-3 translate-y-0 opacity-100 transition-all duration-500 ease-silk md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
            <AnimatePresence>
              {picking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mb-2 flex max-h-28 flex-wrap gap-1.5 overflow-auto rounded-2xl bg-white/90 p-2 backdrop-blur no-scrollbar"
                >
                  {options.map((v) => (
                    <button
                      key={v.id}
                      disabled={!v.available}
                      onClick={() => {
                        add(product.handle, v.id)
                        setPicking(false)
                      }}
                      className="rounded-full border border-ink/10 px-2.5 py-1 text-[11px] capitalize transition hover:border-ink hover:bg-ink hover:text-white disabled:opacity-35 disabled:line-through"
                    >
                      {v.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={quickAdd}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink/90 py-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-berry"
            >
              <Plus className="size-4" />
              {options.length > 1 ? (picking ? 'Choose a shade' : `Quick add · ${options.length} shades`) : 'Add to bag'}
            </button>
          </div>
        )}
      </motion.div>

      <Link to={`/products/${product.handle}`} className="mt-4 block px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug transition-colors group-hover:text-berry">{product.title}</h3>
        <p className="mt-2 flex items-baseline gap-2 text-sm">
          <span className="font-semibold">{options.length > 1 && product.variants.some((v) => v.price !== product.price) ? 'From ' : ''}{money(product.price)}</span>
          {off > 0 && <span className="text-mute line-through">{money(product.compareAt!)}</span>}
        </p>
      </Link>
    </motion.article>
  )
}
