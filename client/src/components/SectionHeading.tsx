interface Props {
  eyebrow?: string
  title: string
  sub?: string
  align?: 'center' | 'start'
}

export default function SectionHeading({ eyebrow, title, sub, align = 'center' }: Props) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-start'
  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold/60" />
          <span className="eyebrow">{eyebrow}</span>
          {align === 'center' && <span className="h-px w-8 bg-gold/60" />}
        </div>
      )}
      <h2 className="text-3xl leading-tight text-gold md:text-4xl">{title}</h2>
      {sub && <p className="max-w-xl text-sm leading-relaxed text-text-dim md:text-base">{sub}</p>}
    </div>
  )
}
