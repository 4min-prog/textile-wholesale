import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../api'
import type { Category, Product } from '../types'
import Spinner from '../components/Spinner'
import { DEFAULT_IMAGE, formatPrice } from '../config'
import { EditIcon, TrashIcon, CloseIcon } from '../components/Icons'

interface FormState {
  name_tr: string
  name_en: string
  name_ar: string
  desc_tr: string
  desc_en: string
  desc_ar: string
  price: string
  min_order: string
  categoryId: string
  is_active: boolean
  images: string[]
}

const emptyForm: FormState = {
  name_tr: '',
  name_en: '',
  name_ar: '',
  desc_tr: '',
  desc_en: '',
  desc_ar: '',
  price: '',
  min_order: '',
  categoryId: '',
  is_active: true,
  images: [],
}

function ProductForm({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>(() =>
    product
      ? {
          name_tr: product.name_tr,
          name_en: product.name_en,
          name_ar: product.name_ar,
          desc_tr: product.desc_tr,
          desc_en: product.desc_en,
          desc_ar: product.desc_ar,
          price: String(product.price),
          min_order: String(product.min_order),
          categoryId: String(product.categoryId),
          is_active: product.is_active,
          images: product.images,
        }
      : emptyForm
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
      set('images')([...form.images, res.url])
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
    if (!form.name_en.trim() || !form.price || !form.categoryId) {
      setError(t('admin.required'))
      return
    }
    setSaving(true)
    const payload = {
      name_tr: form.name_tr,
      name_en: form.name_en,
      name_ar: form.name_ar,
      desc_tr: form.desc_tr,
      desc_en: form.desc_en,
      desc_ar: form.desc_ar,
      price: Number(form.price),
      min_order: Number(form.min_order || 0),
      categoryId: Number(form.categoryId),
      is_active: form.is_active,
      images: form.images,
    }
    try {
      if (product) await api(`/admin/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      else await api('/admin/products', { method: 'POST', body: JSON.stringify(payload) })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">{product ? t('admin.editProduct') : t('admin.addProduct')}</h2>
          <button type="button" onClick={onClose} className="text-ink/50 hover:text-navy" aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label className="label">{t('admin.category')}</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => set('categoryId')(e.target.value)}
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="label">{t('admin.nameTr')}</label>
              <input className="input" value={form.name_tr} onChange={(e) => set('name_tr')(e.target.value)} />
            </div>
            <div>
              <label className="label">{t('admin.nameEn')}</label>
              <input className="input" value={form.name_en} onChange={(e) => set('name_en')(e.target.value)} />
            </div>
            <div>
              <label className="label">{t('admin.nameAr')}</label>
              <input className="input" value={form.name_ar} onChange={(e) => set('name_ar')(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="label">{t('admin.price')}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input"
                value={form.price}
                onChange={(e) => set('price')(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t('admin.minOrder')}</label>
              <input
                type="number"
                min="0"
                className="input"
                value={form.min_order}
                onChange={(e) => set('min_order')(e.target.value)}
              />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-navy">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set('is_active')(e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                {t('admin.active')}
              </label>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="label">{t('admin.descTr')}</label>
              <textarea rows={4} className="input resize-y" value={form.desc_tr} onChange={(e) => set('desc_tr')(e.target.value)} />
            </div>
            <div className="sm:col-span-1">
              <label className="label">{t('admin.descEn')}</label>
              <textarea rows={4} className="input resize-y" value={form.desc_en} onChange={(e) => set('desc_en')(e.target.value)} />
            </div>
            <div className="sm:col-span-1">
              <label className="label">{t('admin.descAr')}</label>
              <textarea rows={4} className="input resize-y" value={form.desc_ar} onChange={(e) => set('desc_ar')(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">{t('admin.imageUpload')}</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={img + i} className="relative">
                  <img src={img} alt="" className="h-20 w-20 border border-cream-dark object-cover" />
                  <button
                    type="button"
                    onClick={() => set('images')(form.images.filter((_, j) => j !== i))}
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center bg-navy text-white hover:bg-red-600"
                    aria-label="Remove"
                  >
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="grid h-20 w-20 cursor-pointer place-items-center border border-dashed border-cream-dark text-gold-dark hover:border-gold">
                {uploading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-navy" />
                ) : (
                  <span className="text-2xl leading-none">+</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-cream-dark pt-5">
            <button type="button" onClick={onClose} className="btn btn-outline-gold">
              {t('admin.cancel')}
            </button>
            <button type="submit" disabled={saving || uploading} className="btn-gold">
              {saving ? t('admin.saving') : t('admin.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { t, i18n } = useTranslation()
  const lng = i18n.language
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      api<Product[]>('/admin/products').then(setProducts),
      api<Category[]>('/admin/categories').then(setCategories),
    ])
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (p: Product) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    try {
      await api(`/admin/products/${p.id}`, { method: 'DELETE' })
      load()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Error')
    }
  }

  const toggleActive = async (p: Product) => {
    try {
      await api(`/admin/products/${p.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name_tr: p.name_tr,
          name_en: p.name_en,
          name_ar: p.name_ar,
          desc_tr: p.desc_tr,
          desc_en: p.desc_en,
          desc_ar: p.desc_ar,
          price: p.price,
          min_order: p.min_order,
          categoryId: p.categoryId,
          is_active: !p.is_active,
          images: p.images,
        }),
      })
      load()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Error')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl">{t('admin.productsTitle')}</h1>
        <button
          type="button"
          className="btn-gold"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          {t('admin.addProduct')}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-8 border border-cream-dark bg-white">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">{t('admin.image')}</th>
                  <th>{t('admin.productName')}</th>
                  <th>{t('admin.category')}</th>
                  <th>{t('admin.price')}</th>
                  <th>{t('admin.minOrder')}</th>
                  <th>{t('admin.active')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.images[0] || DEFAULT_IMAGE}
                        alt=""
                        className="h-12 w-12 border border-cream-dark object-cover"
                      />
                    </td>
                    <td className="font-medium text-navy">
                      {p[`name_${lng}` as keyof Pick<Product, 'name_tr' | 'name_en' | 'name_ar'>]}
                    </td>
                    <td className="text-ink/60">
                      {p.category ? p.category[`name_${lng}` as keyof Pick<Category, 'name_tr' | 'name_en' | 'name_ar'>] : ''}
                    </td>
                    <td className="font-medium text-gold-dark">{formatPrice(p.price, lng)}</td>
                    <td className="text-ink/60">{p.min_order}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleActive(p)}
                        title="Toggle"
                      >
                        <span className={`badge ${p.is_active ? 'badge-green' : 'badge-gray'}`}>
                          {p.is_active ? t('admin.active') : t('admin.inactive')}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn btn-navy btn-sm"
                          onClick={() => {
                            setEditing(p)
                            setOpen(true)
                          }}
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                          {t('admin.edit')}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => remove(p)}
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          {t('admin.delete')}
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
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false)
            load()
          }}
        />
      )}
    </div>
  )
}
