# Test Architecture Report

> Generated: 2026-02-11
> Phase: Architectural Consolidation (pre-production)
> Status: AUDIT COMPLETE

## Executive Summary

- **Total Unit Tests (src/):** 96 test files
- **Total E2E Tests (e2e/):** 21 test files
- **Test Framework:** Jest (unit) + Playwright (E2E)
- **Test Organization:** `__tests__/` directories co-located with components; `e2e/` directory for browser tests
- **Configuration:** `jest.config.cjs` (CommonJS), `jest.setup.js` (Next.js mocks)

## Distribution Summary

| Type | Files | Framework |
|------|-------|-----------|
| Unit/Integration | 96 | Jest + React Testing Library |
| E2E | 21 | Playwright (Chromium only) |
| **Total** | **117** | -- |

---

## 1. Unit Test Files by Category

### A. Domain Layer Tests (31 files)

| Domain | Schema Tests | Model/Query Tests | Coverage |
|--------|--------------|-------------------|----------|
| **article** | `schema.test.ts` | `model.test.ts`, `validate-data.test.ts`, `filtering.test.ts`, `useArticles.test.tsx`, `useArticleBySlug.test.tsx` | **GOOD** -- 5 test files |
| **project** | `schema.test.ts` | `project.model.test.ts`, `validate-data.test.ts`, `utils.test.ts`, `useProject.test.tsx`, `useProjects.test.tsx` | **GOOD** -- 6 test files |
| **academic** | `schema.test.ts` | `useAcademics.test.ts` | **GOOD** -- 2 test files |
| **job-experience** | `schema.test.ts` | `useJobExperiences.test.tsx` | **PARTIAL** -- 2 test files (schema OK, queries basic) |
| **profile** | `schema.test.ts` | `useProfile.test.tsx` | **PARTIAL** -- 2 test files |
| **technology** | `schema.test.ts` | *MISSING model/query tests* | **MISSING** -- Only schema (1 file) |
| **contact-point** | `schema.test.ts` | *MISSING model/query tests* | **MISSING** -- Only schema (1 file) |

**Key Pattern:** All domains have Zod schema validation tests. Query hooks tested with React Query + Redux mocks.

### B. UI Component Tests (53 files)

#### Atoms (14 files)

| Component | Test Files | Type | Coverage |
|-----------|-----------|------|----------|
| AuthButton | `AuthButton.test.tsx`, `AuthDropdown.test.tsx` | Unit + Integration | GOOD |
| CopyButton | `CopyButton.test.tsx` | Unit | GOOD |
| ThemeButton | `ThemeButton.test.tsx` | Unit (Redux integration) | GOOD |
| SkillSelectorButton | `SkillSelectorButton.test.tsx` | Unit | GOOD |
| ChatButton | `ChatButton.test.tsx` | Unit | GOOD |
| TransitionLink | `TransitionLink.test.tsx` | Unit (Router mock) | GOOD |
| ArticleAppearance | `ArticleAppearance.test.tsx` | Unit (Framer Motion mock) | GOOD |
| MotionTitle | `MotionTitle.test.tsx` | Unit (Animation) | GOOD |
| ArticleHoverThumbnail | `ArticleHoverThumbnail.test.tsx` | Unit | GOOD |
| IconButtonsAriaLabel | `IconButtonsAriaLabel.test.tsx` | Accessibility | GOOD |

#### Molecules (13 files)

| Component | Test Files | Type | Coverage |
|-----------|-----------|------|----------|
| Experience | `Experience.test.tsx` | Unit | GOOD |
| Education | `Education.test.tsx` | Unit | GOOD |
| Calendar | `Calendar.test.tsx` | Unit | GOOD |
| CopyEmail | `CopyEmail.test.tsx`, `EmailLink.test.tsx`, `skeleton.test.tsx` | Unit + Skeleton | GOOD |
| SocialNetworkLink | `SocialNetworkLink.test.tsx`, `Icon.test.tsx` | Unit | GOOD |
| SocialShareButtons | `SocialShareButtons.test.tsx` | Unit | GOOD |
| ArticleListItem | `ArticleListItem.test.tsx` | Unit | GOOD |
| Article | `Article.test.tsx` | Unit | GOOD |
| TechnologyFilter | `TechnologyFilter.test.tsx` | Unit | GOOD |
| WhatsApp | `WhatsApp.test.tsx` | Unit | GOOD |
| TransitionEffect | `TransitionEffect.reducedMotion.test.tsx`, `TransitionEffect.exitAnimation.test.tsx` | Behavioral + Animation | GOOD |

