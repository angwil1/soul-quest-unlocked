import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCapacitor } from "./lib/capacitor";

// Initialize Capacitor when app starts
initializeCapacitor();

createRoot(document.getElementById("root")!).render(<App />);
