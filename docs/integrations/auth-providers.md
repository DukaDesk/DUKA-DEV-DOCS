---
sidebar_position: 5
description: Google + Apple OAuth wiring across backend and mobile.
---

# Auth providers — Google + Apple

```mermaid
flowchart TD
  subgraph Mobile
    EX[expo-auth-session<br/>lazy + expo-web-browser] --> G1[Google flow]
    NS[@react-native-google-signin] --> G1
  end
  subgraph Backend
    GS[GoogleStrategy<br/>passport-google-oauth20<br/>google-auth-library verify] --> U[link User]
    AS[AppleStrategy<br/>passport-apple<br/>apple-signin-auth verify] --> U
    U --> JWT[JWT + RefreshToken]
  end
  G1 --> GS
```

| Concern | Value / file |
|---|---|
| Mobile lazy import | `expo-auth-session` + `expo-web-browser` required inside `useGoogleAuth()` (avoids native crash) |
| Google client IDs | web `606232078363-08o10lpokt7t9qckgh9kesknmag5a0m9`, android `…0km23v4u50aqn34e9f2urneev7mn9hak`, ios `…0r8h3qlarr9jmaukbngn9qv1e29havmd` |
| Backend verify | `google-auth-library`, `apple-signin-auth` |
| Passwords | `bcryptjs` + `PasswordHistory` |
| Sessions | `RefreshToken` + `Device` rows, `AuthManager` (MMKV) on device |

:::warning OAuth redirect allowlist
New bundle IDs / web origins must be registered in Google + Apple consoles
**and** in backend CORS/env. A working backend with an unregistered mobile
`redirectUri` fails with opaque `access_denied` — check console first.
:::
