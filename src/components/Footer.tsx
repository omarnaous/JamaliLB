import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { INSTAGRAM_URL, STORE_URL, TIKTOK_URL } from '../lib/catalog'

const cols = [
  {
    title: 'Shop',
    links: [
      { label: 'Makeup', to: '/collections/makeup' },
      { label: 'Skin care', to: '/collections/skin-care' },
      { label: 'New arrivals', to: '/collections/new-arrivals' },
      { label: 'Best sellers', to: '/collections/best-seller' },
      { label: 'Sale', to: '/collections/sale-collection' },
    ],
  },
  {
    title: 'Brands',
    links: [
      { label: 'Huda Beauty', to: '/collections/huda-beauty-collection' },
      { label: 'Sol de Janeiro', to: '/collections/sol-de-janeiro' },
      { label: 'SHEGLAM', to: '/collections/sheglam' },
      { label: 'Dali', to: '/collections/dali' },
      { label: 'Sephora Favorites', to: '/collections/sephora-favorites-kits' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact us', href: `${STORE_URL}/pages/contact` },
      { label: 'Privacy policy', href: `${STORE_URL}/policies/privacy-policy` },
      { label: 'My account', href: `${STORE_URL}/account` },
    ],
  },
]

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const letterSpacing = useTransform(scrollYProgress, [0, 1], ['0.6em', '0.08em'])

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-petal">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 pb-10 pt-20 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-4xl leading-tight text-white md:text-5xl">
            Beauty. Glow.
            <br />
            <em className="text-blush">Confidence.</em>
          </p>
          <p className="mt-4 max-w-xs text-sm text-petal/60">Authentic beauty favourites, hand-picked in Lebanon and delivered to your door in 3–4 business days.</p>
          <div className="mt-6 flex gap-3">
            {[
              { label: 'Instagram', href: INSTAGRAM_URL },
              { label: 'TikTok', href: TIKTOK_URL },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 rounded-full border border-petal/20 px-4 py-2 text-xs transition hover:border-blush hover:bg-blush hover:text-ink">
                {s.label}
                <ArrowUpRight className="size-3.5 transition group-hover:rotate-45" />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-blush">{c.title}</p>
            <ul className="space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  {'to' in l ? (
                    <Link to={l.to!} className="text-petal/70 transition hover:text-white">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-petal/70 transition hover:text-white">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <motion.div style={{ y }} className="pointer-events-none select-none px-2 text-center">
        <motion.p style={{ letterSpacing }} className="whitespace-nowrap text-[19vw] font-extralight leading-[0.8] text-blush">
          JAMALI
        </motion.p>
        <p lang="ar" className="font-arabic -mt-[1vw] text-[8vw] font-extralight leading-none text-blush/40">
          جمالي
        </p>
      </motion.div>

      <div className="container-x flex flex-col items-center justify-between gap-2 border-t border-petal/10 py-6 text-xs text-petal/50 sm:flex-row">
        <p>© {new Date().getFullYear()} Jamali lb. All rights reserved.</p>
        <p>Made with love in Lebanon 🇱🇧</p>
      </div>
    </footer>
  )
}
