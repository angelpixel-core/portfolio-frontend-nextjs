# Epic 25 — Architectural Coherence Sprint

> Status: IN PROGRESS
> Phase: Growth (Post-MVP)
> Type: CSS NORMALIZATION + CONVENTION ALIGNMENT
> Depends on: Epic 24 (Spatial System), Architectural Audit 2026-02-17
> Audit ref: `_bmad-output/implementation-artifacts/architectural-audit-2026-02-17.md`

---

## Objective

Align internal CSS conventions and eliminate structural inconsistencies identified in the architectural audit. Zero design changes — only convention normalization.

---

## Scope (Strictly Limited)

1. BEM normalization (`_` → `__`)
2. Breakpoint tokenization (remove raw 560/720/768/880/1024)
3. Dark mode unification (`.dark` class only)
4. Fix undefined CSS variables (`--dark`, `--light`, `--primary`)
5. Social token deduplication
6. Z-index system documentation

## Explicit Exclusions

- Component refactoring (no SRP decomposition)
- New features or design behavior changes
- WordCloud (any file under `src/ui/organisms/WordCloud/`)
- Testing architecture changes
- Domain layer fixes (Epic 26 candidate)
- ErrorBoundary coverage (Epic 26 candidate)

---

## Metrics de Referencia (Pre-Epic 25)

| Métrica | Valor |
|---------|-------|
| BEM violations (`_` vs `__`) | 332 clases en 45 archivos |
| Raw breakpoints sin tokenizar | 124 instancias en ~55 archivos (excl. WordCloud) |
| Dark mode mecanismos incorrectos | 3 archivos, 16 reglas CSS |
| CSS variables indefinidas | 26 usos en 3 archivos |
| Social tokens duplicados/orphans | 11 old-style, 3 sin consumers |
| Z-index conflictos documentados | 1 (HireMe z-30 vs Floating z-30) |
| Tests passing | 1110 (105 suites) |
| E2E passing | 223 passed, 30 skipped |

---

## Technical Risk Assessment: MEDIO-ALTO

**Riesgos principales:**

1. **BEM rename masivo (332 clases)** — Un error de find-replace puede romper className references. Mitigación: script automatizado + test suite completo post-rename.

2. **Breakpoint tokenization** — Cambiar 124 media queries puede alterar responsive behavior si el token elegido difiere del valor original. Mitigación: mapeo explícito de cada valor → token en ADR.

3. **Cross-cutting visual regression** — Cambios en tantos archivos CSS pueden producir regresiones visuales sutiles. Mitigación: dev server visual check mandatorio por story.

**Riesgos mitigados:**
- Dark mode (3 archivos, 16 reglas) — scope mínimo
- CSS vars (3 archivos, 26 usos) — fix aditivo (agregar definiciones)
- Social tokens (7 archivos) — scope contenido
- Z-index (documentación only) — zero code risk

---

## Stories

### Story 25.0 — ADR: CSS Convention Decisions

**Complejidad:** S (Small, <1h)
**Riesgo:** Ninguno (documentación)

**Scope:**
1. ADR-011: Breakpoint tokenization strategy
   - Decision: which new tokens to add to `tailwind.config.js`
   - Mapping table: raw value → token name
   - Proposed tokens: `compact: 560px`, `medium: 720px`, `content: 768px`, `navContent: 880px`
   - Decision: `1024px` → use existing `desktop: 1025px` (accept 1px shift)
2. ADR-012: BEM enforcement strategy
   - Convention: `block__element--modifier` (double underscore mandatory)
   - Rename approach: batch by component layer
   - No ESLint stylelint rule for now (manual enforcement, future candidate)
3. Z-index scale documentation draft in `docs/architecture/z-index-scale.md`

**Acceptance Criteria:**
- [ ] ADR-011 written and committed
- [ ] ADR-012 written and committed
- [ ] Z-index scale documented
- [ ] New breakpoint token names approved

**Why Story 0:** Project pattern — ADRs before any code (validated in Epic 24).

---

### Story 25.1 — Fix Undefined CSS Variables

**Complejidad:** S (Small, <1h)
**Riesgo:** Bajo
**Archivos:** 4 (1 definition + 3 consumers)

**Scope:**
Define CSS custom properties in `:root` (globals.css) to match Tailwind theme colors:

```css
:root {
  --dark: #1b1b1b;
  --light: #f5f5f5;
  --primary: #B63E96;
  --primaryDark: #58E6D9;
}
```

