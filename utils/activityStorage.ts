// Activity Storage Utility
// For saving download/upload logs and recent activity

interface ActivityEntry {
  name: string;
  time: string;
  fileId?: string;
  downloadedAt?: string;
  date?: string;
  type?: 'download' | 'upload';
}

interface UploadEntry {
  id: string | number;
  name: string;
  subject: string;
  semester: string;
  branch: string;
  uploadedAt: string;
}

// Save file to My Downloads and Recent Activity
export const logDownload = (fileName: string): void => {
  const entry: ActivityEntry = {
    name: fileName,
    time: new Date().toLocaleString(),
    fileId: Math.random().toString(36).substr(2, 9),
    downloadedAt: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    type: 'download'
  };
  
  const prev = JSON.parse(localStorage.getItem("downloads") || "[]");
  localStorage.setItem("downloads", JSON.stringify([entry, ...prev]));

  const recent = JSON.parse(localStorage.getItem("recentActivity") || "[]");
  localStorage.setItem("recentActivity", JSON.stringify([entry, ...recent.slice(0, 4)]));
};

// Save upload activity
export const logUpload = (fileName: string, subject: string, semester: string, branch: string): void => {
  const uploadEntry: UploadEntry = {
    id: Date.now() + Math.random(),
    name: fileName,
    subject,
    semester,
    branch,
    uploadedAt: new Date().toISOString(),
  };

  const uploads = JSON.parse(localStorage.getItem("userUploads") || "[]");
  uploads.unshift(uploadEntry);
  localStorage.setItem("userUploads", JSON.stringify(uploads.slice(0, 50)));

  // Also add to recent activity
  const activityEntry: ActivityEntry = {
    name: fileName,
    time: new Date().toLocaleString(),
    type: 'upload'
  };

  const recent = JSON.parse(localStorage.getItem("recentActivity") || "[]");
  localStorage.setItem("recentActivity", JSON.stringify([activityEntry, ...recent.slice(0, 4)]));
};

// Get all downloads
export const getDownloads = (): ActivityEntry[] => {
  return JSON.parse(localStorage.getItem("downloads") || "[]");
};

// Get all uploads
export const getUploads = (): UploadEntry[] => {
  return JSON.parse(localStorage.getItem("userUploads") || "[]");
};

// Get recent activity
export const getRecentActivity = (): ActivityEntry[] => {
  return JSON.parse(localStorage.getItem("recentActivity") || "[]");
};

// Clear all downloads
export const clearDownloads = (): void => {
  localStorage.removeItem("downloads");
  localStorage.removeItem("recentActivity");
};

// Clear all uploads
export const clearUploads = (): void => {
  localStorage.removeItem("userUploads");
};

export default {
  logDownload,
  logUpload,
  getDownloads,
  getUploads,
  getRecentActivity,
  clearDownloads,
  clearUploads
};
