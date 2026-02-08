# Code Review Findings – Story 16.3: OAuth Integration

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 16-3-oauth-integration  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/16-3-oauth-integration.md` |
| **Discrepancias Git vs File List** | No verificadas en esta sesión |
| **Issues encontrados** | 1 High, 2 Medium, 3 Low |

---

## Git vs Story

- **File List:** 14 archivos (types, mock, oauth, index, mock.test, AuthModal, OAuthButtons, AuthModal.test, OAuthButtons.test, SocialAuthDropdown, EmailBox, .env.template, story, sprint-status).
- **Nota:** No se ejecutó `git status` en esta sesión; se asume que los archivos listados en la story están bajo control de versiones según el Dev Agent Record.

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Wire OAuthButtons / servicio inyectable | **Incumplido** | AuthModal importa `mockOAuthLogin` directamente; no usa `oauthService` ni un servicio inyectable (véase HIGH #1). |
| AC2 Mock OAuth service | OK | `mockOAuthLogin` en mock.ts, delay 1200ms, usuarios por provider, "Unsupported provider", re-export en index. |
| AC3 OAuth types | OK | `OAuthProvider`, `OAuthCredentials` en types.ts; mockOAuthLogin tipado con OAuthProvider. |
| AC4 Flow end-to-end | OK | Handler en AuthModal, loading state, loginSuccess/loginError, clearError antes del flow; tests cubren éxito/error/loading. |
| AC5 SocialAuthDropdown | OK | Usa mockOAuthLogin, barrel fix (@/icons → paths directos), forceMock eliminado. |
| AC6 Tests unitarios | OK | 4 tests mockOAuthLogin (google/linkedin/microsoft/invalid); 4 tests AuthModal OAuth (success, error, loading, exception). |
| AC7 OAuthService + feature flag | Parcial | oauth.ts con interface y MockOAuthService existe; **feature flag** NEXT_PUBLIC_OAUTH_ENABLED no se lee en código (véase MEDIUM #2). ACs en story no marcados [x] (véase MEDIUM #3). |

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

### 1. AC1: Handler no usa servicio de auth inyectable

**AC1** exige: *"onOAuthClick NO está hardcoded al mock — usa el servicio de auth inyectable"*.

**Hecho:** En `AuthModal.tsx` se importa `mockOAuthLogin` directamente desde `@/services/auth` y se usa en `handleOAuthClick`:

```ts
import { mockOAuthLogin } from "@/services/auth";
// ...
const result = await mockOAuthLogin(provider);
```

Existe `oauthService` (y tipo `OAuthService`) en `src/services/auth/oauth.ts` exportado desde `index.ts`, pero **AuthModal no lo usa**. La abstracción está preparada para integración real, pero la UI sigue acoplada al mock por import directo.

**Recomendación:** Inyectar el servicio (prop, contexto o módulo configurable) y que `handleOAuthClick` llame a `oauthService.initiateOAuth(provider)` (o equivalente que devuelva resultado en el flujo mock), de forma que al activar OAuth real solo se cambie la implementación del servicio, no AuthModal.

---

## MEDIUM ISSUES

### 2. Feature flag NEXT_PUBLIC_OAUTH_ENABLED no utilizado en código

La story y AC7 piden el placeholder de variable de entorno `NEXT_PUBLIC_OAUTH_ENABLED=false` como feature flag. Está en `.env.template` y documentado en JSDoc de `oauth.ts`, pero **ningún archivo en `src/` lee `process.env.NEXT_PUBLIC_OAUTH_ENABLED`** para alternar entre mock y OAuth real.

**Recomendación:** Si el flag debe controlar mock vs real, añadir la lectura (por ejemplo en `oauth.ts` o en el punto donde se elige la implementación del servicio) y usar el valor para exponer `oauthService` mock o real. Si de momento es solo placeholder documental, aclararlo en la story o en comentarios.

### 3. Acceptance Criteria en la story siguen sin marcar [x]

En `16-3-oauth-integration.md` todas las viñetas de Acceptance Criteria siguen con `[ ]`, mientras que las Tasks están `[x]` y el Dev Agent Record indica implementación completa. Esto dificulta la trazabilidad y la revisión de “definition of done”.

**Recomendación:** Marcar en la story cada ítem de AC como `[x]` cuando se considere cumplido (o dejar explícito qué ítem queda pendiente, p. ej. el de “servicio inyectable” hasta aplicar HIGH #1).

---

## LOW ISSUES

### 4. OAuthButtons: prop `colored` en iconos

En `OAuthButtons.tsx`, `LinkedInIcon` y `GooglePlusIcon` reciben la prop `colored` (boolean). Es el mismo patrón que en el code review de 16.2: prop no estándar para componentes de icono; en otros sitios se usa variante o nombre explícito. Riesgo bajo de mantenimiento y consistencia de API.

**Recomendación:** Alinear con la convención del design system (p. ej. `variant="colored"` o documentar que `colored` es la API acordada para estos iconos).

### 5. Test de error OAuth no comprueba mensaje visible en UI

AC6 pide *"OAuth error muestra error message"*. El test *"clicking OAuth button calls loginError on failure"* comprueba que `mockLoginError` es llamado con el mensaje correcto, pero **no** que el mensaje se muestre en pantalla (p. ej. `expect(screen.getByText('Unsupported provider')).toBeInTheDocument()`).

**Recomendación:** Añadir una aserción de que el texto de error aparece en el modal cuando el flow falla, para cubrir el criterio de “muestra” desde el punto de vista del usuario.

### 6. OAuthService exportado pero no usado

`oauthService` y el tipo `OAuthService` se exportan desde `src/services/auth/index.ts` y están listados en la File List, pero ningún consumidor (AuthModal, SocialAuthDropdown) los usa; ambos llaman a `mockOAuthLogin` directamente. Refuerza que la intención de “servicio inyectable” (AC1) no está aplicada.

**Recomendación:** Resolver con la recomendación de HIGH #1 (usar oauthService en AuthModal y, si aplica, en SocialAuthDropdown).

---

## Verificación ejecutada

- `npm run typecheck`: OK  
- `npm test` (mock.test.ts + AuthModal.test.tsx): 31 tests passed  
- Revisión de ACs contra código y File List según story 16.3

---

## Siguiente paso sugerido

1. **Corregir HIGH #1:** Hacer que AuthModal use `oauthService` (o un servicio inyectable) en lugar de importar `mockOAuthLogin` directamente.  
2. Opcional: Implementar lectura de `NEXT_PUBLIC_OAUTH_ENABLED` (MEDIUM #2) o documentar que es solo placeholder.  
3. Actualizar la story marcando ACs cumplidos y pendientes (MEDIUM #3).  
4. Opcional: LOW #4 (convención `colored`), #5 (test mensaje visible), #6 (queda resuelto con #1).
