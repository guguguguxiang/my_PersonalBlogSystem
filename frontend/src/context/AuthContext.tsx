import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string | null
}

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: { token: string; user: User }) => void
  logout: () => void
  updateUserInfo: (data: Partial<User>) => void
}

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(() => {
    const userText = localStorage.getItem(USER_KEY)
    return userText ? (JSON.parse(userText) as User) : null
  })

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  const login = useCallback((payload: { token: string; user: User }) => {
    setToken(payload.token)
    setUser(payload.user)
    localStorage.setItem(TOKEN_KEY, payload.token)
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
  }, [])

  const updateUserInfo = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) {
        return prev
      }

      const nextUser = { ...prev, ...data }
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      return nextUser
    })
  }, [])

  useEffect(() => {
    const handleGlobalLogout = () => {
      logout()
    }

    window.addEventListener('auth:logout', handleGlobalLogout)
    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout)
    }
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateUserInfo,
    }),
    [user, token, login, logout, updateUserInfo],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }

  return context
}
