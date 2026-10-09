---
sidebar_position: 5
description: SDUI screen JSON — layout, components, actions, bindings.
---

# Runtime SDUI

The mobile app does not hardcode merchant screens. It renders **ScreenDefinition
JSON** (Server-Driven UI) fetched live from the backend manifest.

## Anatomy of a screen

```mermaid
graph TD
  S[Screen JSON] --> L[layout: LayoutNode<br/>kind scroll + children]
  S --> F[fixedBottom: RuntimeNode<br/>tab_bar at bottom]
  S --> O[overlay: bottom_sheet<br/>optional]
  L --> C[component nodes<br/>hero, list, cart_content...]
  C --> A[actions<br/>switch_screen, exit_tenant*,<br/>checkout, tap/default]
  C --> B[bindings + analytics<br/>+ permissions + cache]
```

Reference for every component/layout/action/field:
`DukaDesk/docs/examplesTemplate.md`.

:::note `*exit_tenant` is the live action code name
Keep it verbatim in screen JSON (ADR-016). Same for `switch_screen`.
:::

## Screen table (Mama's Kitchen pattern — 11 screens)

| Screen | File | Manifest ID |
|---|---|---|
| Home | `screens/home-screen.json` | `core.home` |
| Menu | `screens/menu-screen.json` | `menu.menu` |
| Cart | `screens/cart-screen.json` | `cart.review` |
| Checkout | `screens/checkout-screen.json` | `checkout.flow` |
| Orders | `screens/orders.history` | `orders.history` |
| Order Detail | `screens/order-detail-screen.json` | `orders.detail` |
| Info | `screens/info-screen.json` | `core.info` |
| Notifications | `screens/notifications-screen.json` | `notifications.list` |
| Support | `screens/support-screen.json` | `support.list` |
| Chat | `screens/chat-screen.json` | `support.chat` |
| Exit | `screens/exit-screen.json` | `core.exit` |

## Rendering flow

```mermaid
sequenceDiagram
  participant M as manifest.json
  participant R as ManifestResolver
  participant E as ScreenEngine
  participant A as ActionEngine
  M->>R: screens [{ id, path }]
  R->>R: resolveLegacy → api.getScreen per entry
  R->>E: ScreenDefinition JSON
  E->>E: layout + fixedBottom + overlay + safe-area
  E-->>A: user tap → switch_screen / exit_tenant
```

## Adding a new merchant screen

```mermaid
flowchart TD
  J[1 Create screens/name-screen.json] --> I[2 Import in mockClient.ts<br/>+ merchant screens dict]
  I --> M[3 Add {id, path} to manifest.json]
  M --> T[4 Validate against examplesTemplate.md]
```

:::note Bella Italia vs Mama's Kitchen
`bella-italia/` = 12 full runtime packages (application → validation, 60+ JSON
each for app/auth/home/menu/cart/orders/reservations/profile-wallet-loyalty/
notifications-settings-support/content/publish/validation). `mamas-kitchen/` =
11 lean SDUI screens. New merchants copy the **Mama's Kitchen pattern**.
:::
