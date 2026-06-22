import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from '../../api/tokenStorage'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
