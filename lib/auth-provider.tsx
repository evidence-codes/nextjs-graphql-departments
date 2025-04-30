"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { useCookies } from "react-cookie"

type User = {
  id: string
  username: string
}

type AuthContextType = {
  user: User | null
  login: (token: string) => void
  logout: () => void
  getToken: () => Promise<string | null>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookie, removeCookie] = useCookies(["auth-token"])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if we have a token in cookies
    const token = cookies["auth-token"]
    if (token) {
      try {
        // Decode the token to get user info
        const decoded = jwtDecode<User & { exp: number }>(token)

        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp < currentTime) {
          handleLogout()
          return
        }

        setUser({
          id: decoded.id,
          username: decoded.username,
        })
      } catch (error) {
        handleLogout()
      }
    }
    setIsLoading(false)
  }, [cookies])

  useEffect(() => {
    // Redirect unauthenticated users to login
    if (!isLoading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = (token: string) => {
    // Set token in cookies (secure, httpOnly for production)
    setCookie("auth-token", token, {
      path: "/",
      maxAge: 86400, // 1 day
      sameSite: "strict",
      // secure: process.env.NODE_ENV === "production", // Uncomment in production
    })

    try {
      const decoded = jwtDecode<User>(token)
      setUser({
        id: decoded.id,
        username: decoded.username,
      })
      router.push("/departments")
    } catch (error) {
      console.error("Failed to decode token", error)
    }
  }

  const handleLogout = () => {
    removeCookie("auth-token", { path: "/" })
    setUser(null)
  }

  const getToken = async (): Promise<string | null> => {
    return cookies["auth-token"] || null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout: handleLogout,
        getToken,
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
