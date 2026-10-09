---
sidebar_position: 8
description: Ubiquitous language — merchant, merchant app, release, SDUI, BFF, and friends.
---

# Glossary

:::note ADR-016 rename
Product language is **merchant / merchant app**. `Tenant*` names below are live
code identifiers (Prisma models, `tenantId`, `TenantResolver`, `tenantStore`,
`exit_tenant`) — keep them verbatim in code and screen JSON.
:::

| Term | Meaning |
|---|---|
| Merchant | A business on the platform (code: `Tenant` model; API: `/api/v1/merchants/{id}`) |
| Merchant App | A merchant's live consumer app — the `PublishedApp` (mobile `desk/[id]`) |
| Tenant | Code/data-model term for merchant (`Tenant` + `TenantUser` membership); superseded as product language per ADR-016 |
| BFF | Backend-for-frontend aggregators (`src/bff`: mobile/website/dashboards) |
| SDUI | Server-Driven UI — mobile renders backend JSON, not hardcoded screens |
| ScreenDefinition | One SDUI screen (`layout` + `fixedBottom` + `overlay`) |
| Manifest | Published app index (`screens [{id, path}]` + navigation/theme) |
| Draft / Release | Editable builder state → immutable published snapshot |
| ValidationReport | Publish gate output (errors block, warnings don't) |
| Envelope | Standard API shape `{ success, message, data }` |
| Canonical prefix | `/api/v1/merchants/{id}` for merchant commerce (not `/tenants`) |
| `unwrap()` | Client helper extracting `data` from the envelope |
| TenantResolver | Middleware binding request → merchant context (code name, ADR-011) |
| EventBus | In-app/backend event fan-out (`auth:required`, domain events) |
| ActionEngine | SDUI action dispatcher (`switch_screen`, `exit_tenant`, checkout…) |
| ScreenEngine | Mobile SDUI renderer |
| PublishedApp | Live manifest + screens served to consumers |
| OTA | Over-the-air update (Expo `expo-updates` / backend `update-policy`) |
| KB | `KNOWLEDGE-BASE` — constitution, ADRs, specs (rules source of truth) |
