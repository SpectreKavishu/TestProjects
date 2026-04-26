# Alien Wallpaper Studio

A low-cost MVP website to generate realistic alien-world wallpapers and monetize via credits.

## What you get

- Landing page with business positioning
- User signup/login
- Free starting credits for each account
- AI wallpaper generation tuned for realistic alien planets
- Credit usage tracking
- Stripe payment-link hook for buying more credits
- Gallery of generated images per user

## Tech stack

- Node.js + Express
- JSON file storage (no database hosting needed to start)
- Pollinations image API (free endpoint, no key required)

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start app:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Monetization setup

1. In Stripe, create a payment link for credit packs.
2. Put the URL in `STRIPE_PAYMENT_LINK` in `.env`.
3. After successful payments, add credits using one of these:
   - Temporary manual/dev method: call `POST /api/payments/webhook/dev-credit`
   - Production method: connect Stripe webhook and credit users automatically

Example dev credit call:
```bash
curl -X POST http://localhost:3000/api/payments/webhook/dev-credit \
  -H "Content-Type: application/json" \
  -H "x-dev-secret: YOUR_DEV_WEBHOOK_SECRET" \
  -d '{"email":"customer@example.com","credits":25}'
```

## Near-zero cost launch plan

1. Deploy app to Render/Railway free tier.
2. Use a custom domain from low-cost registrar.
3. Collect emails and offer free credits to attract users.
4. Sell themed packs and custom requests before adding advanced infra.

## Important note

Pollinations is a free endpoint suitable for MVP validation. Before scaling, verify commercial terms and migrate to a dedicated provider (Replicate, Stability, or your own model hosting) for reliability and rights control.
