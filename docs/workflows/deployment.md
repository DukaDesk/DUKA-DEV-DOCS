---
sidebar_position: 4
description: Ship order — migrate, deploy backend, web, mobile, docs.
---

# Deployment

Ship in this order: **database → backend → web → mobile → docs**.

```mermaid
flowchart TD
  M[npx prisma migrate deploy] --> P[predeploy seed if needed]
  P --> BE[Railway deploy<br/>Dockerfile + railway.json<br/>node dist/main]
  BE --> V[Vercel/Netlify<br/>merchant + admin]
  BE --> E[EAS staged builds<br/>dev → staging → production]
  BE --> D[docs build/<br/>any static host]
```

| Step | Command / action | Verify |
|---|---|---|
| Migrate | `npx prisma migrate deploy` | Migration log clean, `Backup` exists |
| Backend | Push → Railway (`predeploy`: `migrate deploy && seed`) | `/api/v1/health`, `/api/docs` |
| Merchant/Admin | Vercel/Netlify (`npm run build` → `dist/`) | Login + one write flow, CORS clean |
| Mobile | `scripts/run-eas.mjs build --profile <env>` | Install on device, live catalog renders |
| Docs | `npm run build` → `build/` → host | `npm run serve` sanity check first |

:::warning Mobile base URL
`src/network/constants.ts` must point at the deployed backend **before** the
EAS build. A staging app baked with the prod URL (or vice versa) tests the
wrong backend silently.
:::
