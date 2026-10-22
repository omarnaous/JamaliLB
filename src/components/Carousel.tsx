import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Native horizontal scroller with snap points: swipe on touch, trackpad on desktop,
 * mouse-drag, arrow buttons and keyboard. Never hijacks vertical scroll.
 */
export function Carousel({ children, header, dark = false, className = '' }: { children: ReactNode; header?: ReactNode; dark?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const progress = useSpring(useMotionValue(0), { stiffness: 200, damping: 30 })
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    progress.set(max > 0 ? el.scrollLeft / max : 0)
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 })
  }, [progress])

  useEffect(() => {
    update()
    const el = track.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  const page = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const item = el.firstElementChild as HTMLElement | null
    const card = item ? item.offsetWidth + 20 : el.clientWidth * 0.8
    // advance by however many whole cards are fully visible
    el.scrollBy({ left: dir * card * Math.max(1, Math.floor(el.clientWidth / card)), behavior: 'smooth' })
  }

  const arrow = `grid size-12 place-items-center rounded-full border transition disabled:pointer-events-none disabled:opacity-30 ${
    dark ? 'border-cream/20 text-cream hover:bg-cream hover:text-ink' : 'border-ink/15 hover:bg-ink hover:text-white'
  }`

  return (
    <div className={className}>
      <div className="container-x mb-8 flex items-end justify-between gap-6 md:mb-10">
        <div className="min-w-0">{header}</div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button className={arrow} onClick={() => page(-1)} disabled={edges.start} aria-label="Previous">
            <ArrowLeft className="size-5" />
          </button>
          <button className={arrow} onClick={() => page(1)} disabled={edges.end} aria-label="Next">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        data-lenis-prevent-horizontal
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        onScroll={update}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !track.current) return
          drag.current = { active: true, moved: false, x: e.clientX, left: track.current.scrollLeft }
        }}
        onPointerMove={(e) => {
          const d = drag.current
          if (!d.active || !track.current) return
          const dx = e.clientX - d.x
          if (!d.moved && Math.abs(dx) > 6) {
            d.moved = true
            track.current.style.scrollSnapType = 'none'
            track.current.setPointerCapture(e.pointerId)
          }
          if (d.moved) track.current.scrollLeft = d.left - dx
        }}
        onPointerUp={(e) => {
          const d = drag.current
          d.active = false
          if (!track.current) return
          if (track.current.hasPointerCapture(e.pointerId)) track.current.releasePointerCapture(e.pointerId)
          track.current.style.scrollSnapType = ''
        }}
        onClickCapture={(e) => {
          // a drag shouldn't also open the card under the cursor
          if (drag.current.moved) {
            e.preventDefault()
            e.stopPropagation()
            drag.current.moved = false
          }
        }}
        onDragStart={(e) => e.preventDefault()}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 outline-none sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10 [&>*]:snap-start"
      >
        {children}
      </div>

      <div className="container-x mt-8">
        <div className={`h-[2px] overflow-hidden rounded-full ${dark ? 'bg-cream/15' : 'bg-ink/10'}`}>
          <motion.div className="h-full origin-left bg-blush" style={{ scaleX: progress }} />
        </div>
      </div>
    </div>
  )
}
