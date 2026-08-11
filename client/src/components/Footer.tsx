import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Category } from '../types'
import { COMPANY, waLink } from '../config'
import { WhatsIcon, LockIcon } from './Icons'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api<Category[]>('/categories')
      .then(setCategories)
      .catch(() => {})
  }, [])

  const name = (c: Category) =>
    c[`name_${i18n.language}` as keyof Pick<Category, 'name_tr' | 'name_en' | 'name_ar'>]

  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-dark text-white/65">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center border border-gold/60 text-xl leading-none">
              <span className="font-serif text-gold">A</span>
            </div>
            <div className="leading-none">
              <div className="font-serif text-lg text-white">Atlas</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
                Textile
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{t('footer.blurb')}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">
            {t('footer.quickLinks')}
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: '/', label: t('nav.home') },
              { to: '/products', label: t('nav.products') },
              { to: '/categories', label: t('nav.categories') },
              { to: '/about', label: t('nav.about') },
              { to: '/contact', label: t('nav.contact') },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">
            {t('footer.categories')}
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/products?category=${c.slug}`}
                  className="transition-colors hover:text-gold"
                >
                  {name(c)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">
            {t('footer.contact')}
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={COMPANY.phoneHref} className="transition-colors hover:text-gold">
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-gold">
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a
                href={waLink(t('wa.defaultText'))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-gold"
              >
                <WhatsIcon className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li className="text-white/50">{COMPANY.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/40 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} Atlas Textile. {t('footer.rights')}
          </p>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 uppercase tracking-widest transition-colors hover:text-gold"
          >
            <LockIcon className="h-3 w-3" /> {t('nav.admin')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
