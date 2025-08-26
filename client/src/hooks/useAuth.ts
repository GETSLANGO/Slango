import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from 'react';

export function useAuth() {
  const [clerkError, setClerkError] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const hasClerkKey = clerkKey && clerkKey.length > 20 && clerkKey.startsWith('pk_');
  
  // Always call hooks, but handle errors gracefully
  let isSignedIn = false;
  let clerkUser: any = null;
  let isLoaded = true;
  let getToken = (): Promise<string | null> => Promise.resolve(null);

  // Check for domain mismatch
  useEffect(() => {
    const currentDomain = window.location.hostname;
    if (clerkKey?.includes('precious-koi-20') && currentDomain === 'getslango.com') {
      setClerkError(true);
      console.warn('Clerk domain mismatch - development keys used in production');
    }
    
    // Set initial load as complete after a brief delay
    const timer = setTimeout(() => setInitialLoadComplete(true), 1000);
    return () => clearTimeout(timer);
  }, [clerkKey]);

  // For now, disable Clerk and use simple auth approach
  useEffect(() => {
    if (hasClerkKey) {
      setClerkError(true); // Disable Clerk for now due to configuration issues
    }
  }, [hasClerkKey]);

  // Sync user data with our backend when signed in
  const { data: syncedUser } = useQuery({
    queryKey: ['/api/auth/sync', clerkUser?.id],
    queryFn: async () => {
      if (!clerkUser?.id) return null;
      
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: clerkUser.id }),
      });
      
      if (!response.ok) throw new Error('Sync failed');
      return response.json();
    },
    enabled: !!isSignedIn && !!clerkUser?.id && hasClerkKey && !clerkError,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Fetch our backend user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: isSignedIn && hasClerkKey && !clerkError,
    retry: false,
  });

  // Determine loading state - don't show loading indefinitely
  const actualIsLoading = clerkError ? false : (!isLoaded && !initialLoadComplete);

  return {
    user: user || syncedUser?.user,
    isAuthenticated: isSignedIn && !clerkError,
    isLoading: actualIsLoading,
    getToken,
    hasAuthError: clerkError,
  };
}