import { Sparkles } from 'lucide-react'
import { Marquee } from './Marquee'

const messages = [
  'Free delivery on orders over $50',
  'Take 10% off your first order with WELCOME10',
  '100% authentic — sourced from trusted brands',
  'Delivered across Lebanon in 3–4 business days',
]

export function AnnouncementBar() {
  return (
    <div className="relative z-50 bg-ink py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-petal">
      <Marquee duration={40}>
        {messages.map((m) => (
          <span key={m} className="flex items-center gap-6 px-6">
            {m}
            <Sparkles className="size-3 text-blush" />
          </span>
        ))}
      </Marquee>
    </div>
  )
}
