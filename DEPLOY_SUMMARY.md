# 🎯 Production Deployment - Quick Start

Your Mox Mini store is now ready for production! Here's everything you need to know.

## What's Been Done ✅

### 1. Environment Variables Cleaned Up
- ✅ Removed duplicate Stripe keys
- ✅ Organized development vs production keys
- ✅ Added clear comments for production setup
- ✅ Test keys configured for local development
- ⚠️  **Action needed**: Add live keys and webhook secret in Vercel

### 2. Webhook Enhanced for Production
- ✅ Improved error handling and logging
- ✅ Better error messages for debugging
- ✅ Proper database error handling
- ✅ Emoji indicators for easy log scanning
- ✅ Production-ready error responses

### 3. Documentation Created
- ✅ `PRODUCTION_READY_GUIDE.md` - Complete step-by-step guide
- ✅ `deploy.sh` / `deploy.ps1` - Quick deploy scripts
- ✅ Environment variable templates with clear instructions

### 4. Database Ready
- ✅ Vercel Postgres integration configured
- ✅ Database schema defined in `lib/db.ts`
- ✅ Auto-initialization on first run
- ✅ Order storage and retrieval working

---

## 🚀 Deploy in 5 Steps

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### Step 2: Deploy to Vercel
```bash
cd c:/Users/kodya/Projects/Testing/my-app
./deploy.sh    # On Mac/Linux
# OR
./deploy.ps1   # On Windows
```

Or manually:
```bash
vercel --prod
```

### Step 3: Add Vercel Postgres
1. Go to your project on Vercel
2. **Storage** tab → **Create Database** → **Postgres**
3. Name it: `moxmini-orders`

### Step 4: Add Environment Variables
In Vercel Dashboard → **Project Settings** → **Environment Variables**:

```env
# Stripe LIVE keys (from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Admin (CHANGE THESE!)
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password

# Webhook (add after Step 5)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 5: Configure Stripe Webhook
1. Go to https://dashboard.stripe.com/webhooks (Live mode)
2. **Add endpoint**: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook secret → Add to Vercel environment variables
5. **Redeploy** in Vercel

---

## 📋 Production Checklist

Before going live:

- [ ] Deployed to Vercel
- [ ] Vercel Postgres database created
- [ ] Live Stripe keys added to Vercel
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook secret added to Vercel
- [ ] Redeployed after adding webhook secret
- [ ] Changed admin credentials
- [ ] Test purchase completed successfully
- [ ] Order appears in admin dashboard
- [ ] Webhook shows 200 status in Stripe

---

## 🧪 Testing Your Production Setup

### Test Payment
1. Visit your production URL
2. Add a product to cart
3. Checkout with test card: `4242 4242 4242 4242`
4. Verify success page appears

### Verify Webhook
1. Stripe Dashboard → **Webhooks** → Your endpoint
2. Check "Recent deliveries" for 200 responses
3. If errors, check Vercel logs: `vercel logs --prod`

### Check Admin Dashboard
1. Go to: `https://your-domain.vercel.app/admin/login`
2. Login with your credentials
3. Verify test order appears

---

## 🔍 Monitoring & Logs

### View Logs in Real-Time
```bash
vercel logs --prod --follow
```

### Check Webhook Logs
Look for these indicators:
- ✅ `Webhook verified: checkout.session.completed`
- 📦 `New orders received from webhook`
- ✅ `Successfully stored N orders in database`
- ❌ Any error messages with details

### Database Queries
Vercel Dashboard → **Storage** → Your Database → **Query**:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

---

## ⚠️ Important Security Notes

### 1. Change Admin Credentials
Default credentials are in `.env.local` - **CHANGE THEM** for production!
```env
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
```

### 2. Never Commit Secrets
Your `.env.local` should NEVER be in git. It's already in `.gitignore`.

### 3. Use Live Keys in Production
Make sure you're using `pk_live_...` and `sk_live_...` keys, NOT test keys!

### 4. Verify Webhook Signatures
The webhook code already does this - don't skip signature verification!

---

## 💰 Costs

### Current Setup (Free Tier)
- **Vercel Hosting**: FREE (100GB bandwidth/month)
- **Vercel Postgres**: ~$0.27/month (0.25GB storage)
- **Stripe**: 2.9% + $0.30 per transaction

### Example: 50 orders @ $30 each
- Revenue: $1,500
- Stripe fees: ~$46.50
- Hosting: ~$0.50
- **Your net**: ~$1,453

---

## 🆘 Troubleshooting

### "Webhook signature verification failed"
→ Check webhook secret in Vercel matches Stripe
→ Redeploy after updating environment variables

### "Orders not appearing in dashboard"
→ Check Vercel logs for errors: `vercel logs --prod`
→ Verify POSTGRES_URL is set (auto-added by Vercel)
→ Check webhook deliveries in Stripe Dashboard

### "Payment failed"
→ Verify you're using live keys (not test keys)
→ Check Stripe Dashboard for payment details
→ Review browser console for errors

### "Database connection error"
→ Verify Vercel Postgres is created and connected
→ Check environment variables include POSTGRES_URL
→ Redeploy project

---

## 📚 Documentation Files

- `PRODUCTION_READY_GUIDE.md` - Complete deployment guide (read this!)
- `STRIPE_SETUP.md` - Stripe integration details
- `PRODUCTION_DEPLOYMENT.md` - Original deployment notes
- `README.md` - General project information

---

## 🎉 You're Ready!

Your store is production-ready with:
- ✅ Secure payment processing via Stripe
- ✅ Real-time order tracking via webhooks
- ✅ Database storage for orders
- ✅ Admin dashboard for order management
- ✅ Production-grade error handling

### Quick Links
- **Deploy**: `./deploy.sh` or `./deploy.ps1`
- **Docs**: `PRODUCTION_READY_GUIDE.md`
- **Stripe**: https://dashboard.stripe.com
- **Vercel**: https://vercel.com/dashboard

---

**Need help?** Check `PRODUCTION_READY_GUIDE.md` for detailed instructions and troubleshooting.

Good luck with your launch! 🚀
