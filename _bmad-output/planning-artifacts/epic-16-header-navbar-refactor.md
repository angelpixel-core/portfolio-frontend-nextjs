---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics']
inputDocuments:
  - '_bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/01-blades-and-breakpoints.md'
  - '_bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/02-rules.md'
  - '_bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/03-header-navbar-rules_final-version.md'
version: 1
scope: 'Epic 16'
baselineEpic: 15
status: in-progress
---

# Portfolio Frontend - Epic 16: Header/NavBar Refactor

## Overview

Este documento proporciona el desglose de épicas e historias para el refactor completo del Header/NavBar, basado en la documentación de diseño UX creada en `06-home-layout-rules/`.

**Contexto:** Epics 1-15 completados. Epic 15 planificado para Auth System.

**Foco:** Restructuración del Header siguiendo el documento de reglas final, reducción de redes sociales, integración de AuthButton, y corrección de HireMe positioning.

---

## Requirements Inventory

### Functional Requirements

**Header - Structure & Order:**

| ID | Requirement | Source |
|----|-------------|--------|
| FR16.1 | Header sigue orden DOM estricto: Logo → Nav → Socials → UI (Auth + Theme) → HireMe | 03-header-rules §3 |
| FR16.2 | Header usa CSS Grid con AIR (espacio de respiración) entre zonas | 03-header-rules §4 |
| FR16.3 | Relación de AIR es 2:3 consistente | 03-header-rules §4 |
| FR16.4 | Socials relajados hacia centro, no pegados al borde | 03-header-rules §4 |
| FR16.5 | Reducir redes sociales de 6 a 4 (LinkedIn, GitHub, Twitter, Dribbble) | Plan Phase 1 |

**Header - Mobile Behavior:**

| ID | Requirement | Source |
|----|-------------|--------|
| FR16.6 | Mobile layout: Logo (izq) → Auth → Theme → HireMe (flotante) | 03-header-rules §5 |
| FR16.7 | No hay menú hamburguesa activo (componente existe pero desconectado) | 03-header-rules §2 |
| FR16.8 | Nav + Socials se ocultan detrás del logo con animación (futuro) | 03-header-rules §6 |
| FR16.9 | Click en logo abre overlay con nav + socials | 03-header-rules §7 |

**HireMe - Positioning:**

| ID | Requirement | Source |
|----|-------------|--------|
| FR16.10 | Desktop: HireMe en flow normal del header (no fixed) | 03-header-rules §4 |
| FR16.11 | Mobile: HireMe flotante (fixed), persigue scroll | 03-header-rules §8 |
| FR16.12 | HireMe siempre circular con texto animado | 03-header-rules §8 |
| FR16.13 | HireMe solo existe en Home | 01-blades §2 |
| FR16.14 | HireMe no duplicado (un solo componente, posición controlada por parent) | 03-header-rules §8 |

**Auth System (New):**

| ID | Requirement | Source |
|----|-------------|--------|
| FR16.15 | AuthButton reemplaza 3 botones OAuth individuales | Plan Phase 3 |
| FR16.16 | AuthButton con estados: inactivo (gris), autenticado (glow verde) | Plan Phase 3.2 |
| FR16.17 | AuthModal con tabs Login/Signup | Plan Phase 3.3 |
| FR16.18 | OAuth buttons: LinkedIn, Microsoft, Google | Plan Phase 3.3 |
| FR16.19 | Mock auth service para desarrollo | Plan Phase 3.4 |

---

### Non-Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| NFR16.1 | CSS Grid/Flex + Tailwind + BEM para todo layout | 03-header-rules §9 |
| NFR16.2 | No position:fixed innecesarios | 03-header-rules §9 |
| NFR16.3 | No hacks con márgenes mágicos | 03-header-rules §9 |
| NFR16.4 | No dependencias de JS para layout (solo para animaciones) | 03-header-rules §9 |
| NFR16.5 | Layout debe permitir animaciones futuras sin refactor | 03-header-rules §1.7 |

---

### Architecture Decisions

