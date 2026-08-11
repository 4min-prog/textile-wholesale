import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import tr from './locales/tr'
import en from './locales/en'
import ar from './locales/ar'

const saved = localStorage.getItem('lang') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: saved,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

function applyDir(lng: string) {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
}

applyDir(i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
  applyDir(lng)
})

export default i18n
