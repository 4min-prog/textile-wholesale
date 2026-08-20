import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-28 text-center">
      <div className="font-serif text-7xl text-gold">404</div>
      <h1 className="mt-4 text-3xl">{t('notFound.title')}</h1>
      <p className="mt-3 text-text-dim">{t('notFound.text')}</p>
      <Link to="/" className="btn btn-gold mt-10">
        {t('notFound.back')}
      </Link>
    </div>
  )
}
