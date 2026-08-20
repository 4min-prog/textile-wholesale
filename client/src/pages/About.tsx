import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Page } from '../types'
import Spinner from '../components/Spinner'
import { paragraphs } from '../utils'

export default function About() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [page, setPage] = useState<Page | null | undefined>(undefined)

  useEffect(() => {
    api<Page>('/pages/about')
      .then(setPage)
      .catch(() => setPage(null))
  }, [])

  const stats = [
    { value: '25+', label: t('about.yearsLabel') },
    { value: '1.2k+', label: t('about.clientsLabel') },
    { value: '40+', label: t('about.countriesLabel') },
    { value: '60k+', label: t('about.rollsLabel') },
  ]

  const content = page
    ? paragraphs(page[`content_${lng}` as keyof Pick<Page, 'content_tr' | 'content_en' | 'content_ar'>])
    : []

  return (
    <div>
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            <span className="eyebrow">ALACA</span>
          </div>
          <h1 className="mt-5 max-w-2xl text-3xl leading-tight text-gold sm:text-4xl md:text-5xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 max-w-xl text-text-dim">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {page === undefined ? (
          <Spinner />
        ) : (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl space-y-5">
              {content.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'text-base leading-relaxed text-text-dim sm:text-lg' : 'leading-relaxed text-text-dim/80'}
                >
                  {p}
                </p>
              ))}
              <Link to="/contact" className="btn btn-gold mt-6">
                {t('nav.contact')}
              </Link>
            </div>
            <div>
              <div className="relative">
                <div className="absolute -end-4 -top-4 h-20 w-20 border border-gold/40 sm:h-24 sm:w-24" />
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-card p-3">
                  <img
                    src="/uploads/seed/banner-weave.svg"
                    alt="ALACA TEKSTİTİL"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-3xl text-gold sm:text-4xl md:text-5xl">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-text-dim/60">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
