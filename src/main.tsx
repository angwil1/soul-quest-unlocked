import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCapacitor } from "./lib/capacitor";

// Initialize Capacitor when app starts (only if needed)
initializeCapacitor().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
