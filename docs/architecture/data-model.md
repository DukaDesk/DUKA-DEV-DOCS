---
sidebar_position: 4
description: The ~100 Prisma models grouped by domain.
---

# Data model

`DUKA-BACKEND/prisma/schema.prisma` — Postgres, ~100 models. Groups:

:::note ADR-016: `Tenant*` models are live code names for merchants
No `Merchant` model exists. Read `Tenant` = merchant, `TenantUser` = merchant
membership throughout this page.
:::

```mermaid
graph TD
  ID[Identity + RBAC<br/>User, Profile, RefreshToken<br/>Role, Permission, Tenant,<br/>TenantUser, ApiKey, Consent] --> TP[Tenant platform<br/>TenantConfig, Plan,<br/>Subscription, TenantDomain, ApiQuota]
  TP --> PB[Publishing<br/>Draft → Release<br/>Page/Section/Component<br/>Template, Theme, Navigation]
  PB --> CT[Catalog + commerce<br/>Category, Product, Cart,<br/>Order, Coupon, TaxRule,<br/>InventoryReservation, Fulfillment]
  CT --> BK[Booking + forms<br/>Booking, StaffMember,<br/>Resource, Schedule,<br/>Form, Submission, Workflow]
  BK --> PAY[Payments + notifications<br/>PaymentIntent, Transaction,<br/>Settlement, WebhookEvent<br/>Notification, DeviceToken]
  PAY --> PL[Platform<br/>AnalyticsEvent, SearchIndex,<br/>AIProvider, FeatureFlag,<br/>Deployment, AuditLog, Backup]
```

## Key chains

```mermaid
erDiagram
  Draft ||--o{ Release : snapshot
  Draft ||--o{ DraftPage : pages
  DraftPage ||--o{ DraftSection : sections
  DraftSection ||--o{ DraftComponent : components
  Release ||--o{ ValidationReport : checks
  Page ||--o{ Section : live
  Section ||--o{ Component : live
  Category ||--o{ Product : catalog
  Product ||--o{ CartItem : in_carts
  Cart ||--o{ CartItem : items
  Order ||--o{ OrderItem : items
  Order ||--o{ OrderStatusHistory : timeline
```

| Domain | Core models |
|---|---|
| Identity | `User, Profile, RefreshToken, Device, PasswordHistory, Consent, ConsentScope, ConsentAudit` |
| Ops RBAC | `Role, Permission, RolePermission, UserRole, AdminInvite` |
| Publishing | `Draft, Release, ValidationReport, DraftPage/Section/Component, Page/Section/Component, Template, Navigation, Theme/ThemeVersion` |
| Assets | `Media, AssetFolder/Version/Collection(+Item)/Share, StorageProvider` |
| Commerce | `Category, Product(+Image,Variant), InventoryReservation, Cart(+Item), Order(+Item,StatusHistory), Coupon, Fulfillment, TaxRule` |
| Booking | `Booking, BookingService, StaffMember, BookingResource, Schedule, BookingLocation, CancellationPolicy, BookingReminder, BookingHistory, WaitingListEntry` |
| Payments | `PaymentProvider, TenantPaymentAccount, PaymentIntent, PaymentTransaction, WebhookEvent, Settlement, FinancialEvent` |
| Notify | `Notification, NotificationTemplate/Event/Preference, DeviceToken, DeliveryResult` |
| Integration | `IntegrationConnector, OAuthToken, WebhookOutbox(+Endpoint/EventLog), SyncJob` |

:::tip Migrations
Dev: `npx prisma migrate dev`. Prod/Railway: `migrate deploy` (+ `predeploy`
runs seed). Never hand-edit migrated SQL — add a new migration.
:::
