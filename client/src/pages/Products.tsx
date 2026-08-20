import { useEffect, useState, useRef } from 'react'
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
  const scrollRef = useRef<HTMLDivElement>(null)

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold/60" />
          <span className="eyebrow">ALACA</span>
        </div>
        <h1 className="mt-4 text-3xl text-gold sm:text-4xl">{t('products.title')}</h1>
        <p className="mt-3 text-text-dim">{t('products.subtitle')}</p>
      </div>

      {/* Mobile: horizontal scroll category filter */}
      <div className="mt-8 lg:hidden" ref={scrollRef}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`shrink-0 rounded-none border px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${
              !category
                ? 'border-gold bg-gold text-navy'
                : 'border-white/15 bg-card text-text-dim hover:border-gold/40'
            }`}
          >
            {t('products.allCategories')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={`shrink-0 rounded-none border px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${
                category === c.slug
                  ? 'border-gold bg-gold text-navy'
                  : 'border-white/15 bg-card text-text-dim hover:border-gold/40'
              }`}
            >
              {field(c, 'name', lng)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* Desktop: sidebar filter */}
        <aside className="hidden lg:col-span-1 lg:block">
          <div className="border border-white/10 bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-dim">
              {t('products.allCategories')}
            </h3>
            <ul className="mt-4 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className={`w-full px-3 py-2 text-start text-sm transition-colors ${
                    !category
                      ? 'bg-gold/10 font-medium text-gold'
                      : 'text-text-dim hover:bg-white/5 hover:text-text'
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
                        ? 'bg-gold/10 font-medium text-gold'
                        : 'text-text-dim hover:bg-white/5 hover:text-text'
                    }`}
                  >
                    <span>{field(c, 'name', lng)}</span>
                    <span className="text-xs text-text-dim/50">{c._count?.products ?? 0}</span>
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
                className="text-sm font-medium uppercase tracking-widest text-gold hover:text-gold-dark"
              >
                {t('products.clearFilters')}
              </button>
            )}
          </div>

          <p className="mt-5 text-sm text-text-dim/60">
            {loading ? t('common.loading') : `${products.length} ${t('products.results')}`}
          </p>

          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="border border-white/10 bg-card px-6 py-20 text-center">
              <p className="text-text-dim">{t('products.noResults')}</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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