#### Organisms (19 files)

| Component | Test Files | Type | Coverage |
|-----------|-----------|------|----------|
| Menu | `Menu.test.tsx` | Unit | GOOD |
| MenuFloating | `MenuFloatingClient.test.tsx` (with snapshot) | Unit + Snapshot | GOOD |
| ProjectCard | `ProjectCard.test.tsx` (with snapshot) | Unit + Snapshot | GOOD |
| ArticleCard | `ArticleCard.test.tsx` | Unit | GOOD |
| ProjectDetail | `ProjectDetail.test.tsx` | Unit | GOOD |
| Academics | `Academics.test.tsx` | Integration (queries + Redux) | GOOD |
| Experiences | `Experiences.test.tsx` | Integration | GOOD |
| Skills | `Skills.test.tsx` | Unit | GOOD |
| Chat | `Chat.test.tsx` | Unit | GOOD |
| Auth | `AuthForm.test.tsx`, `AuthModal.test.tsx`, `OAuthButtons.test.tsx` | Integration | GOOD |
| ArticleContent | `ArticleContent.test.tsx`, `CodeBlock.test.tsx` | Unit | GOOD |
| Axe (a11y) | `a11y-axe.test.tsx` | Accessibility (jest-axe) | **PARTIAL** -- Mocks heavy |
| Sections (a11y) | `Sections.a11y.test.tsx` | Accessibility | **PARTIAL** |

#### Overlays (2 files)

| Component | Test Files | Type | Coverage |
|-----------|-----------|------|----------|
| Floating | `Floating.a11y.test.tsx` | Accessibility | GOOD |
| FloatingMobile | `FloatingMobile.a11y.test.tsx` | Accessibility | GOOD |

### C. State Management Tests (5 files)

| Slice | Test File | Coverage |
|-------|-----------|----------|
| menuPanel | `menuPanel.slice.test.ts` | GOOD |
| themeMode | `themeMode.slice.test.ts` | GOOD |
| authPanel | `authPanel/slice.test.ts` | GOOD |
| EmailClipboard | `EmailClipboard/slice.test.ts` | GOOD |
| Providers | `AuthProvider.test.tsx`, `TransitionProvider.test.tsx` | GOOD |

### D. Hooks Tests (7 files)

| Hook | Test File | Type | Coverage |
|------|-----------|------|----------|
| useAuth | `useAuth.test.tsx` | Integration (session mock) | GOOD |
| useReducedMotion | `useReducedMotion.test.ts` | Unit (framer-motion mock) | GOOD |
| useTransition | `useTransition.test.tsx` | Integration | GOOD |
| useTouchState | `useTouchState.test.tsx` | Unit (event simulation) | GOOD |
| useScrollAppearance | `useScrollAppearance.test.tsx` | Unit (DOM mock) | GOOD |

### E. Services/Utilities Tests (9 files)

| Service | Test File | Type | Coverage |
|---------|-----------|------|----------|
| Auth | `oauth.test.ts`, `getInitials.test.ts`, `session.test.ts`, `mock.test.ts` | Unit | GOOD |
| SEO | `article-jsonld.test.ts` | Unit (JSON-LD schema) | GOOD |
| Styles | `reduced-motion.test.ts` | CSS/Accessibility | GOOD |
| Lib | `createQueryHook.test.tsx` | Integration (React Query factory) | GOOD |
| TypeScript | `typescript-setup.test.js` | Configuration check | MINIMAL |

---

## 2. E2E Test Files (21 tests) -- Playwright/Chromium

