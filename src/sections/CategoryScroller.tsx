import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Carousel } from '../components/Carousel'
import { getProduct, img, products } from '../lib/catalog'

const CATS = [
  { name: 'Lips', hero: 'huda-beauty-faux-filler-jelly-oil-lipstick', tone: 'from-[#ffd3e4] to-[#f7a1c4]', note: 'Oils, stains & glosses' },
  { name: 'Cheeks', hero: 'rare-beauty-soft-pinch-liquid-blush', tone: 'from-[#ffe1d6] to-[#f6a6a0]', note: 'The flush edit' },
  { name: 'Face', hero: 'huda-beauty-fauxfilter-luminous-matte-buildable-coverage-crease-proof-concealer', tone: 'from-[#f8e7da] to-[#e7c2a6]', note: 'Base that breathes' },
  { name: 'Eyes', hero: 'rare-beauty-perfect-strokes-universal-volumizing-mascara', tone: 'from-[#ece4f6] to-[#c8b5e6]', note: 'Lash drama' },
  { name: 'Skincare', hero: 'medicube-txa-niacinamide-15-serum', tone: 'from-[#e3f1ec] to-[#b6dccd]', note: 'K-beauty rituals' },
  { name: 'Body & Fragrance', hero: 'sol-de-janeiro-after-hours-perfume-mist-90-ml', tone: 'from-[#fff0cf] to-[#f7c98c]', note: 'Smell like summer' },
  { name: 'Sets & Gifts', hero: 'sephora-favorites-nude-energy-lip-kit-makeup-set', tone: 'from-[#fde3ef] to-[#f49ac9]', note: 'Made for gifting' },
]

const count = (c: string) => products.filter((p) => p.category === c).length

export function CategoryScroller() {
  return (
    <section className="overflow-hidden bg-ink py-20 text-cream md:py-28">
      <Carousel
        dark
        header={
          <h2 className="font-display text-5xl leading-[0.9] md:text-8xl">
            Shop by <em className="text-blush">mood</em>
          </h2>
        }
      >
        {CATS.map((c, i) => {
          const p = getProduct(c.hero)
          return (
            <div key={c.name} className="shrink-0">
              <Link
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                draggable={false}
                className={`group relative flex h-[min(62vh,560px)] w-[78vw] select-none flex-col justify-between overflow-hidden rounded-[36px] bg-gradient-to-br p-7 text-ink sm:w-[44vw] lg:w-[min(30vw,440px)] ${c.tone}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-xl italic">0{i + 1}</span>
                  <span className="grid size-12 place-items-center rounded-full bg-white/60 backdrop-blur transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                {p && (
                  <img decoding="async"
                    src={img(p.images[0], 700)}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="absolute left-1/2 top-1/2 h-[58%] -translate-x-1/2 -translate-y-1/2 rounded-3xl object-contain mix-blend-multiply transition-transform duration-500 ease-silk group-hover:-translate-y-[54%] group-hover:scale-105"
                  />
                )}
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                    {c.note} · {count(c.name)} products
                  </p>
                  <p className="mt-1 font-display text-5xl leading-none md:text-6xl">{c.name}</p>
                </div>
              </Link>
            </div>
          )
        })}
        <Link
          to="/shop"
          draggable={false}
          className="group grid h-[min(62vh,560px)] w-[60vw] shrink-0 place-items-center rounded-[36px] border border-cream/15 transition-colors hover:border-blush sm:w-[30vw] lg:w-[20vw]"
        >
          <span className="text-center font-display text-4xl leading-tight">
            Shop
            <br />
            <em className="text-blush">everything</em>
          </span>
        </Link>
      </Carousel>
    </section>
  )
}
