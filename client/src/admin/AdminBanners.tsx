import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Banner } from '../types'
import Spinner from '../components/Spinner'
import { EditIcon, TrashIcon, CloseIcon } from '../components/Icons'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

interface FormState {
  image_url: string
  title_tr: string
  title_en: string
  title_ar: string
  is_active: boolean
}

function BannerForm({
  banner,
  onClose,
  onSaved,
}: {
  banner: Banner | null
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>(() =>
    banner
      ? {
          image_url: banner.image_url,
          title_tr: banner.title_tr,
          title_en: banner.title_en,
          title_ar: banner.title_ar,
          is_active: banner.is_active,
        }
      : { image_url: '', title_tr: '', title_en: '', title_ar: '', is_active: true }
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    setUploading(true)
    setError('')
    try {
      const res = await api<{ url: string }>('/admin/upload', { method: 'POST', body: fd })
      set('image_url')(res.url)
    } catch {
      setError(t('admin.uploadFailed'))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.image_url || !form.title_en.trim()) {
      setError(t('admin.required'))
      return
    }
    setSaving(true)
    try {
      if (banner)
        await api(`/admin/banners/${banner.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await api('/admin/banners', { method: 'POST', body: JSON.stringify(form) })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-card p-5 shadow-2xl sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-gold sm:text-xl">{t('admin.addBanner')}</h2>
          <button type="button" onClick={onClose} className="text-text-dim hover:text-text" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
          <div>
            <label className="label">{t('admin.image')}</label>
            <div className="flex items-start gap-4">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="h-28 w-48 rounded-xl border border-white/10 object-cover sm:h-32 sm:w-56" />
              ) : (
                <div className="grid h-28 w-48 place-items-center rounded-xl border border-dashed border-white/20 text-text-dim/40 sm:h-32 sm:w-56">
                  {t('admin.image')}
                </div>
              )}
              <label className="btn btn-navy btn-sm cursor-pointer">
                {uploading ? t('admin.saving') : t('admin.upload')}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            </div>
          </div>

          <div>
            <label className="label">{t('admin.titleTr')}</label>
            <input className="input" value={form.title_tr} onChange={(e) => set('title_tr')(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('admin.titleEn')}</label>
            <input className="input" value={form.title_en} onChange={(e) => set('title_en')(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('admin.titleAr')}</label>
            <input className="input" value={form.title_ar} onChange={(e) => set('title_ar')(e.target.value)} />
          </div>
          <div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active')(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              {t('admin.active')}
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={onClose} className="btn btn-outline-gold">
              {t('admin.cancel')}
            </button>
            <button type="submit" disabled={saving || uploading} className="btn btn-gold">
              {saving ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBanners() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<Banner | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const load = () => {
    setLoading(true)
    api<Banner[]>('/admin/banners')
      .then(setBanners)
      .catch(() => setBanners([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (b: Banner) => {
    try {
      await api(`/admin/banners/${b.id}`, { method: 'DELETE' })
      setToast({ type: 'success', message: t('admin.deleted') })
      load()
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Error' })
    }
  }

  const toggleActive = async (b: Banner) => {
    try {
      await api(`/admin/banners/${b.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          image_url: b.image_url,
          title_tr: b.title_tr,
          title_en: b.title_en,
          title_ar: b.title_ar,
          is_active: !b.is_active,
        }),
      })
      load()
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Error' })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl text-gold sm:text-2xl md:text-3xl">{t('admin.bannersTitle')}</h1>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          {t('admin.addBanner')}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-card sm:mt-8">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-20 sm:w-24">{t('admin.image')}</th>
                  <th>{t('admin.titleEn')}</th>
                  <th>{t('admin.active')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <img src={b.image_url} alt="" className="h-10 w-16 rounded-lg border border-white/10 object-cover sm:h-14 sm:w-24" />
                    </td>
                    <td className="font-medium text-text">
                      {b[`title_${lng}` as keyof Pick<Banner, 'title_tr' | 'title_en' | 'title_ar'>]}
                    </td>
                    <td>
                      <button type="button" onClick={() => toggleActive(b)} title="Toggle">
                        <span className={`badge rounded-full ${b.is_active ? 'badge-green' : 'badge-gray'}`}>
                          {b.is_active ? t('admin.active') : t('admin.inactive')}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          className="btn btn-navy btn-sm"
                          onClick={() => {
                            setEditing(b)
                            setOpen(true)
                          }}
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{t('admin.edit')}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmTarget(b)}
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{t('admin.delete')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && (
        <BannerForm
          banner={editing}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false)
            setToast({ type: 'success', message: t('admin.saved') })
            load()
          }}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          message={t('admin.confirmDelete')}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={() => {
            setConfirmTarget(null)
            remove(confirmTarget)
          }}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