| ADR | Decisión | Rationale |
|-----|----------|-----------|
| ADR-16.1 | CSS Grid de 9 columnas para header desktop | Permite AIR flexible entre zonas |
| ADR-16.2 | HireMe posición controlada por parent container | Evita duplicación, un solo componente |
| ADR-16.3 | Redux slice para auth state (siguiendo chatPanel) | Consistencia con patrón existente |
| ADR-16.4 | AuthButton + Modal pattern | Reduce complejidad visual del header |

---

## Implementation Status

### ✅ Completed (This Session)

| Story | Status | Files Modified/Created |
|-------|--------|------------------------|
| 16.1 Social Reduction | ✅ Done | `Menu/constants.js` |
| 16.2 CSS Grid Layout | ✅ Done | `Menu/styles.css` |
| 16.3 Auth Redux Slice | ✅ Done | `state/slices/authPanel/*` |
| 16.4 UserIcon Component | ✅ Done | `atoms/icons/UserIcon/*` |
| 16.5 AuthButton Component | ✅ Done | `atoms/buttons/AuthButton/*` |
| 16.6 Auth Modal + Forms | ✅ Done | `organisms/Auth/*` |
| 16.7 Mock Auth Service | ✅ Done | `services/auth/*` |
| 16.8 Menu Integration | ✅ Done | `organisms/Menu/index.jsx` |
| 16.9 HireMe Positioning | ✅ Done | `organisms/NavBar/*`, `molecules/HireMe/*` |

### 🔄 Pending Stories

| Story | Status | Description |
|-------|--------|-------------|
| 16.10 | Pending | Auth Modal integration with Floating overlay |
| 16.11 | Pending | Mobile overlay (logo click → nav + socials) |
| 16.12 | Pending | Mobile animation: elements hide behind logo |
| 16.13 | Pending | E2E tests for new header structure |

---

## Epic 16: Header/NavBar Refactor

**Objetivo:** El usuario experimenta un header limpio, ordenado y consistente en todos los breakpoints, con auth unificado y HireMe correctamente posicionado.

**FRs cubiertos:** FR16.1-FR16.19
**NFRs aplicados:** NFR16.1-NFR16.5

---

### Story Summary

| # | Story | FRs | Status | Notas |
|---|-------|-----|--------|-------|
| **16.1** | Social Networks Reduction | FR16.5 | ✅ Done | 4 icons: LinkedIn, GitHub, Twitter, Dribbble |
| **16.2** | Header CSS Grid Layout | FR16.1, FR16.2, FR16.3, FR16.4 | ✅ Done | 9-column grid with AIR |
| **16.3** | Auth Redux Slice | FR16.15-FR16.19 | ✅ Done | Following chatPanel pattern |
| **16.4** | UserIcon Component | FR16.16 | ✅ Done | New SVG icon |
| **16.5** | AuthButton Component | FR16.15, FR16.16 | ✅ Done | Toggle + visual states |
| **16.6** | Auth Modal & Forms | FR16.17, FR16.18 | ✅ Done | Login/Signup tabs + OAuth |
| **16.7** | Mock Auth Service | FR16.19 | ✅ Done | user@test.com / password123 |
| **16.8** | Menu Integration | FR16.15 | ✅ Done | AuthButton replaces OAuth buttons |
| **16.9** | HireMe Positioning | FR16.10-FR16.14 | ✅ Done | Desktop: flow, Mobile: floating |
| 16.10 | Auth Overlay Integration | FR16.17 | 🔄 Pending | Integrate with Floating component |
| 16.11 | Mobile Logo Overlay | FR16.9 | 🔄 Pending | Click logo → nav + socials |
| 16.12 | Mobile Hide Animation | FR16.8 | 🔄 Pending | Elements hide behind logo |
| 16.13 | E2E Test Suite | NFR16.5 | 🔄 Pending | Validate all breakpoints |

---

### Story Details (Completed)

#### Story 16.1: Social Networks Reduction ✅

**Files Modified:**
- `src/ui/organisms/Menu/constants.js`

