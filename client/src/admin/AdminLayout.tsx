import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, clearToken } from '../api'
import { BoxIcon, TagsIcon, ImageIcon, FileIcon, MailIcon, LogOutIcon, MenuIcon, CloseIcon } from '../components/Icons'
import type { Admin } from '../types'

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  )
}

export default function AdminLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    api<Admin>('/admin/me')
      .then(setAdmin)
      .catch(() => {})
  }, [])

  const links = [
    { to: '/admin', label: t('admin.dashboard'), end: true, icon: <DashboardIcon className="h-5 w-5" /> },
    { to: '/admin/products', label: t('admin.products'), end: false, icon: <BoxIcon className="h-5 w-5" /> },
    { to: '/admin/categories', label: t('admin.categories'), end: false, icon: <TagsIcon className="h-5 w-5" /> },
    { to: '/admin/banners', label: t('admin.banners'), end: false, icon: <ImageIcon className="h-5 w-5" /> },
    { to: '/admin/pages', label: t('admin.pages'), end: false, icon: <FileIcon className="h-5 w-5" /> },
    { to: '/admin/messages', label: t('admin.messages'), end: false, icon: <MailIcon className="h-5 w-5" /> },
  ]

  const logout = () => {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-dark transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid h-10 w-10 place-items-center border border-gold/60 text-xl leading-none">
            <span className="font-serif text-gold">A</span>
          </div>
          <div className="leading-none">
            <div className="font-serif text-lg text-white">Atlas</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
              Admin
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-gold bg-navy text-gold'
                    : 'border-transparent text-white/60 hover:text-white'
                }`
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-6 py-5">
          {admin && (
            <div className="mb-4 truncate text-xs text-white/50">{admin.email}</div>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:text-gold"
          >
            <LogOutIcon className="h-5 w-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cream-dark bg-white px-4 md:hidden">
          <span className="font-serif text-lg text-navy">
            Atlas <span className="text-gold-dark">Admin</span>
          </span>
          <button type="button" onClick={() => setOpen(true)} className="text-navy" aria-label="Menu">
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </header>

        <main className="p-5 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
