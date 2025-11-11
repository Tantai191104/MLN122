import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { JSX } from 'react'

interface ProtectedRouteProps {
  children: JSX.Element
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}


