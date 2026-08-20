import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Page } from '../types'
import Spinner from '../components/Spinner'
import { EditIcon } from '../components/Icons'

export default function AdminPages() {
  const { t } = useTranslation()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Page | null>(null)
  const [form, setForm] = useState({ content_tr: '', content_en: '', content_ar: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api<Page[]>('/admin/pages')
      .then(setPages)
      .catch(() => setPages([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startEdit = (p: Page) => {
    setEditing(p)
    setForm({ content_tr: p.content_tr, content_en: p.content_en, content_ar: p.content_ar })
    setError('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      await api(`/admin/pages/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) })
      load()
      setEditing(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-xl text-gold sm:text-2xl md:text-3xl">{t('admin.pagesTitle')}</h1>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-card sm:mt-8">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.slug')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium text-text">/{p.slug}</td>
                      <td>
                        <button type="button" className="btn btn-navy btn-sm" onClick={() => startEdit(p)}>
                          <EditIcon className="h-3.5 w-3.5" />
                          {t('admin.edit')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {editing && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-card p-5 sm:mt-8 sm:p-6 md:p-8">
              <h2 className="text-lg text-gold sm:text-xl">
                {t('admin.editPage')}: <span className="text-text-dim">/{editing.slug}</span>
              </h2>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
                <div>
                  <label className="label">{t('admin.contentTr')}</label>
                  <textarea
                    rows={6}
                    className="input resize-y"
                    value={form.content_tr}
                    onChange={(e) => setForm((f) => ({ ...f, content_tr: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">{t('admin.contentEn')}</label>
                  <textarea
                    rows={6}
                    className="input resize-y"
                    value={form.content_en}
                    onChange={(e) => setForm((f) => ({ ...f, content_en: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">{t('admin.contentAr')}</label>
                  <textarea
                    rows={6}
                    className="input resize-y"
                    value={form.content_ar}
                    onChange={(e) => setForm((f) => ({ ...f, content_ar: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                  <button type="button" className="btn btn-outline-gold" onClick={() => setEditing(null)}>
                    {t('admin.cancel')}
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-gold">
                    {saving ? t('admin.saving') : t('admin.save')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}
