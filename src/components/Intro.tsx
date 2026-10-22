import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { EASE } from './motion'

const KEY = 'jamali-intro-seen'

const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

/** Seconds the hero should wait so its entrance plays after the curtain lifts. */
export const INTRO_DELAY = seen() ? 0.05 : 0.95

/** One-time-per-session brand curtain. */
export function Intro() {
  const [show, setShow] = useState(() => !seen())

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode */
    }
    const t = setTimeout(() => setShow(false), 1000)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-blush text-white"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex overflow-hidden text-5xl font-light tracking-[0.4em] sm:text-7xl">
              {'JAMALI'.split('').map((c, i) => (
                <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.55, ease: EASE }}>
                  {c}
                </motion.span>
              ))}
            </div>
            <motion.span
              lang="ar"
              className="font-arabic text-3xl font-light sm:text-4xl"
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              جمالي
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
