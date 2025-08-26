import { UserButton as ClerkUserButton, useUser } from '@clerk/clerk-react';

export function UserButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <ClerkUserButton 
      afterSignOutUrl="/"
      showName={false}
      userProfileMode="navigation"
      userProfileUrl={undefined}
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
          userButtonPopoverCard: "bg-white border border-gray-200 shadow-lg",
          userButtonPopoverActions: "bg-white",
          userButtonPopoverActionButton: "text-gray-900 hover:bg-gray-50",
          userButtonPopoverActionButtonText: "text-gray-900",
          userButtonPopoverFooter: "hidden", // Hide the "Manage account" footer
          userButtonPopoverActionButton__manageAccount: "hidden", // Hide manage account button
          userButtonPopoverActionButtonIcon__manageAccount: "hidden", // Hide manage account icon
          userButtonPopoverActionButtonText__manageAccount: "hidden", // Hide manage account text
        },
      }}
      userProfileProps={{
        appearance: {
          elements: {
            // Hide profile and security navigation
            navbar: "hidden",
            navbarMobileMenuButton: "hidden", 
            pageScrollBox: "hidden",
            page: "hidden",
            // Hide the entire modal content
            modalContent: "hidden",
            card: "hidden",
          }
        }
      }}
    />
  );
}