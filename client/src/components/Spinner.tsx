export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="h-9 w-9 animate-spin border-2 border-gold border-t-navy" />
      {label && <p className="text-sm text-ink/50">{label}</p>}
    </div>
  )
}
