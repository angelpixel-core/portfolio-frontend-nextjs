# Epic 16: Auth System & Session UI

**Status:** Backlog (Pending Epic 15 completion)
**Type:** Feature
**Duration:** 2-3 sprints (estimado)
**Origin:** UI & Motion Spec Section 2.3 "Auth Button" + Epic 13 Retrospective
**Prerequisite:** Epic 15 (TypeScript Hardening)

---

## Objetivo

Implementar flujo completo de autenticación social (OAuth) con estados visuales de sesión, permitiendo a visitantes autenticarse para acceder a funcionalidades premium del portfolio.

---

## Contexto

El Auth Button existe en el header pero actualmente es un placeholder. Este epic implementa:
- Autenticación social (LinkedIn, Google, Microsoft)
- Modal de Sign In/Sign Up
- Estados visuales de sesión autenticada
- Persistencia de sesión
- Logout

**Dependencia técnica:** El TODO en `SocialAuthDropdown` (`// TODO: Real OAuth integration`) debe resolverse en este epic.

---

## Scope

### In Scope

1. OAuth integration con proveedores sociales
2. Modal de autenticación (Sign In / Sign Up)
3. Estados visuales del Auth Button (logged in vs logged out)
4. Persistencia de sesión (JWT/cookies)
5. Logout functionality
6. Protected routes (si aplica)
7. User profile básico post-login

### Out of Scope

- Backend de autenticación (asume API existente o Rodauth)
- Features premium que requieren auth (scope de epic futuro)
- Password-based auth (solo OAuth social)
- 2FA / MFA

---

## Functional Requirements

### Auth Button States

| ID | Requirement | Priority |
|----|-------------|----------|
| FR16.1 | Auth button muestra estado logged out por defecto | Alta |
| FR16.2 | Auth button muestra avatar/iniciales cuando logged in | Alta |
| FR16.3 | Click en Auth button (logged out) abre modal de sign in | Alta |
| FR16.4 | Click en Auth button (logged in) abre dropdown con opciones | Alta |
| FR16.5 | Dropdown incluye: View Profile, Settings, Logout | Media |

### Auth Modal

| ID | Requirement | Priority |
|----|-------------|----------|
| FR16.6 | Modal muestra opciones de OAuth providers (LinkedIn, Google, Microsoft) | Alta |
| FR16.7 | Modal se cierra al hacer click fuera o presionar Escape | Alta |
| FR16.8 | Modal tiene estados de loading durante OAuth flow | Media |
| FR16.9 | Modal muestra errores de autenticación con mensajes claros | Media |
| FR16.10 | Modal soporta reduced motion | Media |

### Session Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR16.11 | Sesión persiste entre page refreshes | Alta |
| FR16.12 | Sesión expira después de tiempo configurable | Media |
| FR16.13 | Logout limpia sesión completamente | Alta |
| FR16.14 | Estado de sesión disponible via React Context/Redux | Alta |

### OAuth Flow

| ID | Requirement | Priority |
|----|-------------|----------|
| FR16.15 | Redirect a provider OAuth page | Alta |
| FR16.16 | Callback handling post-OAuth | Alta |
| FR16.17 | Token storage seguro | Alta |
| FR16.18 | Refresh token flow (si aplica) | Media |

---

## Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR16.1 | OAuth flow < 3 segundos (excluyendo provider) | Media |
| NFR16.2 | Modal accesible (WCAG 2.1 AA) | Alta |
| NFR16.3 | Funciona en mobile y desktop | Alta |
| NFR16.4 | No expone tokens en client-side storage inseguro | Alta |
| NFR16.5 | E2E tests para flujos críticos de auth | Alta |

---

## Stories (Preliminar)

### Story 16.1: Auth State Management

**Como** desarrollador,
**Quiero** un sistema de estado para auth con TypeScript,
**Para que** cualquier componente pueda conocer el estado de sesión.

**Scope:**
- Auth slice en Redux (o Context dedicado)
- Types para User, Session, AuthState
- Hooks: `useAuth`, `useUser`, `useIsAuthenticated`

---

### Story 16.2: Auth Modal Component

**Como** visitante,
**Quiero** un modal atractivo para sign in,
**Para que** pueda elegir mi provider OAuth fácilmente.

**Scope:**
- Modal component con AnimatePresence
- Provider buttons (LinkedIn, Google, Microsoft)
- Loading states
- Error states
- Accessibility (focus trap, escape to close)

---

### Story 16.3: OAuth Integration

**Como** visitante,
**Quiero** autenticarme con mi cuenta social,
**Para que** no necesite crear una cuenta nueva.

