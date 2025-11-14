# Environment Variables Setup for Vercel

Your deployment is failing with a 500 error because environment variables are missing.

## Required Environment Variables

You need to add these to your Vercel project:

### 1. Stripe Configuration
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_`)
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret (starts with `whsec_`)

### 2. Database (Vercel Postgres)
- `POSTGRES_URL` - Your Postgres connection string

### 3. NextAuth
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - A random secret (generate with: `openssl rand -base64 32`)

### 4. Admin Credentials
- `ADMIN_USERNAME` - Your admin username
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of your password

## How to Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`moxmini`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `STRIPE_SECRET_KEY`)
   - **Value**: Your actual value
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

## Generate Admin Password Hash

Run this in your terminal to generate a password hash:

```bash
node -e "const bcrypt = require('bcryptjs'); const hash = bcrypt.hashSync('YOUR_PASSWORD', 10); console.log('ADMIN_PASSWORD_HASH=' + hash);"
```

Replace `YOUR_PASSWORD` with your desired password.

## Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## After Adding Variables

1. Go to your Vercel project **Deployments** tab
2. Click on the failed deployment
3. Click **Redeploy** button

Or simply push a new commit and Vercel will redeploy automatically.

## Vercel Postgres Setup

If you haven't set up Vercel Postgres yet:

1. Go to your Vercel project
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Click **Continue** to create
5. The `POSTGRES_URL` and related variables will be automatically added

## Quick Test Locally

Create a `.env.local` file (ignored by git) with all these variables to test locally before deploying.
