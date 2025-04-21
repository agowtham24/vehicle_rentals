import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App />
      <Toaster richColors />
    </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
