"use client"

import Navbar from "@/components/navbar"
import { useState } from "react"
import { Mail, MapPin, Send, AlertCircle } from "lucide-react" // Removed User, BookUser, MessageSquare

interface Alert {
  type: "success" | "error" | "warning"
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showAlert = (type: Alert["type"], message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showAlert("error", "Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showAlert("error", "Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      showAlert("success", "Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen"> {/* Removed gradient background */}
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

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16"> {/* Restored bottom margin */}
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f5dc] mb-6"> {/* Restored text color and size */}
              Get in Touch
            </h1>
            <p className="text-lg text-[#e6e6e6] max-w-3xl mx-auto">
              Have questions about accessing previous year papers or need help with the platform? 
              We're here to help JIIT students succeed in their academic journey.
            </p>
            {/* Removed Accent line */}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glass-card p-8"> {/* Restored original card class */}
                <h2 className="text-2xl font-semibold text-[#f5f5dc] mb-6"> {/* Restored text color and size */}
                  Contact Information
                </h2>
                
                <div className="space-y-6"> {/* Restored spacing */}
                  <div className="flex items-start gap-4"> {/* Restored gap */}
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#f5f5dc] mb-1">Email</h3>
                      <p className="text-[#e6e6e6]">deepanshubhalia1234@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4"> {/* Restored gap */}
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#f5f5dc] mb-1">Address</h3>
                      <p className="text-[#e6e6e6]">
                        Jaypee Institute of Information Technology<br />
                        A-10, Sector-62, Noida<br />
                        Uttar Pradesh - 201309, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8"> {/* Restored original card class */}
              <h2 className="text-2xl font-semibold text-[#f5f5dc] mb-6"> {/* Restored text color and size */}
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Restored gap */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#f5f5dc] mb-2">
                      Full Name *
                    </label>
                    {/* Removed icon wrapper div */}
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#f5f5dc] placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent" // Restored input styling
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#f5f5dc] mb-2">
                      Email Address *
                    </label>
                    {/* Removed icon wrapper div */}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#f5f5dc] placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent" // Restored input styling
                      placeholder="your.email@mail.jiit.ac.in"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#f5f5dc] mb-2">
                    Subject *
                  </label>
                  {/* Removed icon wrapper div */}
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#f5f5dc] placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent" // Restored input styling
                    placeholder="What\'s this regarding?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#f5f5dc] mb-2">
                    Message *
                  </label>
                  {/* Removed icon wrapper div */}
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#f5f5dc] placeholder-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none" // Restored textarea styling
                    placeholder="Describe your question or issue in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" // Restored button styling
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
