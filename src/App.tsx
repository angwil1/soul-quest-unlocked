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
import Questions from "./pages/Questions";
import QuizResults from "./pages/QuizResults";
import SampleProfiles from "./pages/SampleProfiles";
import Pricing from "./pages/Pricing";
import Subscription from "./pages/Subscription";
import ConnectionDNA from "./pages/ConnectionDNA";
import MemoryVault from "./pages/MemoryVault";
import AIDigest from "./pages/AIDigest";
import Mission from "./pages/Mission";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/sample-profiles" element={<SampleProfiles />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/connection-dna" element={<ConnectionDNA />} />
            <Route path="/memory-vault" element={<MemoryVault />} />
            <Route path="/ai-digest" element={<AIDigest />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;