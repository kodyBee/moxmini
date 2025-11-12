# Quick Deploy Script for Vercel
# Run this script to deploy to production

Write-Host "🚀 Deploying Mox Mini Store to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if project is linked
if (!(Test-Path ".vercel")) {
    Write-Host "🔗 Linking project to Vercel..." -ForegroundColor Yellow
    vercel link
}

Write-Host ""
Write-Host "📝 Pre-deployment checklist:" -ForegroundColor Yellow
Write-Host "   ✓ Have you added Vercel Postgres database?" 
Write-Host "   ✓ Have you added environment variables in Vercel?" 
Write-Host "   ✓ Have you configured Stripe webhook endpoint?"
Write-Host ""

$confirm = Read-Host "Ready to deploy? (y/n)"

if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Deploying to production..." -ForegroundColor Green
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Copy your production URL from above"
    Write-Host "   2. Go to https://dashboard.stripe.com/webhooks"
    Write-Host "   3. Create webhook endpoint with your URL + /api/webhooks/stripe"
    Write-Host "   4. Copy webhook secret and add to Vercel environment variables"
    Write-Host "   5. Redeploy to apply webhook secret"
    Write-Host ""
    Write-Host "📖 Full guide: PRODUCTION_READY_GUIDE.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    Write-Host "💡 Review PRODUCTION_READY_GUIDE.md before deploying"
}
