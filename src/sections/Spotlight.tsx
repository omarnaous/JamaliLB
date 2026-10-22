import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { ProductCard } from '../components/ProductCard'
import { img, inCollection, money } from '../lib/catalog'

/** Sticky brand story on the left, products scrolling past on the right. */
export function HudaSpotlight() {
  const items = inCollection('huda-beauty-collection')
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow mb-3">Brand spotlight</p>
          <h2 className="font-display text-6xl leading-[0.9] md:text-8xl">
            Huda
            <br />
            <em className="text-berry">Beauty</em>
          </h2>
          <p className="mt-6 max-w-sm text-plum/75">From the FAUXFILTER family to the cult Lip Contour Stain — the Dubai-born icon, at Lebanon-friendly prices.</p>
          <Link to="/collections/huda-beauty-collection" className="btn-ink group mt-8">
            Shop Huda Beauty <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:gap-x-6 [&>*:nth-child(even)]:lg:translate-y-24">
          {items.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** A full-bleed banner that grows into place as it scrolls into view. */
export function SolSpotlight() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  // scale + y only, so the browser can composite it instead of repainting the panel every frame
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const imgY = useTransform(scrollYProgress, [0, 1], [90, 0])
  const items = inCollection('sol-de-janeiro').slice(0, 4)

  return (
    <section ref={ref} className="px-3 py-6 md:px-6">
      <motion.div style={{ scale }} className="relative overflow-hidden rounded-[40px] bg-[radial-gradient(120%_100%_at_80%_0%,#ffd27a_0%,#ff9a6b_35%,#f06aa6_70%,#c2185b_100%)] text-white">
        <div className="container-x grid min-h-[90vh] items-center gap-10 py-20 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Sol de Janeiro</p>
            <h2 className="mt-3 font-display text-6xl leading-[0.9] md:text-8xl">
              Smell like
              <br />
              <em>summer</em>, all year.
            </h2>
            <p className="mt-6 max-w-md text-white/85">Cheirosa mists in ’62, ’40, ’71 and After Hours — the Brazilian Crush scents everyone asks about, in stock now.</p>
            <Link to="/collections/sol-de-janeiro" className="btn mt-8 bg-white text-ink hover:bg-ink hover:text-white">
              Shop the mists <ArrowRight className="size-4" />
            </Link>
          </div>
          <motion.div style={{ y: imgY }} className="grid grid-cols-2 gap-4">
            {items.map((p, i) => (
              <Link
                key={p.handle}
                to={`/products/${p.handle}`}
                className={`group rounded-[28px] bg-white/25 p-3 transition-colors hover:bg-white/40 ${i % 2 ? 'translate-y-10' : ''}`}
              >
                <div className="aspect-square overflow-hidden rounded-[22px] bg-white">
                  <img decoding="async" src={img(p.images[0], 500)} alt={p.title} loading="lazy" className="size-full object-contain p-3 transition duration-700 group-hover:scale-110" />
                </div>
                <p className="mt-2 line-clamp-1 px-1 text-sm font-medium">{p.title.replace(/^Sol de Janeiro\s*-?\s*/i, '')}</p>
                <p className="px-1 text-sm font-semibold">{money(p.price)}</p>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
