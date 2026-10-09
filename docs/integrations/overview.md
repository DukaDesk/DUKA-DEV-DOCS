---
sidebar_position: 1
description: External systems map — DB, cache, storage, auth, payments, hosting.
---

# Integrations overview

```mermaid
graph TD
  BE[DUKA-BACKEND] --> PG[(Postgres 16<br/>Prisma 6)]
  BE --> RD[(Redis<br/>OTP + cache + pub/sub)]
  BE --> Q[Bull queues ×5]
  BE --> S3[(S3-compatible<br/>media)]
  BE --> OA[Google + Apple OAuth]
  BE --> PAY[Paystack / Flutterwave / Stripe]
  BE --> EM[SendGrid / Resend / SES / SMTP<br/>+ FCM push + SMS]
  BE --> RAIL[Railway hosting]
  MP[Merchant portal] --> V1[Vercel / Netlify]
  AP[Admin portal] --> V2[Vercel]
  MO[Mobile] --> EAS[EAS builds + OTA]
```

| Integration | Detail page | Critical env |
|---|---|---|
| Postgres | [database](./database.md) | `DATABASE_URL` |
| Redis + Bull | [redis-queue](./redis-queue.md) | `REDIS_URL` (or `HOST/PORT`) |
| Object storage | [storage](./storage.md) | `STORAGE_PROVIDER/BUCKET/REGION/ENDPOINT/KEYS` |
| OAuth | [auth-providers](./auth-providers.md) | `GOOGLE_*`, `APPLE_*`, `JWT_*` |
| Payments/notify | [payments-notifications](./payments-notifications.md) | provider keys, `FCM_*`, mail keys |
| Hosting | [hosting](./hosting.md) | `PORT`, `CORS_ORIGINS`, platform tokens |

:::danger Local fallback lies
Redis has an in-memory `Map` fallback and storage falls back to `uploads/`.
Both hide outages locally. Staging must use real Redis + real S3-compatible
storage or queue/OTP/media bugs ship silently.
:::
