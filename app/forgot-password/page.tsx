"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { AlertCircle, CheckCircle, X, Eye, EyeOff } from "lucide-react"

interface Alert {
  type: "success" | "error" | "warning"
  message: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const showAlert = (type: Alert["type"], message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Check if user is registered
    const userRegistered = localStorage.getItem("userRegistered")
    const userEmail = localStorage.getItem("userEmail")

    if (!userRegistered || !userEmail) {
      showAlert("error", "No account found. Please sign up first.")
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // Update password in localStorage
      localStorage.setItem("userPassword", formData.newPassword)

      // Automatically log the user in
      localStorage.setItem("userLoggedIn", "true")

      showAlert("success", "Password updated successfully! Logging you in...")

      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)

      setIsLoading(false)
    }, 800)
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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" }
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-red-400" }
    if (password.length < 8) return { strength: 2, text: "Fair", color: "text-yellow-400" }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, text: "Strong", color: "text-green-400" }
    }
    return { strength: 3, text: "Good", color: "text-blue-400" }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

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
            <h1 className="text-3xl font-bold text-[#f5f5dc] text-center mb-8">Set New Password</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-[#e6e6e6] text-sm font-medium mb-2">
                  Enter New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="glass-input w-full pr-12"
                    placeholder="Create a strong password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 1
                              ? "bg-red-500 w-1/4"
                              : passwordStrength.strength === 2
                                ? "bg-yellow-500 w-2/4"
                                : passwordStrength.strength === 3
                                  ? "bg-blue-500 w-3/4"
                                  : passwordStrength.strength === 4
                                    ? "bg-green-500 w-full"
                                    : "w-0"
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
                    </div>
                  </div>
                )}

                {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-[#e6e6e6] text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="glass-input w-full pr-12"
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.newPassword === formData.confirmPassword ? (
                      <p className="text-green-400 text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}

                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="glass-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || formData.newPassword !== formData.confirmPassword}
              >
                {isLoading ? "Updating password..." : "Update Password"}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <p className="text-[#e6e6e6] text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-[#f5f5dc] hover:underline font-medium">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="glass-card mt-6">
            <h3 className="text-[#f5f5dc] font-semibold text-sm mb-3">Password Requirements</h3>
            <ul className="text-[#e6e6e6] text-xs space-y-1">
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? "bg-green-400" : "bg-gray-500"}`}
                />
                At least 6 characters
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? "bg-green-400" : "bg-gray-500"}`}
                />
                8+ characters for better security
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.newPassword) ? "bg-green-400" : "bg-gray-500"}`}
                />
                Include uppercase letters
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.newPassword) ? "bg-green-400" : "bg-gray-500"}`}
                />
                Include numbers
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
