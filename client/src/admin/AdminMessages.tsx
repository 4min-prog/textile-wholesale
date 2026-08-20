import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Message } from '../types'
import Spinner from '../components/Spinner'
import { formatDate } from '../config'
import { TrashIcon } from '../components/Icons'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

export default function AdminMessages() {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmTarget, setConfirmTarget] = useState<Message | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const load = () => {
    setLoading(true)
    api<Message[]>('/admin/messages')
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const markRead = async (m: Message) => {
    if (m.is_read) return
    try {
      await api(`/admin/messages/${m.id}/read`, { method: 'PATCH' })
      load()
    } catch {
      /* ignore */
    }
  }

  const remove = async (m: Message) => {
    try {
      await api(`/admin/messages/${m.id}`, { method: 'DELETE' })
      setToast({ type: 'success', message: t('admin.deleted') })
      load()
    } catch {
      setToast({ type: 'error', message: 'Error' })
    }
  }

  const unread = messages.filter((m) => !m.is_read).length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl text-gold sm:text-2xl md:text-3xl">{t('admin.messagesTitle')}</h1>
        {unread > 0 && <span className="badge badge-gold rounded-full">{unread} {t('admin.unread')}</span>}
      </div>

      {loading ? (
        <Spinner />
      ) : messages.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-card px-6 py-12 text-center text-sm text-text-dim sm:mt-8 sm:py-16">
          {t('admin.noMessages')}
        </div>
      ) : (
        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border bg-card p-4 sm:p-6 ${m.is_read ? 'border-white/10' : 'border-gold/30'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-sm font-semibold text-text sm:text-base">{m.name}</h2>
                    {!m.is_read && <span className="badge badge-gold rounded-full">{t('admin.unread')}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-dim sm:gap-x-4">
                    <a href={`mailto:${m.email}`} className="hover:text-gold">
                      {m.email}
                    </a>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{formatDate(m.created_at, i18n.language)}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  {!m.is_read && (
                    <button type="button" className="btn btn-navy btn-sm" onClick={() => markRead(m)}>
                      {t('admin.markRead')}
                    </button>
                  )}
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirmTarget(m)}>
                    <TrashIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t('admin.delete')}</span>
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-dim sm:mt-4">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {confirmTarget && (
        <ConfirmDialog
          message={t('admin.confirmDelete')}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={() => {
            setConfirmTarget(null)
            remove(confirmTarget)
          }}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
