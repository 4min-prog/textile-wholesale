import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Banner, Category, Product } from '../types'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import CategoryIcon from '../components/CategoryIcon'
import Spinner from '../components/Spinner'
import { WhatsIcon } from '../components/Icons'
import { DEFAULT_IMAGE, waLink } from '../config'
import { field } from '../utils'

export default function Home() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api<Banner[]>('/banners'), api<Product[]>('/products'), api<Category[]>('/categories')])
      .then(([b, p, c]) => {
        setBanners(b)
        setProducts(p)
        setCategories(c)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hero = banners[0]
  const heroImage = hero?.image_url || DEFAULT_IMAGE
  const featured = products.slice(0, 6)
  const aboutImage = products[1]?.images[0] || DEFAULT_IMAGE

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[500px] items-center overflow-hidden sm:min-h-[560px]">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy/95" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 sm:text-left lg:px-8">
          <div className="mx-auto max-w-2xl sm:mx-0">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="h-px w-10 bg-gold/60" />
              <span className="eyebrow">{t('home.heroEyebrow')}</span>
              <span className="h-px w-10 bg-gold/60 sm:hidden" />
            </div>
            <h1 className="mt-6 text-3xl leading-tight text-gold sm:text-4xl md:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-text-dim sm:mx-0 sm:text-base md:text-lg">
              {t('home.heroSub')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 sm:justify-start">
              <Link to="/products" className="btn-gold">
                {t('home.heroCtaPrimary')}
              </Link>
              <Link to="/contact" className="btn-outline-white">
                {t('home.heroCtaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="ALACA"
          title={t('home.featured')}
          sub={t('home.featuredSub')}
        />
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/products" className="btn-navy">
            {t('common.viewAll')}
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow={t('home.categoriesEyebrow')}
            title={t('home.categoriesTitle')}
            sub={t('home.categoriesSub')}
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.slug}`}
                className="group flex flex-col items-center gap-5 border border-white/10 bg-navy p-8 text-center transition-all duration-200 hover:border-gold/30 sm:p-10"
              >
                <CategoryIcon slug={c.slug} className="h-12 w-12 text-gold" />
                <div>
                  <h3 className="text-lg text-text transition-colors group-hover:text-gold sm:text-xl">
                    {field(c, 'name', lng)}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-widest text-text-dim/50">
                    {c._count?.products ?? 0} {t('categories.inStock')}
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {t('common.explore')} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold/60" />
              <span className="eyebrow">{t('home.aboutEyebrow')}</span>
            </div>
            <h2 className="mt-5 text-2xl leading-tight text-gold sm:text-3xl md:text-4xl">{t('home.aboutTitle')}</h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-dim sm:text-base">
              {t('home.aboutText')}
            </p>
            <Link to="/about" className="btn-navy mt-8">
              {t('home.aboutCta')}
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -start-4 -top-4 h-20 w-20 border border-gold/40 sm:h-24 sm:w-24" />
            <div className="aspect-[4/3] w-full border border-white/10 bg-card p-3">
              <img src={aboutImage} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-2xl leading-tight text-gold sm:text-3xl md:text-4xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-text-dim">{t('home.ctaText')}</p>
          <a
            href={waLink(t('wa.defaultText'))}
            target="_blank"
            rel="noreferrer"
            className="btn-gold mt-8"
          >
            <WhatsIcon className="h-4 w-4" />
            {t('home.ctaButton')}
          </a>
        </div>
      </section>
    </div>
  )
}
