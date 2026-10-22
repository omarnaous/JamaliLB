import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/** Infinite marquee whose speed and direction follow scroll velocity. */
export function VelocityMarquee({ children, baseVelocity = -2, className }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false })
  const pos = useTransform(x, (v) => `${wrap(-25, -50, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    x.set(x.get() + move)
  })

  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <motion.div className="flex shrink-0 flex-nowrap" style={{ x: pos }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/** Plain CSS marquee, pauses on hover. */
export function Marquee({ children, duration = 30, className }: { children: ReactNode; duration?: number; className?: string }) {
  return (
    <div className={`group flex overflow-hidden ${className ?? ''}`}>
      <div className="flex shrink-0 animate-marquee group-hover:[animation-play-state:paused]" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
