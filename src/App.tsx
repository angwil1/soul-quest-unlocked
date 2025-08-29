import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppWrapper } from "@/components/AppWrapper";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import BrowseProfiles from "./pages/BrowseProfiles";

import Questions from "./pages/Questions";
import QuizResults from "./pages/QuizResults";
import SampleProfiles from "./pages/SampleProfiles";
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
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/browse" element={<BrowseProfiles />} />
            <Route path="/browse-profiles" element={<BrowseProfiles />} />
            
            <Route path="/messages" element={<Messages />} />
            
            <Route path="/questions" element={<Questions />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/sample-profiles" element={<SampleProfiles />} />
            <Route path="/pricing" element={<Pricing />} />
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
            <Route path="/safety" element={<SafetyCenter />} />
            <Route path="/sample-user-profile/:profileId" element={<SampleUserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;