---
sidebar_position: 3
description: Monorepo map, runtime topology, and canonical request flows.
---

# System overview

DukaDesk is a **multi-merchant commerce platform**: merchants build merchant apps in the
Merchant portal, publish them through the backend pipeline, and consumers use them
inside the Expo mobile app. The Admin portal operates the platform itself.

## Monorepo map

```mermaid
graph TD
  DD[DD workspace] --> BE[DUKA-BACKEND<br/>NestJS API + BFF + queues]
  DD --> MP[DUKA-MERCHANT/dukaDesk<br/>merchant builder + dashboard]
  DD --> MO[DukaDesk<br/>Expo consumer app]
  DD --> AP[DUKA-ADMIN<br/>platform ops portal]
  DD --> KB[KNOWLEDGE-BASE<br/>constitution + ADRs + specs]
  DD --> D1[DUKA-DOCS<br/>merchant help center]
  DD --> D2[DUKA-DEV-DOCS<br/>developer core docs]
```

| Concern | Owner | Deploys to |
|---|---|---|
| API, BFF, publishing, billing, auth | `DUKA-BACKEND` (`railway.json`, `Dockerfile`) | Railway |
| Merchant dashboard + app builder | `DUKA-MERCHANT/dukaDesk` | Vercel / Netlify |
| Consumer mobile | `DukaDesk` (`eas.json`) | EAS (dev / staging / production) |
| Platform ops | `DUKA-ADMIN` (`vercel.json`) | Vercel |
| Static docs | `DUKA-DOCS`, `DUKA-DEV-DOCS` | Vercel / Netlify / Pages / S3 |

## Runtime topology

```mermaid
flowchart TB
  subgraph Clients
    MPc[Merchant portal]
    APc[Admin portal]
    MOc[Expo mobile]
  end
  subgraph API["Backend :4000 — global prefix /api + version v1"]
    GW[CORS + ValidationPipe<br/>+ HttpExceptionFilter<br/>+ TransformInterceptor]
    MOD[30 modules<br/>auth → publishing → commerce]
    BFF[BFF aggregators<br/>mobile / website / dashboards]
    Q[Bull queues<br/>publishing, notifications,<br/>assets, webhooks, analytics]
  end
  subgraph Data
    PG[(Postgres 16<br/>Prisma 6, ~100 models)]
    RD[(Redis<br/>OTP, cache, pub/sub)]
    S3[(S3-compatible<br/>media, uploads/)]
  end
  MPc --> GW
  APc --> GW
  MOc --> GW
  GW --> MOD
  MOD --> BFF
  MOD --> Q
  Q --> RD
  MOD --> PG
  MOD --> S3
  MOD --> RD
```

:::note Key `main.ts` facts (`DUKA-BACKEND/src/main.ts`)
Global prefix `api` + URI versioning `v1`. `ValidationPipe{whitelist,
forbidNonWhitelisted, transform}`. JSON limit 5 MB. CORS allowlist +
`*.netlify.app` / `*.railway.app` / localhost. Swagger at `/api/docs`.
Static `/uploads`. Timeout 30 s.
:::

## Canonical request flows

### Public catalog (no auth)

```mermaid
sequenceDiagram
  participant MO as Mobile / Web
  participant API as Backend /api/v1
  participant DB as Postgres
  MO->>API: GET /merchants/{id}/products
  API->>DB: Prisma Product + Category + Inventory
  DB-->>API: rows
  API-->>MO: { success:true, message, data }
```

### Authenticated commerce

```mermaid
sequenceDiagram
  participant MO as Mobile
  participant API as Backend
  participant Q as Bull/Redis
  participant DB as Postgres
  MO->>API: POST /app/commerce/cart (Bearer JWT)
  API->>API: JwtAuthGuard + TenantResolver
  API->>DB: Cart + InventoryReservation
  API->>Q: enqueue notifications/analytics
  API-->>MO: { success, message, data }
```

:::warning Canonical prefix
Commerce/booking/tax/categories use `/api/v1/merchants/{id}` — **not**
`/tenants`. Authenticated commerce/cart/order/tax live under
`/api/v1/app/commerce/*`, booking detail under `/api/v1/app/booking/*`.
BFF mobile under `/api/v1/bff/mobile/*`, discovery under `/discovery/*`.
Do not invent `/cart/*`, `/orders/*`, `/profile`, or `/merchants/{id}/orders` —
they don't exist in the OpenAPI contract.
:::

### Publishing (builder → consumer)

```mermaid
flowchart LR
  B[Builder draft<br/>Draft + DraftPage/Section/Component] --> V[Validation<br/>ValidationReport]
  V --> R[Release<br/>immutable snapshot]
  R --> PG[Page/Section/Component<br/>live tables]
  PG --> MAN[Manifest<br/>bff/mobile manifest]
  MAN --> MO[Expo ScreenEngine<br/>renders SDUI JSON]
```

See [publishing pipeline](./architecture/publishing-pipeline.md) and
[runtime SDUI](./architecture/runtime-sdui.md).

## Tenancy at a glance

```mermaid
erDiagram
  User ||--o{ TenantUser : membership
  Tenant ||--o{ TenantUser : has
  Tenant ||--|| TenantConfig : config
  Tenant ||--o{ Draft : drafts
  Draft ||--o{ Release : releases
  Tenant ||--o{ Product : catalog
  Tenant ||--o{ Order : orders
```

:::note Tenant in diagrams = merchant in product language
Prisma models are still `Tenant`/`TenantUser` (ADR-016: rename is product/API-facing only).
Read `Tenant` as merchant everywhere in this site's diagrams.
:::

- Identity is global (`User`), membership is per-merchant (code: `TenantUser` + `Role`).
- Requests resolve the merchant via middleware (code: `TenantResolver` + `CorrelationId`) — see [tenancy](./architecture/tenancy.md).
- RBAC: `JwtAuthGuard` → `RbacGuard` → `ApiQuotaGuard`, plus global `ThrottlerGuard`.

## Model: which client calls what

```mermaid
graph LR
  MP[Merchant portal] -->|auth, builder, publishing,<br/>products, orders, analytics| API1["/api/v1/*"]
  AP[Admin portal] -->|platform-admin,<br/>marketplace, audit| API1
  MO[Mobile] -->|public catalog<br/>/merchants/{id}/*| API1
  MO -->|authed commerce<br/>/app/commerce/*| API1
  MO -->|aggregated feeds<br/>/bff/mobile/* + /discovery/*| API1
```
