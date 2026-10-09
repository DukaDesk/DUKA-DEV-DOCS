---
sidebar_position: 5
description: Cross-project patterns every developer must follow.
---

# Shared patterns

Patterns that repeat across backend, web, and mobile. Follow them for new code.

## 1. Envelope + unwrap

```mermaid
flowchart LR
  BE[Backend TransformInterceptor<br/>{ success, message, data }] --> MO[Mobile endpoints/*.ts<br/>unwrap]
  BE --> MP[Merchant httpClient<br/>same shape]
  BE --> AP[Admin unwrapAuth]
```

Backend wraps; every client unwraps. Never invent a second envelope.

## 2. Anti-double-submit (mobile)

```mermaid
sequenceDiagram
  participant U as User tap
  participant S as actionLoadingStore
  participant A as ActionEngine/API
  U->>S: tap PrimaryButton
  S->>S: if loading → ignore
  S->>A: dispatch once
  A-->>S: done → unlock
```

`PrimaryButton`/`DynamicButton`/`DynamicCard` are wired to it. New buttons must be too.

## 3. Guest gating (mobile)

```mermaid
flowchart TD
  G[Guest taps write action] --> E[fire auth:required<br/>EventBus]
  E --> M[AuthPromptModal]
  M --> S[Sign in] 
  M --> X[Stay guest<br/>read-only feeds]
```

Cart/Orders SDUI gated via `CartContentSection` / `OrderHistorySection`.

## 4. No-demo rule (mobile live screens)

```mermaid
flowchart TD
  F[Fetch live<br/>discoveryApi / bffApi / commerceApi] --> E{Empty?}
  E -->|yes| MSG[Show 'No published … — Publish from builder']
  E -->|no| R[Render]
  X[Never import mockClient<br/>or src/data/* demos] -. banned .-> R
```

## 5. Zero `Alert.alert` (mobile)

Use `ValidationModal` (with `actions` for confirm/cancel). Global rule, no exceptions.

## 6. Lazy + boundaries (web)

Both portals: `React.lazy + Suspense + ErrorBoundary` per page/route.
Admin adds `canAccessPage` RBAC; merchant adds `ProtectedRoute/PublicRoute`.

## 7. Storage factory (mobile)

`src/store/storage.ts` → `createMMKVStorage()` per store (session, tenantStore —
merchant state, booking, platform) with in-memory `Map` fallback. New persisted stores get their
own MMKV instance — never share one.
