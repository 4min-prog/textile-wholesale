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
      className="fixed bottom-6 end-6 z-40 grid h-14 w-14 place-items-center bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      aria-label="WhatsApp"
    >
      <WhatsIcon className="h-7 w-7" />
    </a>
  )
}
