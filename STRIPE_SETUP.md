# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for your miniature figurine store.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Node.js and npm installed

## Installation

The required packages are already installed:
- `stripe` - Stripe Node.js library for server-side operations
- `@stripe/stripe-js` - Stripe.js library for client-side operations

## Configuration

### 1. Get Your Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

### 2. Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Stripe keys:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

**Important:** 
- Never commit `.env.local` to version control
- Use test keys (`pk_test_` and `sk_test_`) for development
- Switch to live keys (`pk_live_` and `sk_live_`) for production

### 3. Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Testing the Payment Flow

### Test Cards

Stripe provides test card numbers for testing:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVC
- Use any ZIP code

### Payment Flow

1. **Add Items to Cart**: Browse products and add items (customized or prepainted)
2. **View Cart**: Click the cart icon to review items
3. **Checkout**: Click "Proceed to Checkout"
4. **Stripe Checkout**: Enter test card details
5. **Success**: Redirected to success page with order confirmation

## Features

✅ **Secure Payment Processing**: All payments handled by Stripe
✅ **Product Metadata**: Painting options saved with each order
✅ **Order Details**: Full order information in Stripe Dashboard
✅ **Success Page**: Confirmation page after successful payment
✅ **Cart Management**: Cart automatically cleared after successful payment
✅ **Loading States**: Visual feedback during checkout process

## Webhook Setup (Optional)

For production, set up webhooks to handle payment events:

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for (e.g., `payment_intent.succeeded`)
4. Copy the webhook signing secret and add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Going Live

Before going live:

1. **Switch to Live Keys**: Replace test keys with live keys in `.env.local`
2. **Test Thoroughly**: Test the complete payment flow
3. **Enable Payment Methods**: Configure accepted payment methods in Stripe Dashboard
4. **Set Up Webhooks**: Configure production webhooks
5. **Review Security**: Ensure all sensitive data is properly secured

## Troubleshooting

### "Missing Stripe publishable key" Error
- Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Restart your development server

### Payment Not Processing
- Check browser console for errors
- Verify Stripe keys are correct
- Check Stripe Dashboard logs

### Environment Variables Not Loading
- Ensure file is named `.env.local` (not `.env`)
- Restart development server after changes
- Check file is in project root directory

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Test Cards: https://stripe.com/docs/testing

## Security Notes

⚠️ **Never expose your secret key** - Only use it in server-side code (API routes)
⚠️ **Use HTTPS in production** - Required for payment processing
⚠️ **Validate on server** - Always verify payments server-side
⚠️ **Keep packages updated** - Regularly update Stripe packages
