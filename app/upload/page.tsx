"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route-wrapper"
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react"
import { logUpload } from "@/utils/activityStorage"

interface Alert {
  type: "success" | "error" | "warning"
  message: string
}

export default function UploadPapersPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    semester: "",
    branch: "",
    examType: "",
    year: "",
  })

  const showAlert = (type: Alert["type"], message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== files.length) {
      showAlert("warning", "Please select only PDF files.")
    }

    setSelectedFiles((prev) => [...prev, ...pdfFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      showAlert("error", "Please select at least one PDF file.")
      return
    }

    // Validate for other file types if you expand beyond PDF in the backend
    const nonPdfFiles = selectedFiles.filter(file => file.type !== "application/pdf" && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    if (nonPdfFiles.length > 0) {
      showAlert("warning", "Please select only PDF or DOCX files.");
      // Optionally, filter out non-PDF/DOCX files or prevent submission
      // setSelectedFiles(selectedFiles.filter(file => file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
      // return;
    }

    if (!formData.subject || !formData.semester || !formData.branch) {
      showAlert("error", "Please fill in all required fields: Subject, Semester, and Branch.")
      return
    }

    setUploading(true)

    // Using a single file upload for this example. 
    // If multiple files are to be uploaded, loop through selectedFiles
    // and call the API for each, or adjust the API to handle multiple files.
    const fileToUpload = selectedFiles[0]; // Example: upload the first selected file

    const uploadPayload = new FormData();
    uploadPayload.append('file', fileToUpload);
    uploadPayload.append('subject', formData.subject);
    uploadPayload.append('semester', formData.semester);
    uploadPayload.append('branch', formData.branch);
    uploadPayload.append('examType', formData.examType);
    uploadPayload.append('year', formData.year);

    try {
      const response = await fetch('/api/upload-paper', {
        method: 'POST',
        body: uploadPayload, // Send FormData directly
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert("success", result.message || "File uploaded successfully! It will be reviewed and added to the collection.");
        logUpload(fileToUpload.name, formData.subject, formData.semester, formData.branch); // Log after successful API response
        
        // Reset form
        setSelectedFiles([])
        setFormData({
          subject: "",
          semester: "",
          branch: "",
          examType: "",
          year: "",
        });
      } else {
        showAlert("error", result.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showAlert("error", "Upload failed due to a network or server error. Please try again.");
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        {/* Alert Component */}
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-[#f5f5dc]">Upload Question Papers</h1>
              <p className="text-[#e6e6e6] text-lg">Contribute to the community by sharing question papers</p>
            </div>

            {/* Upload Form */}
            <div className="glass-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div>
                  <label className="block text-[#f5f5dc] text-lg font-semibold mb-4">Select PDF Files</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                    <Upload className="mx-auto w-12 h-12 text-[#f5f5dc] mb-4" />
                    <p className="text-[#e6e6e6] mb-4">Drag and drop PDF files here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="glass-button cursor-pointer inline-block">
                      Choose Files
                    </label>
                  </div>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div>
                    <h3 className="text-[#f5f5dc] font-semibold mb-3">Selected Files:</h3>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[#f5f5dc]" />
                            <div>
                              <p className="text-[#e6e6e6] font-medium">{file.name}</p>
                              <p className="text-[#cccccc] text-sm">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#e6e6e6] text-sm font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="glass-input w-full"
                      placeholder="e.g., Data Structures"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#e6e6e6] text-sm font-medium mb-2">Semester *</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="glass-input w-full"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem} className="bg-black">
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#e6e6e6] text-sm font-medium mb-2">Branch *</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="glass-input w-full"
                      required
                    >
                      <option value="">Select Branch</option>
                      <option value="CSE" className="bg-black">CSE</option>
                      <option value="IT" className="bg-black">IT</option>
                      <option value="ECE" className="bg-black">ECE</option>
                      <option value="Biotech" className="bg-black">Biotech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#e6e6e6] text-sm font-medium mb-2">Exam Type</label>
                    <select
                      name="examType"
                      value={formData.examType}
                      onChange={handleInputChange}
                      className="glass-input w-full"
                    >
                      <option value="">Select Type</option>
                      <option value="T1" className="bg-black">T1</option>
                      <option value="T2" className="bg-black">T2</option>
                      <option value="T3" className="bg-black">T3</option>
                      <option value="Quiz" className="bg-black">Quiz</option>
                      <option value="Lab Test" className="bg-black">Lab Test</option>
                      <option value="Lab Eval" className="bg-black">Lab Eval</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#e6e6e6] text-sm font-medium mb-2">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="glass-input w-full"
                      placeholder="e.g., 2023"
                      min="2000"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={uploading || selectedFiles.length === 0}
                    className="glass-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Upload Papers"}
                  </button>
                </div>
              </form>
            </div>

            {/* Guidelines */}
            <div className="glass-card">
              <h3 className="text-[#f5f5dc] font-semibold text-lg mb-4">Upload Guidelines</h3>
              <ul className="text-[#e6e6e6] space-y-2">
                <li>• Only PDF files are accepted</li>
                <li>• Maximum file size: 10MB per file</li>
                <li>• Ensure the question paper is clear and readable</li>
                <li>• Fill in all required information accurately</li>
                <li>• Uploaded files will be reviewed before being made available</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
