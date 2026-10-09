---
sidebar_position: 3
description: Prefix, versioning, envelope, canonical routes, dead routes.
---

# API conventions

Violating these breaks all three clients at once. Read twice.

## Base rules

| Rule | Value |
|---|---|
| Global prefix | `api` (`main.ts`) |
| Versioning | URI `v1` |
| Swagger | `/api/docs` (`DUKADESK API`, BearerAuth) |
| Envelope | `{ success, message, data }` — every response; clients `unwrap()` it |
| Validation | `whitelist + forbidNonWhitelisted + transform` — unknown fields rejected |
| Limits | JSON 5 MB, 30 s timeout, `maxHeadersCount 50` |

```mermaid
flowchart LR
  REQ[Request /api/v1/...] --> VAL[ValidationPipe]
  VAL --> H[Handler]
  H --> INT[TransformInterceptor]
  INT --> ENV["{ success, message, data }"]
```

## Canonical routes (live)

```mermaid
graph TD
  PUB["Public catalog<br/>/api/v1/merchants/{id}/products<br/>/api/v1/merchants/{id}/categories<br/>/api/v1/merchants/{id}/definition"]
  COM["Authed commerce<br/>/api/v1/app/commerce/*"]
  BOO["Authed booking<br/>/api/v1/app/booking/*"]
  BFF["Aggregated<br/>/api/v1/bff/mobile/*<br/>GET /discovery/*"]
  PROF["Profile (moved)<br/>GET /bff/mobile/profile<br/>POST /deactivate|/reactivate<br/>GET /deactivation-status"]
```

:::warning Merchant prefix is `/merchants/{id}`, not `/tenants`
Verified live: `GET /merchants/{id}/products` → 200,
`GET /tenants/{id}/products` → 404. Catalog route for BFF mobile is
`GET /bff/mobile/merchants/{id}/catalog`. Authed merchant routes live under
`/api/v1/app/merchants/*`. See ADR-016 for the full rename map.
:::

## Dead routes — do not call or add

`/api/v1/promotions/ads`, `/api/v1/profile`, `/api/v1/auth/me`,
`/api/v1/cart/*`, `/api/v1/orders/*`, `/api/v1/merchants/{id}/orders|tax-calc`.

```mermaid
flowchart TD
  NEW[Need a new endpoint?] --> C{Exists in OpenAPI<br/>contract?}
  C -->|yes| USE[Use canonical path]
  C -->|no| ADR[KB ADR/spec first<br/>then backend + clients]
```

:::note Endpoint modules
Mobile keeps one module per domain in `src/services/api/endpoints/*.ts`, each
with its own `unwrap()`. Mirror that granularity when adding backend routes.
:::
