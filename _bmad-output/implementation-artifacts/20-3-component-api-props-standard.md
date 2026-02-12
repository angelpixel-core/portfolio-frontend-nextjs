# Story 20.3: Component API & Props Standard

Status: review

## Story

As a **developer working on the portfolio frontend**,
I want **a canonical component API and props standard guide defining how to type, name, and structure component props**,
so that **all new components follow consistent patterns for props interfaces, event handlers, state management, and motion conventions**.

## Acceptance Criteria

1. Props interface template with annotated example showing all conventions
2. Naming rules table with valid/invalid examples for each category (boolean, event handler, render prop, children, className)
3. 3 example components: atom (props < 5), molecule (props 5-10), organism (props > 10 with `.types.ts`)
4. Event handler pattern guide with type-safe callback signatures
5. Stateful vs stateless decision guide with criteria for each pattern
6. framer-motion usage rules (`m.*` convention, `AnimatePresence`, `useReducedMotion`)
7. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [x] Task 1: Create `docs/architecture/component-api.md` (AC: #1-6)
  - [x] Section 1: Props Interface Standard (AC: #1)
    - Rule: Always use `interface`, never `type` alias for component props
    - Rule: Name as `ComponentNameProps` (PascalCase component + "Props")
    - Rule: Inline if < 10 properties; separate `ComponentName.types.ts` if >= 10 or shared
    - Rule: Use `export interface` when shared across files, plain `interface` when local
    - Annotated template with JSDoc comments, optional/required markers
    - Import pattern: `import type { ComponentProps } from "./Component.types"`
  - [x] Section 2: Props Naming Conventions (AC: #2)
    - Boolean props: `is*`, `has*`, `should*`, `can*` prefixes — valid/invalid table
    - Event handlers: `on*` prefix for prop names (never `handle*` in interface)
    - Children: `children: ReactNode` for content projection
    - className: `className?: string` with default `""` in destructuring
    - Render slots: `render*` prefix for component injection
    - Discriminated unions: `mode`, `variant`, `type` for multi-shape components
    - Underscore prefix `_` on callback params (existing convention for unused)
  - [x] Section 3: Default Values & Optional Props (AC: #1, #2)
    - Pattern: destructuring defaults only (no `defaultProps`)
    - Rule: Required by default; `?` only for genuinely optional behavior
    - Common defaults: `className = ""`, numeric timeouts, boolean flags
    - Optional callback guard: `onChange?.(value)` pattern
  - [x] Section 4: Event Handler Pattern Guide (AC: #4)
    - Type-safe signatures: `ChangeEvent<HTMLInputElement>`, `MouseEvent<HTMLAnchorElement>`
    - Callback prop typing: `(_tech: string) => void` with `_` prefix
    - Internal vs external naming: `onClick` (prop) → `handleClick` (internal)
    - Promise callbacks: `onSubmit?: () => Promise<boolean>`
    - Multi-param callbacks: `onToggle: (_id: string, _isPressed: boolean) => void`
  - [x] Section 5: Component Examples (AC: #3)
    - Example 1: Atom with < 5 props (inline interface, destructuring defaults)
    - Example 2: Molecule with 5-10 props (inline interface, optional callbacks)
    - Example 3: Organism with > 10 props (separate `.types.ts`, variant pattern)
  - [x] Section 6: Stateful vs Stateless Decision Guide (AC: #5)
    - Stateless: Pure render, no hooks, props → JSX
    - Stateful local: `useState` for UI-only state (expanded, hovered, mounted)
    - Stateful Redux: Cross-component UI state (menuPanel, themeMode, chatPanel)
    - Stateful React Query: Server data (domains/queries hooks)
    - Decision tree: where does this state belong?
    - Error boundaries: only class component pattern (SectionErrorBoundary)
  - [x] Section 7: Framer Motion Convention (AC: #6)
    - Rule: Use `m.*` not `motion.*` (LazyMotion refactor, Story 18.1)
    - Import: `import { m, AnimatePresence } from "framer-motion"`
    - Provider: `LazyMotionProvider` wraps app with `domAnimation` features
    - `useReducedMotion()` for WCAG 2.2 compliance
    - Variant pattern: define variants as objects, reference by name
    - AnimatePresence: required for exit animations, mode="wait" for transitions
  - [x] Section 8: Utility Types in Props (AC: #1)
    - `Pick<DomainType, "field1" | "field2">` for domain model subsets
    - `Omit<LibraryProps, "overriddenProp">` for extending library components
    - `ComponentProps<typeof Component>` for extracting from HTML/React elements
    - `ReactNode` for children, `ReactElement` for strict JSX
  - [x] Section 9: Anti-patterns & Historical Exceptions (AC: #2)
    - Anti-pattern: `type` alias for props (use `interface`)
    - Anti-pattern: `defaultProps` (use destructuring defaults)
    - Anti-pattern: `forwardRef` (not used in codebase)
    - Anti-pattern: Prop spreading `{...rest}` without type constraint
    - Exception: MainContainer/TransitionerLi (JSX, uses rest spread — legacy)
    - Exception: SkillSelectorButton (direct DOM manipulation — documented debt)
- [x] Task 2: Update `CLAUDE.md` (AC: #7)
  - [x] Add `docs/architecture/component-api.md` to Key Files Reference section
- [x] Task 3: Verify document quality (AC: #1-7)
  - [x] `npm run lint` — no regressions
  - [x] `npm run typecheck` — no regressions
  - [x] `npm test` — all tests pass (no code changes, but verify)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de código fuente, solo `docs/architecture/component-api.md` + update a `CLAUDE.md`.

### Datos del Codebase (auditoría exhaustiva)

#### Props Interface Statistics

| Métrica | Valor |
|---------|-------|
| Total UI components | ~207 |
| Components with explicit Props definitions | 47 |
| Separate `.types.ts` files | 5 (2.4%) |
| Inline Props definitions | 42+ (97.6%) |
| Using `interface` | Majority |
| Using `type` alias | Minority (Experience, Education use `Pick<>` / direct alias) |
| ForwardRef usage | 0 |
| defaultProps usage | 0 |
| "use client" components | ~47 |
| Server components (no directive) | ~160 |

#### Separate `.types.ts` Files (5 existentes)

| Componente | Archivo | Props Count |
|------------|---------|-------------|
| ArticleHoverThumbnail | `src/ui/atoms/ArticleHoverThumbnail/ArticleHoverThumbnail.types.ts` | 2 interfaces (MousePosition + Props) |
| ArticleAppearance | `src/ui/atoms/motion/ArticleAppearance/ArticleAppearance.types.ts` | 1 interface, 5 props |
| ArticleListItem | `src/ui/molecules/ArticleListItem/ArticleListItem.types.ts` | 1 interface with callback |
| ArticleCard | `src/ui/organisms/ArticleCard/ArticleCard.types.ts` | 4 interfaces (Props + Meta + Link + Variant) |
| ProjectCard | `src/ui/organisms/ProjectCard/ProjectCard.types.ts` | 4 interfaces (Props + TechStack + Actions + Variant) |

#### Props Naming Patterns (datos reales)

| Categoría | Prefijo | Ejemplos reales |
|-----------|---------|-----------------|
| Boolean state | `is*` | `isOpen`, `isActive`, `isPressed`, `isCopied`, `isLoading`, `isExpanded`, `isTransitioning`, `isTouched`, `isAuthenticated` |
| Boolean state | `has*` | `hasError`, `hasWorkDetails`, `hasDetails` |
| Boolean state | `should*` | `shouldReduceMotion` |
| Boolean state | `can*` | `canAnimate` |
| Boolean state | `show*` | `showControls`, `showInitials` |
| Event handler (prop) | `on*` | `onClick`, `onChange`, `onSubmit`, `onHoverChange`, `onToggle`, `onClearAll`, `onProgressUpdate`, `onLogout`, `onClose`, `onFocus` |
| Event handler (internal) | `handle*` | `handleClick`, `handleToggle`, `handleChange`, `handleSubmit`, `handleMouseEnter`, `handleClose`, `handleClickOutside` |
| Children | `children` | `ReactNode` en Floating, LazyMotionProvider, TransitionLink, ArticleAppearance, ErrorBoundary |
| className | `className?` | Con default `""` en NavigationItemButton, NeumorphicToggle, HireMeButton, etc. |

**Consistencia**: Convención `on*` (prop) → `handle*` (internal) seguida ~90%. Excepciones: algunos componentes usan `on*` internamente.

#### Event Handler Callback Signatures (datos reales)

| Patrón | Ejemplo | Componente |
|--------|---------|------------|
| Simple callback | `onToggle: (_tech: string) => void` | TechnologyFilter |
| Multi-param | `onToggle: (_id: string, _isPressed: boolean) => void` | NeumorphicToggle |
| Promise return | `onSubmit?: () => Promise<boolean>` | Chat/Submit |
| Optional callback | `onChange?: (_selected: string[]) => void` | JobTypeBox |
| Event object | `onChange: (_event: ChangeEvent<HTMLInputElement>) => void` | EmailInput |
| Mouse event | `onClick?: (_e: MouseEvent<HTMLAnchorElement>) => void` | TransitionLink |
| Hover callback | `onHoverChange?: (isHovered: boolean, mousePosition: MousePosition \| null) => void` | ArticleListItem |

**Nota**: Los parámetros de callbacks usan prefijo `_` (underscore) como convención existente del codebase.

#### Default Values Patterns (datos reales)

| Componente | Prop | Default |
|------------|------|---------|
| ArrowButton | `target` | `"_blank"` |
| NavigationItemButton | `className` | `""` |
| NeumorphicToggle | `className` | `""` |
| HireMeButton | `className` | `""` |
| FeaturedArticlesCarousel | `interval` | `AUTO_ADVANCE_MS (5000)` |
| Floating | `title` | `"Dialog"` |
| Chat/MessageBox | `limit` | `4500` |
| Chat/Submit | `simulateDelay` | `2500` |
| Chat/EmailInput | `isLoading` | `false` |
| ArticleAppearance | `delay` | Implicit optional |

**Patrón universal**: Destructuring defaults. Cero usos de `defaultProps`.

#### Utility Types Usage (datos reales)

| Utility Type | Ejemplo | Componente |
|--------------|---------|------------|
| `Pick<>` | `Pick<JobExperience, "id" \| "position" \| "company" \| ...>` | Experience |
| `Omit<>` | `Omit<LinkProps, "onClick">` | TransitionLink |
| `ComponentProps<>` | `ComponentProps<typeof Link>` | TransitionLink (derivado) |
| Direct alias | `type EducationProps = Academic` | Education |

#### Framer Motion Usage (datos reales)

| Patrón | Archivos | Estado |
|--------|----------|--------|
| `import { m } from "framer-motion"` | 13 componentes | ACTIVO (patrón correcto) |
| `import { motion } from "framer-motion"` | 0 componentes | ELIMINADO |
| `import { AnimatePresence } from "framer-motion"` | 6+ componentes | ACTIVO |
| `import { useReducedMotion } from "framer-motion"` | 1+ componentes | ACTIVO (a11y) |
| `LazyMotionProvider` (domAnimation) | 1 (provider) | ACTIVO |

**Componentes con `m.*`**: Article, SocialAuthDropdown, AuthButton, AuthDropdown, ArticleHoverThumbnail, ArticleAppearance, FloatingMobile, Floating, ChatOverlay, AuthForm, AuthModal, ArticleContent.

#### Stateful vs Stateless Distribution

| Patrón | Componentes | Ejemplo |
|--------|-------------|---------|
| Stateless (pure render) | ~160 | ArrowButton, NavigationItemButton, ArticleCard dispatcher |
| Stateful local (`useState`) | ~30 | Experience (`isExpanded`), ThemeButton (`mounted`), FeaturedArticlesCarousel (`currentIndex`) |
| Stateful Redux | ~10 | MenuButton (`useMenuPanel`), ChatButton (`useChatPanel`), AuthButton (`useAuthPanel`) |
| Stateful React Query | ~12 | Page components via domain query hooks |
| Class component | 1 | SectionErrorBoundary (error boundaries require class) |

#### Variant / Dispatch Pattern (datos reales)

```typescript
// ArticleCard/index.tsx — routes to variant based on article.featured
export function ArticleCard({ article, className }: ArticleCardProps) {
  if (article.featured) {
    return <FeaturedArticleCard article={article} className={className} />;
  }
  return <GridArticleCard article={article} className={className} />;
}

// ProjectCard follows identical pattern with view="grid" | "list"
```

#### Historical Exceptions (documentar, no corregir)

| Item | Ubicación | Problema |
|------|-----------|----------|
| MainContainer | `src/ui/atoms/hocs/MainContainer/index.jsx` | JSX con rest spread `{...rest}`, sin TypeScript |
| TransitionerLi | `src/ui/atoms/hocs/TransitionerLi/index.jsx` | JSX sin tipos, minimal props |
| SkillSelectorButton | `src/ui/atoms/buttons/SkillSelectorButton/index.tsx` | Manipulación DOM directa en lugar de React state |
| Experience | `src/ui/molecules/Experience/index.tsx` | Usa `type` alias con `Pick<>` en vez de `interface` |
| Education | `src/ui/molecules/Education/index.tsx` | Usa `type` alias directo: `type EducationProps = Academic` |

### Scope Boundaries — Qué NO Hacer

| NO hacer | Razón |
|----------|-------|
| Refactorizar componentes existentes | Solo documentar estándar, migración es epic futuro |
| Migrar JSX a TSX | Solo documentar la regla de nuevos archivos |
| Agregar forwardRef | No se usa en el codebase, documentar como anti-patrón |
| Crear PropTypes | TypeScript interfaces son suficientes |
| Tocar `src/` | Epic 20 es docs-only |

### Previous Story Intelligence (Story 20.2)

- Story 20.2 creó `docs/architecture/styles-architecture.md` exitosamente
- Code review encontró 6 issues (0 HIGH, 4 MEDIUM, 2 LOW) — todos corregidos
- Key learning: verificar datos contra codebase real (ParagraphText breakpoints, Footer selectors)
- Key learning: separar modificadores similares (--loading vs --sending) con ejemplos reales de cada uno
- Pattern: documentar excepciones históricas explícitamente con ⚠️ markers
- Pattern: incluir cross-references a otros documentos del epic
- Misplacements se documentan pero NO se corrigen (corrección es epic futuro)
- **Verificación triple**: Todo dato citado en el documento debe ser verificable contra codebase real

### Documentación Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------|
| `docs/architecture/folder-structure.md` | Component folder contents, `.types.ts` placement (Story 20.1) |
| `docs/architecture/styles-architecture.md` | BEM naming, style placement rules (Story 20.2) |
| `CLAUDE.md` | State Management Split, Domain Layer Pattern, framer-motion notes |
| `tailwind.config.js` | Theme configuration |
| `src/providers/LazyMotionProvider/index.tsx` | LazyMotion setup |
| `src/test-utils/framer-motion-mock.ts` | Test mock for `m` and `motion` |

### References

- [Source: _bmad-output/implementation-artifacts/epic-20-component-style-architecture.md#Story 20.3]
- [Source: docs/architecture/folder-structure.md — component folder contents, .types.ts placement]
- [Source: docs/architecture/styles-architecture.md — BEM naming, style patterns]
- [Source: CLAUDE.md — State Management Split, framer-motion notes]
- [Source: src/providers/LazyMotionProvider/index.tsx — LazyMotion setup]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — documentation-only story, no debugging needed.

### Completion Notes List

- All 9 sections written covering Props Interface Standard (interface rule, naming, placement, export, annotated template), Props Naming Conventions (valid/invalid table, boolean prefixes, on*/handle* convention, children, className, discriminated unions, underscore prefix), Default Values & Optional Props (destructuring defaults, required-by-default rule, common defaults, optional callback guard), Event Handler Pattern Guide (6 type-safe signatures from real components, internal vs external naming, Promise callbacks, event object typing, extending library handlers), 3 Component Examples (ArrowButton atom, NeumorphicToggle molecule, ArticleCard organism with .types.ts), Stateful vs Stateless Decision Guide (decision tree with 5 patterns, Redux/Query/Error Boundary), Framer Motion Convention (m.* rule, LazyMotion, reduced motion, AnimatePresence, test mocking), Utility Types (Pick, Omit, ComponentProps, ReactNode vs ReactElement), Anti-patterns & Historical Exceptions (7 anti-patterns, 5 documented exceptions)
- Data sourced from exhaustive codebase audit: ~207 UI components, 47 with Props definitions, 5 .types.ts files, 13 m.* components
- All code examples verified against real source files (ArrowButton, NeumorphicToggle, Experience, ArticleCard, ProjectCard, TransitionLink, Floating, Submit, FeaturedArticlesCarousel, LazyMotionProvider, ArticleAppearance)
- Codebase Metrics Appendix and Cross-references sections added for completeness
- Lint, typecheck, 983 tests — all passing, 0 regressions

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `docs/architecture/component-api.md` | CREAR | done |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | done |
