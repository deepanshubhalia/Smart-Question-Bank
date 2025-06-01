"use client" // Specifies this component as a Client Component, allowing interactivity

import { FolderOpen, BookOpen, Code, Cpu, Zap, FlaskConical } from "lucide-react" // Importing icons
import Navbar from "@/components/navbar"; // Importing the shared navigation bar

// Configuration for Google Drive Folder IDs
// Each subject ID (e.g., "cse", "it") should map to its corresponding Google Drive Folder ID.
// IMPORTANT: These IDs MUST be replaced with your actual Google Drive Folder IDs for the links to work correctly.
const subjectFolderIds: { [key: string]: string } = {
  cse: "14VzGsOtct9XURXO9Gs8jq2PscMQXpBZ-",       // Example: Computer Science Engineering folder
  it: "17X7Q5Rs77o3ZveiKIQ_wV2fManJGjGBe",        // Example: Information Technology folder
  ece: "1r0k21t-7-d-QY18ZOs_z44xxcE29MHcT",       // Example: Electronics & Communication folder
  pyq: "15KOyO2SxkprHqAtpMCch5TuDST5_iq6X",        // Example: Previous Year Questions (Electives) folder
  biotech: "1UfRBHW4C65YBiZqQQuuGHKbI9ZqTrFOI",   // Example: Biotechnology folder (already updated)
};

// Array of subject objects to be displayed on the page.
// Each object contains an id (matching keys in subjectFolderIds), a display name,
// an icon component, and a description.
const subjects = [
  { id: "cse", name: "CSE", icon: Code, description: "Computer Science Engineering" },
  { id: "it", name: "IT", icon: Cpu, description: "Information Technology" },
  { id: "ece", name: "ECE", icon: Zap, description: "Electronics & Communication" },
  { id: "pyq", name: "PYQ_Electives_24", icon: BookOpen, description: "Previous Year Questions" },
  { id: "biotech", name: "BIOTECH", icon: FlaskConical, description: "Biotechnology" },
];

/**
 * BrowsePapersPage Component
 * This page displays a list of subjects as cards. Each card allows users
 * to open a corresponding Google Drive folder containing question papers.
 */
export default function BrowsePapersPage() {

  // Handles the click event for the "Open Folder" button on each subject card.
  const handleOpenFolderClick = (subjectId: string, subjectName: string) => {
    const folderId = subjectFolderIds[subjectId]; // Retrieve the folder ID using the subject's ID

    // Define what might be considered a placeholder ID.
    // This helps catch cases where a folder ID hasn't been properly configured.
    // The check looks for specific placeholder patterns.
    const isGenericPlaceholder = typeof folderId === 'string' && folderId.includes("PLACEHOLDER");
    const isSpecificPlaceholderFormat = typeof folderId === 'string' && folderId === `${subjectId.toUpperCase()}_FOLDER_ID_PLACEHOLDER`;
    const isConsideredPlaceholder = isGenericPlaceholder || isSpecificPlaceholderFormat;

    // Check if the folderId exists and is not considered a placeholder
    if (folderId && !isConsideredPlaceholder) {
      // If a valid folder ID is found, open the Google Drive folder in a new tab
      window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
    } else {
      // If the folder ID is missing or is a placeholder, show an alert to the user
      // and log a warning to the console for the developer.
      alert(`The Google Drive folder for "${subjectName}" is not yet configured or uses a placeholder ID. Please contact support or check back later.`);
      console.warn(`Developer Info: Placeholder or missing folder ID for subject: ${subjectId}. Configured ID: ${folderId}`);
    }
  };

  return (
    // Main container for the page, ensuring minimum screen height
    <div className="min-h-screen"> 
      <Navbar /> {/* Renders the shared navigation bar */}

      {/* Main content area of the page */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section: Title and introductory text */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#f5f5dc]">Previous Year Papers</h2> 
          <p className="text-lg text-[#e6e6e6]">Access previous year question papers and study materials</p> 
        </div>

        {/* Cards Grid: Displays a grid of subject cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto"> 
          {/* Iterate over the 'subjects' array to create a card for each subject */}
          {subjects.map((subject) => {
            const IconComponent = subject.icon; // Dynamically select the icon component for the subject
            return (
              // Card container: A div styled to look like a card using Tailwind CSS.
              // Includes hover effects (scale, shadow) and uses 'group' for parent-based hover styling.
              <div
                key={subject.id} // Unique key for each card, important for React's rendering
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 group backdrop-blur-sm h-60 flex flex-col justify-between p-4 rounded-lg"
              >
                {/* Card Header section: Contains icon, subject name, and description */}
                <div className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    {/* Small decorative animated dot */}
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  {/* Subject Name (Card Title) */}
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors">
                    {subject.name}
                  </h3>
                  {/* Subject Description */}
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {subject.description}
                  </p>
                </div>
                
                {/* Card Footer/Action section: Contains the "Open Folder" button */}
                <div className="pt-0"> 
                  {/* "Open Folder" Button */}
                  <button
                    type="button" // Standard practice for buttons not submitting a form
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-500/25 text-sm flex items-center justify-center"
                    onClick={() => handleOpenFolderClick(subject.id, subject.name)} // Call the handler on click
                  >
                    <FolderOpen className="mr-2 h-4 w-4" /> {/* Folder icon */}
                    Open Folder
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Informational Text */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Click on any subject card to access previous year question papers and study materials
          </p>
        </div>
      </main>

      {/* Decorative Background Elements (fixed position, non-interactive) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-white rounded-full opacity-15 animate-pulse"></div>
      </div>
    </div>
  );
}
