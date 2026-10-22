import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { EASE } from '../components/motion'
import { discountPct, img, money, products } from '../lib/catalog'
import { useShop } from '../store/shop'

// Variant ids come from the live catalog; tune the picks per mood here.
const MOODS = [
  { name: 'Soft & natural', color: '#e9b2a4', glow: '#f7d5cb', picks: [46604642549857, 45777397743713, 45194192748641] },
  { name: 'Bold pop', color: '#ff3d7f', glow: '#ff9dbd', picks: [46604653756513, 45777397645409, 45194192715873] },
  { name: 'Dewy & fresh', color: '#ff7f97', glow: '#ffc6d1', picks: [46604711493729, 45745223925857, 46604642615393] },
  { name: 'Berry & warm', color: '#9c2f55', glow: '#e08aa5', picks: [46604711526497, 45777397710945, 45194192781409] },
]

const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)))

export function FlushFinder() {
  const [mood, setMood] = useState(0)
  const add = useShop((s) => s.add)
  const m = MOODS[mood]
  const picks = m.picks.map((id) => byVariant.get(id)).filter((x) => !!x)

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <motion.div className="absolute inset-0 -z-10" animate={{ background: `radial-gradient(60% 60% at 25% 50%, ${m.glow} 0%, #fffaf6 70%)` }} transition={{ duration: 1 }} />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow mb-3">Blush lab</p>
          <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
            Find your <em>flush</em>
          </h2>
          <p className="mt-5 max-w-sm text-plum/75">Pick the vibe you want on your cheeks today — we’ll match it with the exact shades we stock.</p>

          <div className="relative mx-auto mt-8 aspect-square w-full max-w-[220px] sm:max-w-[300px] lg:mx-0 lg:mt-10 lg:max-w-[380px]">
            <motion.div
              className="absolute inset-[8%] blob-shape animate-blob will-change-transform shadow-[inset_-30px_-30px_80px_rgba(0,0,0,.12),inset_30px_30px_60px_rgba(255,255,255,.5)]"
              animate={{ backgroundColor: m.color }}
              transition={{ duration: 0.8, ease: EASE }}
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={m.name}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
                className="absolute inset-0 grid place-items-center text-center font-display text-4xl italic text-white drop-shadow md:text-5xl"
              >
                {m.name}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div>
          <div className="mb-8 flex flex-wrap gap-2" role="radiogroup" aria-label="Blush mood">
            {MOODS.map((x, i) => (
              <button
                key={x.name}
                role="radio"
                aria-checked={i === mood}
                onClick={() => setMood(i)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${i === mood ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white/70 hover:border-ink/40'}`}
              >
                <span className="size-4 rounded-full ring-2 ring-white" style={{ background: x.color }} />
                {x.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {picks.map(({ product, variant }, i) => (
                <motion.div
                  key={variant.id}
                  layout
                  initial={{ opacity: 0, y: 40, rotate: -3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, transition: { delay: i * 0.08, duration: 0.6, ease: EASE } }}
                  exit={{ opacity: 0, y: -30, transition: { duration: 0.25 } }}
                  className="group flex min-w-0 flex-col rounded-[20px] bg-white/85 p-2 shadow-[0_20px_50px_-30px_rgba(43,15,31,.4)] sm:rounded-[28px] sm:p-3"
                >
                  <Link to={`/products/${product.handle}`} className="block aspect-square overflow-hidden rounded-[22px] bg-shell">
                    <img decoding="async" src={img(variant.image ?? product.images[0], 500)} alt={`${product.title} – ${variant.title}`} className="size-full object-contain p-2 mix-blend-multiply transition duration-500 group-hover:scale-110 sm:p-4" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col px-0.5 pt-2 sm:px-1 sm:pt-3">
                    <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-mute sm:text-[10px] sm:tracking-[0.18em]">{product.brand}</p>
                    <p className="line-clamp-1 text-xs font-medium sm:text-sm">{product.title.replace(/^.*?-\s*/, '')}</p>
                    <p className="truncate text-[11px] capitalize text-berry sm:text-xs"><span className="hidden sm:inline">Shade: </span>{variant.title}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1 sm:mt-3">
                      <span className="text-xs font-semibold sm:text-sm">
                        {money(variant.price)}
                        {discountPct(variant.price, variant.compareAt) > 0 && <span className="ml-1.5 hidden text-xs font-normal text-mute line-through sm:inline">{money(variant.compareAt!)}</span>}
                      </span>
                      <button
                        disabled={!variant.available}
                        onClick={() => add(product.handle, variant.id)}
                        className="grid size-8 place-items-center rounded-full bg-ink text-white sm:size-9 transition hover:bg-berry disabled:opacity-30"
                        aria-label={`Add ${variant.title} to bag`}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