**Files affected:**
| File | Instances | Action |
|------|-----------|--------|
| `src/styles/globals.css` | 0 (add) | Add `:root` definitions |
| `src/ui/organisms/ArticleContent/styles.css` | 19 | No change needed (vars now resolve) |
| `src/ui/molecules/SocialShareButtons/styles.css` | 6 | No change needed |
| `src/ui/molecules/CopyEmail/styles.css` | 1 | No change needed |

**Acceptance Criteria:**
- [ ] CSS variables defined in `:root`
- [ ] ArticleContent renders correctly with theme colors (visual check)
- [ ] SocialShareButtons renders correctly (visual check)
- [ ] CopyEmail focus outline visible (visual check)
- [ ] All 1110 tests pass
- [ ] `npm run build` succeeds

**Why first:** Aditivo (solo agrega definiciones), zero riesgo de regresión, desbloquea valor visual inmediato.

---

### Story 25.2 — Dark Mode Unification

**Complejidad:** S (Small, <1h)
**Riesgo:** Bajo
**Archivos:** 3

**Scope:**
Migrate 3 files from incorrect dark mode mechanisms to `.dark` class pattern:

| File | Current Mechanism | Rules | Migration |
|------|-------------------|-------|-----------|
| `src/ui/molecules/CustomersSlider/styles.css` | `[data-theme="dark"]` | 2 | → `.dark .class` |
| `src/styles/globals.css` | `@media (prefers-color-scheme: dark)` | 5 | → `.dark .class` |
| `src/app/coming-soon/styles.css` | `@media (prefers-color-scheme: dark)` | 9 | → `.dark .class` |

**Explicitly excluded:** WordCloud `:root.dark` pattern (line 49).

**Acceptance Criteria:**
- [ ] Zero `[data-theme="dark"]` selectors in codebase (excl. WordCloud)
- [ ] Zero `prefers-color-scheme: dark` in codebase (excl. WordCloud)
- [ ] Theme toggle works correctly for CustomersSlider logos
- [ ] Skip-link and focus-ring respect theme toggle
- [ ] Coming-soon page respects theme toggle
- [ ] All tests pass

---

### Story 25.3 — Social Token Deduplication

**Complejidad:** S-M (Small-Medium, 1-2h)
**Riesgo:** Bajo
**Archivos:** ~10 (1 config + 7 CSS + 2 component refs)

**Scope:**

**Phase 1: Remove orphaned tokens** (0 consumers)
- `primaryGooglePlus` — defunct social network, zero references
- `primaryTelegram` — zero references
- `primaryDarkTelegram` — zero references

**Phase 2: Extend brand.* namespace**
Add to `tailwind.config.js` under `brand`:
```javascript
brand: {
  linkedin: "#0A66C2",
  github: "#24292f",
  githubLight: "#f0f6fc",  // NEW
  twitter: "#1DA1F2",
  dribbble: "#EA4C89",
  whatsapp: "#075E54",     // NEW (from primaryWhatsApp)
  whatsappDark: "#3A8F87", // NEW (from primaryDarkWhatsApp)
  calendar: "#676b74",     // NEW (from primaryCalendar)
  calendarDark: "#006bff", // NEW (from primaryDarkCalendar)
  telegram: "#0889CC",     // NEW (from primaryDarkTelegram value)
}
```

**Phase 3: Migrate consumers**
| File | Old Token | New Token |
|------|-----------|-----------|
| `CalendarIcon/styles.css` | `primaryDarkCalendar` / `primaryCalendar` | `brand-calendarDark` / `brand-calendar` |
| `WhatsAppLink/styles.css` | `primaryWhatsApp` / `primaryDarkWhatsApp` | `brand-whatsapp` / `brand-whatsappDark` |
| `WhatsApp/styles.css` | `primaryWhatsApp` / `primaryDarkWhatsApp` | `brand-whatsapp` / `brand-whatsappDark` |
| `NavBar/styles.css` | hardcoded `#f0f6fc` | `fill-brand-githubLight` |
| `Menu/styles.css` | hardcoded `#f0f6fc` | `fill-brand-githubLight` |
| `MenuFloating/styles.css` | hardcoded `#f0f6fc` | `fill-brand-githubLight` |

**Phase 4: Remove old flat tokens**
Remove from `tailwind.config.js`: `primaryWhatsApp`, `primaryDarkWhatsApp`, `primaryCalendar`, `primaryDarkCalendar`, `primaryGitHub`, `primaryDarkGitHub`, `primaryLinkedIn`, `primaryDarkLinkedIn`.

