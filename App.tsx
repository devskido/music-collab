import { useState } from "react";
import { AuthProvider } from "./components/AuthContext";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { UserProfile } from "./components/UserProfile";
import { DiscoverPage } from "./components/DiscoverPage";
import { ProjectsPage } from "./components/ProjectsPage";

// Mock user data for profile display
const mockUser = {
  id: "current-user",
  name: "Jordan Smith",
  role: "Music Producer & Sound Engineer",
  location: "Los Angeles, CA",
  bio: "Passionate music producer with 8+ years of experience in hip-hop, R&B, and electronic music. Specialized in mixing, mastering, and artist development. Always looking for talented artists to collaborate with.",
  profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  skills: ["Hip-Hop", "R&B", "Electronic", "Mixing", "Mastering", "Pro Tools", "Ableton Live", "Logic Pro"],
  credits: [
    {
      title: "Midnight Dreams",
      artist: "Luna Rose",
      role: "Producer, Mix Engineer",
      year: "2024"
    },
    {
      title: "City Lights",
      artist: "The Collective",
      role: "Co-Producer",
      year: "2023"
    },
    {
      title: "Summer Heat",
      artist: "Marcus Valle",
      role: "Mix Engineer",
      year: "2023"
    }
  ],
  projects: [
    {
      title: "Underground Vibes EP",
      description: "A 5-track EP featuring emerging hip-hop artists from LA",
      collaborators: 4,
      genre: "Hip-Hop"
    },
    {
      title: "Electronic Fusion Album",
      description: "Experimental album blending electronic and organic elements",
      collaborators: 2,
      genre: "Electronic"
    }
  ],
  stats: {
    projects: 12,
    collaborations: 28,
    credits: 35
  }
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <UserProfile user={mockUser} />;
      case "discover":
        return <DiscoverPage />;
      case "projects":
        return <ProjectsPage />;
      case "community":
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-3xl mb-4">Community Features</h1>
              <p className="text-muted-foreground">
                Community features coming soon! Connect with musicians, join discussions, and share your work.
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-3xl mb-4">Settings</h1>
              <p className="text-muted-foreground">
                Settings panel coming soon! Manage your account, privacy, and notification preferences.
              </p>
            </div>
          </div>
        );
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}