import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// Simple test components
const TestProfile = () => (
  <div className="min-h-screen bg-blue-500 flex items-center justify-center">
    <div className="text-white text-4xl font-bold">PROFILE TEST - BLUE SCREEN</div>
  </div>
);

const TestMatches = () => (
  <div className="min-h-screen bg-red-500 flex items-center justify-center">
    <div className="text-white text-4xl font-bold">MATCHES TEST - RED SCREEN</div>
  </div>
);

const TestHome = () => (
  <div className="min-h-screen bg-green-500 flex items-center justify-center">
    <div className="text-white text-4xl font-bold text-center">
      <div>HOME TEST - GREEN SCREEN</div>
      <div className="text-2xl mt-4">React Router is Working!</div>
      <div className="text-lg mt-4">Try visiting /profile or /matches</div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/profile" element={<TestProfile />} />
          <Route path="/matches" element={<TestMatches />} />
          <Route path="*" element={<div className="min-h-screen bg-yellow-500 flex items-center justify-center"><div className="text-black text-4xl font-bold">404 - PAGE NOT FOUND</div></div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;