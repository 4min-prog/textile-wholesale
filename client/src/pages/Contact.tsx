import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import { COMPANY, waLink } from '../config'
import { WhatsIcon } from '../components/Icons'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sending, setSending] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t('contact.required'))
      return
    }
    setSending(true)
    try {
      await api('/messages', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const info = [
    { label: t('contact.phone'), value: COMPANY.phone, href: COMPANY.phoneHref },
    {
      label: t('contact.whatsapp'),
      value: 'WhatsApp',
      href: waLink(t('wa.defaultText')),
      external: true,
    },
    { label: t('contact.email'), value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { label: t('contact.address'), value: COMPANY.address },
    { label: t('contact.hours'), value: COMPANY.hours },
  ]

  const set = (k: 'name' | 'email' | 'phone' | 'message') => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/60" />
            <span className="eyebrow">ALACA</span>
          </div>
          <h1 className="mt-5 text-3xl text-gold sm:text-4xl md:text-5xl">{t('contact.title')}</h1>
          <p className="mt-4 text-text-dim">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Info */}
          <div className="lg:col-span-2">
            <h2 className="text-xl text-gold sm:text-2xl">{t('contact.office')}</h2>
            <ul className="mt-6 space-y-5 sm:mt-8">
              {info.map((item) => (
                <li key={item.label} className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-widest text-text-dim/50">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="mt-1 inline-flex items-center gap-2 font-medium text-text hover:text-gold"
                    >
                      {item.label === t('contact.whatsapp') && (
                        <WhatsIcon className="h-4 w-4 text-gold" />
                      )}
                      {item.value}
                    </a>
                  ) : (
                    <span className="mt-1 font-medium text-text">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="border border-white/10 bg-card p-6 sm:p-8 md:p-10">
              <h2 className="text-xl text-gold sm:text-2xl">{t('contact.formTitle')}</h2>

              {success && (
                <div className="mt-6 border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-400">
                  {t('contact.success')}
                </div>
              )}
              {error && (
                <div className="mt-6 border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 grid gap-5 sm:mt-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="label">
                      {t('contact.name')}
                    </label>
                    <input
                      id="c-name"
                      className="input"
                      value={form.name}
                      onChange={set('name')}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="label">
                      {t('contact.emailLabel')}
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={set('email')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-phone" className="label">
                    {t('contact.phoneOptional')}
                  </label>
                  <input
                    id="c-phone"
                    type="tel"
                    className="input"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </div>
                <div>
                  <label htmlFor="c-message" className="label">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    className="input resize-y"
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>
                <div>
                  <button type="submit" disabled={sending} className="btn btn-gold">
                    {sending ? t('admin.saving') : t('contact.send')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <iframe
            title="ALACA TEXTILES location"
            src="https://www.google.com/maps?q=Gaziantep+Turkey&output=embed"
            className="h-72 w-full border border-white/10 bg-card sm:h-80"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  )
}
