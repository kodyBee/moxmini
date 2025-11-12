# Production Deployment Guide

This guide will help you deploy your Mox Mini painting commission e-commerce site to production on Vercel.

## Prerequisites

- A Vercel account (free tier works)
- A Stripe account with payment processing enabled
- Your GitHub repository connected to Vercel

## 1. Database Setup (Vercel Postgres)

### Option A: Via Vercel Dashboard (Recommended)
1. Go to your project on Vercel
2. Navigate to the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name (e.g., "moxmini-orders")
6. Create the database
7. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - etc.

### Option B: Via Vercel CLI
```bash
vercel link
vercel storage create postgres moxmini-orders
```

## 2. Environment Variables

Add these environment variables to your Vercel project:

### Required Variables
Go to Project Settings → Environment Variables and add:

```env
# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Stripe Webhook (Set after step 3)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Admin Credentials (Change these!)
ADMIN_USERNAME=artist
ADMIN_PASSWORD_HASH=your_hashed_password_here

# Database (Automatically added by Vercel Postgres)
POSTGRES_URL=postgres://...
```

### Getting Your Stripe Keys

1. **Test Mode (Development)**:
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → `STRIPE_SECRET_KEY`

2. **Live Mode (Production)**:
   - Switch to "Live mode" in Stripe Dashboard
   - Go to https://dashboard.stripe.com/apikeys
   - Copy the live keys (they start with `pk_live_` and `sk_live_`)

## 3. Configure Stripe Webhook

### Step 1: Create Webhook Endpoint
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your production URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
5. Click "Add endpoint"

### Step 2: Get Webhook Secret
1. Click on your newly created webhook
2. Click "Reveal" under "Signing secret"
3. Copy the secret (starts with `whsec_`)
4. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Step 3: Test Webhook
```bash
# Install Stripe CLI
stripe listen --forward-to https://your-domain.vercel.app/api/webhooks/stripe

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

## 4. Deploy to Vercel

### First Time Deployment

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Deploy
vercel --prod
```

### Subsequent Deployments

The project is set up for automatic deployment:
- Push to `main` branch → Automatic production deployment
- Push to other branches → Preview deployment

Or deploy manually:
```bash
git push origin main
# Or
vercel --prod
```

## 5. Post-Deployment Checklist

### Verify Database Connection
1. Visit `https://your-domain.vercel.app/admin/login`
2. Login with your credentials
3. The dashboard should load without errors
4. Check Vercel logs for any database connection errors

### Test Payment Flow
1. Add a product to cart
2. Proceed to checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Verify order appears in admin dashboard
6. Check Vercel logs for webhook delivery

### Verify Webhook Delivery
1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. Check "Recent deliveries" - should show successful 200 responses

## 6. Domain Configuration (Optional)

### Add Custom Domain
1. Go to Vercel Project Settings → Domains
2. Add your custom domain (e.g., `moxmini.com`)
3. Follow DNS configuration instructions
4. Update Stripe webhook URL to use custom domain
5. Update any hardcoded URLs in your code

## 7. Monitoring & Maintenance

### Monitor Logs
```bash
vercel logs --prod
```

Or view in Vercel Dashboard → Deployments → [Latest] → Logs

### Database Management
- View database in Vercel Dashboard → Storage → Your Database
- Run queries directly from the dashboard
- Set up backups (available on Pro plan)

### Order Management
- Admin dashboard: `https://your-domain.vercel.app/admin/login`
- Username: `artist` (or your custom username)
- Password: `1z2x3s` (or your custom password)

## 8. Security Recommendations

### Change Default Credentials
1. Hash a new password:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-new-password', 10));"
```
2. Add the hash to `ADMIN_PASSWORD_HASH` environment variable
3. Update the admin auth route to use bcrypt comparison

### Enable Stripe Live Mode
1. Ensure you've completed Stripe onboarding
2. Replace test keys with live keys
3. Test a small transaction first

### Set up HTTPS (Automatic with Vercel)
- Vercel automatically provides SSL certificates
- All traffic is encrypted

## 9. Troubleshooting

### Orders Not Appearing in Dashboard
- Check Vercel logs for webhook errors
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure webhook URL is correct in Stripe dashboard
- Check database connection in Vercel Storage tab

### Database Errors
- Verify `POSTGRES_URL` environment variable is set
- Check database is active in Vercel Storage
- Review Vercel function logs for SQL errors

### Payment Errors
- Verify Stripe keys are for the correct mode (test vs live)
- Check Stripe dashboard for failed payments
- Review browser console for client-side errors

## 10. Production Tips

### Performance
- Enable Vercel Analytics (Project Settings → Analytics)
- Monitor Core Web Vitals
- Optimize images using Next.js Image component

### Backups
- Export orders regularly from admin dashboard
- Set up database backups (Vercel Pro feature)
- Keep environment variables backed up securely

### Updates
```bash
# Pull latest changes
git pull origin main

# Deploy
git push origin main
# Vercel will automatically deploy
```

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs

## Cost Estimates

### Free Tier (Hobby Plan)
- Vercel: Free (limited to 100GB bandwidth/month)
- Vercel Postgres: $0.27/month (0.25GB storage, 10,000 queries)
- Stripe: 2.9% + $0.30 per transaction

### Scaling (Pro Plan)
- Vercel Pro: $20/month
- Database: ~$10-50/month depending on usage
- Stripe: Same transaction fees
