import { ArrowUpRight, Play } from 'lucide-react'
import { Carousel } from '../components/Carousel'
import { SplitText } from '../components/motion'
import { INSTAGRAM_URL, getProduct, img } from '../lib/catalog'

// Mirrors the "Let's try" reels on @jamali_lb.
const REELS = [
  { caption: 'Let’s try Rare Beauty blush', handle: 'rare-beauty-soft-pinch-liquid-blush', tag: 'Try-on' },
  { caption: 'تعي لخبرك', handle: 'hudabeauty-lip-contour-stain', tag: 'Review', rtl: true },
  { caption: 'The jelly oil everyone wants', handle: 'huda-beauty-faux-filler-jelly-oil-lipstick', tag: 'New in' },
  { caption: 'I found the PERFECT natural blush 💕', handle: 'rhode-pocket-blush', tag: 'Try-on' },
  { caption: 'Smell like summer in Beirut', handle: 'sol-de-janeiro-brazilian-crush-hair-body-mist-62', tag: 'Fragrance' },
  { caption: 'Night routine with Medicube', handle: 'medicube-collagen-night-wrapping-mask', tag: 'Skincare' },
]

const BG = ['from-[#f7a1c4] to-[#c2185b]', 'from-[#ffd3c4] to-[#e86a7a]', 'from-[#e9d4ff] to-[#9c5bd6]', 'from-[#ffd9e8] to-[#f06aa6]', 'from-[#ffe6b0] to-[#f08a5d]', 'from-[#ffe0ef] to-[#d65f97]']

export function Reels() {
  return (
    <section className="overflow-hidden bg-petal py-24 md:py-32">
      <Carousel
        header={
          <>
            <p className="eyebrow mb-3">@jamali_lb</p>
            <SplitText as="h2" text="Tried, tested, reeled." className="font-display text-5xl leading-[0.95] md:text-7xl" />
            <p className="mt-4 max-w-md text-plum/75">Real swatches, real skin, no filters. Watch us try it before you buy it.</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="btn-ink mt-6">
              Follow on Instagram <ArrowUpRight className="size-4" />
            </a>
          </>
        }
      >
        {REELS.map((r, i) => {
          const p = getProduct(r.handle)
          return (
            <a
              key={r.handle}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              draggable={false}
              className={`group relative aspect-[9/16] w-[62vw] shrink-0 select-none overflow-hidden rounded-[30px] bg-gradient-to-b transition-transform duration-300 hover:-translate-y-2 sm:w-[34vw] lg:w-[18vw] ${BG[i % BG.length]}`}
            >
              {p && (
                <img decoding="async"
                  src={img(p.images[0], 500)}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  className="absolute inset-x-0 top-[12%] mx-auto h-[55%] object-contain mix-blend-multiply transition-transform duration-500 ease-silk group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{r.tag}</span>
              <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl bg-white/85">
                <Play className="size-4 fill-ink" />
              </span>
              <p dir={r.rtl ? 'rtl' : undefined} className={`absolute inset-x-4 bottom-5 text-lg font-semibold leading-tight text-white ${r.rtl ? 'font-arabic text-2xl' : ''}`}>
                {r.caption}
              </p>
            </a>
          )
        })}
      </Carousel>
    </section>
  )
}
