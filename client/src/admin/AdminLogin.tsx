import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api, setToken } from '../api'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function AdminLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/admin', { replace: true })
  }, [navigate])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(res.token)
      navigate('/admin', { replace: true })
    } catch {
      setError(t('admin.invalid'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div className="grid h-14 w-14 place-items-center border border-gold/60 text-3xl leading-none">
          <span className="font-serif text-gold">A</span>
        </div>
        <div>
          <div className="font-serif text-2xl text-white">Atlas Textile</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
            Admin
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm border border-gold/20 bg-white p-8">
        <h1 className="text-xl">{t('admin.loginTitle')}</h1>
        {error && (
          <div className="mt-4 border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="a-email" className="label">
              {t('admin.email')}
            </label>
            <input
              id="a-email"
              type="email"
              autoComplete="username"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="a-pass" className="label">
              {t('admin.password')}
            </label>
            <input
              id="a-pass"
              type="password"
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? t('admin.saving') : t('admin.signIn')}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <LanguageSwitcher />
      </div>
    </div>
  )
}
