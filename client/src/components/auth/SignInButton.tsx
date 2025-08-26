import { SignInButton as ClerkSignInButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export function SignInButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <ClerkSignInButton mode="modal">
      <Button variant="default" size="sm" className="gap-2">
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    </ClerkSignInButton>
  );
}