# Mox Mini's

Storefront for Mox Mini's hand-painted tabletop miniatures: one-of-a-kind
prepainted pieces, plus custom painting of any figure from the Reaper
Miniatures catalog.

Built with Next.js 16 (App Router, React Compiler), React 19, Tailwind CSS 4,
Stripe Checkout, Neon Postgres, Vercel Blob and NextAuth.

## Pages

| Route                       | What it does                                                 |
| --------------------------- | ------------------------------------------------------------ |
| `/`                         | Home page with featured prepainted pieces                    |
| `/premade`                  | Prepainted pieces for sale (each is removed once it sells)   |
| `/figurefinder`             | Search, filter and sort the Reaper catalog (server-rendered) |
| `/painting-options/[sku]`   | Choose colors and notes for a custom-painted figure          |
| `/cart`                     | Cart (stored in the browser) and Stripe checkout             |
| `/about`                    | About Mox and FAQ                                            |
| `/admin/login`              | Artist sign-in                                               |
| `/admin/dashboard`          | Orders received through the Stripe webhook                   |
| `/admin/dashboard/products` | Add, edit and remove prepainted products                     |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a database, the
shop shows a demo prepainted product so the pages still render.

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`,
`npm run format`.

## Environment variables

Put these in `.env.local` for development, or in the Vercel project settings.

| Variable                | Required for        | Notes                                                          |
| ----------------------- | ------------------- | -------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`     | Checkout            | Stripe secret key                                              |
| `STRIPE_WEBHOOK_SECRET` | Recording orders    | Signing secret for the `/api/webhooks/stripe` endpoint         |
| `POSTGRES_URL`          | Orders and products | Neon connection string (`DATABASE_URL` also works)             |
| `BLOB_READ_WRITE_TOKEN` | Product photos      | Vercel Blob token for admin uploads                            |
| `NEXTAUTH_SECRET`       | Admin sign-in       | Any long random string, e.g. `openssl rand -base64 32`         |
| `NEXTAUTH_URL`          | Admin sign-in       | The site's URL (Vercel sets this automatically)                |
| `ADMIN_USERNAME`        | Admin sign-in       | Username for the artist dashboard                              |
| `ADMIN_PASSWORD_HASH`   | Admin sign-in       | bcrypt hash of the password (see below)                        |
| `REAPER_PRODUCTS_URL`   | Optional            | Override the Reaper catalog URL, e.g. to point at a local copy |

Generate the admin password hash with:

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 10))" 'your-password'
```

The Stripe webhook should send `checkout.session.completed` and
`checkout.session.async_payment_succeeded` events to
`https://<your-domain>/api/webhooks/stripe`.

## How it fits together

- **Catalog**: `lib/catalog.ts` fetches Reaper's product list on the server,
  keeps only metal and plastic figures, and caches it in memory for an hour.
  The Figure Finder filters and paginates it on the server (`lib/finder.ts`).
- **Cart**: `lib/cart.ts` stores the cart in `localStorage` and shares it
  across components and browser tabs with `useSyncExternalStore`.
- **Checkout**: `/api/checkout` looks up every price on the server (catalog
  or database), so prices in the browser can't be tampered with.
- **Orders**: the Stripe webhook saves paid orders to Postgres and removes sold
  prepainted pieces from the shop.
- **Admin**: every `/api/admin/*` route and admin page checks for a signed-in
  admin session.
