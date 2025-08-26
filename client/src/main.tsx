import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk publishable key");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={publishableKey}
      appearance={{
        variables: {
          colorPrimary: "#00BFFF",
          colorBackground: "#0f172a",
          colorText: "#ffffff",
        },
        elements: {
          modalContent: "bg-slate-900/95 backdrop-blur-sm shadow-2xl border border-gray-700/50",
          modalCloseButton: "text-gray-400 hover:text-white",
          card: "bg-slate-900/95 backdrop-blur-sm shadow-2xl border border-gray-700/50 rounded-2xl",
          headerTitle: "text-xl font-bold text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: "bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-gray-400 rounded-full w-12 h-12 flex items-center justify-center text-black",
          socialButtonsProviderIcon: "w-6 h-6",
          providerIcon__apple: "text-black",
          providerIcon__google: "text-black", 
          providerIcon__microsoft: "text-black",
          providerIcon__facebook: "text-black",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg",
          formFieldInput: "bg-slate-800/70 border border-gray-600 text-white placeholder:text-gray-400",
          footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
          footerActionText: "text-sm text-gray-400",
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);