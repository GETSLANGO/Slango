# Clerk Production Setup Guide

## Prerequisites
- Custom domain (e.g., yourdomain.com)
- Replit Deployments access

## Step 1: Replit Deployment
1. Go to "Deployments" in your Repl
2. Choose deployment type (Autoscale recommended)
3. Configure build/run commands:
   - Build: `npm run build`
   - Run: `npm start`
4. Deploy to get `.replit.app` URL
5. In Settings → Custom Domain, add your domain
6. Configure DNS records as provided by Replit

## Step 2: Clerk Production Instance
1. In Clerk Dashboard, create production instance
2. Go to Domains page
3. Set your custom domain
4. Configure required DNS records
5. Wait for domain verification

## Step 3: Update Environment Variables
```bash
# Replace in client/.env.local
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key

# Add to server environment
CLERK_SECRET_KEY=sk_live_your_production_key
```

## Step 4: Enable Clerk in Code
Uncomment the Clerk initialization in `WorkingClerkProvider.tsx`

## Timeline
- DNS propagation: 24-48 hours
- Clerk domain verification: 1-2 hours
- Total setup time: 2-3 days