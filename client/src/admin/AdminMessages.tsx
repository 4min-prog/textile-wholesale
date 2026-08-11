import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Message } from '../types'
import Spinner from '../components/Spinner'
import { formatDate } from '../config'
import { TrashIcon } from '../components/Icons'

export default function AdminMessages() {
  const { t, i18n } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

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
    if (!window.confirm(t('admin.confirmDelete'))) return
    try {
      await api(`/admin/messages/${m.id}`, { method: 'DELETE' })
      load()
    } catch {
      /* ignore */
    }
  }

  const unread = messages.filter((m) => !m.is_read).length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl">{t('admin.messagesTitle')}</h1>
        {unread > 0 && <span className="badge badge-gold">{unread} {t('admin.unread')}</span>}
      </div>

      {loading ? (
        <Spinner />
      ) : messages.length === 0 ? (
        <div className="mt-8 border border-cream-dark bg-white px-6 py-16 text-center text-sm text-ink/50">
          {t('admin.noMessages')}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`border bg-white p-6 ${m.is_read ? 'border-cream-dark' : 'border-gold/40'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-base font-semibold text-navy">{m.name}</h2>
                    {!m.is_read && <span className="badge badge-gold">{t('admin.unread')}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                    <a href={`mailto:${m.email}`} className="hover:text-gold-dark">
                      {m.email}
                    </a>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{formatDate(m.created_at, i18n.language)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!m.is_read && (
                    <button type="button" className="btn btn-navy btn-sm" onClick={() => markRead(m)}>
                      {t('admin.markRead')}
                    </button>
                  )}
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(m)}>
                    <TrashIcon className="h-3.5 w-3.5" />
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/70">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
