import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api, ApiError } from '../api'

export default function AdminSettings() {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'err', text: t('admin.passwordMismatch') })
      return
    }
    if (newPassword.length < 6) {
      setMsg({ type: 'err', text: t('admin.passwordMinLength') })
      return
    }

    setLoading(true)
    try {
      await api('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setMsg({ type: 'ok', text: t('admin.passwordChanged') })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const text = err instanceof ApiError ? err.message : t('admin.error')
      setMsg({ type: 'err', text })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-serif text-2xl text-text">{t('admin.settings')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-card p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">
            {t('admin.currentPassword')}
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded border border-white/10 bg-navy px-3 py-2.5 text-sm text-text placeholder:text-white/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">
            {t('admin.newPassword')}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded border border-white/10 bg-navy px-3 py-2.5 text-sm text-text placeholder:text-white/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">
            {t('admin.confirmPassword')}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded border border-white/10 bg-navy px-3 py-2.5 text-sm text-text placeholder:text-white/30 focus:border-gold focus:outline-none"
          />
        </div>

        {msg && (
          <div
            className={`rounded px-3 py-2 text-sm ${
              msg.type === 'ok'
                ? 'bg-green-900/40 text-green-300'
                : 'bg-red-900/40 text-red-300'
            }`}
          >
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-gold w-full"
        >
          {loading ? t('admin.saving') : t('admin.changePassword')}
        </button>
      </form>
    </div>
  )
}
