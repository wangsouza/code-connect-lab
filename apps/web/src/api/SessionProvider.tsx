/* eslint-disable react-refresh/only-export-components -- provider e hook useSession ficam juntos por coesão */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMe, type UserResponse } from './auth'
import { clearToken, getToken } from './tokenStorage'

interface SessionContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  loading: boolean
  refresh: () => Promise<void>
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      setUser(await getMe())
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      refresh,
      logout,
    }),
    [user, loading, refresh, logout],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession deve ser usado dentro de um SessionProvider')
  }
  return context
}
