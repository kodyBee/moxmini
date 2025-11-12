#!/bin/bash
# Quick Deploy Script for Vercel (Bash version)

echo "🚀 Deploying Mox Mini Store to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "🔗 Linking project to Vercel..."
    vercel link
fi

echo ""
echo "📝 Pre-deployment checklist:"
echo "   ✓ Have you added Vercel Postgres database?"
echo "   ✓ Have you added environment variables in Vercel?"
echo "   ✓ Have you configured Stripe webhook endpoint?"
echo ""

read -p "Ready to deploy? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Copy your production URL from above"
    echo "   2. Go to https://dashboard.stripe.com/webhooks"
    echo "   3. Create webhook endpoint with your URL + /api/webhooks/stripe"
    echo "   4. Copy webhook secret and add to Vercel environment variables"
    echo "   5. Redeploy to apply webhook secret"
    echo ""
    echo "📖 Full guide: PRODUCTION_READY_GUIDE.md"
else
    echo "❌ Deployment cancelled"
    echo "💡 Review PRODUCTION_READY_GUIDE.md before deploying"
fi
