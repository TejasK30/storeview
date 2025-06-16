"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProfile } from "@/lib/services/authService"
import { api } from "@/lib/services/api"

type Role = "system_admin" | "store_owner" | "user"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  storeId?: string // storeId will be defined for store_owner role
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => void
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile()

        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          ...(profile.role === "store_owner" && { storeId: profile.store.id }), // set storeId only for store_owner
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    api.get("/auth/logout")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