**Acceptance Criteria:**
- [ ] Zero flat `primary*` social tokens in `tailwind.config.js`
- [ ] All social colors use `brand.*` namespace
- [ ] Zero hardcoded `#f0f6fc` in CSS files
- [ ] Visual check: all social icons render correct colors in light/dark mode
- [ ] All tests pass
- [ ] `npm run build` succeeds

---

### Story 25.4 — Breakpoint Tokenization

**Complejidad:** L (Large, 4-6h)
**Riesgo:** Medio
**Archivos:** ~55 CSS files, ~124 instances (excl. WordCloud)

**Scope:**

**Phase 1: Add new tokens to `tailwind.config.js`**
(Per ADR-011 from Story 25.0)

```javascript
screens: {
  phablet: "400px",
  compact: "560px",    // NEW — progressive typography step
  mobile: "480px",
  tablet: "640px",
  medium: "720px",     // NEW — tablet content expansion
  content: "768px",    // NEW — content layout shifts
  nav: "800px",
  navContent: "880px", // NEW — nav content full display
  stage: "960px",
  desktop: "1025px",
  wide: "1441px",
}
```

**Phase 2: Replace raw values with `@media screen(token)`**

| Raw Value | Token | Instances | Files |
|-----------|-------|-----------|-------|
| `min-width: 560px` | `screen(compact)` | 10 | 9 |
| `min-width: 720px` | `screen(medium)` | 34 | 12* |
| `min-width: 768px` | `screen(content)` | 40 | 7* |
| `min-width: 880px` | `screen(navContent)` | 11 | 6 |
| `min-width: 1024px` | `screen(desktop)` | 29 | 4* |
| **Total** | | **124** | **~55** |

*Counts exclude WordCloud (~33 instances in 720/768/1024).

**Phase 3: Handle edge cases**
- `max-width: 768px` in ArticleContent → `@media not screen(content)`
- `max-width: 1024px` in globals.css (page-container) → keep as raw value (container max, not breakpoint)
- `min-width: 800px` in HireMe → already maps to `screen(nav)`

**Acceptance Criteria:**
- [ ] Zero raw `560px`, `720px`, `768px`, `880px` in `@media` queries (excl. WordCloud)
- [ ] Zero raw `1024px` in `@media` queries (excl. WordCloud, excl. max-width containers)
- [ ] All new tokens defined in `tailwind.config.js`
- [ ] `@media screen(token)` syntax used throughout
- [ ] Visual regression check at each breakpoint: 400, 480, 560, 640, 720, 768, 800, 880, 960, 1025
- [ ] All tests pass
- [ ] E2E tests pass (header visibility matrix is breakpoint-sensitive)

**Risk Mitigation:**
- Execute in sub-batches by breakpoint value (smallest → largest)
- Run `npm run build` after each batch
- Dev server visual spot-check after each batch

---

### Story 25.5 — BEM Normalization

**Complejidad:** XL (Extra-Large, 6-10h)
**Riesgo:** Medio-Alto
**Archivos:** 45 CSS + ~45 TSX/JSX + ~20 test files = ~110 archivos

**Scope:**
Rename 332 CSS class definitions from single underscore `_` to double underscore `__` (BEM element separator), plus all corresponding `className` references in components and test selectors.

**Execution batches (por capa UI):**

| Batch | Layer | Classes | CSS Files | Priority |
|-------|-------|---------|-----------|----------|
| A | `app/` pages | 33 | 4 | 1st |
| B | `atoms/` | 39 | 11 | 2nd |
| C | `molecules/` | 75 | 16 | 3rd |
| D | `organisms/` | 62 | 7 | 4th |
| E | `overlays/` | 4 | 2 | 5th |

**Top 5 files by volume:**
1. `Chat/styles.css` — 39 classes
2. `Experience/styles.css` — 17 classes
3. `Education/styles.css` — 15 classes
4. `NavBar/styles.css` — 15 classes
5. `app/styles.css` — 15 classes

**Per-batch workflow:**
1. Rename CSS classes in batch files
2. Update `className` in corresponding component files
3. Update test selectors if referenced
4. Run `npm test` after each batch
5. Visual spot-check affected components

**Acceptance Criteria:**
- [ ] Zero single-underscore BEM element separators in CSS (excl. WordCloud)
- [ ] All `className` references match renamed CSS classes
- [ ] All 1110+ tests pass after each batch
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] E2E tests pass

