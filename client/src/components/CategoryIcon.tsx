interface Props {
  slug: string
  className?: string
}

function FabricIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" />
      <path d="M8 20h32M8 28h32M20 8v32M28 8v32" opacity="0.55" />
      <path d="M8 8l32 32M40 8L8 40" opacity="0.8" />
    </svg>
  )
}

function YarnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <ellipse cx="20" cy="20" rx="12" ry="9" transform="rotate(-30 20 20)" />
      <path d="M26 14c4 6-2 14 6 18M30 10c4 5-1 12 4 15" opacity="0.7" />
      <path d="M36 30l-6 8" />
    </svg>
  )
}

function CurtainIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M10 8v32M38 8v32" />
      <path d="M10 10c10 4 10 16 0 20" opacity="0.85" />
      <path d="M38 10c-10 4-10 16 0 20" opacity="0.85" />
      <path d="M10 8h28M10 40h28" />
    </svg>
  )
}

function DefaultIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M24 6l16 8v20L24 42 8 34V14Z" />
      <path d="M8 14l16 8 16-8M24 22v20" opacity="0.7" />
    </svg>
  )
}

export default function CategoryIcon({ slug, className = 'h-10 w-10' }: Props) {
  const cls = className
  if (slug === 'fabrics') return <FabricIcon className={cls} />
  if (slug === 'yarn') return <YarnIcon className={cls} />
  if (slug === 'curtains') return <CurtainIcon className={cls} />
  return <DefaultIcon className={cls} />
}
