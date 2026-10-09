---
sidebar_position: 1
description: Dependency maps per project — what each library actually does.
---

# Libraries overview

```mermaid
graph TD
  subgraph Backend
    N[NestJS 11] --> PR[Prisma 6]
    PR --> PG[(Postgres)]
    N --> RD[ioredis + Bull]
    N --> S3[AWS S3 SDK + sharp + multer]
    N --> AU[Passport JWT/Google/Apple<br/>+ bcryptjs]
    N --> SW[Swagger + pino + throttler]
  end
  subgraph Web
    R[React 18] --> V[Vite 5/8]
    R --> RR[react-router 6/7]
    R --> CH[Recharts + lucide + toastify]
    R --> AX[axios merchant only]
  end
  subgraph Mobile
    EX[Expo 56] --> ER[expo-router]
    EX --> ZU[Zustand + MMKV]
    EX --> RQ[React Query + axios]
    EX --> NAT[secure-store, sqlite,<br/>notifications, location, camera]
  end
```

| Project | Manager | Lockfile | Install |
|---|---|---|---|
| Backend | npm | `package-lock.json` | `npm install` |
| Merchant | npm | `dukaDesk/package-lock.json` | `npm install` in `dukaDesk/` |
| Mobile | npm | `package-lock.json` | `npx expo install` preferred |
| Admin | npm | `package-lock.json` | `npm install` |
| Docs | npm | `package-lock.json` | `npm install` |

:::warning Version pins that matter
React 18 on both web portals vs React 19 on mobile (Expo 56). `react-router`
6 (admin) vs 7 (merchant). Prisma 6 + Nest 11 on backend. Don't "harmonize"
these without testing each app's build.
:::