**Scope:**
- OAuth redirect flow
- Callback handling
- Token storage
- Session creation

---

### Story 16.4: Auth Button States

**Como** visitante,
**Quiero** ver claramente si estoy logged in o no,
**Para que** sepa qué acciones puedo tomar.

**Scope:**
- Logged out state (icon genérico)
- Logged in state (avatar/iniciales)
- Dropdown menu para logged in users
- Smooth transitions entre estados

---

### Story 16.5: Session Persistence

**Como** visitante autenticado,
**Quiero** que mi sesión persista entre visitas,
**Para que** no tenga que re-autenticarme constantemente.

**Scope:**
- Token persistence (httpOnly cookies o secure storage)
- Session restoration on page load
- Token refresh logic

---

### Story 16.6: Logout Flow

**Como** visitante autenticado,
**Quiero** poder cerrar mi sesión fácilmente,
**Para que** mi cuenta esté segura en dispositivos compartidos.

**Scope:**
- Logout button en dropdown
- Session cleanup
- Redirect post-logout
- Confirmation (opcional)

---

### Story 16.7: Auth E2E Test Suite

**Como** QA engineer,
**Quiero** E2E tests para el flujo de auth,
**Para que** detectemos regresiones rápidamente.

**Scope:**
- Test: Modal abre/cierra correctamente
- Test: OAuth redirect funciona (mock provider)
- Test: Estados de Auth Button
- Test: Logout limpia sesión

---

## Story Summary

| Story | Descripción | Prioridad | Dependencias |
|-------|-------------|-----------|--------------|
| 16.1 | Auth State Management | Alta | Epic 15 (TS ready) |
| 16.2 | Auth Modal Component | Alta | 16.1 |
| 16.3 | OAuth Integration | Alta | 16.1, Backend ready |
| 16.4 | Auth Button States | Alta | 16.1 |
| 16.5 | Session Persistence | Media | 16.3 |
| 16.6 | Logout Flow | Media | 16.3 |
| 16.7 | Auth E2E Test Suite | Media | 16.2, 16.4, 16.6 |

---

## Technical Considerations

### Backend Dependency

Este epic asume que existe un backend de autenticación. Opciones:
1. **Rodauth** (Ruby) - mencionado en specs originales
2. **NextAuth.js** - si se quiere mantener en Next.js
3. **Auth0 / Clerk** - SaaS solutions

**Decisión pendiente:** Definir backend auth approach antes de iniciar.

### Token Storage

| Opción | Pros | Contras |
|--------|------|---------|
| httpOnly Cookie | Seguro, automático | Requiere backend |
| localStorage | Simple | Vulnerable a XSS |
| sessionStorage | Más seguro que local | No persiste entre tabs |
| Memory + Refresh | Muy seguro | Complejidad |

**Recomendación:** httpOnly Cookie si hay backend, Memory + Refresh Token si SPA pura.

### Existing Code

- `SocialAuthDropdown` ya tiene UI para providers
- `authPanel` slice existe en Redux
- `AuthButton` existe pero es placeholder

---

## Risks & Mitigations

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Backend no ready | Media | Alto | Definir API contract early |
| OAuth provider issues | Baja | Medio | Test con múltiples providers |
| Token security | Baja | Alto | Security review, httpOnly cookies |
| UX friction | Media | Medio | User testing, clear error messages |

---

## Definition of Done (Epic)

- [ ] Auth modal funcional con 3 providers
- [ ] Auth button muestra estados correcto (logged in/out)
- [ ] Sesión persiste entre refreshes
- [ ] Logout funciona correctamente
- [ ] E2E tests para flujos críticos
- [ ] WCAG 2.1 AA compliance
- [ ] Funciona en mobile y desktop
- [ ] No security vulnerabilities (token exposure, XSS)
- [ ] Documentación de API/config

---

## Open Questions

1. ¿Qué backend de auth usar? (Rodauth, NextAuth, Auth0, custom)
2. ¿Qué funcionalidades requieren auth? (scope de epic futuro)
3. ¿Necesitamos user profile page?
4. ¿Rate limiting en auth endpoints?

---

## References

- [UI & Motion Spec Section 2.3](TBD)
- [SocialAuthDropdown Component](../src/ui/molecules/SocialAuthDropdown/)
- [Epic 15 - TypeScript Hardening](./epic-15-typescript-hardening.md)

---

**Document Created:** 2026-02-07
**Author:** BMAD SM Agent
**Status:** Draft - Pending backend decision
