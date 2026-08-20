import { useEffect } from 'react'

interface Props {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

export default function Toast({ type, message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors =
    type === 'error'
      ? 'border-red-500/30 bg-red-500/10 text-red-300'
      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'

  return (
    <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 animate-fade-in">
      <div className={`flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-md ${colors}`}>
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-1 text-current opacity-60 hover:opacity-100" aria-label="Close">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