**Risk Mitigation:**
- Batch A (pages) is smallest and most isolated — validates the approach
- Adversarial review required (>10 modified files per project rules)
- Script-assisted rename: `grep -rn "old_class" src/` before and after each batch
- Commit per batch (not per file, not all-at-once)

---

### Story 25.6 — Z-index System Documentation

**Complejidad:** S (Small, <1h)
**Riesgo:** Muy bajo
**Archivos:** 1 new doc + 1 optional CSS fix

**Scope:**
Create `docs/architecture/z-index-scale.md` with the complete z-index inventory.

**Z-index Scale:**

| Layer | Range | Purpose | Files |
|-------|-------|---------|-------|
| Background | -10 to -1 | Shadow pseudo-elements, depth layers | BoxShadow, FeaturedBoxShadow, skill |
| Document | 0 | Base layout flow | MainContainer, History, Footer |
| Elevation | 1 | Minimal lift (icons, animations) | LiIcon, app/styles |
| Components | 10 | Navigation bar, images, carousels | NavBar, Auth, MovingImage, Carousel |
| Overlays | 20 | Backdrop layers (chat, floating) | Floating, FloatingMobile, Chat |
| Panels | 30 | Overlay content, HireMe, menu trigger | Floating panel, HireMe, MenuButton |
| Modals | 40-50 | Auth modal, skill detail, dropdowns | Auth, WordCloud, NavBar fixed, AuthButton |
| A11y | 100-9999 | Skip link (always on top) | coming-soon, globals |

**Optional fix:** Document the HireMe z-30 vs Floating panel z-30 overlap as known behavior (both never visible simultaneously — HireMe hides when overlay opens).

**Acceptance Criteria:**
- [ ] `docs/architecture/z-index-scale.md` created
- [ ] Scale covers all z-index values in codebase
- [ ] Conflict analysis documented
- [ ] `docs/index.md` updated with link to new doc

---

## Execution Order

```
25.0 (ADR)     ──→  25.1 (CSS vars)  ──→  25.2 (Dark mode)  ──→  25.3 (Social tokens)
                                                                         │
                                                                         ▼
                                                               25.4 (Breakpoints)
                                                                         │
                                                                         ▼
                                                               25.5 (BEM normalize)
                                                                         │
                                                                         ▼
                                                               25.6 (Z-index docs)
```

**Rationale:**
1. **25.0 first** — Decisions before code (project pattern)
2. **25.1 second** — Aditivo, zero risk, immediate visual fix
3. **25.2 third** — 3 files, small scope, independent
4. **25.3 fourth** — Token cleanup before breakpoint work (both touch `tailwind.config.js`)
5. **25.4 fifth** — Large but contained to CSS `@media` queries
6. **25.5 sixth** — Largest, highest risk, benefits from all prior stories being stable
7. **25.6 last** — Documentation, no code risk, closes the epic

**Gate entre stories:** `npm test` + `npm run build` + visual spot-check

---

## Complexity Summary

| Story | Title | Complexity | Files | Risk |
|-------|-------|------------|-------|------|
| 25.0 | ADR: CSS Convention Decisions | S | 3 docs | None |
| 25.1 | Fix Undefined CSS Variables | S | 4 | Low |
| 25.2 | Dark Mode Unification | S | 3 | Low |
| 25.3 | Social Token Deduplication | S-M | ~10 | Low |
| 25.4 | Breakpoint Tokenization | L | ~55 | Medium |
| 25.5 | BEM Normalization | XL | ~110 | Medium-High |
| 25.6 | Z-index Documentation | S | 2 docs | Very Low |
| **Total** | | **~20-24h** | | **Medium** |

---

## Success Criteria (Epic-level)

1. Zero raw breakpoint values (560/720/768/880/1024) in `@media` queries outside WordCloud
2. Zero single-underscore BEM element separators outside WordCloud
3. Single dark mode mechanism (`.dark` class) across entire codebase outside WordCloud
4. All CSS custom properties (`var(--dark/light/primary)`) resolve to defined values
5. Single social color token namespace (`brand.*`)
6. Z-index scale documented
7. All 1110+ tests passing
8. All 223+ E2E tests passing
9. `npm run build` succeeds
10. Zero visual regressions confirmed via dev server

---

*Epic defined from Architectural Audit 2026-02-17 (366 findings). This epic addresses Audit Group E (CSS Normalization) with targeted picks from Group A (broken CSS).*
