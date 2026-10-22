import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'

const TEXT =
  'Jamali — جمالي — means “my beauty”. We hand-pick authentic favourites from the brands you follow, test them on camera, and deliver them to your door anywhere in Lebanon. No fakes. No guesswork. Just glow.'

const HIGHLIGHT = new Set(['“my', 'beauty”.', 'authentic', 'glow.', 'جمالي'])

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = TEXT.split(' ')

  return (
    <section className="container-x py-28 md:py-40">
      <p className="eyebrow mb-8 flex items-center gap-3">
        <span className="h-px w-10 bg-berry" /> Beauty • Glow • Confidence
      </p>
      <div ref={ref}>
        <p className="font-display text-[9vw] leading-[1.05] md:text-[5.2vw]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} highlight={HIGHLIGHT.has(w)}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  )
}

function Word({ children, progress, range, highlight }: { children: string; progress: MotionValue<number>; range: [number, number]; highlight: boolean }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${highlight ? 'italic text-berry' : ''} ${/[؀-ۿ]/.test(children) ? 'font-arabic font-light' : ''}`}>
      {children}
    </motion.span>
  )
}
