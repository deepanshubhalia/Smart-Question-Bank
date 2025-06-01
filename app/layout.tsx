import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StarBackground from "@/components/star-background"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Question Bank",
  description: "Access previous year question papers based on your branch, semester, and subject",
  generator: 'v0.dev',
  viewport: 'width=device-width, initial-scale=1.0', // Added viewport meta tag
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen relative overflow-x-hidden`}>
        <StarBackground />
        <div className="relative z-10">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
