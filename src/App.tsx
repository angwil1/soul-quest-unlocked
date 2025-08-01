import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test component first
const App = () => {
  console.log("App component is rendering");
  
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '20px', 
      minHeight: '100vh',
      fontSize: '20px'
    }}>
      <h1>TEST: App is working!</h1>
      <p>If you can see this, React is rendering properly.</p>
      <p>Date: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default App;
