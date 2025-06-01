"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Alert {
  type: "success" | "error" | "warning"
  message: string
}

export default function HomePage() {
  const router = useRouter()
  const [alert, setAlert] = useState<Alert | null>(null)
  const { isAuthenticated } = useAuth()

  const showAlert = (type: Alert["type"], message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = () => {
    router.push("/login")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Alert Component */}
      {alert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg backdrop-blur-md border ${
              alert.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-100"
                : alert.type === "error"
                  ? "bg-red-500/20 border-red-500/30 text-red-100"
                  : "bg-yellow-500/20 border-yellow-500/30 text-yellow-100"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium text-sm">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#f5f5dc] leading-none"
            style={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Smart Question Bank
          </h1>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-[#e6e6e6] max-w-3xl mx-auto leading-relaxed"
            style={{ fontWeight: 500 }}
          >
            Access previous year question papers based on your branch, semester, and subject
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8">
            <button onClick={handleLogin} className="glass-button w-full sm:w-auto">
              Login
            </button>
            <button onClick={handleSignup} className="glass-button w-full sm:w-auto">
              Signup
            </button>
          </div>

          {/* Trust Indicator */}
          <div className="pt-12">
            <p className="text-[#e6e6e6] text-sm opacity-80">Exclusively for JIIT Students • Verified Access Only</p>
          </div>
        </div>
      </main>
    </div>
  )
}
