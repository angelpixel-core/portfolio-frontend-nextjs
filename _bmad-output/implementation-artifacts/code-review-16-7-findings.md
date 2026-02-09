# Code Review Findings – Story 16.7: Auth E2E Test Suite

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)
**Story:** 16-7-auth-e2e-test-suite
**Fecha:** 2026-02-08
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/16-7-auth-e2e-test-suite.md` |
| **Discrepancias Git vs File List** | 2 |
| **Issues encontrados** | 0 Critical, 0 High, 1 Medium, 4 Low |

---

## Git vs Story

- **File List (story):** 7 archivos (auth.spec.ts, testids.ts, AuthButton index, AuthDropdown, AuthModal, AuthForm, OAuthButtons).
- **Git (real):** 8 modificados + 3 sin trackear = 11 archivos total.
- **Discrepancias:**
  1. **CLAUDE.md** — modificado en git (tabla Critical E2E Flows con entrada Auth), no en File List. Task 6 lo menciona como subtarea completada.
  2. **sprint-status.yaml** — modificado en git (16-7: review), no en File List.
  3. Archivos BMAD (`16-7-auth-e2e-test-suite.md`, `code-review-16-7-findings.md`) no listados, pero son artefactos de proceso, no de implementación — aceptable.
  4. Implementación sin commit.

---

## Validación de ACs

| AC | Estado | Evidencia |
|----|--------|-----------|
| AC1 Test ID infrastructure | OK | `data-testid` en AuthButton(:44), AuthDropdown(:84,:104), AuthModal(:126,:137,:191,:199), AuthForm(:219), OAuthButtons(:28,:39,:50). Todos en `testids.ts:128-144`. |
| AC2 Auth Modal E2E | OK | 7 tests (describe "Auth Modal", lines 65-148): open, backdrop, Escape, X, tab switch, a11y attrs, focus trap. |
| AC3 Email/Password Login E2E | OK | 4 tests (describe "Email/Password Login", lines 152-220): success, "Signing in...", error, session persist. |
| AC4 Signup E2E | OK | 3 tests (describe "Signup", lines 224-288) + 1 N/A documentado (short password → browser native validation). |
| AC5 OAuth E2E | OK | 2 tests (describe "OAuth Login", lines 292-326): 3 buttons visible, Google login success. |
| AC6 Dropdown & Logout E2E | OK | 5 tests (describe "Auth Dropdown & Logout", lines 330-415). |
| AC7 Session & cross-tab E2E | OK | 2 tests (describe "Session Persistence & Cross-Tab", lines 419-483). |
| AC8 Accessibility E2E | OK | 4 tests (describe "Auth Accessibility", lines 488-546): aria-expanded, role=menu/menuitem, keyboard Escape. |

**Total: 27 tests, todos los ACs satisfechos.**

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

*(Ninguno.)*

---

## MEDIUM ISSUES

### M1. File List incompleta — CLAUDE.md y sprint-status faltan

La File List de la story documenta 7 archivos pero git muestra 2 archivos adicionales modificados como parte del trabajo:
- `CLAUDE.md` — actualizado con entrada Auth en tabla Critical E2E Flows (Task 6)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — status actualizado a review

**Impacto:** Revisiones futuras que solo usen la File List no verán estos cambios.

**Recomendación:** Agregar ambos a la tabla File List del Dev Agent Record.

---

## LOW ISSUES

### L1. Test "cross-tab logout propagation" no verifica sync en vivo

El test (line 445) hace logout en page1 (clear localStorage + dispatch StorageEvent), verifica que page1 se actualiza, pero para page2 hace `reload()` en vez de verificar sync en vivo. En un navegador real, `StorageEvent` se propaga a otras ventanas automáticamente. En Playwright, `dispatchEvent` solo afecta la misma página — limitación del entorno.

**Recomendación:** Agregar comentario en el test documentando esta limitación (ya existe parcialmente en line 474-475, pero podría ser más explícito).

### L2. Selector frágil en focus trap test

Line 143-145 usa selector complejo:
```typescript
page.locator('#authPanelFloating .auth-panel a[href], #authPanelFloating .auth-panel button, #authPanelFloating .auth-panel input').first()
```

Cualquier cambio en la estructura del panel o clases CSS puede romper el test.

**Recomendación:** Considerar usar `data-testid="auth-modal-first-focus"` en el primer elemento enfocable del modal para reducir acoplamiento.

### L3. Inconsistencia documental en conteo de tests

Completion Notes dicen "modal (6)" pero el describe "Auth Modal" tiene 7 tests. La suma 6+4+3+2+5+2+4 = 26, pero el total real es 27. Debería ser 7+4+3+2+5+2+4 = 27.

**Recomendación:** Corregir "modal (6)" → "modal (7)" en Completion Notes.

### L4. Cambios sin commit

Toda la implementación de la story 16.7 está sin commit. 11 archivos pendientes.

**Recomendación:** Crear commits atómicos agrupados por concern (testids, E2E tests, docs).

---

## Verificación ejecutada

- Lectura completa de todos los archivos en File List + archivos descubiertos por git.
- Verificación de data-testid en 5 componentes auth — todos presentes y alineados con testids.ts.
- Verificación de CLAUDE.md Critical E2E Flows table — entrada Auth presente (line 171).
- Verificación de sprint-status.yaml — `16-7: review`.
- Cross-reference de 27 tests con 8 ACs — cobertura completa.
- Los 27 E2E tests pasaron (verificado previamente en esta sesión).

---

## Siguiente paso sugerido

1. **M1:** Agregar CLAUDE.md y sprint-status.yaml a la File List.
2. **L3:** Corregir "modal (6)" → "modal (7)" en Completion Notes.
3. **L4:** Crear commits atómicos.
4. **L1, L2:** Opcional — documentar limitación cross-tab, endurecer selector focus trap.
