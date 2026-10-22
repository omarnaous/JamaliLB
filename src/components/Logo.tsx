export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="text-[1.35em] font-light tracking-[0.42em] pl-[0.42em]">JAMALI</span>
      <span className="font-arabic text-[0.95em] font-light tracking-wide" lang="ar">
        جمالي
      </span>
    </span>
  )
}
