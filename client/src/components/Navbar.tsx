import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import { LockIcon, MenuIcon, CloseIcon } from './Icons'

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/products', label: t('nav.products'), end: false },
    { to: '/categories', label: t('nav.categories'), end: false },
    { to: '/about', label: t('nav.about'), end: false },
    { to: '/contact', label: t('nav.contact'), end: false },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 pb-1.5 text-sm font-medium transition-colors ${
      isActive ? 'border-gold text-gold' : 'border-transparent text-white/70 hover:text-white'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gold/15 transition-colors duration-300 ${
        scrolled ? 'bg-navy/95 backdrop-blur-md' : 'bg-navy'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-gold/60 sm:h-11 sm:w-11">
            <span className="font-serif text-xl text-gold sm:text-2xl">A</span>
          </div>
          <div className="leading-none">
            <div className="font-serif text-lg text-white sm:text-xl">ALACA</div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-gold sm:text-[10px]">
              TEKSTİTİL
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

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-white/40 transition-colors hover:text-gold"
          >
            <LockIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('nav.admin')}</span>
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

      {/* Mobile menu with slide-down animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gold/15 bg-navy-dark px-4 pb-6 pt-4">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-sm transition-colors ${
                    isActive ? 'font-medium text-gold' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-white/10 pt-3 md:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
