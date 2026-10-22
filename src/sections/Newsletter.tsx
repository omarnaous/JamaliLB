import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '../components/motion'
import { STORE_URL, WELCOME_CODE } from '../lib/catalog'

/** Posts to Shopify's native customer newsletter form, so sign-ups land in Shopify Customers. */
export function Newsletter() {
  return (
    <section className="container-x py-24 md:py-32">
      <Reveal className="grain relative overflow-hidden rounded-[40px] bg-petal px-6 py-16 text-center md:px-16 md:py-24">
        <motion.div className="absolute -left-20 -top-20 size-72 animate-blob bg-blush/60 blur-2xl" />
        <motion.div className="absolute -bottom-24 -right-16 size-80 animate-blob bg-[#ffd6c9] blur-2xl [animation-delay:-8s]" />
        <div className="relative">
          <p className="eyebrow mb-4">Join the glow list</p>
          <h2 className="mx-auto max-w-3xl font-display text-5xl leading-[0.95] md:text-7xl">
            Take <em className="text-berry">10% off</em> your first order
          </h2>
          <p className="mx-auto mt-5 max-w-md text-plum/75">
            Get first dibs on new drops, restocks and members-only offers. Your welcome code is <b className="text-ink">{WELCOME_CODE}</b>.
          </p>
          <form action={`${STORE_URL}/contact#contact_form`} method="post" target="_blank" className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
            <input type="hidden" name="form_type" value="customer" />
            <input type="hidden" name="utf8" value="✓" />
            <input type="hidden" name="contact[tags]" value="newsletter" />
            <label className="sr-only" htmlFor="nl-email">
              Email
            </label>
            <input
              id="nl-email"
              type="email"
              name="contact[email]"
              required
              placeholder="you@email.com"
              className="h-14 flex-1 rounded-full border border-ink/10 bg-white px-6 text-sm outline-none transition focus:border-ink"
            />
            <button className="btn-ink h-14 group">
              Subscribe <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  )
}
