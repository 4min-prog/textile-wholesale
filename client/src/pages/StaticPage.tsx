import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Page } from '../types'
import Spinner from '../components/Spinner'
import { paragraphs } from '../utils'

export default function StaticPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [page, setPage] = useState<Page | null | undefined>(undefined)

  useEffect(() => {
    setPage(undefined)
    api<Page>(`/pages/${slug}`)
      .then(setPage)
      .catch(() => setPage(null))
  }, [slug])

  if (page === undefined) return <Spinner />

  if (page === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl">{t('common.notFoundTitle')}</h1>
        <Link to="/" className="btn btn-gold mt-8">
          {t('common.backHome')}
        </Link>
      </div>
    )
  }

  const content = paragraphs(page[`content_${lng}` as keyof Pick<Page, 'content_tr' | 'content_en' | 'content_ar'>])

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-gold" />
        <span className="eyebrow">ALACA</span>
      </div>
      <h1 className="mt-4 text-4xl capitalize">{slug}</h1>
      <div className="mt-8 space-y-6">
        {content.map((p, i) => (
          <p key={i} className="leading-relaxed text-text-dim">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}