### Critical Flows (Required by CLAUDE.md)

| Flow | Test File | Status | Coverage |
|------|-----------|--------|----------|
| Menu mobile navigation | `menu-autoclose.spec.ts` | IMPLEMENTED | Auto-close on nav, keyboard accessible |
| Desktop navigation | `navigation.spec.ts` | IMPLEMENTED | Navbar links, keyboard navigation |
| Theme persistence | `theme.spec.ts` | IMPLEMENTED | Toggle persists across page reload |
| Page transitions | `page-transitions.spec.ts` | IMPLEMENTED | Curtain animation completes |
| Header visibility | `header-visibility.spec.ts` | IMPLEMENTED | Zones shown/hidden per breakpoint matrix |
| Menu/Social links | `menu-autoclose.spec.ts` | IMPLEMENTED | Open/close correctly |
| Auth modal | `auth.spec.ts` | IMPLEMENTED | Open/close, login/signup/OAuth, dropdown, logout, session persistence, a11y |

### Additional E2E Coverage (17 tests)

| Category | Tests | Purpose |
|----------|-------|---------|
| Page Layout | `home.spec.ts`, `projects-articles.spec.ts`, `about-experiences-education-ux.spec.ts`, `footer-consistency.spec.ts` | Smoke tests for page rendering |
| Header Details | `header-nav-breakpoint.spec.ts`, `header-mobile-layout.spec.ts`, `header-hover-states.spec.ts`, `header-padding.spec.ts`, `header-zones.spec.ts`, `home-hero-blade.spec.ts` | Header component positioning, hover states, responsive layout |
| Accessibility | `accessibility.spec.ts`, `reduced-motion.spec.ts` | a11y compliance, motion preferences |
| Features | `contact.spec.ts` | Contact form functionality |
| Performance | `performance.spec.ts` | Lighthouse/performance metrics |
| Technical | `favicon.spec.ts` | Favicon presence validation |

---

## 3. Coverage Matrix

### Domain Coverage

```
src/domains/
+-- article/           GOOD      (5 files: schema, model, validation, filtering, 2x queries)
+-- project/           GOOD      (6 files: schema, model, validation, utils, 2x queries)
+-- academic/          GOOD      (2 files: schema, query)
+-- job-experience/    PARTIAL   (2 files: schema, query only -- no model utils)
+-- profile/           PARTIAL   (2 files: schema, query only)
+-- technology/        MISSING   (1 file: schema only -- NO model/query tests)
+-- contact-point/     MISSING   (1 file: schema only -- NO model/query tests)
```

### Component Coverage by Layer

```
src/ui/
+-- atoms/
|   +-- buttons/        7 files tested (all major buttons covered)
|   +-- links/          1 file: TransitionLink
|   +-- texts/          1 file: AnimatedTitle
|   +-- motion/         1 file: ArticleAppearance
|   +-- icons/          MISSING (icon barrel issue noted in MEMORY.md)
|
+-- molecules/          13 files tested (all major molecules covered)
|
+-- organisms/          19 files tested
|   +-- Header/         MISSING (unit test; E2E covers in e2e/)
|   +-- Footer/         MISSING (unit test; E2E footer-consistency.spec.ts)
|   +-- NavBar/         MISSING (unit test; navigation.spec.ts covers)
|
+-- overlays/           2 files: Floating, FloatingMobile (a11y)
|
+-- shared/             1 file: ErrorBoundary
```

### State Management Coverage

```
src/state/slices/
+-- menuPanel/          Tested
+-- themeMode/          Tested
+-- authPanel/          Tested
+-- EmailClipboard/     Tested
+-- chatPanel/          MISSING (no test file)
+-- transitionState/    MISSING (no test file)
```

---

## 4. Gaps Prioritized

| Priority | Gap | Recommendation |
|----------|-----|----------------|
| HIGH | `technology` domain: no model/query tests | Add 2 test files |
| HIGH | `contact-point` domain: no model/query tests | Add 2 test files |
| MEDIUM | `chatPanel` slice: no tests | Add slice test |
| MEDIUM | `transitionState` slice: no tests | Add slice test |
| MEDIUM | Header/Footer/NavBar: no unit tests | Add unit tests (E2E covers but slower) |
| LOW | Error path testing sparse | Add negative test cases |
| LOW | No code coverage threshold | Configure Jest `coverageThreshold` |

