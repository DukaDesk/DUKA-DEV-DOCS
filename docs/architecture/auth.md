---
sidebar_position: 2
description: JWT + Google/Apple OAuth, OTP, guards, mobile session model.
---

# Auth

```mermaid
graph TD
  subgraph Backend
    AS[modules/auth] --> JS[JwtStrategy]
    AS --> GS[GoogleStrategy<br/>passport-google-oauth20]
    AS --> PS[AppleStrategy<br/>passport-apple]
    AS --> BC[bcryptjs password hash]
    AS --> OT[OTP via Redis otp:email 300s]
  end
  subgraph Guards
    JG[JwtAuthGuard] --> RG[RbacGuard]
    RG --> QG[ApiQuotaGuard]
    TG[ThrottlerGuard<br/>global] --> JG
  end
  MO[Mobile AuthManager MMKV<br/>+ Zustand session] --> AS
  MP[Merchant portal<br/>dd_merchant] --> AS
  AP[Admin portal<br/>dukadesk_admin] --> AS
```

## Flows

```mermaid
sequenceDiagram
  participant C as Client
  participant A as /auth
  participant R as Redis
  participant DB as Postgres
  C->>A: POST register/login (email+password)
  A->>DB: verify bcryptjs + User/UserStatus
  A-->>C: JWT + RefreshToken
  C->>A: POST send-otp
  A->>R: SET otp:{email} 300s
  C->>A: POST verify-otp
  A->>R: GET + DEL otp:{email}
  C->>A: Google/Apple OAuth code
  A->>A: google-auth-library / apple-signin-auth
  A-->>C: JWT (linked User)
```

| Endpoint family | Notes |
|---|---|
| `register/login/refresh` | Email/password (`FEAT-0001` on mobile) |
| `send-otp/verify-otp` | Redis-backed, 5-min TTL |
| `google/apple` | `expo-auth-session` on mobile (lazy-required with `expo-web-browser` to avoid native crash); web/client IDs in `AGENTS.md` |

## Mobile session specifics

- `AuthManager` (MMKV) + Zustand session store; `expo-secure-store` for secrets.
- Google IDs: web `606232078363-08o10lpokt7t9qckgh9kesknmag5a0m9`, android `…0km23v4u50aqn34e9f2urneev7mn9hak`, ios `…0r8h3qlarr9jmaukbngn9qv1e29havmd`.
- 30-min `SessionGate`; guest mode fires `auth:required` → `AuthPromptModal`.

:::danger Token handling
Never log JWTs. Refresh rotates `RefreshToken` rows; `PasswordHistory` blocks
reuse; `Device` tracks sessions. Compromised admin token = rotate `JWT_*` env +
revoke rows, not just redeploy.
:::
