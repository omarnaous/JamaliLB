import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-[30vw] leading-none text-blush md:text-[16vw]">404</p>
        <p className="font-display text-4xl italic">This page took a glow break.</p>
        <Link to="/" className="btn-ink mt-8">
          Back home
        </Link>
      </div>
    </div>
  )
}
