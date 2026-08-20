import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Category } from '../types'
import Spinner from '../components/Spinner'
import { EditIcon, TrashIcon, CloseIcon } from '../components/Icons'
import { slugify } from '../utils'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'

interface FormState {
  name_tr: string
  name_en: string
  name_ar: string
  slug: string
}

function CategoryForm({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>(() =>
    category
      ? { name_tr: category.name_tr, name_en: category.name_en, name_ar: category.name_ar, slug: category.slug }
      : { name_tr: '', name_en: '', name_ar: '', slug: '' }
  )
  const [slugTouched, setSlugTouched] = useState(!!category)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const onNameEn = (v: string) => {
    setForm((f) => ({
      ...f,
      name_en: v,
      slug: slugTouched ? f.slug : slugify(v),
    }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name_en.trim() || !form.name_ar.trim() || !form.name_tr.trim() || !form.slug.trim()) {
      setError(t('admin.required'))
      return
    }
    setSaving(true)
    try {
      if (category)
        await api(`/admin/categories/${category.id}`, { method: 'PUT', body: JSON.stringify(form) })
      else await api('/admin/categories', { method: 'POST', body: JSON.stringify(form) })
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
          <h2 className="text-lg text-gold sm:text-xl">{category ? t('admin.editCategory') : t('admin.addCategory')}</h2>
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
            <label className="label">{t('admin.nameTr')}</label>
            <input className="input" value={form.name_tr} onChange={(e) => set('name_tr')(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('admin.nameEn')}</label>
            <input className="input" value={form.name_en} onChange={(e) => onNameEn(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('admin.nameAr')}</label>
            <input className="input" value={form.name_ar} onChange={(e) => set('name_ar')(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('admin.slug')}</label>
            <input
              className="input"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug')(e.target.value)
              }}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={onClose} className="btn btn-outline-gold">
              {t('admin.cancel')}
            </button>
            <button type="submit" disabled={saving} className="btn btn-gold">
              {saving ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCategories() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<Category | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const load = () => {
    setLoading(true)
    api<Category[]>('/admin/categories')
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (c: Category) => {
    try {
      await api(`/admin/categories/${c.id}`, { method: 'DELETE' })
      setToast({ type: 'success', message: t('admin.deleted') })
      load()
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Error' })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl text-gold sm:text-2xl md:text-3xl">{t('admin.categoriesTitle')}</h1>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          {t('admin.addCategory')}
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
                  <th>{t('admin.nameEn')}</th>
                  <th>{t('admin.slug')}</th>
                  <th>{t('admin.productsCount')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium text-text">{c[`name_${lng}` as keyof Pick<Category, 'name_tr' | 'name_en' | 'name_ar'>]}</td>
                    <td className="text-text-dim">/{c.slug}</td>
                    <td className="text-text-dim">{c._count?.products ?? 0}</td>
                    <td>
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          className="btn btn-navy btn-sm"
                          onClick={() => {
                            setEditing(c)
                            setOpen(true)
                          }}
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{t('admin.edit')}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirmTarget(c)}
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
        <CategoryForm
          category={editing}
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
