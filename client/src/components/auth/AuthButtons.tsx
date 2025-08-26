import { useUser } from '@clerk/clerk-react';
import { SignInButton } from './SignInButton';
import { UserButton } from './UserButton';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LayoutDashboard } from 'lucide-react';

export function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (isSignedIn) {
    return <UserButton />;
  }

  return <SignInButton />;
}