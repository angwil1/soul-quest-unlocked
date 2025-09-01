import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppWrapper } from "@/components/AppWrapper";
import { AgeGate } from "@/components/AgeGate";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileSetup from "./pages/ProfileSetup";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import BrowseProfiles from "./pages/BrowseProfiles";
import SwipeMode from "./pages/SwipeMode";

import Questions from "./pages/Questions";
import QuizResults from "./pages/QuizResults";
import Pricing from "./pages/Pricing";
import PremiumDashboard from "./pages/PremiumDashboard";
import ConnectionDNA from "./pages/ConnectionDNA";
import MemoryVault from "./pages/MemoryVault";
import AIDigest from "./pages/AIDigest";
import Mission from "./pages/Mission";
import FAQ from "./pages/FAQ";
import QuickStart from "./pages/QuickStart";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import CookieStatement from "./pages/CookieStatement";
import AccessibilityStatement from "./pages/AccessibilityStatement";

import FeatureTest from "./pages/FeatureTest";
import SafetyCenter from "./pages/SafetyCenter";
import SampleUserProfile from "./pages/SampleUserProfile";
import TestQuietStart from "./pages/TestQuietStart";
import TestSubscriptionFeatures from "./pages/TestSubscriptionFeatures";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";


const queryClient = new QueryClient();

const App = () => {
  const [ageVerified, setAgeVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if age has been verified
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    const ageConfirmedDate = localStorage.getItem('ageConfirmedDate');
    
    // Age confirmation expires after 30 days for additional security
    if (ageConfirmed === 'true' && ageConfirmedDate) {
      const confirmationDate = new Date(ageConfirmedDate);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (confirmationDate > thirtyDaysAgo) {
        setAgeVerified(true);
      } else {
        // Expired, clear storage
        localStorage.removeItem('ageConfirmed');
        localStorage.removeItem('ageConfirmedDate');
      }
    }
    
    setLoading(false);
  }, []);

  const handleAgeConfirmed = () => {
    setAgeVerified(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!ageVerified) {
    return <AgeGate onAgeConfirmed={handleAgeConfirmed} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />
          <AppWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/profile/setup" element={<ProfileSetup />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/browse" element={<BrowseProfiles />} />
            <Route path="/swipe" element={<SwipeMode />} />
            <Route path="/browse-profiles" element={<BrowseProfiles />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/premium-dashboard" element={<PremiumDashboard />} />
            <Route path="/connection-dna" element={<ConnectionDNA />} />
            <Route path="/memory-vault" element={<MemoryVault />} />
            <Route path="/ai-digest" element={<AIDigest />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/quick-start" element={<QuickStart />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookieStatement />} />
            <Route path="/accessibility" element={<AccessibilityStatement />} />
            
            <Route path="/feature-test" element={<FeatureTest />} />
            <Route path="/test-quiet-start" element={<TestQuietStart />} />
            <Route path="/test-subscription-features" element={<TestSubscriptionFeatures />} />
            <Route path="/safety" element={<SafetyCenter />} />
            <Route path="/sample-user-profile/:profileId" element={<SampleUserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;