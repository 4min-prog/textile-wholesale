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
      <section className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow">Atlas</span>
          </div>
          <h1 className="mt-5 text-4xl text-white md:text-5xl">{t('contact.title')}</h1>
          <p className="mt-4 text-white/60">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl">{t('contact.office')}</h2>
            <ul className="mt-8 space-y-5">
              {info.map((item) => (
                <li key={item.label} className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink/40">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="mt-1 inline-flex items-center gap-2 font-medium text-navy hover:text-gold-dark"
                    >
                      {item.label === t('contact.whatsapp') && (
                        <WhatsIcon className="h-4 w-4 text-gold-dark" />
                      )}
                      {item.value}
                    </a>
                  ) : (
                    <span className="mt-1 font-medium text-navy">{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="border border-cream-dark bg-white p-8 md:p-10">
              <h2 className="text-2xl">{t('contact.formTitle')}</h2>

              {success && (
                <div className="mt-6 border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-800">
                  {t('contact.success')}
                </div>
              )}
              {error && (
                <div className="mt-6 border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-8 grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
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
                    rows={6}
                    className="input resize-y"
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>
                <div>
                  <button type="submit" disabled={sending} className="btn-gold">
                    {sending ? t('admin.saving') : t('contact.send')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <iframe
            title="Atlas Textile location"
            src="https://www.google.com/maps?q=Kuyumcukent%20Merter%20Istanbul&output=embed"
            className="h-80 w-full border border-cream-dark bg-white"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  )
}
