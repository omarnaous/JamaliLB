import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

/** Breast-cancer awareness band, echoing the October post on @jamali_lb. */
export function PinkOctober() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const draw = useTransform(scrollYProgress, [0.1, 0.55], [0, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 12])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#ff5fa2] py-24 text-white md:py-32">
      <div className="container-x grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <motion.svg style={{ rotate }} viewBox="0 0 120 180" className="mx-auto h-56 w-auto md:h-80" aria-hidden>
          <motion.path
            d="M28 170 L74 90 C96 52 88 14 61 14 C34 14 26 52 48 90 L94 170"
            fill="none"
            stroke="white"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: draw }}
          />
        </motion.svg>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Pink October</p>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] md:text-7xl">
            More than a colour.
            <br />
            <em>A reminder to check in.</em>
          </h2>
          <p className="mt-5 max-w-lg text-white/90">Know your body. Prioritise your health. Book your screening this month — and remind the women you love to do the same. 🎀</p>
        </div>
      </div>
    </section>
  )
}
