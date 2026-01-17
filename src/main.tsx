import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme from localStorage, default to light
const initializeTheme = () => {
  const stored = localStorage.getItem("theme");
  const root = document.documentElement;
  
  if (stored === "dark") {
    root.classList.add("dark");
  } else {
    // Default to light mode
    root.classList.remove("dark");
    if (!stored) {
      localStorage.setItem("theme", "light");
    }
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
