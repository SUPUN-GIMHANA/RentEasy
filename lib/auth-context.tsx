"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { api, getStoredUser } from "./api-client"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  phoneNumber?: string
  address?: string
  city?: string
  country?: string
  profileImageUrl?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: any) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = getStoredUser()
        if (storedUser) {
          // Verify token is still valid
          const userData = await api.users.getProfile()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to load user:", error)
        api.auth.logout()
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password })
      // Fetch full user profile after login
      const userData = await api.users.getProfile()
      setUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        profileImageUrl: userData.profileImageUrl,
      })
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const signup = async (data: any) => {
    try {
      await api.auth.signup(data)
      // Auto login after signup
      const success = await login(data.email, data.password)
      return success
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }

  const logout = () => {
    api.auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
