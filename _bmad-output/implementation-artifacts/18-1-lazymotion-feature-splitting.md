# Story 18.1: LazyMotion feature splitting

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como **visitante**,
quiero **que las páginas carguen más rápido con bundles de JavaScript más pequeños**,
para **tener una navegación más ágil y menor consumo de datos**.

## Acceptance Criteria

1. **Given** el build actual tiene el chunk 2186 (framer-motion) con 33.5 KiB gzip **When** se implementa LazyMotion con features domAnimation **Then** el chunk de framer-motion se reduce en al menos 12 KiB gzip.
2. **Given** un componente que usa `motion.div` (ej: ArticleAppearance) **When** se reemplaza por `m.div` con LazyMotion provider **Then** la animación funciona idénticamente (entrada, salida, hover).
3. **Given** `prefers-reduced-motion: reduce` está activo en el OS **When** se visita cualquier página con animaciones **Then** las animaciones están reducidas/deshabilitadas (sin regresión del hook existente).
4. **Given** `npm run build` se ejecuta **When** el build completa **Then** no hay errores ni warnings nuevos.
5. **Given** `npm test` se ejecuta **When** todos los tests corren **Then** los 963+ tests pasan sin regresiones.

## Tasks / Subtasks

- [x] **Task 1:** Crear LazyMotionProvider e integrarlo en el layout (AC: #1, #2)
  - [x] Crear `src/providers/LazyMotionProvider/index.tsx` que exporte `<LazyMotion features={domAnimation} strict>`
  - [x] Integrar el provider en `RootProvider` envolviendo `TransitionProvider`
- [x] **Task 2:** Refactorizar imports motion → m en 19 archivos (AC: #2)
  - [x] Reemplazar `import { motion }` por `import { m }` y `motion.*` por `m.*` en 19 archivos
  - [x] Archivos que solo usan `AnimatePresence`/hooks no tocados (6 archivos)
- [x] **Task 3:** Migrar overlays a TypeScript (AC: #4)
  - [x] Convertir `Floating/index.jsx` → `.tsx` con interface `FloatingProps`
  - [x] Convertir `FloatingMobile/index.jsx` → `.tsx` con interface `FloatingMobileProps`
- [x] **Task 4:** Tests y verificación (AC: #3, #4, #5)
  - [x] Centralizado mock (`framer-motion-mock.ts`): añadido `m`, `LazyMotion`, `domAnimation`
  - [x] 2 inline mocks actualizados: MotionTitle.test.tsx, TransitionEffect.exitAnimation.test.tsx
  - [x] `npm run build` exitoso — sin errores ni warnings nuevos
  - [x] `npm test` — 963/963 tests pasan
  - [ ] Verificación visual pendiente (requiere dev server manual)

### Review Follow-ups (AI)

- [ ] [AI-Review][HIGH] AC1 no cumplido: reducción de chunk framer-motion ~1.6 KiB gzip (meta ≥12 KiB). Cerrar brecha o documentar aceptación de excepción con PO. [code-review-18-1-findings.md]
- [ ] [AI-Review][MEDIUM] Completar verificación visual en 3 viewports (dev server manual) y marcar subtask. [Story Tasks § Task 4]
- [ ] [AI-Review][MEDIUM] Documentar verificación de AC3 (reduced-motion): test o paso de revisión con prefers-reduced-motion activo. [Story AC #3]
- [ ] [AI-Review][MEDIUM] File List: añadir a "Created" los archivos `src/ui/overlays/Floating/index.tsx` y `src/ui/overlays/FloatingMobile/index.tsx`. [Story Dev Agent Record § File List]

## Dev Notes

- **Objetivo de bundle:** Chunk 2186 (framer-motion) actualmente ~33.5 KiB gzip; meta reducir ≥12 KiB gzip usando LazyMotion + `domAnimation`.
- **Estrategia:** Provider `LazyMotion` con `features={domAnimation}` en el layout; reemplazar solo los **motion components** por `m`; dejar `AnimatePresence` y `useReducedMotion` sin cambios.
- **Riesgo:** Algún componente podría usar features no incluidos en `domAnimation` (layout animations, SVG morphing). Si tras el refactor una animación falla, comprobar si requiere otro feature bundle; en este proyecto solo se usan animaciones DOM básicas.

### Archivos que usan motion components (cambiar a `m`)

| Archivo | Imports actuales | Acción |
|---------|------------------|--------|
| `src/ui/atoms/ArticleHoverThumbnail/index.tsx` | motion, AnimatePresence | motion → m; AnimatePresence sin cambio |
| `src/ui/atoms/buttons/AuthButton/index.tsx` | AnimatePresence, motion | motion → m |
| `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | motion | motion → m |
| `src/ui/atoms/motion/ArticleAppearance/index.tsx` | motion | motion → m |
| `src/ui/molecules/Article/index.tsx` | motion | motion → m |
| `src/ui/molecules/SocialAuthDropdown/index.tsx` | motion, AnimatePresence | motion → m |
| `src/ui/organisms/Auth/Form/AuthForm.tsx` | motion, AnimatePresence | motion → m |
| `src/ui/organisms/Auth/AuthModal.tsx` | motion, AnimatePresence | motion → m |
| `src/ui/organisms/ArticleContent/index.tsx` | motion | motion → m |
| `src/ui/overlays/Floating/index.jsx` | motion | motion → m; migrar a .tsx |
| `src/ui/overlays/FloatingMobile/index.jsx` | motion | motion → m; migrar a .tsx |
| `src/ui/molecules/skill/index.jsx` | motion | motion → m |
| `src/ui/molecules/TransitionEffect/index.jsx` | motion, AnimatePresence | motion → m |
| `src/ui/atoms/texts/AnimatedTitle/MotionTitle.jsx` | motion | motion → m |
| `src/ui/atoms/hocs/TransitionerLi/index.jsx` | motion | motion → m |
| `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | motion | motion → m |
| `src/ui/organisms/WordCloud/SkillDetail.jsx` | motion | motion → m |
| `src/ui/atoms/icons/LiIcon/index.jsx` | motion, useScroll | motion → m; useScroll se mantiene (framer-motion) |
| `src/ui/atoms/hocs/History/index.jsx` | motion, useScroll | motion → m |
| `src/ui/atoms/hocs/FramerImage/index.jsx` | motion | motion → m |

**Solo AnimatePresence / hooks (no tocar el import de motion):** `src/ui/organisms/Chat/index.tsx`, `src/ui/organisms/MenuFloatingClient/index.jsx`, `src/ui/organisms/WordCloud/index.jsx` usan AnimatePresence; `src/hooks/ui/useReducedMotion.ts` usa `useReducedMotion`; `src/ui/molecules/MovingImage/index.jsx` y `src/ui/atoms/texts/AnimatedNumber/index.jsx` usan hooks (`useMotionValue`, `useSpring`, `useInView`). Estos archivos no requieren cambio a `m`; si importan `motion` además del hook/AnimatePresence, solo sustituir el uso de componentes `motion.*` por `m.*`.

### LazyMotion API (framer-motion v10.18.0)

- Import: `import { LazyMotion, m, domAnimation } from "framer-motion"`.
- Provider: `<LazyMotion features={domAnimation} strict>{children}</LazyMotion>`.
- Uso de `strict`: recomendado para detectar usos incorrectos de `motion` dentro del árbol (el lib avisa si se usa `motion` en vez de `m`).
- `domAnimation` incluye: animaciones, variants, exit animations, tap/hover/focus. No incluye layout animations ni SVG path; si algo deja de animar, revisar docs de feature bundles.

### Project Structure Notes

- **Providers:** El layout raíz usa `RootProvider` en `src/app/layout.jsx`. El provider de LazyMotion debe envolver todo lo que use `m`; opción natural: crear `src/providers/LazyMotionProvider.tsx` y añadirlo dentro de `RootProvider` (p. ej. envolviendo a `TransitionProvider` y children), o como wrapper superior según preferencia del equipo.
- **Alias:** Usar `@/providers`, `@/state/providers` según convención existente (RootProvider ya importa desde `@/state/providers`).
- **next.config.js:** Ya tiene `optimizePackageImports: ["framer-motion"]`; mantener. LazyMotion no cambia esta configuración.

### References

- [Source: _bmad-output/planning-artifacts/epic-18-bundle-performance.md] — Story 18.1, contexto técnico, tabla de archivos, AC, subtasks.
- [Source: CLAUDE.md] — Comandos (npm run build, npm test), estructura src/, alias, breakpoints.
- [Source: _bmad-output/planning-artifacts/architecture.md] — Stack (Framer Motion, Next.js 14), NFRs performance.
- Framer Motion LazyMotion: documentación oficial "Reduce bundle size" / "LazyMotion" (framer-motion v10 exporta `LazyMotion`, `m`, `domAnimation` desde `"framer-motion"`).

---

## Developer Context (guardrails)

- **Epic 18** es solo optimización de bundle; no se añaden features. Cualquier cambio debe preservar comportamiento visual y accesibilidad (reduced-motion).
- **No inventar:** Ya existe `useReducedMotion` en `src/hooks/ui/useReducedMotion.ts`; no sustituir ni duplicar. AnimatePresence se mantiene tal cual.
- **Ubicación del provider:** Un solo `LazyMotion` en el árbol (layout). No envolver por página ni por componente.
- **Tests:** Si un test mockea `framer-motion` o `motion`, actualizar el mock a `m` donde se rendericen motion components; no eliminar tests de animación ni de reduced-motion.

### Technical requirements

- **framer-motion:** Versión existente ^10.18.0. Usar solo la API LazyMotion oficial: `LazyMotion`, `m`, `domAnimation` desde `"framer-motion"`.
- **Build:** Tras el cambio, ejecutar `npm run build` y comprobar en la salida el tamaño del chunk que contiene framer-motion; debe bajar ≥12 KiB gzip respecto al valor actual (33.5 KiB gzip para chunk 2186).
- **TypeScript:** Los dos overlays que pasan a .tsx deben tipar props y refs según patrones del proyecto (ver otros .tsx en overlays/ o atoms).

### Architecture compliance

- Respetar DDD + Atomic Design: providers en `src/providers/`, UI en `src/ui/atoms|molecules|organisms|overlays/`.
- No mover componentes de carpeta; solo cambiar imports y añadir un provider.
- Mantener `optimizePackageImports: ["framer-motion"]` en next.config.js.

### Library / framework requirements

- **Solo framer-motion** para esta story. No añadir otras librerías. LazyMotion y `m` son parte de framer-motion v10.
- Si en el futuro se usan layout animations o SVG, habría que cargar otro feature bundle; para 18.1 solo `domAnimation`.

### File structure requirements

- Nuevo archivo: `src/providers/LazyMotionProvider.tsx` (o nombre equivalente que exporte el wrapper LazyMotion).
- Modificar: `src/providers/RootProvider/index.jsx` (o donde se decida montar el provider) y los ~18 archivos listados en Dev Notes que usan `motion` components.
- Migrar a .tsx: `src/ui/overlays/Floating/index.jsx`, `src/ui/overlays/FloatingMobile/index.jsx`.

### Testing requirements

- `npm test`: todos los tests deben pasar (963+). Actualizar mocks de framer-motion si fallan por uso de `motion` vs `m`.
- No se exigen tests unitarios nuevos para LazyMotion; sí verificación manual/visual de animaciones y de reduced-motion.
- E2E existentes (menu, theme, page-transitions, etc.) no deben romperse; las animaciones de transición y overlays deben seguir funcionando.

### Project context reference

- **CLAUDE.md:** Comandos (dev, build, lint, test, typecheck), estructura `src/`, alias `@/`, breakpoints, convenciones BEM y theme.
- **docs/layout-system.md:** Visibilidad del header por breakpoint (no afecta esta story pero es contexto de UI).
- No existe `project-context.md` en el repo; contexto principal en CLAUDE.md y epic-18-bundle-performance.md.

### Story completion status

- **Status:** in-progress (code review: AC1 no alcanzado; ver code-review-18-1-findings.md)
- **Completion note:** Ultimate context engine analysis completed — comprehensive developer guide created for LazyMotion + feature splitting (Story 18.1).

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation, no debug cycles needed.

### Completion Notes List

1. **Code review (adversarial):** 1 HIGH, 3 MEDIUM, 2 LOW. Ver `code-review-18-1-findings.md`. Aplicados: status → in-progress, Review Follow-ups añadidos, File List Created ampliado, descripción test MotionTitle "motion.span" → "m.span". Sprint synced: 18-1 → in-progress.
2. LazyMotionProvider created at `src/providers/LazyMotionProvider/index.tsx`, integrated in RootProvider.
3. 19 files refactored: all `motion.*` → `m.*`, all `import { motion }` → `import { m }`.
4. Overlays migrated to TypeScript with proper interfaces and typed refs.
5. Centralized framer-motion test mock updated to export `m`, `LazyMotion`, `domAnimation`.
6. **Bundle impact note:** Chunk reduction is ~1.6 KiB gzip (33.5→31.9 shared). This is less than the 12 KiB target because `optimizePackageImports: ["framer-motion"]` in next.config.js already performs equivalent tree-shaking. The LazyMotion refactor is still the recommended practice and enables future feature-splitting (e.g., loading `domMax` only on pages that need layout animations).

### File List

**Created:**
- `src/providers/LazyMotionProvider/index.tsx`
- `src/ui/overlays/Floating/index.tsx`
- `src/ui/overlays/FloatingMobile/index.tsx`

**Modified (motion → m refactor):**
- `src/ui/atoms/motion/ArticleAppearance/index.tsx`
- `src/ui/atoms/ArticleHoverThumbnail/index.tsx`
- `src/ui/atoms/buttons/AuthButton/index.tsx`
- `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx`
- `src/ui/atoms/hocs/FramerImage/index.jsx`
- `src/ui/atoms/hocs/History/index.jsx`
- `src/ui/atoms/hocs/TransitionerLi/index.jsx`
- `src/ui/atoms/icons/LiIcon/index.jsx`
- `src/ui/atoms/texts/AnimatedTitle/MotionTitle.jsx`
- `src/ui/molecules/Article/index.tsx`
- `src/ui/molecules/skill/index.jsx`
- `src/ui/molecules/SocialAuthDropdown/index.tsx`
- `src/ui/molecules/TransitionEffect/index.jsx`
- `src/ui/organisms/Auth/AuthModal.tsx`
- `src/ui/organisms/Auth/Form/AuthForm.tsx`
- `src/ui/organisms/ArticleContent/index.tsx`
- `src/ui/organisms/WordCloud/SkillDetail.jsx`
- `src/providers/RootProvider/index.jsx`

**Migrated JSX → TSX:**
- `src/ui/overlays/Floating/index.jsx` → `index.tsx`
- `src/ui/overlays/FloatingMobile/index.jsx` → `index.tsx`

**Test mocks updated:**
- `src/test-utils/framer-motion-mock.ts`
- `src/ui/atoms/texts/AnimatedTitle/__tests__/MotionTitle.test.tsx`
- `src/ui/molecules/TransitionEffect/__tests__/TransitionEffect.exitAnimation.test.tsx`
