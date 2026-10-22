import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { CATEGORIES, COLLECTIONS, getProduct, img } from '../lib/catalog'
import { useCart, useShop } from '../store/shop'
import { Logo } from './Logo'
import { EASE } from './motion'

const NAV = [
  { to: '/collections/new-arrivals', label: 'New in' },
  { to: '/collections/best-seller', label: 'Best sellers' },
  { to: '/collections/makeup', label: 'Makeup' },
  { to: '/collections/skin-care', label: 'Skin care' },
  { to: '/collections/sale-collection', label: 'Sale' },
]

const BRAND_LINKS = ['huda-beauty-collection', 'sol-de-janeiro', 'sheglam', 'dali', 'ruby-beauty', 'sephora-favorites-kits']

export function Header() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [mega, setMega] = useState(false)
  const [mobile, setMobile] = useState(false)
  const { count } = useCart()
  const wishCount = useShop((s) => s.wishlist.length)
  const lastAdded = useShop((s) => s.lastAdded)
  const setCartOpen = useShop((s) => s.setCartOpen)
  const setSearchOpen = useShop((s) => s.setSearchOpen)
  const { pathname } = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > 400 && y > prev && !mega)
  })

  useEffect(() => {
    setMobile(false)
    setMega(false)
  }, [pathname])

  const featured = getProduct('rare-beauty-soft-pinch-liquid-blush')

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="sticky top-0 z-40"
        onMouseLeave={() => setMega(false)}
      >
        <div className={`transition-[background,box-shadow,backdrop-filter] duration-500 ${solid || mega ? 'bg-cream/80 shadow-[0_1px_0_rgba(43,15,31,.06)] backdrop-blur-xl' : 'bg-transparent'}`}>
          <div className="container-x grid h-[72px] grid-cols-[1fr_auto_1fr] items-center">
            <nav className="hidden items-center gap-7 text-[13px] font-medium lg:flex">
              <button className="group relative py-2" onMouseEnter={() => setMega(true)} onFocus={() => setMega(true)} aria-expanded={mega}>
                Shop
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-silk group-hover:scale-x-100" />
              </button>
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} onMouseEnter={() => setMega(false)} className={({ isActive }) => `group relative py-2 ${n.label === 'Sale' ? 'text-berry' : ''} ${isActive ? 'font-semibold' : ''}`}>
                  {n.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-silk group-hover:scale-x-100" />
                </NavLink>
              ))}
            </nav>
            <button className="-ml-2 grid size-11 place-items-center lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
              <Menu className="size-5" />
            </button>

            <Link to="/" aria-label="Jamali home" className="text-[13px] sm:text-[15px]">
              <Logo />
            </Link>

            <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/60 pl-3.5 pr-2 text-xs text-mute transition hover:border-ink/25 md:flex"
              >
                <Search className="size-4" />
                Search beauty…
                <kbd className="rounded-md bg-petal px-1.5 py-0.5 font-sans text-[10px] text-berry">⌘K</kbd>
              </button>
              <button onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center md:hidden" aria-label="Search">
                <Search className="size-5" />
              </button>
              <Link to="/wishlist" className="relative grid size-10 place-items-center" aria-label="Wishlist">
                <Heart className="size-5" />
                {wishCount > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-berry" />}
              </Link>
              <motion.button
                key={lastAdded}
                animate={lastAdded ? { scale: [1, 1.25, 1] } : undefined}
                transition={{ duration: 0.5 }}
                onClick={() => setCartOpen(true)}
                className="relative grid size-10 place-items-center"
                aria-label={`Bag, ${count} items`}
              >
                <ShoppingBag className="size-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-berry text-[10px] font-bold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-0 top-full hidden border-t border-ink/5 bg-cream/95 backdrop-blur-xl lg:block"
            >
              <div className="container-x grid grid-cols-[1fr_1fr_1fr_1.3fr] gap-10 py-10">
                <MegaCol title="Category" links={CATEGORIES.map((c) => ({ to: `/shop?category=${encodeURIComponent(c)}`, label: c }))} />
                <MegaCol title="Brands" links={BRAND_LINKS.map((h) => ({ to: `/collections/${h}`, label: COLLECTIONS[h].title }))} />
                <MegaCol
                  title="Edits"
                  links={['best-seller', 'new-arrivals', 'limited-beauty', 'sale-collection'].map((h) => ({ to: `/collections/${h}`, label: COLLECTIONS[h].title }))}
                />
                {featured && (
                  <Link to={`/products/${featured.handle}`} className="group relative overflow-hidden rounded-3xl bg-petal p-6">
                    <span className="eyebrow">The blush everyone’s asking for</span>
                    <p className="mt-2 max-w-[14ch] font-display text-3xl leading-none">{featured.title.replace('Rare Beauty - ', '')}</p>
                    <span className="mt-4 inline-block text-xs font-semibold underline underline-offset-4">Shop now</span>
                    <img
                      src={img(featured.images[0], 400)}
                      alt=""
                      className="absolute -bottom-6 -right-4 h-44 mix-blend-multiply transition-transform duration-700 ease-silk group-hover:-translate-y-2 group-hover:rotate-[-6deg]"
                    />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
    </>
  )
}

function MegaCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <motion.li key={l.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
            <Link to={l.to} className="font-display text-2xl leading-tight transition-colors hover:text-berry hover:italic">
              {l.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const links = [{ to: '/shop', label: 'Shop all' }, ...NAV, { to: '/collections/huda-beauty-collection', label: 'Huda Beauty' }, { to: '/collections/sol-de-janeiro', label: 'Sol de Janeiro' }, { to: '/wishlist', label: 'Wishlist' }]
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col bg-blush text-ink"
      initial={{ clipPath: 'circle(0% at 24px 24px)' }}
      animate={{ clipPath: 'circle(150% at 24px 24px)' }}
      exit={{ clipPath: 'circle(0% at 24px 24px)' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="flex h-[72px] items-center justify-between px-4">
        <Logo className="text-[13px]" />
        <button onClick={onClose} className="grid size-11 place-items-center" aria-label="Close menu">
          <X className="size-6" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
        {links.map((l, i) => (
          <div key={l.to} className="overflow-hidden">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}>
              <Link to={l.to} className="block font-display text-5xl leading-[1.1]">
                {l.label}
              </Link>
            </motion.div>
          </div>
        ))}
      </nav>
      <p className="px-6 pb-8 text-sm">Beauty • Glow • Confidence 🇱🇧</p>
    </motion.div>
  )
}
