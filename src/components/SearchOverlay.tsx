import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { img, money, products } from '../lib/catalog'
import { useShop } from '../store/shop'
import { EASE } from './motion'

const TRENDING = ['Rare Beauty', 'Blush', 'Sol de Janeiro', 'Lip oil', 'Medicube', 'Mascara']

export function SearchOverlay() {
  const open = useShop((s) => s.searchOpen)
  const setOpen = useShop((s) => s.setSearchOpen)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!useShop.getState().searchOpen)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50)
    else setQ('')
  }, [open])

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return []
    return products
      .filter((p) => {
        const hay = `${p.title} ${p.brand} ${p.category} ${p.variants.map((v) => v.title).join(' ')}`.toLowerCase()
        return terms.every((t) => hay.includes(t))
      })
      .sort((a, b) => Number(b.available) - Number(a.available))
      .slice(0, 8)
  }, [q])

  useEffect(() => setActive(0), [q])

  const go = (handle: string) => {
    setOpen(false)
    navigate(`/products/${handle}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex justify-center bg-ink/40 p-3 pt-[10vh] backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            role="dialog"
            aria-label="Search"
            className="h-fit max-h-[78vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-cream shadow-2xl"
            initial={{ y: -30, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="flex items-center gap-3 border-b border-ink/5 px-5">
              <Search className="size-5 text-mute" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, results.length - 1))
                  if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, 0))
                  if (e.key === 'Enter' && results[active]) go(results[active].handle)
                }}
                placeholder="Search products, brands, shades…"
                className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-mute/70"
                aria-label="Search products"
              />
              <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-petal" aria-label="Close search">
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[calc(78vh-4rem)] overflow-y-auto p-3">
              {!q && (
                <div className="p-3">
                  <p className="eyebrow mb-3">Trending searches</p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button key={t} onClick={() => setQ(t)} className="chip hover:border-ink">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {q && results.length === 0 && <p className="p-6 text-center text-mute">No matches for “{q}” — try a brand or a product type.</p>}
              <ul>
                {results.map((p, i) => (
                  <li key={p.handle}>
                    <Link
                      to={`/products/${p.handle}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-4 rounded-2xl p-2 transition ${i === active ? 'bg-petal' : ''}`}
                    >
                      <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-white">
                        <img src={img(p.images[0], 160)} alt="" className="size-full object-contain p-1 mix-blend-multiply" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">{p.brand}</span>
                        <span className="block truncate text-sm font-medium">{p.title}</span>
                      </span>
                      <span className="text-sm font-semibold">{p.available ? money(p.price) : 'Sold out'}</span>
                      <ArrowUpRight className={`size-4 transition ${i === active ? 'opacity-100' : 'opacity-0'}`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
