import { AnimatePresence, motion } from 'motion/react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ProductCard } from '../components/ProductCard'
import { EASE, SplitText } from '../components/motion'
import { CATEGORIES, COLLECTIONS, discountPct, inCollection } from '../lib/catalog'

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  discount: 'Biggest savings',
  newest: 'Newest',
} as const
type Sort = keyof typeof SORTS

const QUICK = ['all', 'best-seller', 'new-arrivals', 'sale-collection', 'limited-beauty', 'makeup', 'skin-care', 'huda-beauty-collection', 'sol-de-janeiro', 'sheglam', 'dali', 'ruby-beauty', 'sephora-favorites-kits']

export default function Shop() {
  const { handle = 'all' } = useParams()
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)

  const category = params.get('category')
  const brand = params.get('brand')
  const sort = (params.get('sort') as Sort) || 'featured'
  const inStock = params.get('stock') === '1'
  const meta = COLLECTIONS[handle] ?? { title: handle.replace(/-/g, ' '), blurb: '' }

  const base = inCollection(handle)
  const categories = CATEGORIES.filter((c) => base.some((p) => p.category === c))
  const brandList = [...new Set(base.map((p) => p.brand))].sort()

  const list = useMemo(() => {
    let l = base.filter((p) => (!category || p.category === category) && (!brand || p.brand === brand) && (!inStock || p.available))
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'discount') l = [...l].sort((a, b) => discountPct(b.price, b.compareAt) - discountPct(a.price, a.compareAt))
    if (sort === 'newest') l = [...l].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sort === 'featured') l = [...l].sort((a, b) => Number(b.available) - Number(a.available))
    return l
  }, [base, category, brand, sort, inStock])

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || next.get(key) === value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const activeFilters = [category && { key: 'category', label: category }, brand && { key: 'brand', label: brand }, inStock && { key: 'stock', label: 'In stock' }].filter(Boolean) as {
    key: string
    label: string
  }[]

  const filters = (
    <div className="space-y-8">
      <FilterGroup title="Category">
        {categories.map((c) => (
          <FilterOption key={c} active={category === c} onClick={() => set('category', c)} label={c} count={base.filter((p) => p.category === c).length} />
        ))}
      </FilterGroup>
      {brandList.length > 1 && (
        <FilterGroup title="Brand">
          {brandList.map((b) => (
            <FilterOption key={b} active={brand === b} onClick={() => set('brand', b)} label={b} count={base.filter((p) => p.brand === b).length} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Availability">
        <FilterOption active={inStock} onClick={() => set('stock', '1')} label="In stock only" />
      </FilterGroup>
    </div>
  )

  return (
    <div className="pb-24">
      <header className="relative overflow-hidden bg-petal">
        <div aria-hidden className="absolute -right-32 -top-32 size-[32rem] animate-drift rounded-full bg-[radial-gradient(closest-side,rgba(244,154,201,.55),transparent)] will-change-transform" />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20">
          <nav className="mb-6 text-xs text-mute">
            <Link to="/" className="hover:text-ink">
              Home
            </Link>{' '}
            / <span className="text-ink">{meta.title}</span>
          </nav>
          <SplitText key={handle} as="h1" text={category ?? meta.title} className="font-display text-6xl capitalize leading-[0.9] md:text-8xl" />
          <p className="mt-4 max-w-lg text-plum/75">{meta.blurb}</p>
        </div>
        <div className="container-x relative flex gap-2 overflow-x-auto pb-6 no-scrollbar">
          {QUICK.map((h) => (
            <Link
              key={h}
              to={h === 'all' ? '/shop' : `/collections/${h}`}
              className={`chip shrink-0 ${h === handle ? 'border-ink bg-ink text-white' : 'hover:border-ink/40'}`}
            >
              {COLLECTIONS[h].title}
            </Link>
          ))}
        </div>
      </header>

      <div className="container-x mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filters}</div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setDrawer(true)} className="chip lg:hidden">
                <SlidersHorizontal className="size-3.5" /> Filters
              </button>
              <span className="text-sm text-mute">{list.length} products</span>
              <AnimatePresence>
                {activeFilters.map((f) => (
                  <motion.button
                    key={f.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => set(f.key, null)}
                    className="chip border-berry/30 bg-petal text-berry"
                  >
                    {f.label} <X className="size-3" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-mute">Sort</span>
              <select value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? null : e.target.value)} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm outline-none">
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {list.length === 0 ? (
            <div className="rounded-[28px] bg-petal p-16 text-center">
              <p className="font-display text-4xl italic">Nothing here… yet</p>
              <button onClick={() => setParams({}, { replace: true })} className="btn-ink mt-6">
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div key={p.handle} layout exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: EASE }}>
                    <ProductCard product={p} index={i} priority={i < 6} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[81] max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-cream p-6 lg:hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: EASE }}
              data-lenis-prevent
            >
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-ink/15" />
              {filters}
              <button onClick={() => setDrawer(false)} className="btn-ink mt-8 w-full">
                Show {list.length} products
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <div className="flex flex-col items-start gap-1">{children}</div>
    </div>
  )
}

function FilterOption({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active} className="group flex w-full items-center gap-3 py-1 text-left text-sm">
      <span className={`grid size-4 place-items-center rounded-full border transition ${active ? 'border-berry bg-berry' : 'border-ink/25 group-hover:border-ink'}`}>
        {active && <span className="size-1.5 rounded-full bg-white" />}
      </span>
      <span className={`flex-1 transition ${active ? 'font-semibold text-berry' : 'group-hover:translate-x-0.5'}`}>{label}</span>
      {count !== undefined && <span className="text-xs text-mute">{count}</span>}
    </button>
  )
}
