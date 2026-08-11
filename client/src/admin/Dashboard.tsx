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
    <Link to={to} className="group border border-cream-dark bg-white p-6 transition-shadow hover:shadow-lift">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-semibold text-navy">{value}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink/45">
            {label}
          </div>
        </div>
        <div className="text-gold-dark group-hover:text-gold">{icon}</div>
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
      <h1 className="text-2xl md:text-3xl">{t('admin.dashboardTitle')}</h1>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          to="/admin/products"
          label={t('admin.statProducts')}
          value={products.length}
          icon={<BoxIcon className="h-8 w-8" />}
        />
        <StatCard
          to="/admin/categories"
          label={t('admin.statCategories')}
          value={categories.length}
          icon={<TagsIcon className="h-8 w-8" />}
        />
        <StatCard
          to="/admin/messages"
          label={t('admin.statMessages')}
          value={messages.length}
          icon={<MailIcon className="h-8 w-8" />}
        />
        <StatCard
          to="/admin/messages"
          label={t('admin.statUnread')}
          value={unread}
          icon={<span className="grid h-8 w-8 place-items-center border border-gold/50 text-gold-dark">{unread}</span>}
        />
      </div>

      <div className="mt-10 border border-cream-dark bg-white">
        <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
          <h2 className="text-lg">{t('admin.recentMessages')}</h2>
          <Link
            to="/admin/messages"
            className="text-xs font-semibold uppercase tracking-widest text-gold-dark hover:text-navy"
          >
            {t('common.viewAll')}
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ink/50">{t('admin.noMessages')}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.from')}</th>
                <th>{t('contact.message')}</th>
                <th>{t('admin.received')}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((m) => (
                <tr key={m.id}>
                  <td className="font-medium text-navy">
                    {m.name}
                    {!m.is_read && (
                      <span className="badge badge-gold ms-2">{t('admin.unread')}</span>
                    )}
                  </td>
                  <td className="max-w-xs truncate text-ink/60">{m.message}</td>
                  <td className="whitespace-nowrap text-ink/50">
                    {formatDate(m.created_at, i18n.language)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
