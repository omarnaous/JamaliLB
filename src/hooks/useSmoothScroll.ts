import Lenis from 'lenis'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useShop } from '../store/shop'

let lenis: Lenis | null = null

export const scrollToTop = (immediate = true) => (lenis ? lenis.scrollTo(0, { immediate }) : window.scrollTo(0, 0))

/** Lenis inertial scrolling, paused while an overlay is open and reset on navigation. */
export function useSmoothScroll() {
  const { pathname } = useLocation()
  const locked = useShop((s) => s.cartOpen || s.searchOpen)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
    let raf = requestAnimationFrame(function loop(time) {
      lenis?.raf(time)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  useEffect(() => {
    if (locked) lenis?.stop()
    else lenis?.start()
    document.documentElement.style.overflow = locked ? 'hidden' : ''
  }, [locked])

  useEffect(() => {
    // Wait for the exiting page to leave before jumping to the top.
    const t = setTimeout(() => scrollToTop(), 260)
    return () => clearTimeout(t)
  }, [pathname])
}
