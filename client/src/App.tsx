import { Routes, Route, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/ui/footer";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AboutUsPage from "@/pages/about";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import ApiDocsPage from "@/pages/api-docs";
import LegalPage from "@/pages/legal";
import SavedTranslationsPage from "@/pages/saved";
import HistoryPage from "@/pages/history";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/landing" element={<Landing />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/api" element={<ApiDocsPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/saved" element={<SavedTranslationsPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />

      {/* Auth routes */}
      <Route 
        path="/sign-in/*" 
        element={
          <div className="flex items-center justify-center min-h-screen p-4 bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-md">
              <SignIn 
                routing="path"
                path="/sign-in"
                appearance={{
                  variables: {
                    colorPrimary: "#00BFFF",
                    colorBackground: "#0f172a",
                    colorText: "#ffffff",
                  },
                  elements: {
                    card: "bg-slate-900/95 backdrop-blur-sm shadow-2xl border border-gray-700/50 rounded-2xl",
                    headerTitle: "text-xl font-bold text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-slate-800/90 border border-gray-600 text-gray-200 hover:bg-slate-700/90",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg",
                    formFieldInput: "bg-slate-800/70 border border-gray-600 text-white placeholder:text-gray-400",
                    footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
                    footerActionText: "text-sm text-gray-400",
                  },
                }}
              />
            </div>
          </div>
        } 
      />
      <Route 
        path="/sign-up/*" 
        element={
          <div className="flex items-center justify-center min-h-screen p-4 bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-md">
              <SignUp 
                routing="path"
                path="/sign-up"
                appearance={{
                  variables: {
                    colorPrimary: "#00BFFF",
                    colorBackground: "#0f172a",
                    colorText: "#ffffff",
                  },
                  elements: {
                    card: "bg-slate-900/95 backdrop-blur-sm shadow-2xl border border-gray-700/50 rounded-2xl",
                    headerTitle: "text-xl font-bold text-white",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-slate-800/90 border border-gray-600 text-gray-200 hover:bg-slate-700/90",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg",
                    formFieldInput: "bg-slate-800/70 border border-gray-600 text-white placeholder:text-gray-400",
                    footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
                    footerActionText: "text-sm text-gray-400",
                  },
                }}
              />
            </div>
          </div>
        } 
      />

      {/* Protected routes */}
      <Route path="/" element={
        <>
          <SignedIn>
            <Home />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />
      <Route path="/dashboard" element={
        <>
          <SignedIn>
            <Dashboard />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />
      <Route path="/saved" element={
        <>
          <SignedIn>
            <SavedTranslationsPage />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />
      <Route path="/history" element={
        <>
          <SignedIn>
            <HistoryPage />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ConditionalFooter() {
  const location = useLocation();

  // Hide footer on landing page
  if (location.pathname === "/landing") {
    return null;
  }

  return <Footer />;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1">
              <Router />
            </div>
            <ConditionalFooter />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;