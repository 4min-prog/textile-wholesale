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
      <section className="relative flex min-h-[560px] items-center overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow">{t('home.heroEyebrow')}</span>
            </div>
            <h1 className="mt-6 text-4xl leading-tight text-white md:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {t('home.heroSub')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Atlas"
          title={t('home.featured')}
          sub={t('home.featuredSub')}
        />
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/products" className="btn-navy">
            {t('common.viewAll')}
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-cream-dark/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('home.categoriesEyebrow')}
            title={t('home.categoriesTitle')}
            sub={t('home.categoriesSub')}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.slug}`}
                className="group flex flex-col items-center gap-5 bg-navy p-10 text-center transition-colors hover:bg-navy-light"
              >
                <CategoryIcon slug={c.slug} className="h-12 w-12 text-gold" />
                <div>
                  <h3 className="text-xl text-white transition-colors group-hover:text-gold">
                    {field(c, 'name', lng)}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-widest text-white/40">
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
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow">{t('home.aboutEyebrow')}</span>
            </div>
            <h2 className="mt-5 text-3xl leading-tight md:text-4xl">{t('home.aboutTitle')}</h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/60">
              {t('home.aboutText')}
            </p>
            <Link to="/about" className="btn-navy mt-9">
              {t('home.aboutCta')}
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -start-4 -top-4 h-24 w-24 border border-gold" />
            <div className="aspect-[4/3] w-full border border-cream-dark bg-white p-3">
              <img src={aboutImage} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-navy">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl leading-tight text-white md:text-4xl">{t('home.ctaTitle')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/65">{t('home.ctaText')}</p>
          <a
            href={waLink(t('wa.defaultText'))}
            target="_blank"
            rel="noreferrer"
            className="btn-gold mt-9"
          >
            <WhatsIcon className="h-4 w-4" />
            {t('home.ctaButton')}
          </a>
        </div>
      </section>
    </div>
  )
}