**Changes:**
```javascript
// Before: 6 providers
export const HEADER_SOCIAL_PROVIDERS = [
  "github", "linkedin", "twitter", "dribbble", "telegram", "whatsapp"
];

// After: 4 providers
export const HEADER_SOCIAL_PROVIDERS = [
  "linkedin", "github", "twitter", "dribbble"
];
```

---

#### Story 16.2: Header CSS Grid Layout ✅

**Files Modified:**
- `src/ui/organisms/Menu/styles.css`

**Grid Structure:**
```css
.menu-bar {
  @apply hidden nav:grid items-center w-full;
  /* Grid: logo | air | nav | air | socials | air | ui | air | cta */
  grid-template-columns: auto 1fr auto 1.5fr auto 1fr auto 1fr auto;
}

.menu-bar__logo { grid-column: 1; }
.menu-bar__nav { grid-column: 3; }
.menu-bar__social { grid-column: 5; }
.menu-bar__ui { grid-column: 7; }
.menu-bar__cta { grid-column: 9; }
```

---

#### Story 16.3: Auth Redux Slice ✅

**Files Created:**
- `src/state/slices/authPanel/slice.ts`
- `src/state/slices/authPanel/hooks.ts`
- `src/state/slices/authPanel/index.ts`

**State Structure:**
```typescript
interface AuthPanelState {
  isOpen: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  error: string | null;
}

// Actions: open, close, toggle, loginSuccess, loginError, logout, clearError
```

---

#### Story 16.4-16.6: Auth Components ✅

**Files Created:**
- `src/ui/atoms/icons/UserIcon/index.jsx`
- `src/ui/atoms/buttons/AuthButton/index.tsx`
- `src/ui/atoms/buttons/AuthButton/styles.css`
- `src/ui/organisms/Auth/index.tsx`
- `src/ui/organisms/Auth/AuthModal.tsx`
- `src/ui/organisms/Auth/Form/LoginForm.tsx`
- `src/ui/organisms/Auth/Form/SignupForm.tsx`
- `src/ui/organisms/Auth/Form/OAuthButtons.tsx`
- `src/ui/organisms/Auth/styles.css`

---

#### Story 16.7: Mock Auth Service ✅

**Files Created:**
- `src/services/auth/types.ts`
- `src/services/auth/mock.ts`
- `src/services/auth/index.ts`

**Mock Credentials:**
```typescript
// Success: user@test.com / password123 → 200
// Error: any other credentials → 401
// Signup conflict: existing@test.com → 409
```

---

#### Story 16.9: HireMe Positioning ✅

**Files Modified:**
- `src/ui/organisms/NavBar/index.jsx`
- `src/ui/organisms/NavBar/styles.css`
- `src/ui/molecules/HireMe/styles.css`
- `src/app/page.jsx` (removed duplicate HireMe)

**Key Changes:**
1. HireMe removed from Home page (was duplicating)
2. NavBar now renders HireMe in two contexts:
   - Desktop: Inside Menu component (in flow)
   - Mobile: Inside `layout_hireme-mobile` container (floating)
3. HireMe component no longer has positioning - parent controls it

**Desktop (in Menu):**
```css
.menu-bar__cta .hire-me_container {
  @apply relative flex static;
  position: relative !important;
}
```

**Mobile (floating):**
```css
.layout_hireme-mobile .hire-me_container {
  @apply fixed flex;
  position: fixed !important;
  bottom: 1.5rem;
  right: 1.5rem;
}
```

---

### Story Details (Pending)

#### Story 16.10: Auth Overlay Integration 🔄

**Acceptance Criteria:**

**Given** the user is on any page
**When** they click the AuthButton
**Then** the AuthModal opens as an overlay (using Floating pattern)
**And** clicking outside closes the modal

**Files to Modify:**
- `src/ui/overlays/Floating/index.jsx`

---

#### Story 16.11: Mobile Logo Overlay 🔄

**Acceptance Criteria:**

**Given** the user is on mobile (< 841px)
**When** they click on the Logo
**Then** an overlay opens showing:
  - Navigation links (Home, About, Projects, Articles)
  - Social links (LinkedIn, GitHub, Twitter, Dribbble)
**And** clicking a nav link closes the overlay
**And** clicking outside closes the overlay

