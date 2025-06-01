"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ProtectRouteProps {
  children: React.ReactNode
}

export function ProtectRoute({ children }: ProtectRouteProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const userRegistered = localStorage.getItem("userRegistered")
      const userEmail = localStorage.getItem("userEmail")

      if (userRegistered && userEmail && userEmail.endsWith("@mail.jiit.ac.in")) {
        setIsAuthenticated(true)
      } else {
        alert("Please sign up first using your JIIT email address.")
        router.push("/")
        return
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#f5f5dc] text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
