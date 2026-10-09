---
sidebar_position: 6
description: The engineering OS — constitution, platform definition, ADRs, specs.
---

# Knowledge base — KNOWLEDGE-BASE

**Role:** the engineering operating system. Single source of truth for rules.
Code explains *how*; the KB decides *what is allowed*.

```mermaid
flowchart LR
  C[dukadesk-constitution/<br/>laws] --> K[KB core<br/>C001-009, 003-141]
  K --> A[ADRs/<br/>001-006++]
  A --> S[SPECIFICATIONS/<br/>+ engineering-specifications/]
  S --> G[engineering-governance/<br/>+ STANDARDS/]
  G --> IM[implementation/ +<br/>engineering-work/]
```

## Entry points

| Read | Why |
|---|---|
| `README.md` (v0.1.0, 2026-09-24) | Chain: Constitution → KB → ADRs → Specs → Governance → Implementation |
| `ARCHITECTURE_ALIGNMENT.md` | Pins Constitution/KB/Spec `0.1.0`; tables `KB-C001-009`, `KB-003-141`, `ADR-001-006`, specs (`runtime-engine`, `tenant-model`, `action-system`, `component-system`), `PD-001/002` |
| `ADRs/ADR-016-merchant-app-rename.md` | **Tenant → merchant/app rename**: product/API language map + code-identifier exceptions — read before touching any `tenant` reference |
| `AGENT_BOOT_PROCESS.md` | How agents should boot into this repo |
| `CORE_PRINCIPLES.md`, `PLATFORM_PHILOSOPHY.md` | Non-negotiables |
| `GLOSSARY.md`, `NAMING_STANDARDS.md`, `ENGINEERING_STANDARDS.md` | Language + naming + bars |

## Map of the KB

```mermaid
graph TD
  KB[KNOWLEDGE-BASE/] --> GOV[constitution + platform-definition<br/>+ engineering-governance]
  KB --> ARCH[ARCHITECTURE/ + architecture/<br/>+ ARCHITECTURE_ALIGNMENT.md]
  KB --> SPEC[SPECIFICATIONS/ + product-definition/<br/>+ ui-specifications/ + master-plan/]
  KB --> DOM[backend/ mobile/ builder/<br/>marketplace/ tenant-dashboard/<br/>business-dashboard/ sdk/ cli/]
  KB --> OPS[platform-operations/ + infrastructure/<br/>+ project-management/ + implementation/]
  KB --> SUP[GUIDES/ STANDARDS/ ADRs/<br/>tests/ scripts/ docs/]
```

:::tip Working with the KB
- New pattern? Check `ADRs/` first — `Runtime`, `SDUI`, `Actions`, `EventBus`, `Splash` are already decided (`ADR-001-006`).
- Progress claims? Verify in `PROGRESS.md` / `PROGRESS_REGISTRY.md` — reported
  state: Runtime √ Builder √ Marketplace √ App √ Identity √, Data 16/16 Draft,
  Integration 9/13, Enterprise 6/34.
- Companion doc: `platform-definition/` = *what it is*; `constitution/` = *laws*.
:::
