"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { AlertCircle, CheckCircle, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Alert {
  type: "success" | "error" | "warning"
  message: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const showAlert = (type: Alert["type"], message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!formData.email.endsWith("@mail.jiit.ac.in")) {
      newErrors.email = "Use your JIIT email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      
      if (success) {
        showAlert("success", "Login successful!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        showAlert("error", "Invalid credentials or account not found. Please check your email and password.")
      }
    } catch (error) {
      showAlert("error", "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Alert Component */}
      {alert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border ${
              alert.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-100"
                : alert.type === "error"
                  ? "bg-red-500/20 border-red-500/30 text-red-100"
                  : "bg-yellow-500/20 border-yellow-500/30 text-yellow-100"
            }`}
          >
            {alert.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="glass-card">
            <h1 className="text-3xl font-bold text-[#f5f5dc] text-center mb-8">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[#e6e6e6] text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                  placeholder="your.name@mail.jiit.ac.in"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-[#e6e6e6] text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-[#f5f5dc] hover:underline text-sm">
                Forgot password?
              </Link>
            </div>

            {/* Signup Link */}
            <div className="text-center mt-6">
              <p className="text-[#e6e6e6] text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#f5f5dc] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
