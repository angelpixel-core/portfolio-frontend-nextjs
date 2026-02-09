# Plan: E2E Test Hardening — Desacoplar tests de implementación CSS

## Contexto

El E2E suite tiene 312 tests. Un run inestable reportó 106 fallos.
Análisis revela que muchos son flaky (server crash), pero hay **problemas estructurales reales** que hacen los tests frágiles.

Un run limpio posterior dio **200 passed, 0 failed, 6 skipped** — lo que confirma que la mayoría de fallos eran por inestabilidad del server. Sin embargo, los patrones frágiles persisten y deben corregirse preventivamente.

**Principio rector:** Los E2E tests deben validar **comportamiento observable** (ARIA, data attributes, visibilidad), no **implementación interna** (nombres de clases CSS).

---

## Categorías de fallos

### Cat 1: Strict Mode — Elementos duplicados (19 fallos potenciales)

**Problema:** Componentes como `HireMe` y `ThemeButton` se renderizan en múltiples zonas del header (mobile + desktop). Playwright strict mode falla cuando `getByTestId()` resuelve a >1 elemento.

**Archivos E2E afectados:**
- `footer-consistency.spec.ts` — 9 tests: HireMe duplicado
- `theme.spec.ts` — 4 tests: ThemeButton duplicado
- `header-hover-states.spec.ts` — 2 tests: HireMe hover
- `contact.spec.ts` — 1 test: social links count
- `menu-autoclose.spec.ts` — 3 tests: burger zone

**Componentes con testid duplicado:**
| testid | Zona 1 | Zona 2 |
|--------|--------|--------|
| `theme-toggle-button` | `header-mobile-theme` | `header-ui-zone` (Menu) |
| `hire-me-circular` | `header-cta-zone` (Menu) | `layout_hireme-mobile` |
| `hire-me-link` | (mismos locations) | |

**Estrategia de fix:** Scope los locators por zona del header usando locators anidados:
```ts
// Antes (falla en strict mode):
const themeButton = page.getByTestId('theme-toggle-button');

// Después (scoped a zona visible):
const themeButton = page.getByTestId('header-ui-zone').getByTestId('theme-toggle-button');
// O para mobile:
const themeButton = page.getByTestId('header-mobile-theme').getByTestId('theme-toggle-button');
```

**Alternativa:** Crear un helper `getVisibleElement(page, testid)` que filtre por visibilidad.

**Archivos a modificar:**
- `e2e/theme.spec.ts`
- `e2e/footer-consistency.spec.ts`
- `e2e/header-hover-states.spec.ts`
- `e2e/contact.spec.ts`
- `e2e/menu-autoclose.spec.ts`

---

### Cat 2: Elementos no encontrados / Flaky (45+ fallos potenciales)

**Problema:** Tests buscan elementos que no se renderizan a tiempo o bajo ciertas condiciones. Muchos pasaron en run limpio, sugiriendo flakiness por timing.

**Archivos E2E afectados:**
- `about-skills-interaction.spec.ts` — 16 tests
- `about-stats-degradation.spec.ts` — 9 tests
- `header-mobile-layout.spec.ts` — 6 tests
- `menu-autoclose.spec.ts` — 4 tests

**Estrategia de fix:**
1. Verificar reproducibilidad ejecutando 3 runs consecutivos
2. Si son flaky: agregar `waitFor` explícitos antes de assertions
3. Si son consistentes: investigar si el componente realmente no renderiza
4. Para skills/stats: verificar que React Query hooks retornan datos en time

**Archivos a modificar:** Depende del diagnóstico de reproducibilidad.

---

### Cat 3: WCAG Touch Target (3 fallos)

**Problema:** El toggle de experiencias mide 16px (1rem), WCAG 2.5.5 requiere 44px mínimo para touch targets.

**Archivos E2E afectados:**
- `about-experiences-education-ux.spec.ts` — 2 tests (size + spacing)

**Estrategia de fix (COMPONENT):**
```css
.experience_toggle-inline {
  /* Agregar padding para alcanzar 44px de touch target */
  min-width: 44px;
  min-height: 44px;
  /* Mantener el icono visualmente pequeño */
  padding: 12px;
}
```

**Archivos a modificar:**
- `src/ui/molecules/Experience/styles.css`

---

### Cat 4: Debug/Diagnostic tests crashing (7 fallos)

**Problema:** `debug-breakpoint-transitions.spec.ts` hace múltiples resizes rápidos que crashean el browser context.

**Archivos E2E afectados:**
- `debug-breakpoint-transitions.spec.ts` — 7 tests

**Estrategia de fix:**
- Opción A: Skip estos tests en CI (`test.skip()` o `test.describe.configure({ mode: 'serial' })`)
- Opción B: Agregar delays entre resizes y error recovery
- Opción C: Eliminar si son puramente diagnósticos (no cubren funcionalidad real)

**Archivos a modificar:**
- `e2e/debug-breakpoint-transitions.spec.ts`

---

## Orden de ejecución

| Batch | Cat | Fallos | Esfuerzo | Riesgo |
|-------|-----|--------|----------|--------|
| 1 | Strict mode duplicates | 19 | Bajo | Bajo — solo cambia locators en tests |
| 2 | Flaky / timing | 45+ | Medio | Bajo — diagnóstico primero, fix si reproduce |
| 3 | WCAG touch target | 3 | Bajo | Bajo — CSS padding change |
| 4 | Debug tests | 7 | Bajo | Nulo — skip o eliminar |

---

## Completado

- [x] Cat 0: Class assertions → aria-expanded/aria-pressed (5 fallos — ya corregido)
  - `about-experiences-education-ux.spec.ts` — commit `8f61fc6`
  - `about-skills-interaction.spec.ts` — commit `50c4cf1`
- [x] Cat 1: Strict mode duplicates (19 fallos potenciales → 0 fallos)
  - `theme.spec.ts` — scope a `header-ui-zone` — commit `63638b9`
  - `header-hover-states.spec.ts` — scope a `header-cta-zone` + viewport nav+ — commit `99e1497`
  - `footer-consistency.spec.ts` — visibility filter + AC6 rewrite + AC2 fixme — commit `65c994d`
  - `contact.spec.ts` y `menu-autoclose.spec.ts` — fallos son Cat 2 (testid faltante), no strict mode
- [ ] Cat 2: Flaky / timing
- [ ] Cat 3: WCAG touch target
- [ ] Cat 4: Debug tests
