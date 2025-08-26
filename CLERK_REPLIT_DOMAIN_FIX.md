# Fix Clerk Authentication for slango.replit.app

## The Issue
Your Clerk development instance (`precious-koi-20.clerk.accounts.dev`) was configured for a different domain and doesn't recognize `slango.replit.app`.

## Solution Steps

### 1. Update Clerk Development Instance Domain Settings

Go to your Clerk Dashboard:
1. Navigate to your development instance (`precious-koi-20.clerk.accounts.dev`)
2. Go to **Developers → Sessions**
3. Look for **"Allowed Origins"** or **"Domains"** section
4. Add these domains:
   - `https://slango.replit.app`
   - `http://localhost:5173` (for development)
   - `https://localhost:5173` (for development)

### 2. Update OAuth Provider Settings

In your Clerk Dashboard:
1. Go to **User & Authentication → Social Connections**
2. For each OAuth provider (Google, Facebook, etc.), update:
   - **Authorized redirect URIs** to include: `https://slango.replit.app/api/auth/callback/clerk`
   - **Authorized JavaScript origins** to include: `https://slango.replit.app`

### 3. Environment Variables Check

Ensure you're using development keys (they should start with `pk_test_`):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMta29pLTIwLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_NWeTw0H04xdmpLCcX63n1SpyXydBcgUemPlEslsfzi
```

### 4. Test the Fix

After updating the Clerk settings:
1. Wait 5-10 minutes for changes to propagate
2. Clear browser cache and cookies
3. Test the sign-in button

## Expected Result
- No more "ClerkJS: Something went wrong initializing Clerk" errors
- Sign-in modal should open properly
- Users can register and login successfully

## If This Doesn't Work
You may need to create a new Clerk development instance specifically configured for `slango.replit.app` domain.