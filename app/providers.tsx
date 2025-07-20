"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import { useDebateStore } from "@/lib/store"
import { useSession } from "next-auth/react"
import { getUserProfile } from "@/app/actions"
import { ThemeProvider } from "@/components/theme-provider"

function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const setCurrentUser = useDebateStore((state) => state.setCurrentUser)

  useEffect(() => {
    const fetchAndSetUser = async () => {
      if (status === "authenticated" && session?.user?.id) {
        const { user, error } = await getUserProfile(session.user.id)
        if (user) {
          setCurrentUser(user)
        } else if (error) {
          console.error("Failed to fetch user profile:", error)
          // Optionally clear current user if fetch fails
          setCurrentUser(null)
        }
      } else if (status === "unauthenticated") {
        setCurrentUser(null)
      }
    }

    fetchAndSetUser()
  }, [session, status, setCurrentUser])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </SessionProvider>
    </ThemeProvider>
  )
}
