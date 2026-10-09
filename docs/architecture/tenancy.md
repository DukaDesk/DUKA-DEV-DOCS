---
sidebar_position: 1
description: "Multi-merchant isolation — User vs Merchant (code: Tenant) vs membership, resolver middleware, RBAC."
---

# Tenancy → merchants

One backend serves many merchants. Identity is global; membership is per-merchant.

:::note ADR-016 rename
Product/API language is **merchant**. Code identifiers below (`Tenant`,
`TenantUser`, `tenantId`, `TenantResolver`, tenant-context) are live and stay
verbatim. "Multi-tenant" remains the architecture adjective.
:::

```mermaid
erDiagram
  User ||--o{ TenantUser : membership
  Tenant ||--o{ TenantUser : has
  Tenant ||--|| TenantConfig : config
  Tenant ||--o{ TenantDomain : domains
  Tenant ||--o{ Subscription : plans
  User ||--o{ Role : platform_roles
  Role ||--o{ UserRole : grants
```

| Table (code name) | Meaning |
|---|---|
| `User` + `Profile` | Global human identity (`UserStatus`, `RefreshToken`, `Device`, `Consent`) |
| `Tenant` | A merchant workspace (`TenantStatus`) |
| `TenantUser` | Membership: user × merchant × `TenantUserRole` |
| `Role` / `Permission` / `RolePermission` / `UserRole` | RBAC graph; `PlatformRole(super_admin/support/operations/finance)` for ops |
| `TenantConfig`, `Plan`, `Subscription`, `TenantDomain`, `ApiQuota` | Config, billing, domains, rate quotas |

## Request resolution

```mermaid
sequenceDiagram
  participant C as Client
  participant MW as CorrelationId<br/>+ TenantResolver middleware
  participant CTX as tenant-context<br/>(shared/context, code name)
  participant G as RbacGuard + ApiQuotaGuard
  participant H as Module handler
  C->>MW: /api/v1/merchants/{id}/... + JWT
  MW->>CTX: bind merchantId (code: tenantId) + correlationId
  CTX->>G: role + quota check
  G->>H: scoped Prisma queries
```

:::note Where it lives
`gateway/middleware`, `common/middleware`, `common/guards`, `shared/context`,
`shared/tenant`, `shared/events/event-bus`. Merchant-scoped commerce uses the
canonical `/merchants/{id}` prefix — see [API conventions](./api-conventions.md).
:::

:::warning Never trust client merchant claims
The merchant comes from the resolver + JWT, not from a body field. Tests that spoof
`tenantId`/`merchantId` in payloads must fail closed.
:::
