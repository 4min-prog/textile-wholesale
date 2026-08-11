import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { LockIcon, MenuIcon, CloseIcon } from './Icons'

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/products', label: t('nav.products'), end: false },
    { to: '/categories', label: t('nav.categories'), end: false },
    { to: '/about', label: t('nav.about'), end: false },
    { to: '/contact', label: t('nav.contact'), end: false },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 pb-1.5 text-sm font-medium transition-colors ${
      isActive ? 'border-gold text-gold' : 'border-transparent text-white/75 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="grid h-11 w-11 place-items-center border border-gold/60 text-2xl leading-none">
            <span className="font-serif text-gold">A</span>
          </div>
          <div className="leading-none">
            <div className="font-serif text-xl text-white">Atlas</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
              Textile
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-gold"
          >
            <LockIcon className="h-3.5 w-3.5" />
            {t('nav.admin')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-white lg:hidden"
            aria-label="Menu"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-navy-dark px-4 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'font-medium text-gold' : 'text-white/75 hover:text-white'
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
