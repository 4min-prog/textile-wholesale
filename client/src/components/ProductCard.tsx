import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../types'
import { DEFAULT_IMAGE, formatPrice } from '../config'
import { field } from '../utils'

export default function ProductCard({ product }: { product: Product }) {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const name = product[`name_${lng}` as keyof Product] as string
  const image = product.images[0] || DEFAULT_IMAGE

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block border border-cream-dark bg-white transition-shadow duration-200 hover:shadow-lift"
    >
      <div className="aspect-square w-full overflow-hidden bg-cream">
        <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-ink/40">
          {product.category ? field(product.category, 'name', lng) : ''}
        </div>
        <h3 className="mt-1.5 text-base font-medium leading-snug text-navy">{name}</h3>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="font-semibold text-gold-dark">{formatPrice(product.price, lng)}</span>
          <span className="text-xs text-ink/45">
            {t('common.minOrder')} {product.min_order}
          </span>
        </div>
      </div>
    </Link>
  )
}
