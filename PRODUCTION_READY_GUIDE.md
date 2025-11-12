# Production Deployment Guide - Mox Mini Store

This guide will walk you through deploying your Stripe-integrated e-commerce site to production on Vercel.

## 📋 Pre-Deployment Checklist

### ✅ Required Items
- [ ] Vercel account (free tier works)
- [ ] Stripe account with payment processing enabled
- [ ] GitHub repository with your code
- [ ] Custom domain (optional but recommended)

---

## 🚀 Step 1: Prepare Your Stripe Account

### 1.1 Complete Stripe Onboarding
1. Go to https://dashboard.stripe.com
2. Complete business information
3. Add bank account details
4. Verify identity (may take 1-2 business days)

### 1.2 Get Live API Keys
1. Switch to **Live mode** in Stripe Dashboard (toggle in top right)
2. Navigate to **Developers** → **API keys**
3. Copy these values (you'll need them for Vercel):
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...` (click "Reveal" to see it)

⚠️ **IMPORTANT**: Keep your secret key secure! Never commit it to git or share it publicly.

---

## 🔗 Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI (Optional)
```bash
npm i -g vercel
vercel login
```

### 2.2 Connect Repository to Vercel
**Option A: Via Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

**Option B: Via CLI**
```bash
cd c:/Users/kodya/Projects/Testing/my-app
vercel
```

### 2.3 Add Vercel Postgres Database
1. In Vercel Dashboard, go to your project
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Name it: `moxmini-orders`
6. Click **Create**

Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

---

## 🔐 Step 3: Configure Environment Variables

### 3.1 Add Variables in Vercel
1. Go to **Project Settings** → **Environment Variables**
2. Add the following variables for **Production**:

```env
# Stripe Live Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password

# Webhook Secret (add this in Step 4)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 3.2 Optional: Add for Preview/Development
You can also add test keys for preview deployments:
- Select "Preview" environment
- Add your test keys (`pk_test_...` and `sk_test_...`)

---

## 🎯 Step 4: Configure Stripe Webhook (CRITICAL!)

### 4.1 Get Your Production URL
After deploying, your URL will be:
- Vercel default: `https://your-project.vercel.app`
- Or your custom domain: `https://yourdomain.com`

### 4.2 Create Webhook Endpoint in Stripe
1. Go to https://dashboard.stripe.com/webhooks (make sure you're in **Live mode**)
2. Click **"Add endpoint"**
3. Enter webhook URL:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```
4. Click **"Select events"**
5. Choose: `checkout.session.completed`
6. Click **"Add endpoint"**

### 4.3 Get Webhook Signing Secret
1. Click on your newly created webhook
2. Find **"Signing secret"** section
3. Click **"Reveal"**
4. Copy the secret (starts with `whsec_`)

### 4.4 Add Webhook Secret to Vercel
1. Go back to Vercel: **Project Settings** → **Environment Variables**
2. Add/Update:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_COPIED_SECRET_HERE
   ```
3. Click **"Save"**
4. **Redeploy** your project (Settings → Deployments → latest → ... → Redeploy)

---

## ✅ Step 5: Test Production Setup

### 5.1 Test the Website
1. Visit your production URL
2. Browse products
3. Add items to cart
4. Click "Checkout"

### 5.2 Test Payment Flow
1. Use a **real test card** (Stripe provides these):
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. Complete the checkout
3. You should see success page

### 5.3 Verify Webhook Works
1. Go to Stripe Dashboard → **Webhooks**
2. Click on your webhook endpoint
3. Check **"Recent deliveries"**
4. You should see successful (200) responses
5. If you see errors, check Vercel logs (see Step 6)

### 5.4 Check Admin Dashboard
1. Visit: `https://your-domain.vercel.app/admin/login`
2. Login with your credentials
3. You should see the test order you just placed

---

## 🔍 Step 6: Monitor & Debug

### 6.1 View Vercel Logs
```bash
vercel logs --prod
```
Or in Dashboard: **Deployments** → [Latest] → **Logs**

### 6.2 Check Database
- Vercel Dashboard → **Storage** → Your Database
- Click **"Query"** to run SQL queries
- Check orders table:
  ```sql
  SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
  ```

### 6.3 Monitor Stripe Webhooks
- Dashboard → **Webhooks** → Your endpoint
- Check "Recent deliveries" for errors
- Look for failed webhooks (400/500 errors)

### 6.4 Common Issues

**Webhook failing (400 error)**
- Check webhook secret is correct in Vercel
- Verify webhook URL is correct
- Redeploy after updating environment variables

**Orders not appearing in dashboard**
- Check Vercel logs for database errors
- Verify POSTGRES_URL is set
- Check webhook is receiving events in Stripe Dashboard

**Payment not processing**
- Verify you're using live keys (not test keys)
- Check Stripe Dashboard for payment status
- Review browser console for errors

---

## 🌐 Step 7: Add Custom Domain (Optional)

### 7.1 Add Domain in Vercel
1. **Project Settings** → **Domains**
2. Enter your domain (e.g., `moxmini.com`)
3. Follow DNS configuration instructions

### 7.2 Update Stripe Webhook
1. Go to Stripe Dashboard → **Webhooks**
2. Click your webhook endpoint
3. Click **"..."** → **"Update details"**
4. Change URL to: `https://yourdomain.com/api/webhooks/stripe`
5. Save changes

---

## 🔒 Step 8: Security Hardening

### 8.1 Change Admin Credentials
Generate a secure password hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourSecurePassword123!', 10));"
```

Then update in Vercel:
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_new_secure_password
```

### 8.2 Enable Rate Limiting (Recommended)
Consider adding rate limiting to your API routes for production security.

### 8.3 Review Stripe Settings
1. Enable 3D Secure in Stripe Dashboard
2. Set up fraud detection rules
3. Configure email notifications

---

## 📊 Step 9: Going Live Checklist

Before accepting real payments:

- [ ] Stripe account fully verified
- [ ] Live API keys configured in Vercel
- [ ] Webhook endpoint created and tested
- [ ] Database storing orders correctly
- [ ] Admin dashboard accessible
- [ ] Custom domain configured (optional)
- [ ] Admin credentials changed from defaults
- [ ] Test purchase completed successfully
- [ ] Webhook deliveries showing 200 status
- [ ] Email notifications working (Stripe sends them automatically)

---

## 💰 Cost Breakdown

### Free Tier (Good for Starting)
- **Vercel**: Free (100GB bandwidth/month)
- **Vercel Postgres**: ~$0.27/month (0.25GB, 10k queries)
- **Stripe**: 2.9% + $0.30 per transaction (no monthly fees)

### Estimated Monthly Cost for 100 Orders
- Hosting: ~$0.50
- Database: ~$0.50
- Stripe fees: ~$90 (on $3,000 revenue)
- **Total**: ~$91/month

---

## 🆘 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Troubleshooting
1. Check Vercel logs: `vercel logs --prod`
2. Review Stripe webhook deliveries
3. Test with Stripe CLI locally first
4. Check environment variables are set correctly

### Local Development
To test locally with production webhook:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook secret to .env.local
npm run dev
```

---

## 🎉 Success!

Your store is now live and ready to accept real payments!

### Next Steps:
1. Share your store URL
2. Monitor first few orders closely
3. Set up analytics (Vercel Analytics)
4. Consider adding email notifications
5. Plan marketing strategy

### Production URLs:
- Store: `https://your-domain.vercel.app`
- Admin: `https://your-domain.vercel.app/admin/login`
- Stripe Dashboard: `https://dashboard.stripe.com`

---

## 📝 Quick Reference

### Environment Variables Needed
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
POSTGRES_URL=postgres://... (auto-added by Vercel)
```

### Important URLs
- Stripe API Keys: https://dashboard.stripe.com/apikeys
- Stripe Webhooks: https://dashboard.stripe.com/webhooks
- Vercel Dashboard: https://vercel.com/dashboard
- Admin Login: https://your-domain.vercel.app/admin/login

### Test Cards (for testing)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

---

**Need Help?** Check the troubleshooting section or review Vercel/Stripe logs for detailed error messages.
