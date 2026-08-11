import { useTranslation } from 'react-i18next'
import { waLink } from '../config'
import { WhatsIcon } from './Icons'

export default function WhatsAppButton() {
  const { t } = useTranslation()
  return (
    <a
      href={waLink(t('wa.defaultText'))}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 end-6 z-40 grid h-14 w-14 place-items-center bg-gold text-navy shadow-lg transition-colors hover:bg-gold-dark"
      aria-label="WhatsApp"
    >
      <WhatsIcon className="h-7 w-7" />
    </a>
  )
}
