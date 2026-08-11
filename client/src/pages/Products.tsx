import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Category, Product } from '../types'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import { field } from '../utils'

export default function Products() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const q = searchParams.get('q') ?? ''
  const [text, setText] = useState(q)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const p = new URLSearchParams(searchParams)
      if (text.trim()) p.set('q', text.trim())
      else p.delete('q')
      if (p.toString() !== searchParams.toString()) setSearchParams(p, { replace: true })
    }, 350)
    return () => clearTimeout(timer)
  }, [text, searchParams, setSearchParams])

  useEffect(() => {
    api<Category[]>('/categories')
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (category) p.set('category', category)
    if (q) p.set('q', q)
    api<Product[]>(`/products?${p.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, q])

  const setCategory = (slug: string) => {
    const p = new URLSearchParams(searchParams)
    if (slug) p.set('category', slug)
    else p.delete('category')
    setSearchParams(p)
  }

  const clearAll = () => setSearchParams(new URLSearchParams())

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow">Atlas</span>
        </div>
        <h1 className="mt-4 text-4xl">{t('products.title')}</h1>
        <p className="mt-3 text-ink/55">{t('products.subtitle')}</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-4">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <div className="border border-cream-dark bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-navy/50">
              {t('products.allCategories')}
            </h3>
            <ul className="mt-4 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className={`w-full px-3 py-2 text-start text-sm transition-colors ${
                    !category
                      ? 'bg-navy font-medium text-gold'
                      : 'text-ink/70 hover:bg-cream hover:text-navy'
                  }`}
                >
                  {t('products.allCategories')}
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setCategory(c.slug)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-start text-sm transition-colors ${
                      category === c.slug
                        ? 'bg-navy font-medium text-gold'
                        : 'text-ink/70 hover:bg-cream hover:text-navy'
                    }`}
                  >
                    <span>{field(c, 'name', lng)}</span>
                    <span className="text-xs text-white/40">{c._count?.products ?? 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('products.searchPlaceholder')}
              className="input max-w-md"
            />
            {(category || q) && (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-medium uppercase tracking-widest text-gold-dark hover:text-navy"
              >
                {t('products.clearFilters')}
              </button>
            )}
          </div>

          <p className="mt-6 text-sm text-ink/50">
            {loading ? t('common.loading') : `${products.length} ${t('products.results')}`}
          </p>

          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="border border-cream-dark bg-white px-6 py-20 text-center">
              <p className="text-ink/55">{t('products.noResults')}</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
