---
sidebar_position: 6
description: Payments, email, push, SMS — providers and webhook discipline.
---

# Payments + notifications

## Payments (`modules/payments`)

```mermaid
graph TD
  PI[PaymentIntent] --> TX[PaymentTransaction]
  TX --> WH[WebhookEvent<br/>provider callback]
  WH --> ST[Settlement + FinancialEvent]
  TA[TenantPaymentAccount<br/>code name, per-merchant credentials] --> PI
```

Providers: **Paystack / Flutterwave / Stripe** (`PaymentProvider` rows).
`TenantPaymentAccount` (code model name) scopes credentials per merchant — never use platform keys
for merchant charges.

:::danger Webhook idempotency
Providers retry callbacks. `WebhookEvent` dedupes by provider event ID; handlers
must be idempotent (re-entrant `Settlement` writes corrupt payouts).
:::

## Notifications (`modules/notifications`)

| Channel | Providers / tables |
|---|---|
| Email | `log \| sendgrid \| resend \| ses \| smtp` (`NotificationTemplate/Event/Preference`) |
| Push | `FCM` → `DeviceToken` → `DeliveryResult` |
| SMS | `sms` provider |

```mermaid
flowchart TD
  EV[domain event<br/>order placed, booking reminder] --> Q[Bull notifications queue]
  Q --> T[render NotificationTemplate]
  T --> P{channel?}
  P -->|email| E[sendgrid/resend/ses/smtp]
  P -->|push| F[FCM → DeviceToken]
  P -->|sms| S[sms provider]
  E --> D[DeliveryResult]
  F --> D
```

Booking reminders use `BookingReminder` + `notifications` queue — not cron hacks.
