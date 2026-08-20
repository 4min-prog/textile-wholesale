import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, clearToken } from '../api'
import { BoxIcon, TagsIcon, ImageIcon, FileIcon, MailIcon, LogOutIcon, MenuIcon, CloseIcon, SettingsIcon } from '../components/Icons'
import LanguageSwitcher from '../components/LanguageSwitcher'
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

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

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
    <div className="min-h-screen bg-navy">
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-dark border-r border-white/10 transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6 sm:h-20">
          <div className="grid h-9 w-9 place-items-center border border-gold/60 text-lg leading-none sm:h-10 sm:w-10">
            <span className="font-serif text-gold">A</span>
          </div>
          <div className="leading-none">
            <div className="font-serif text-base text-white sm:text-lg">ALACA</div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-gold sm:text-[10px]">
              Admin
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4 sm:py-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm font-medium transition-colors sm:py-3 ${
                  isActive
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {l.icon}
              {l.label}
            </NavLink>
          ))}

          <div className="my-3 border-t border-white/10" />

          <NavLink
            to="/admin/settings"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm font-medium transition-colors sm:py-3 ${
                isActive
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <SettingsIcon className="h-5 w-5" />
            {t('admin.settings')}
          </NavLink>
        </nav>

        <div className="border-t border-white/10 px-6 py-4 sm:py-5">
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          {admin && (
            <div className="mb-3 truncate text-xs text-white/40">{admin.email}</div>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/50 transition-colors hover:text-gold"
          >
            <LogOutIcon className="h-5 w-5" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-navy/95 px-4 backdrop-blur-md sm:h-16 md:hidden">
          <span className="font-serif text-base text-text">
            ALACA <span className="text-gold">Admin</span>
          </span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button type="button" onClick={() => setOpen(!open)} className="text-text" aria-label="Menu">
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-5 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
