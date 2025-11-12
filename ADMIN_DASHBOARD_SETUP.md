# Admin Dashboard Setup Guide

## Overview
The admin dashboard allows the artist to view all painting orders with detailed color specifications and customer information.

## Access Information
- **Login URL**: `https://your-domain.com/admin/login`
- **Username**: `artist`
- **Password**: `1z2x3s`

## Features
- ✅ Automatic order ingestion from Stripe payments
- ✅ Color swatches with hex codes for each miniature
- ✅ Direct links to order miniatures from Reaper Minis website
- ✅ Mark orders as complete/pending
- ✅ Delete orders
- ✅ Filter by status (All/Pending/Completed)
- ✅ Customer email and order ID tracking
- ✅ Session expires after 24 hours for security

## Setting Up Stripe Webhook (IMPORTANT!)

For orders to automatically appear in the dashboard, you need to set up a Stripe webhook:

### Step 1: Add Webhook Secret to Environment Variables

1. Create/update your `.env.local` file with:
```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 2: Configure Webhook in Stripe Dashboard

#### For Local Testing (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`) to your `.env.local`

#### For Production (Vercel/Live Site):

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
5. Click "Add endpoint"
6. Copy the webhook signing secret
7. Add to Vercel environment variables:
   - Go to Vercel project settings
   - Environment Variables
   - Add: `STRIPE_WEBHOOK_SECRET` = `whsec_...`
8. Redeploy your site

### Step 3: Test the Webhook

1. Make a test purchase on your site
2. Complete the checkout with test card: `4242 4242 4242 4242`
3. Go to `https://your-domain.com/admin/login`
4. Login with credentials above
5. The order should appear automatically in the dashboard!

## Dashboard Features

### Order Information Displayed:
- Product name and SKU
- Order ID and timestamp
- Customer email
- Price
- Painting colors with visual swatches:
  - Hair color
  - Skin color
  - Accessory color
  - Fabric color
- Special instructions from customer
- Direct link to order the miniature from Reaper Minis

### Actions Available:
- **Mark Complete**: Move order to completed status
- **Mark Pending**: Move order back to pending status
- **Delete**: Remove order from list
- **Filter**: View all orders, only pending, or only completed

## Notes

- Orders are currently stored in localStorage (client-side)
- For production use, consider implementing a database (like Supabase, PostgreSQL, etc.)
- The webhook stores orders server-side but the dashboard reads from localStorage
- Session expires after 24 hours for security
- Each order includes a direct link to buy the miniature from Reaper Minis using the SKU

## Troubleshooting

### Orders not appearing in dashboard?
1. Check that webhook is properly configured in Stripe
2. Verify `STRIPE_WEBHOOK_SECRET` is set in environment variables
3. Check Vercel logs for webhook errors
4. Make sure you completed a test purchase after setting up webhook

### Can't login?
- Username: `artist` (all lowercase)
- Password: `1z2x3s` (no spaces)
- Clear browser cache if issues persist

### Session expired?
- Login again (session lasts 24 hours)
- This is a security feature
