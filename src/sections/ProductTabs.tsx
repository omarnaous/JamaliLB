import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { ProductCard } from '../components/ProductCard'
import { SplitText } from '../components/motion'
import { inCollection } from '../lib/catalog'

const TABS = [
  { handle: 'best-seller', label: 'Best sellers' },
  { handle: 'new-arrivals', label: 'New in' },
  { handle: 'limited-beauty', label: 'Limited beauty' },
  { handle: 'sale-collection', label: 'On sale' },
]

export function ProductTabs() {
  const [tab, setTab] = useState(TABS[0].handle)
  const items = inCollection(tab)
    .filter((p) => p.available)
    .slice(0, 8)

  return (
    <section className="container-x py-24 md:py-32">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-3">The edit</p>
          <SplitText as="h2" text="Loved in Lebanon" className="font-display text-5xl leading-[0.95] md:text-7xl" />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-full bg-petal p-1 no-scrollbar" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.handle}
              role="tab"
              aria-selected={tab === t.handle}
              onClick={() => setTab(t.handle)}
              className="relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              {tab === t.handle && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className={`relative transition-colors ${tab === t.handle ? 'text-white' : ''}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
        >
          {items.map((p, i) => (
            // 8 fills the 2- and 4-column grids; the 3-column (tablet) grid shows 6 so no row is left half-empty
            <div key={p.handle} className={i >= 6 ? 'md:hidden lg:block' : undefined}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-14 flex justify-center">
        <Link to={`/collections/${tab}`} className="btn-light group">
          View all {TABS.find((t) => t.handle === tab)?.label.toLowerCase()}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
