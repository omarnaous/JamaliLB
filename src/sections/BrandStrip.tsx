import { VelocityMarquee } from '../components/Marquee'

const BRANDS = ['Huda Beauty', 'Rare Beauty', 'Sol de Janeiro', 'Medicube', 'Rhode', 'Laneige', 'NARS', 'Dior', 'Glow Recipe', 'Makeup by Mario', 'SHEGLAM', 'Summer Fridays', 'La Roche-Posay', 'KIKO Milano']

export function BrandStrip() {
  return (
    <section aria-label="Brands we carry" className="border-y border-ink/5 bg-cream py-7">
      <VelocityMarquee baseVelocity={-1.4}>
        {BRANDS.map((b, i) => (
          <span key={b} className="flex items-center">
            <span className={`px-8 font-display text-4xl md:text-6xl ${i % 2 ? 'italic text-berry' : ''}`}>{b}</span>
            <span className="text-2xl text-blush">✦</span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  )
}
