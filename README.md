# Fitse Works

A trusted two-sided marketplace that connects **clients** who need creative/digital
work with **verified designers**. Clients complete profile + admin verification,
pay a posting fee, then submit jobs for review. Approved designers apply.

Payment for the work happens directly between the client and the designer — the
platform handles trust, matchmaking, and job posting.

## Tech stack

- **Next.js (App Router)** + TypeScript
- **Better Auth** — email/password auth with role-based accounts
- **Prisma** + **Neon Postgres**
- **shadcn/ui** (Radix) + Tailwind CSS v4
- **Telebirr-ready payment flow** for job posting fees
- Fonts: **Fraunces** (display) + **Plus Jakarta Sans** (UI)

## Roles

- **Client** — posts jobs, reviews applicants, hires a designer.
- **Designer** — builds a profile/portfolio, browses live jobs, applies.
- **Admin** (your friend, the teacher) — verifies people and approves jobs.
  The account whose email matches `ADMIN_EMAIL` automatically becomes admin.

## How a job flows

1. A client/designer signs up, completes profile, then waits for admin approval.
2. A client creates a job and is redirected to Telebirr checkout to pay the posting fee.
3. After payment, the job moves to **Awaiting review**.
4. Admin approves it → status becomes **Live**.
5. Approved designers see live jobs and apply with a pitch + price.
5. The client hires a designer. Payment happens between them directly.

## Getting started

```bash
npm install
npx prisma db push      # sync schema to the database
npm run dev             # http://localhost:3000
```

### Environment variables (`.env`)

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres connection (used by the app at runtime) |
| `DIRECT_URL` | Direct Postgres connection (used by Prisma migrations) |
| `BETTER_AUTH_SECRET` | Secret used to sign sessions. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `BETTER_AUTH_URL` | Base URL of the app, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Same base URL, exposed to the browser |
| `TELEBIRR_INITIATE_URL` | Your backend endpoint that creates a real Telebirr checkout (optional) |
| `TELEBIRR_BRIDGE_TOKEN` | Optional bearer token sent to `TELEBIRR_INITIATE_URL` |
| `TELEBIRR_WEBHOOK_SECRET` | Shared secret expected on `/api/payments/telebirr/webhook` as `x-telebirr-secret` |
| `ADMIN_EMAIL` | The email that is auto-granted the admin role on signup |

## Telebirr payment flow

- Each category has a fixed job posting fee in ETB (see `JOB_POSTING_FEES_ETB`).
- When a client submits a job, status starts as `PAYMENT_PENDING`.
- The app creates a payment record and redirects the client to checkout:
  - if `TELEBIRR_INITIATE_URL` is configured, it calls your Telebirr bridge/backend.
  - otherwise it uses an in-app **mock Telebirr page** for demos.
- On successful payment, webhook endpoint `/api/payments/telebirr/webhook` marks
  payment `PAID` and moves the job to `PENDING_REVIEW`.

### What you still need to finish for real Telebirr

1. Build/provide a secure backend endpoint for `TELEBIRR_INITIATE_URL` that:
   - signs and creates a real Telebirr checkout session,
   - returns `{ checkoutUrl, providerReference? }`.
2. Configure Telebirr webhook to call:
   `POST /api/payments/telebirr/webhook`
   with header `x-telebirr-secret: <TELEBIRR_WEBHOOK_SECRET>`.
3. Send payload:
   `{ paymentId, status: "SUCCESS" | "FAILED", providerReference?, reason? }`.

## Demo accounts (already seeded)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fitseworks.com` | `password123` |
| Client | `client@example.com` | `password123` |
| Designer | `designer@example.com` | `password123` |

Re-run the demo seed anytime with:

```bash
node prisma/seed.mjs
```

## Roadmap ideas

- In-app chat between client and designer
- Ratings & reviews / reputation
- Escrow payments + commission
- Skills tests for designers
- Telegram/SMS notifications
