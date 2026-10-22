import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { INTRO_DELAY } from '../components/Intro'
import { Magnetic, EASE } from '../components/motion'
import { brands, getProduct, img, products } from '../lib/catalog'

const D = INTRO_DELAY + 0.1

const FLOATERS = [
  { handle: 'rare-beauty-soft-pinch-liquid-blush', className: 'left-[3%] top-[14%] w-[24vw] max-w-[230px] md:w-[15vw]', depth: 0.6, r: -8 },
  { handle: 'sol-de-janeiro-brazilian-crush-hair-body-mist-62', className: 'right-[4%] top-[10%] w-[26vw] max-w-[250px] md:w-[16vw]', depth: 1, r: 7 },
  { handle: 'rhode-pocket-blush', className: 'left-[10%] bottom-[8%] w-[22vw] max-w-[200px] md:w-[13vw] hidden sm:block', depth: 1.3, r: 6 },
  { handle: 'laneige-lip-sleeping-mask-berry-20g', className: 'right-[12%] bottom-[6%] w-[22vw] max-w-[210px] md:w-[13vw] hidden sm:block', depth: 0.8, r: -5 },
  { handle: 'huda-beauty-faux-filler-jelly-oil-lipstick', className: 'left-[30%] top-[4%] w-[14vw] max-w-[150px] md:w-[9vw] hidden lg:block', depth: 1.6, r: 12 },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48])

  // pointer parallax
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const watermarkX = useTransform(px, (v) => v * -30)
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 200])

  return (
    <section
      ref={ref}
      className="relative -mt-[72px] h-[100svh] min-h-[640px] bg-cream"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        px.set(e.clientX / window.innerWidth - 0.5)
        py.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      <motion.div style={{ scale, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }} className="grain relative h-full overflow-hidden bg-gradient-to-b from-shell via-petal to-blush/60">
        {/* living blobs */}
        <div className="absolute -left-[10%] top-[20%] size-[55vw] animate-blob bg-blush/50 blur-3xl" />
        <div className="absolute -right-[15%] -top-[10%] size-[45vw] animate-blob bg-[#ffd6c9]/70 blur-3xl [animation-delay:-6s]" />

        {/* Arabic watermark */}
        <motion.p
          lang="ar"
          aria-hidden
          style={{ x: watermarkX, y: watermarkY }}
          className="font-arabic text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[42vw] font-extralight leading-none text-white/70 md:text-[30vw]"
        >
          جمالي
        </motion.p>

        {FLOATERS.map((f, i) => (
          <Floater key={f.handle} {...f} index={i} px={px} py={py} progress={scrollYProgress} />
        ))}

        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-[72px] text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 0.1, duration: 0.8 }} className="chip mb-6 border-white/60">
            <Sparkles className="size-3.5 text-berry" /> Authentic beauty · Delivered across Lebanon 🇱🇧
          </motion.span>

          <h1 className="font-display leading-[0.82] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-[25vw] sm:text-[20vw] lg:text-[15vw]" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay: D, duration: 1.2, ease: EASE }}>
                Pretty
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span className="block text-[13vw] italic text-berry sm:text-[10vw] lg:text-[7.5vw]" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay: D + 0.15, duration: 1.2, ease: EASE }}>
                starts here ✨
              </motion.span>
            </span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 0.5, duration: 1 }} className="mt-6 max-w-md text-balance text-[15px] text-plum/80">
            Huda Beauty, Rare Beauty, Sol de Janeiro, Medicube & {brands.length - 4}+ more brands, hand-picked and 100% authentic.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: D + 0.6, duration: 0.8, ease: EASE }} className="mt-8 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Link to="/collections/best-seller" className="btn-ink group">
                Shop best sellers
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/collections/new-arrivals" className="btn-light">
                What’s new
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: D + 0.9 }} className="absolute inset-x-0 bottom-6 z-10 hidden items-end justify-between px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-plum/70 md:flex">
          <span>{products.length} products</span>
          <span className="flex items-center gap-2">
            Scroll
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              <ArrowDown className="size-3.5" />
            </motion.span>
          </span>
          <span>{brands.length} brands</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Floater({
  handle,
  className,
  depth,
  r,
  index,
  px,
  py,
  progress,
}: {
  handle: string
  className: string
  depth: number
  r: number
  index: number
  px: MotionValue<number>
  py: MotionValue<number>
  progress: MotionValue<number>
}) {
  const p = getProduct(handle)
  const x = useTransform(px, (v) => v * 60 * depth)
  const yMouse = useTransform(py, (v) => v * 40 * depth)
  const yScroll = useTransform(progress, [0, 1], [0, -260 * depth])
  const y = useTransform([yMouse, yScroll], ([a, b]: number[]) => a + b)
  if (!p) return null
  return (
    <motion.div style={{ x, y }} className={`absolute z-[5] ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: r * 2 }}
        animate={{ opacity: 1, scale: 1, rotate: r }}
        transition={{ delay: D + 0.1 + index * 0.12, duration: 1.2, ease: EASE }}
      >
        <Link
          to={`/products/${p.handle}`}
          className="group block animate-float rounded-t-full rounded-b-[2rem] bg-white/70 p-2 shadow-[0_30px_60px_-20px_rgba(194,24,91,.35)] backdrop-blur transition-transform duration-500 hover:scale-105"
          style={{ animationDelay: `${index * -1.3}s` }}
          aria-label={p.title}
        >
          <span className="block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[1.6rem] bg-shell">
            <img src={img(p.images[0], 420)} alt="" className="size-full object-contain p-3 mix-blend-multiply" />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}
