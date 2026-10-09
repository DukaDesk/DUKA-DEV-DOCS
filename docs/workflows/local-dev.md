---
sidebar_position: 1
description: Daily dev loop — branch, run, change, verify.
---

# Local development

```mermaid
flowchart TD
  B[git branch from main] --> DB[docker compose up -d]
  DB --> BE[npm run start:dev<br/>DUKA-BACKEND :4000]
  BE --> CL[run ONE client<br/>merchant :3000 / admin vite / expo]
  CL --> CH[make change]
  CH --> V{verify}
  V -->|backend| T1[jest spec + /api/docs]
  V -->|merchant| T2[vitest]
  V -->|admin| T3[playwright relevant spec]
  V -->|mobile| T4[jest + tsc --noEmit]
  T1 --> L[lint + typecheck]
  T2 --> L
  T3 --> L
  T4 --> L
```

## Per-project loop

| Project | Run | Lint/type | Test |
|---|---|---|---|
| Backend | `npm run start:dev` | `npm run lint` | `npm test`, `npm run test:e2e` |
| Merchant | `npm run dev` (`dukaDesk/`) | eslint+prettier | `vitest` |
| Admin | `npm run dev` | `npm run lint` | `npx playwright test` |
| Mobile | `npx expo start` | `npm run lint`, `npx tsc --noEmit` | `npx jest` |
| Docs | `npm start` (`-- --port 3001` if clash) | — | `npm run build` (link check) |

:::tip One client at a time
Backend + one client is the default loop. Running merchant + admin + Expo
simultaneously wastes ports and confuses CORS/OTP state.
:::
