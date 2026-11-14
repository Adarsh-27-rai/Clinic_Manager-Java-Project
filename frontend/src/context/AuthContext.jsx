import { createContext, useContext, useState, useEffect } from 'react'
import { getStoredUser, loginUser, registerUser, logoutUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const loggedInUser = await loginUser(username, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (username, password) => {
    const registeredUser = await registerUser(username, password)
    setUser(registeredUser)
    return registeredUser
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
