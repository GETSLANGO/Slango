import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import { ReactNode, useEffect, useState } from 'react';
import { forceClerkWhiteBackground } from '@/utils/clerkStyleOverride';

interface ClerkProviderProps {
  children: ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Detect dark mode and ensure theme detection runs before ClerkProvider renders
  useEffect(() => {
    const detectTheme = () => {
      const root = document.documentElement;
      const isDark = root.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial detection
    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Small delay to ensure DOM and CSS are ready
    const timer = setTimeout(() => {
      setIsThemeReady(true);
      // Start the nuclear override for Clerk styles in light mode only
      if (!document.documentElement.classList.contains('dark')) {
        forceClerkWhiteBackground();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Check if we should disable Clerk due to domain issues
  const currentDomain = window.location.hostname;
  const isReplit = currentDomain.includes('.replit.dev') || currentDomain === 'localhost';
  const isProductionDomain = currentDomain === 'getslango.com' || currentDomain === 'slango.replit.app';

  // Disable Clerk if no key or if we're on development domain with production keys
  const shouldDisableClerk = !publishableKey || 
    (isReplit && publishableKey.includes('pk_live_')) ||
    (!isProductionDomain && publishableKey && !publishableKey.includes('precious-koi-20'));

  if (shouldDisableClerk) {
    console.warn('Clerk disabled due to domain/key mismatch');
    return <>{children}</>;
  }

  // Don't render ClerkProvider until theme is ready
  if (!isThemeReady) {
    return <>{children}</>;
  }

  return (
    <BaseClerkProvider 
      publishableKey={publishableKey}
      signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL || "/sign-in"}
      signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL || "/sign-up"}
      afterSignInUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || "/"}
      afterSignUpUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || "/"}
      appearance={{
        baseTheme: isDarkMode ? "dark" : undefined,
        elements: isDarkMode ? {
          // Clean dark mode styling - removes gray backgrounds
          card: {
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "none",
          },
          modalContent: {
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "none",
          },
          formFieldInput: {
            backgroundColor: "#111827",
            color: "#ffffff",
            border: "1px solid #1f2937",
          },
          socialButtonsBlockButton: {
            backgroundColor: "#1f2937",
            border: "none",
            color: "#ffffff",
          },
          headerTitle: {
            color: "#ffffff",
          },
          headerSubtitle: {
            color: "#9ca3af",
          },
          userButtonPopoverCard: {
            backgroundColor: "#111827",
            boxShadow: "none",
            border: "none",
          },
          modalBackdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        } : {
          // Light mode elements
          modalContent: {
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          card: {
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          headerTitle: {
            color: "#1a1a1a",
            fontWeight: "600",
            fontSize: "20px",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          headerSubtitle: {
            color: "#4a4a4a",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          formFieldInput: {
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          },
          formFieldLabel: {
            color: "#1a1a1a",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          formButtonPrimary: {
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            fontWeight: "500",
            borderRadius: "6px",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          socialButtonsBlockButton: {
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          footerActionText: {
            color: "#4a4a4a",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          footerActionLink: {
            color: "#3b82f6",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          dividerText: {
            color: "#6b7280",
            fontFamily: "'Exo 2', system-ui, sans-serif",
          },
          dividerLine: {
            backgroundColor: "#e5e7eb",
          },
          userButtonPopoverCard: {
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        },
      }}
      localization={{
        signIn: {
          start: {
            title: "Sign in to Slango",
            subtitle: "Welcome back! Please sign in to continue",
          },
        },
        signUp: {
          start: {
            title: "Create your Slango account",
            subtitle: "Welcome! Please fill in the details to get started",
          },
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}