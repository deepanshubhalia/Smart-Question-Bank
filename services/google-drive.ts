import axios from "axios"

// Replace with your actual Google Drive API key
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || "YOUR_API_KEY_HERE"
const FOLDER_ID = "17SRGqHEYhsJ0aLaCGE8TfHZO0jG7o1nR"

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink: string
  iconLink: string
  size?: string
  modifiedTime?: string
}

export const googleDriveService = {
  async getFilesFromFolder(): Promise<DriveFile[]> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType,webViewLink,iconLink,size,modifiedTime)&orderBy=name`,
      )
      return response.data.files || []
    } catch (error) {
      console.error("Error fetching files from Google Drive:", error)
      throw new Error("Failed to fetch files from Google Drive")
    }
  },

  getDownloadLink(fileId: string): string {
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  },

  formatFileSize(bytes: string): string {
    if (!bytes) return "Unknown size"
    const size = Number.parseInt(bytes)
    const units = ["B", "KB", "MB", "GB"]
    let unitIndex = 0
    let fileSize = size

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024
      unitIndex++
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`
  },

  formatDate(dateString: string): string {
    if (!dateString) return "Unknown date"
    return new Date(dateString).toLocaleDateString()
  },
}
