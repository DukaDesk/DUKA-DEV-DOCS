---
sidebar_position: 3
description: Test strategy per project — what to run before pushing.
---

# Testing

```mermaid
graph TD
  BE[Backend<br/>jest src + e2e] --> CI[CI per repo<br/>.github/]
  ME[Merchant<br/>vitest + jsdom] --> CI
  AD[Admin<br/>playwright] --> CI
  MO[Mobile<br/>jest-expo + RNTL] --> CI
  DO[Docs<br/>npm run build<br/>link check] --> CI
```

| Project | Command | Scope |
|---|---|---|
| Backend | `npm test` / `test:watch` / `test:cov` | `src/**/*.spec.ts` (ts-jest) |
| Backend e2e | `npm run test:e2e` | `test/jest-e2e.json` |
| Merchant | `vitest` (`dukaDesk`) | Component/unit (Testing Library/jsdom) |
| Admin | `npx playwright test` (+ `--ui`, `--headed`, `--debug`) | E2E portal flows |
| Mobile | `npx jest` | `jest-expo` preset (+ `jest.setup.js`) |
| Docs | `npm run build` | Fails on broken links (`onBrokenLinks: throw`) |

:::note Minimum bar before PR
Backend: touched module spec passes. Web: related test passes. Mobile:
`jest` + `tsc --noEmit` clean. Docs: `npm run build` clean. New API route:
spec + Swagger annotation + one client call verified live.
:::
