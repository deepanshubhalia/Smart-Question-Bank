"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Alert {
  type: "success" | "error" | "warning"
  message: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)
  const { isAuthenticated, logout, user } = useAuth()

  const showAlert = (type: Alert["type"], message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleProtectedNavigation = (href: string, linkName: string) => {
    if (!isAuthenticated) {
      showAlert("warning", "Please sign up first using your JIIT email")
      return
    }
    window.location.href = href
  }

  const handleLogout = () => {
    logout()
    showAlert("success", "Logged out successfully")
    setTimeout(() => {
      window.location.href = "/"
    }, 1000)
  }

  // Define base links common to both states or specific to one state
  const commonLinks = [
    { name: "Browse Papers", href: "/browse-papers", protected: false },
    { name: "Contact Us", href: "/contact", protected: false },
  ];

  let currentNavLinks;

  if (isAuthenticated) {
    currentNavLinks = [
      { name: "My Dashboard", href: "/dashboard", protected: true },
      ...commonLinks,
    ];
  } else {
    currentNavLinks = [
      { name: "Home", href: "/", protected: false },
      ...commonLinks,
      // If you had explicit Login/Signup links here for non-authenticated users,
      // they would be added here. For now, adhering to the prompt.
    ];
  }
  // The old navLinks array is replaced by currentNavLinks logic above
  // const navLinks = [
  //   { name: "Home", href: "/", protected: false },
  //   { name: "Browse Papers", href: "/browse-papers", protected: false },
  //   { name: "My Dashboard", href: "/dashboard", protected: true },
  //   { name: "Contact Us", href: "/contact", protected: false },
  // ];

  return (
    <>
      {/* Alert Component */}
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
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

      {/* Apply bg-black and py-4 for padding as per new CSS */}
      <nav className="relative z-20 w-full bg-black">
        {/* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 remains for content centering */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* flex items-center justify-between h-16 (h-16 is 4rem, py-4 makes it 2rem padding top/bottom if h-auto) */}
          {/* Let's use py-4 for padding and let height be auto based on content */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-semibold text-xl"> {/* Changed text to white */}
                Smart Question Bank
              </Link>
            </div>

            {/* Desktop Navigation */}
            {/* Apply nav-links styling: flex, gap-2rem (space-x-8) */}
            <div className="hidden md:block">
              {/* items-baseline might not be needed if all items are simple links/buttons */}
              <div className="ml-10 flex items-center space-x-8"> {/* space-x-8 is 2rem gap */}
                {currentNavLinks.map((link) => ( // Use currentNavLinks
                  <div key={link.name}>
                    {link.protected ? (
                      <button
                        onClick={() => handleProtectedNavigation(link.href, link.name)}
                        // Apply .nav-links a styling: text-white, font-medium, hover:text-yellow-400
                        className="text-white hover:text-yellow-400 font-medium transition-colors duration-300"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        // Apply .nav-links a styling: text-white, font-medium, hover:text-yellow-400
                        className="text-white hover:text-yellow-400 font-medium transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    // Apply .nav-links a styling: text-white, font-medium, hover:text-red-400 (custom for logout)
                    className="text-white hover:text-red-400 font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-yellow-400 transition-colors duration-200" // Adjusted colors
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {/* Mobile nav styling can also be updated for consistency if needed */}
          {isOpen && (
            <div className="md:hidden">
              {/* bg-white/5 backdrop-blur-md can be changed to bg-black or similar if desired */}
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-lg mt-2"> {/* Darker background for mobile dropdown */}
                {currentNavLinks.map((link) => ( // Use currentNavLinks
                  <div key={link.name}>
                    {link.protected ? (
                      <button
                        onClick={() => {
                          handleProtectedNavigation(link.href, link.name)
                          setIsOpen(false)
                        }}
                        className="text-white hover:text-yellow-400 block px-3 py-2 font-medium transition-colors duration-300 w-full text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white hover:text-yellow-400 block px-3 py-2 font-medium transition-colors duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="text-white hover:text-red-400 block px-3 py-2 font-medium transition-colors duration-300 w-full text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
