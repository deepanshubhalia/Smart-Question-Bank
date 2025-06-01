"use client"

import Navbar from "@/components/navbar"
import { BookOpen, Upload, Download, AlertCircle, CheckCircle } from "lucide-react" // Added AlertCircle, CheckCircle for showAlert
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route-wrapper"
import { useRouter } from "next/navigation"
import { logDownload } from "../../utils/activityStorage" // Import logDownload

// Define Alert interface if not already present (it might be if showAlert is used elsewhere)
interface Alert {
  type: "success" | "error" | "warning";
  message: string;
}

export default function DashboardPage() {
  // Removed downloads and uploads state as the recent activity is now static
  const router = useRouter()
  const [alert, setAlert] = useState<Alert | null>(null); // Add alert state for showAlert

  // showAlert function (if not already present or needs adjustment)
  const showAlert = (type: Alert['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleStaticDownload = (paperName: string, paperUrl: string) => {
    // 1. Trigger download
    const link = document.createElement('a');
    link.href = paperUrl;
    link.download = paperName;
    document.body.appendChild(link); // Required for some browsers (e.g., Firefox)
    link.click();
    document.body.removeChild(link); // Clean up

    // 2. Add to My Downloads history
    logDownload(paperName); // Pass only name as fileId is not available for this static item

    // 3. Show success alert
    showAlert("success", `${paperName} download started and added to your download history.`);
  };


  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        {/* Alert Component (copied from upload/page.tsx for consistency if needed) */}
        {alert && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300 w-full max-w-md px-4">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg backdrop-blur-md border ${
                alert.type === "success"
                  ? "bg-green-500/20 border-green-500/30 text-green-100"
                  : alert.type === "error"
                    ? "bg-red-500/20 border-red-500/30 text-red-100"
                    : "bg-yellow-500/20 border-yellow-500/30 text-yellow-100"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium text-sm">{alert.message}</span>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-[#f5f5dc]">Welcome to Your Dashboard</h1>
              <p className="text-[#e6e6e6] text-lg">Access and manage your question papers</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Browse Papers Card */}
              <div 
                className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => router.push("/browse-papers")}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <BookOpen className="text-[#f5f5dc] w-8 h-8" />
                  <h3 className="text-xl font-semibold text-[#f5f5dc]">Browse Papers</h3>
                </div>
                <p className="text-[#e6e6e6] mb-4">
                  Search and access previous year question papers by branch, semester, and subject.
                </p>
                <button className="text-[#f5f5dc] hover:underline font-medium">Browse Now →</button>
              </div>

              {/* Upload Papers Card */}
              <div 
                className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => router.push("/upload")}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Upload className="text-[#f5f5dc] w-8 h-8" />
                  <h3 className="text-xl font-semibold text-[#f5f5dc]">Upload Papers</h3>
                </div>
                <p className="text-[#e6e6e6] mb-4">
                  Contribute to the community by uploading question papers you have.
                </p>
                <button className="text-[#f5f5dc] hover:underline font-medium">Upload Now →</button>
              </div>

              {/* My Downloads Card */}
              <div 
                className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => router.push("/my-downloads")}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Download className="text-[#f5f5dc] w-8 h-8" />
                  <h3 className="text-xl font-semibold text-[#f5f5dc]">My Downloads</h3>
                </div>
                <p className="text-[#e6e6e6] mb-4">View and manage all the question papers you've downloaded.</p>
                <button className="text-[#f5f5dc] hover:underline font-medium">View Downloads →</button>
              </div>
            </div>

            {/* Recent Activity - REMOVED AS PER USER REQUEST */}
            {/* 
            <div className="recent-activity">
              <h2 className="text-xl font-semibold mb-2 text-[#f5f5dc]">Recent Activity</h2>
              <div className="bg-[#1e1e1e] p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">three.pdf</p>
                  <p className="text-sm text-gray-400">01/06/2025, 12:15:17</p>
                </div>
                <Download 
                  className="w-5 h-5 text-gray-400 cursor-pointer hover:text-yellow-400 transition"
                  onClick={() => handleStaticDownload('three.pdf', '/downloads/three.pdf')} 
                />
              </div>
            </div>
            */}

          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
