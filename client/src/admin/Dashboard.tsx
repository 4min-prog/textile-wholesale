import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Category, Message, Product } from '../types'
import { formatDate } from '../config'
import { BoxIcon, TagsIcon, MailIcon } from '../components/Icons'

function StatCard({
  to,
  label,
  value,
  icon,
}: {
  to: string
  label: string
  value: number
  icon: ReactNode
}) {
  return (
    <Link to={to} className="group border border-white/10 bg-card p-5 transition-all duration-200 hover:border-gold/30 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold text-text sm:text-3xl">{value}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-text-dim/60">
            {label}
          </div>
        </div>
        <div className="text-text-dim/40 transition-colors group-hover:text-gold">{icon}</div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    api<Product[]>('/admin/products').then(setProducts).catch(() => {})
    api<Category[]>('/admin/categories').then(setCategories).catch(() => {})
    api<Message[]>('/admin/messages').then(setMessages).catch(() => {})
  }, [])

  const unread = messages.filter((m) => !m.is_read).length
  const recent = messages.slice(0, 5)

  return (
    <div>
      <h1 className="text-xl text-gold sm:text-2xl md:text-3xl">{t('admin.dashboardTitle')}</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard
          to="/admin/products"
          label={t('admin.statProducts')}
          value={products.length}
          icon={<BoxIcon className="h-7 w-7 sm:h-8 sm:w-8" />}
        />
        <StatCard
          to="/admin/categories"
          label={t('admin.statCategories')}
          value={categories.length}
          icon={<TagsIcon className="h-7 w-7 sm:h-8 sm:w-8" />}
        />
        <StatCard
          to="/admin/messages"
          label={t('admin.statMessages')}
          value={messages.length}
          icon={<MailIcon className="h-7 w-7 sm:h-8 sm:w-8" />}
        />
        <StatCard
          to="/admin/messages"
          label={t('admin.statUnread')}
          value={unread}
          icon={<span className="grid h-7 w-7 place-items-center border border-gold/40 text-sm text-gold sm:h-8 sm:w-8">{unread}</span>}
        />
      </div>

      <div className="mt-8 border border-white/10 bg-card">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 sm:px-6 sm:py-4">
          <h2 className="text-sm text-text sm:text-lg">{t('admin.recentMessages')}</h2>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-dark"
          >
            {t('common.viewAll')}
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-text-dim sm:py-12">{t('admin.noMessages')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t('admin.from')}</th>
                  <th className="hidden sm:table-cell">{t('contact.message')}</th>
                  <th>{t('admin.received')}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((m) => (
                  <tr key={m.id}>
                    <td className="font-medium text-text">
                      {m.name}
                      {!m.is_read && (
                        <span className="badge badge-gold ms-2">{t('admin.unread')}</span>
                      )}
                    </td>
                    <td className="max-w-xs truncate text-text-dim hidden sm:table-cell">{m.message}</td>
                    <td className="whitespace-nowrap text-text-dim">
                      {formatDate(m.created_at, i18n.language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
