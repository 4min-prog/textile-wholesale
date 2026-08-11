export const WHATSAPP_NUMBER = '905001112233'

export const COMPANY = {
  name: 'Atlas Textile',
  phone: '+90 212 555 0123',
  phoneHref: 'tel:+902125550123',
  email: 'sales@atlastextile.com',
  address: 'Kuyumcukent San. Sitesi, Merter, Istanbul, Türkiye',
  hours: 'Mon – Sat, 09:00 – 18:00 (TRT)',
}

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function formatPrice(n: number, locale: string): string {
  const l = locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar-EG' : 'en-US'
  return new Intl.NumberFormat(l, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n)
}

export function formatDate(iso: string, locale: string): string {
  const l = locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar-EG' : 'en-US'
  return new Date(iso).toLocaleString(l, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const DEFAULT_IMAGE = '/uploads/seed/fabric-cotton-twill.svg'
