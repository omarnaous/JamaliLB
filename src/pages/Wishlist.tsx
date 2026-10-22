import { Link } from 'react-router'
import { ProductCard } from '../components/ProductCard'
import { SplitText } from '../components/motion'
import { pick } from '../lib/catalog'
import { useShop } from '../store/shop'

export default function Wishlist() {
  const items = pick(useShop((s) => s.wishlist))
  return (
    <div className="container-x pb-24 pt-14">
      <SplitText as="h1" text="Your wishlist" className="font-display text-6xl leading-[0.9] md:text-8xl" />
      <p className="mt-3 text-mute">{items.length} saved</p>
      {items.length === 0 ? (
        <div className="mt-10 rounded-[28px] bg-petal p-16 text-center">
          <p className="font-display text-4xl italic">Nothing saved yet</p>
          <p className="mt-2 text-sm text-mute">Tap the heart on anything you love.</p>
          <Link to="/collections/best-seller" className="btn-ink mt-6">
            Explore best sellers
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
