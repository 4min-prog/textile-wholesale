import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Category } from '../types'
import CategoryIcon from '../components/CategoryIcon'
import Spinner from '../components/Spinner'
import { field } from '../utils'

export default function Categories() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<Category[]>('/categories')
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold/60" />
          <span className="eyebrow">ALACA</span>
        </div>
        <h1 className="mt-4 text-3xl text-gold sm:text-4xl">{t('categories.title')}</h1>
        <p className="mt-3 text-text-dim">{t('categories.subtitle')}</p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.slug}`}
              className="group flex flex-col gap-6 rounded-2xl border border-white/10 bg-navy p-8 transition-all duration-200 hover:border-gold/30 sm:p-10"
            >
              <CategoryIcon slug={c.slug} className="h-14 w-14 text-gold" />
              <div>
                <h2 className="text-xl text-text transition-colors group-hover:text-gold sm:text-2xl">
                  {field(c, 'name', lng)}
                </h2>
                <p className="mt-2 text-xs uppercase tracking-widest text-text-dim/50">
                  {c._count?.products ?? 0} {t('categories.inStock')}
                </p>
              </div>
              <span className="mt-auto text-xs font-semibold uppercase tracking-widest text-gold">
                {t('common.explore')} →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
