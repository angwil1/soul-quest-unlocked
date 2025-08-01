import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProfileSetupModal } from "@/components/ProfileSetupModal";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Questions from "./pages/Questions";
import QuizResults from "./pages/QuizResults";
import Pricing from "./pages/Pricing";
import Subscription from "./pages/Subscription";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import FAQ from "./pages/FAQ";
import AIDigest from "./pages/AIDigest";
import ConnectionDNA from "./pages/ConnectionDNA";
import MemoryVault from "./pages/MemoryVault";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import Mission from "./pages/Mission";
import SampleProfiles from "./pages/SampleProfiles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (!authLoading && !profileLoading && user && profile) {
      // Show profile setup if user is logged in but hasn't completed basic profile info
      const needsProfileSetup = !profile.gender || !profile.looking_for || !profile.location;
      setShowProfileSetup(needsProfileSetup);
    } else {
      setShowProfileSetup(false);
    }
  }, [user, profile, authLoading, profileLoading]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/ai-digest" element={<AIDigest />} />
        <Route path="/connection-dna" element={<ConnectionDNA />} />
        <Route path="/memory-vault" element={<MemoryVault />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/sample-profiles" element={<SampleProfiles />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ProfileSetupModal 
        isOpen={showProfileSetup} 
        onComplete={handleProfileSetupComplete} 
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
