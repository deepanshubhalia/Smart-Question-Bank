"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Download, Calendar, FileText } from "lucide-react";

interface DownloadItem {
  name: string;
  time: string;
  fileId?: string;
  downloadedAt?: string;
  date?: string;
}

export default function MyDownloadsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<DownloadItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load downloads from localStorage
    const storedDownloads = localStorage.getItem("downloads");
    if (storedDownloads) {
      setDownloads(JSON.parse(storedDownloads));
    }

    // Load recent activity from localStorage
    const storedActivity = localStorage.getItem("recentActivity");
    if (storedActivity) {
      setRecentActivity(JSON.parse(storedActivity));
    }
  }, [isAuthenticated, router]);

  const clearDownloads = () => {
    localStorage.removeItem("downloads");
    localStorage.removeItem("recentActivity");
    setDownloads([]);
    setRecentActivity([]);
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#f5f5dc]">My Downloads</h1>
            <p className="text-[#e6e6e6] text-lg">All your downloaded question papers</p>
          </div>

          {/* Downloads List */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#f5f5dc] flex items-center gap-2">
                <Download className="w-6 h-6" />
                All Downloads ({downloads.length})
              </h2>
              {downloads.length > 0 && (
                <button
                  onClick={clearDownloads}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {downloads.length > 0 ? (
              <div className="space-y-4">
                {downloads.map((download, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-[#f5f5dc]" />
                      <div>
                        {download.fileId ? (
                          <a 
                            href={`https://drive.google.com/uc?export=download&id=${download.fileId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            <h3 className="text-[#f5f5dc] font-medium cursor-pointer">{download.name}</h3>
                          </a>
                        ) : (
                          // Fallback if fileId is not available, though it should be for Drive downloads
                          <h3 className="text-[#f5f5dc] font-medium">{download.name}</h3>
                        )}
                        <div className="flex items-center gap-2 text-[#e6e6e6] text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{download.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#f5f5dc] text-sm font-medium bg-white/10 px-2 py-1 rounded">
                        PDF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Download className="w-16 h-16 text-[#e6e6e6] mx-auto mb-4 opacity-50" />
                <p className="text-[#e6e6e6] text-lg mb-2">No downloads yet</p>
                <p className="text-[#cccccc] text-sm mb-6">Start browsing and downloading question papers</p>
                <button
                  onClick={() => router.push("/browse-papers")}
                  className="glass-button"
                >
                  Browse Papers
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
