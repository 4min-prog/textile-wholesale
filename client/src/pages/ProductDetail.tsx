import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import { WhatsIcon } from '../components/Icons'
import { DEFAULT_IMAGE, formatPrice, waLink } from '../config'
import { field } from '../utils'

export default function ProductDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [related, setRelated] = useState<Product[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setProduct(undefined)
    setIdx(0)
    api<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => setProduct(null))
  }, [id])

  useEffect(() => {
    if (!product?.categoryId) return
    api<Product[]>('/products')
      .then((list) =>
        setRelated(list.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 3))
      )
      .catch(() => {})
  }, [product?.categoryId, product?.id])

  if (product === undefined) return <Spinner />
  if (product === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl text-gold">{t('common.notFoundTitle')}</h1>
        <Link to="/products" className="btn btn-gold mt-8">
          {t('product.backToProducts')}
        </Link>
      </div>
    )
  }

  const name = field(product, 'name', lng)
  const desc = field(product, 'desc', lng)
  const categoryName = product.category ? field(product.category, 'name', lng) : ''
  const images = product.images.length ? product.images : [DEFAULT_IMAGE]
  const mainImage = images[idx] || DEFAULT_IMAGE
  const waText = `Hello, I am interested in "${name}" (${formatPrice(product.price, lng)}, min. order ${product.min_order}). Please send a wholesale quotation.`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-dim/50">
        <Link to="/" className="hover:text-gold">
          {t('common.home')}
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gold">
          {t('nav.products')}
        </Link>
        <span>/</span>
        <span className="text-text">{name}</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-card">
            <img src={mainImage} alt={name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`aspect-square w-16 overflow-hidden rounded-lg border sm:w-20 ${
                    i === idx ? 'border-gold' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {categoryName && (
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="eyebrow hover:text-gold-dark"
            >
              {categoryName}
            </Link>
          )}
          <h1 className="mt-3 text-2xl leading-tight text-gold sm:text-3xl md:text-4xl">{name}</h1>

          <div className="mt-6 flex items-baseline gap-3 border-y border-white/10 py-5">
            <span className="text-2xl font-semibold text-gold sm:text-3xl">
              {formatPrice(product.price, lng)}
            </span>
            <span className="text-sm text-text-dim">{t('product.perUnit')}</span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-text-dim/50">
                {t('product.minOrder')}
              </dt>
              <dd className="mt-1 font-medium text-text">{product.min_order}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-text-dim/50">
                {t('product.category')}
              </dt>
              <dd className="mt-1 font-medium text-text">{categoryName}</dd>
            </div>
          </dl>

          <a
            href={waLink(waText)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-gold mt-8 w-full sm:w-auto"
          >
            <WhatsIcon className="h-4 w-4" />
            {t('product.orderOnWhatsApp')}
          </a>

          {desc && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-text-dim/50">
                {t('product.description')}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-dim">
                {desc}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl text-gold sm:text-2xl">{t('product.related')}</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
