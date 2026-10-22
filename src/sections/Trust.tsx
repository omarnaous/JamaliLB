import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck, HeartHandshake, Sparkles, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Reveal, SplitText } from '../components/motion'

const PERKS = [
  { icon: BadgeCheck, title: 'Premium quality', body: 'Original beauty products sourced from trusted brands. Never fakes, never dupes.' },
  { icon: Truck, title: 'Fast delivery', body: 'Delivered within 3–4 business days anywhere in Lebanon. Free over $50.' },
  { icon: HeartHandshake, title: 'Customer first', body: 'Your satisfaction is our top priority — DM us any time, we answer.' },
  { icon: Sparkles, title: 'Beauty experts', body: 'Personalised shade and routine recommendations for every beauty need.' },
]

// Real reviews from jamalilb.com
const REVIEWS = [
  { quote: 'Wow ktir Hlwin el products w service kmen akid brjaa btloub mn eendkoun thank youu', name: 'Sarah', city: 'Beirut' },
  { quote: 'Hi l products b janenoooo merci ktirr', name: 'Maya', city: 'Tripoli' },
  { quote: 'Hello excellent service and great products thank you', name: 'Nour', city: 'Jounieh' },
]

export function Perks() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-3">Why Jamali</p>
        <SplitText as="h2" text="What makes us different" className="font-display text-5xl leading-[0.95] md:text-7xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1} className="group relative overflow-hidden rounded-[28px] bg-white p-7 ring-1 ring-ink/5 transition-colors duration-500 hover:bg-ink hover:text-cream">
            <span className="grid size-14 place-items-center rounded-2xl bg-petal text-berry transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
              <p.icon className="size-6" />
            </span>
            <h3 className="mt-10 font-display text-3xl">{p.title}</h3>
            <p className="mt-2 text-sm text-mute transition-colors group-hover:text-cream/70">{p.body}</p>
            <span className="absolute -bottom-10 -right-10 size-32 rounded-full bg-blush/0 blur-2xl transition-colors duration-700 group-hover:bg-blush/40" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function Reviews() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % REVIEWS.length), 5000)
    return () => clearInterval(t)
  }, [])
  const r = REVIEWS[i]

  return (
    <section className="relative overflow-hidden bg-blush py-24 text-ink md:py-36">
      <span aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 font-display text-[40vw] leading-none text-white/30">
        “
      </span>
      <div className="container-x relative text-center">
        <p className="eyebrow mb-6 text-ink">💕 Loved by our customers</p>
        <div className="mx-auto min-h-[12rem] max-w-4xl md:min-h-[14rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-4xl leading-[1.1] md:text-6xl">“{r.quote}”</p>
              <footer className="mt-8 text-sm font-semibold uppercase tracking-[0.2em]">
                {r.name} · <span className="font-normal">{r.city}</span> <span className="ml-2 text-berry">★★★★★</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {REVIEWS.map((_, j) => (
            <button key={j} onClick={() => setI(j)} aria-label={`Review ${j + 1}`} className="h-2 overflow-hidden rounded-full bg-white/50 transition-all" style={{ width: j === i ? 40 : 8 }}>
              {j === i && <motion.span key={i} className="block h-full bg-ink" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