**Files to Create/Modify:**
- `src/ui/organisms/MobileMenu/` (new)
- `src/ui/organisms/NavBar/index.jsx`

---

#### Story 16.12: Mobile Hide Animation 🔄

**Acceptance Criteria:**

**Given** the viewport transitions from desktop to mobile
**When** the nav breakpoint is crossed (841px)
**Then** Nav + Socials animate toward the logo
**And** they "disappear behind" the logo with staggered timing
**And** the animation follows magnetic attraction physics

**Technical Notes:**
- Delay incremental: ~0.3-0.4s between elements
- Last element moves faster
- Optional: Logo color change per absorbed element

---

#### Story 16.13: E2E Test Suite 🔄

**Test Cases:**

1. **Desktop Header Layout (≥841px)**
   - Logo visible at left
   - Nav links visible
   - Social icons visible (4 icons)
   - Auth button visible
   - Theme button visible
   - HireMe visible at right (not fixed)

2. **Mobile Header Layout (<841px)**
   - Logo visible
   - Auth button visible
   - Theme button visible
   - HireMe floating at bottom-right

3. **Auth Flow**
   - Click AuthButton → Modal opens
   - Login with valid credentials → Modal closes, button glows
   - Login with invalid credentials → Error message

---

## Dependencies

```
16.1 ✅ ──┬──> 16.2 ✅ ──> 16.8 ✅
          │
          └──> 16.3 ✅ ──> 16.4 ✅ ──> 16.5 ✅ ──> 16.6 ✅ ──> 16.7 ✅ ──> 16.10 🔄
          │
          └──> 16.9 ✅

16.10 🔄 ──> 16.11 🔄 ──> 16.12 🔄

All ──> 16.13 🔄 (E2E requires all completed)
```

---

## Critical Files Summary

| File | Status | Action |
|------|--------|--------|
| `src/ui/organisms/Menu/constants.js` | ✅ | Reduced to 4 socials |
| `src/ui/organisms/Menu/styles.css` | ✅ | CSS Grid with AIR |
| `src/ui/organisms/Menu/index.jsx` | ✅ | Integrated AuthButton + HireMe |
| `src/ui/organisms/NavBar/index.jsx` | ✅ | Mobile HireMe container |
| `src/ui/organisms/NavBar/styles.css` | ✅ | Mobile floating styles |
| `src/ui/molecules/HireMe/styles.css` | ✅ | Removed positioning (parent-controlled) |
| `src/state/slices/authPanel/*` | ✅ | New Redux slice |
| `src/ui/atoms/buttons/AuthButton/*` | ✅ | New component |
| `src/ui/atoms/icons/UserIcon/*` | ✅ | New icon |
| `src/ui/organisms/Auth/*` | ✅ | Modal + Forms |
| `src/services/auth/*` | ✅ | Mock service |
| `src/app/page.jsx` | ✅ | Removed duplicate HireMe |
| `src/ui/overlays/Floating/index.jsx` | 🔄 | Pending auth integration |

---

## Out of Scope (Epic 16)

⚠️ **Explícitamente fuera de alcance:**

- Real authentication backend (Rodauth) - Epic 15
- HireMe scroll-following behavior on About page
- HireMe → square button transition animation
- Parallax/3D effects on header
- Performance optimization for animations

---

## Verification Checklist

✅ = Verified, 🔄 = Pending

- ✅ Logo y HireMe no son fixed en desktop
- ✅ Socials relajados hacia centro, no al borde
- ✅ Auth y theme tienen aire propio a la derecha
- ✅ No hay menú hamburguesa activo
- ✅ Header implementado con Grid/Flex + Tailwind + BEM
- ✅ HireMe único componente, posición controlada por parent
- 🔄 Mobile: click en logo abre overlay
- 🔄 Mobile: elementos se ocultan detrás del logo con animación
- 🔄 E2E tests validados

---

## Reference Documents

- `_bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/01-blades-and-breakpoints.md`
- `_bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/02-rules.md`
- `_bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/03-header-navbar-rules_final-version.md`
- `.claude/plans/humming-whistling-hedgehog.md` (Implementation Plan)
