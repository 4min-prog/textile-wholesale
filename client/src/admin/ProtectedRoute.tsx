import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { api, clearToken } from '../api'
import Spinner from '../components/Spinner'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    api('/admin/me')
      .then(() => setValid(true))
      .catch(() => {
        clearToken()
        setValid(false)
      })
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Spinner />
      </div>
    )
  }

  if (!valid) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