---

## 5. What MUST Be Tested

- All Zod schemas (data contract validation)
- All Redux slices (state management correctness)
- Auth flows (security-critical)
- Critical E2E flows (7 defined in CLAUDE.md)
- Accessibility (focus management, aria attributes)

## 6. What SHOULD NOT Be Tested

- CSS styling (except reduced-motion behavioral tests)
- Skeleton components (pure visual, no logic)
- Barrel exports/re-exports
- Third-party library internals (framer-motion, React Query)
- Static content rendering (covered by E2E smoke tests)

---

## 7. Proposed Test Strategy Outline

```
1. Unit Tests (Jest)
   - Every domain: schema + model + query hook
   - Every Redux slice
   - Every custom hook
   - Every service function

2. Integration Tests (Jest + RTL)
   - Organisms with state: Auth, Chat, Menu
   - Page-level compositions

3. E2E Tests (Playwright)
   - 7 critical flows (menu, nav, theme, transitions, header, auth, chat)
   - Page smoke tests
   - Responsive breakpoint validation

4. Not Tested
   - Pure presentational atoms (visual only)
   - Skeleton components
   - CSS-only changes
```

---

## 8. Test Patterns Reference

### Domain Testing Pattern
```typescript
// Schema validation
domains/{name}/model/__tests__/schema.test.ts

// Business logic
domains/{name}/model/__tests__/model.test.ts
domains/{name}/model/__tests__/validate-data.test.ts
domains/{name}/model/__tests__/utils.test.ts (if applicable)

// Query hooks
domains/{name}/queries/__tests__/use{Entity}.test.tsx
domains/{name}/queries/__tests__/use{Entity}BySlug.test.tsx (if applicable)
```

### Component Testing Pattern
```typescript
// Co-located test file
src/ui/{layer}/{component}/__tests__/{component}.test.tsx

// Snapshot file (if used)
src/ui/{layer}/{component}/__tests__/__snapshots__/{component}.test.tsx.snap

// Skeleton tests (for loading states)
src/ui/{layer}/{component}/__tests__/skeleton.test.tsx
```

### Mock Patterns
1. **Redux:** Create store per test, wrap component with Provider
2. **Framer Motion:** Use shared mock from `src/test-utils/framer-motion-mock.ts`
3. **Hooks:** Mock at module level with jest.mock()
4. **Accessibility:** Use jest-axe helper from `src/test-utils/axe-helper.ts`

---

## 9. Assessment Summary

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Architecture | 5/5 | Well-organized with atomic design, domain-driven structure |
| Breadth | 4/5 | Good coverage overall; gaps in technology/contact-point domains |
| Depth | 4/5 | Unit tests cover most components; E2E tests cover critical flows |
| Accessibility Testing | 3/5 | jest-axe tests have heavy mocks; E2E a11y tests are good |
| Performance Testing | 2/5 | Only `performance.spec.ts` (E2E Lighthouse); no bundle analysis |
| Error Handling | 2/5 | Limited negative/error path testing |
| Maintainability | 5/5 | Centralized testids, shared mocks, clear naming conventions |
| TypeScript Support | 5/5 | Full TS, type-safe test helpers, tsconfig paths used correctly |

## Recommendations

### Immediate Actions
1. Add model/query tests for `technology` and `contact-point` domains
2. Add unit tests for Header, Footer, NavBar organisms
3. Reduce jest-axe mock heaviness (test real DOM structure in Axe tests)

### Medium-term
4. Add tests for `chatPanel` and `transitionState` Redux slices
5. Add error path tests (failed API calls, validation errors)
6. Add bundle/performance regression tests

### Long-term
7. Consider visual regression testing (Percy, Chromatic)
8. Set up code coverage threshold enforcement
9. Add mutation testing to ensure test quality
