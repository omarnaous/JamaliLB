import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return <motion.div className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-blush via-blush-deep to-berry" style={{ scaleX }} />
}
