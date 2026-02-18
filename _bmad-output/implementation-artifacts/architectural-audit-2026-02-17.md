# Auditoría Arquitectónica — Portfolio Frontend Next.js

**Fecha:** 2026-02-17
**Tipo:** Enterprise-level, exhaustiva, pre-Epic 25
**Auditor:** Amelia (Dev Agent) + 6 agentes especializados
**Contexto:** Post-Epic 24 (Spatial System & Layout Stabilization)

---

## Resumen Ejecutivo

| Zona de Auditoría | CRITICAL | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|---|
| 1. Naming & Conventions | 0 | 14 | 108 | 15 | 139 |
| 2. CSS Architecture | 0 | 21 | 28 | 35 | 84 |
| 3. Component Architecture | 0 | 13 | 19 | 14 | 46 |
| 4. Testing Architecture | 0 | 14 | 11 | 0 | 25 |
| 5. Docs & Config | 1 | 8 | 17 | 12 | 38 |
| 6. Domain & State | 1 | 3 | 12 | 18 | 34 |
| **TOTALES** | **2** | **73** | **195** | **94** | **366** |

**2 CRITICAL:**
1. Pre-commit hook completamente desactivado (`.husky/pre-commit` comentado al 100%)
2. `contact-point/model/mock.ts:46` — template literal `mailto:${undefined}` siempre truthy, fallback nunca se alcanza

---

## Zona 1: Naming & Conventions (139 hallazgos)

### 1.1 CSS BEM: Underscore simple `_` vs doble `__` (84 clases en 30+ archivos)

**El hallazgo de mayor volumen de la auditoría.** La mitad del codebase usa `block_element` (underscore simple) y la otra mitad usa `block__element` (BEM correcto). Ambos estilos coexisten, incluso dentro del mismo archivo.

**Archivos más afectados:**
- `HireMe/styles.css` — 4 clases (`hire-me_container`, `hire-me_content`, etc.)
- `Education/styles.css` — 12 clases
- `Experience/styles.css` — 12 clases
- `NavBar/styles.css` — 6 clases (`layout_navbar-container`, etc.)
- `Floating/styles.css` + `FloatingMobile/styles.css` — 4 clases
- `Chat/styles.css` — 5 clases
- `Author/styles.css`, `CopyEmail/styles.css`, `SocialNetworkLink/styles.css` — 2-3 clases c/u
- Todas las pages (`about/`, `articles/`, `projects/`) — `layout_hireme-mobile`

**Caso más grave:** `AuthButton/styles.css` mezcla AMBAS convenciones en el mismo archivo:
- `auth_button` (underscore simple)
- `auth-dropdown__header` (BEM correcto)

**Impacto:** Puramente convencional — no afecta funcionalidad. Pero impide buscar patrones consistentemente y confunde a contribuidores nuevos.

**Esfuerzo:** MEDIO — requiere rename coordinado de clases CSS + sus referencias en JSX/TSX. ~80 clases en ~30 archivos.

### 1.2 Carpeta `skill/` en minúsculas (1 instancia)

`src/ui/molecules/skill/` es la ÚNICA carpeta de componente en minúsculas. Todas las demás usan PascalCase.

### 1.3 `EmailClipboard/` en PascalCase (1 instancia)

`src/state/slices/EmailClipboard/` — todos los otros slices usan camelCase (`menuPanel/`, `chatPanel/`, `authPanel/`, `themeMode/`).

### 1.4 Sufijo `Model` inconsistente en tipos Zod (9 de 14 dominios)

9 dominios exportan `ProjectModel`, `ContactPointModel`, `CustomerModel`, etc. Pero 5 dominios exportan `Article`, `Academic`, `JobExperience` SIN el sufijo `Model`. Necesita alineación.

### 1.5 `useTouchState` retorna `handleTouchStart` en vez de `onTouchStart`

Convención React: hooks retornan `on*` (prop naming), implementaciones internas usan `handle*`. El hook público retorna `handleTouchStart` y `handleClick` que se pasan directamente a props JSX.

### 1.6 Otros (menor)
- `src/ui/atoms/ArticleHoverThumbnail/` — atom sin subcategoría (todos los otros están en `buttons/`, `icons/`, `links/`, `texts/`)
- `skeleton.css` en `ImageLink/` — único CSS no nombrado `styles.css`
- Tests de slices `menuPanel` y `themeMode` ubicados en `slices/__tests__/` en vez de en sus propias carpetas
- `MousePosition` tipo duplicado en `ArticleHoverThumbnail.types.ts` y `ArticleListItem.types.ts`
- 6 dominios sin tests de queries (`contact-point`, `content`, `customer`, `navigation-item`, `experience-stat`, `technology`)
- `src/ui/molecules/model/schema.ts` — schema de dominio ubicado en capa UI (tiene `// TODO: Move`)

---

## Zona 2: CSS Architecture (84+ hallazgos)

### 2.1 CRITICAL: CSS Custom Properties rotas — `var(--dark)`, `var(--light)`, `var(--primary)` nunca definidas

**Archivos afectados:**
- `ArticleContent/styles.css` — 23+ usos
- `SocialShareButtons/styles.css` — 6 usos
- `CopyEmail/styles.css` — 1 uso

Estas variables CSS **no están definidas en `:root`** en `globals.css`. Los colores caen a transparente/invisible. Estos componentes tienen **colores rotos silenciosamente**.

### 2.2 Dark mode: 4 mecanismos diferentes, 3 de ellos incorrectos

| Mecanismo | Estado | Archivos |
|---|---|---|
| `:is(.dark ...)` / `.dark .class` / `dark:` | CORRECTO | ~70 archivos |
| `[data-theme="dark"]` | NUNCA DISPARA | `CustomersSlider/styles.css:149,153` |
| `@media (prefers-color-scheme: dark)` | NUNCA RESPONDE al toggle | `globals.css:64-73,86-90`, `coming-soon/styles.css:104-138` |
| `:root.dark` | Funciona pero inconsistente | `WordCloud/styles.css:49` |

**Impacto:** Los estilos dark mode en `CustomersSlider` y `coming-soon` están completamente rotos. El skip-link y `.focus-ring` en `globals.css` no cambian con el toggle de tema.

### 2.3 Bug de unidades faltantes en `skill/styles.css`

```css
.skill:before {
  bottom: 100; left: 100; right: 100; top: 100; /* Faltan unidades (%, px) */
}
```

El pseudo-elemento tiene posicionamiento roto.

### 2.4 `!important` problemáticos (8 usos que deben refactorizarse)

- `articles/styles.css` y `projects/styles.css`: font-size de títulos con `!important` en cada breakpoint — indica conflicto de especificidad con `AnimatedTitle`
- `NavBar/styles.css:155+`: posicionamiento de HireMe con `!important` — acoplamiento tight entre layout y componente
- `articles/styles.css:55-96`: `display: inline/block !important` en `.animated-title_word` — peleando con estilos del componente

**Nota:** 10 usos de `!important` son NECESARIOS (a11y `prefers-reduced-motion`, override de TagCloud.js library).

### 2.5 Duplicación de código CSS (4 patrones principales)

| Patrón | Veces | Archivos |
|---|---|---|
| Glass effect (backdrop-filter + rgba + box-shadow) | 4x | Floating, FloatingMobile, Auth, Chat |
| Progressive title scaling (9 breakpoints, `2rem→3.75rem`) | 4x | Experiences, Academics, about, AnimatedTitle |
| Logo gradient `@keyframes` | 2x | Logo, LogoMenuTrigger |
| Skeleton pulse animation | 5x | ImageLink, ParagraphText, AnimatedTitle, CalendarLink |

**El glass effect se inlineó intencionalmente** por incompatibilidad `@apply` + `@layer utilities` en dev mode. La duplicación fue un side-effect conocido.

### 2.6 Breakpoints raw sin tokenizar

5 valores de breakpoint usados en 30+ archivos que NO están en `tailwind.config.js`:
- `560px` — 7+ archivos
- `720px` — 10+ archivos
- `768px` — 15+ archivos (legacy Tailwind `md`)
- `880px` — 6+ archivos
- `1024px` — 10+ archivos (legacy Tailwind `xl`)

### 2.7 Colores hardcoded sin tokens

- `#25d366` (WhatsApp green) — debería ser `brand.whatsapp`
- `#0088cc` (Telegram blue) — debería ser `brand.telegram`
- `#f0f6fc` (GitHub light) — debería ser `brand.githubLight`
- `#0066cc` / `#66b3ff` (focus ring) — debería ser `focus.ring` / `focus.ringDark`
- `background-color: green` en `ChatButton/styles.css:6` — color named, no token
- `bg-blue-500` en `Author/styles.css:16` y `WhatsApp/styles.css:27` — copy-paste artifact incorrecto

### 2.8 Tokens social duales: `primaryWhatsApp` vs `brand.whatsapp`

`tailwind.config.js` tiene dos sistemas paralelos de colores sociales. Los old-style (`primaryWhatsApp`, `primaryGooglePlus`, etc.) parecen huérfanos.

### 2.9 Z-index sin documentar

Sistema implícito de z-index (-10 a 9999) funcional pero no documentado. Conflicto potencial: `hire-me_link` a `z-30` no será cubierto por backdrop modal a `z-20`.

---

## Zona 3: Component Architecture (46 hallazgos)

### 3.1 `WordCloud` — 379 líneas, 5+ responsabilidades, 4 violaciones a11y (HIGH)

**Responsabilidades mezcladas:**
- TagCloud.js dynamic import + lifecycle
- 3D sphere init, resize handling
- Click event attachment via imperative DOM (bypasses React)
- Debounced search con `setTimeout`
- Highlight logic via class manipulation
- Lazy-loaded `SkillDetail` overlay

**Violaciones de accesibilidad:**
1. Search input sin `<label>` ni `aria-label`
2. Tag items son `<span>` sin `role`, `tabindex`, ni `aria-label` — invisibles para keyboard users
3. `SkillDetail` no restaura focus al cerrar
4. `SkillDetail` no mueve focus al abrir (dialog sin focus management)

### 3.2 `AuthButton` — átomo que no es atómico (HIGH)

Maneja OAuth dropdown + initials display + session state + Google/LinkedIn auth. Es un organismo disfrazado de átomo. 128 líneas con múltiples concerns.

### 3.3 Solo Hero tiene ErrorBoundary (HIGH)

`SectionErrorBoundary` existe pero solo se usa en `Hero`. Organisms que fetchean datos sin protección: `Experiences`, `Academics`, `Biography`, `Skills`, `ExperienceStats`, `ArticleContent`, `NavBar`, `Menu`, `WordCloud`.

### 3.4 `Floating` overlay acoplado a Redux slices (HIGH)

`Floating/index.tsx` importa directamente `useChatPanel()` Y `useMenuPanel()` y decide cuál cerrar. Agregar un tercer panel requiere modificar este componente. Debería aceptar `onClose` callback.

### 3.5 `MobileMenuOverlay` importa skeletons de otros organisms (HIGH)

Cross-organism coupling: importa `NavigationItemButtonsSkeleton` de `MenuFloating` y `SocialNetworkLinksSkeleton` de `Menu`.

### 3.6 `HireMe` molecule — URL de Telegram hardcoded (HIGH)

```tsx
const profile = { telegram: "https://t.me/angelszymczak" };
```

Dato de configuración hardcoded en componente.

### 3.7 Skeletons faltantes en componentes visibles

Sin skeleton: `FeaturedArticle`, `FeaturedArticlesCarousel`, `CustomersSlider`, `TechnologiesSlider`, `Logo`, `HireMe`, `ArticleCard`, `Auth`, `Chat`, `Footer`, `NavBar`, `WordCloud`.

### 3.8 `FeaturedArticlesCarousel` usa `role="tablist"` incorrectamente (MEDIUM)

Dots de navegación de carousel usan `role="tab"` / `role="tablist"` pero no son tabs. No tienen arrow-key navigation. Deberían ser buttons con `aria-label="Go to slide N"`.

### 3.9 `client` directive implícito en múltiples components (MEDIUM)

`Footer`, `ArticleCard`, `ProjectCard` no tienen `'use client'` pero renderizan componentes client. La boundary es implícita y frágil.

---

## Zona 4: Testing Architecture (25 hallazgos prioritarios)

### 4.1 `chatPanel` slice sin tests + Chat E2E marcado TBD (CRITICAL GAP)

- El slice `chatPanel` no tiene tests unitarios
- CLAUDE.md marca "Chat panel open/close: TBD" en la tabla de critical flows
- No existe `e2e/chat-panel.spec.ts`

### 4.2 Solo 2 Storybook `play` functions de 49+ stories (HIGH)

Solo `IconGallery` y `NavigationItems` tienen interaction tests. Componentes interactivos como `AuthButton`, `CopyButton`, `TechnologyFilter`, `ThemeButton` no tienen `play` functions.

### 4.3 Sin guard automático contra regresión de barrel imports (HIGH)

Después de todo el trabajo de Epic 23, no hay test ni ESLint rule que prevenga re-introducir `import { X } from "@/icons"`.

### 4.4 `jest.useFakeTimers()` sin cleanup (MEDIUM)

`MenuFloatingClient.test.tsx` llama `jest.useFakeTimers()` a nivel de módulo sin `jest.useRealTimers()` en cleanup. Contamina otros tests del mismo worker.

### 4.5 `window.matchMedia` mock duplicado (MEDIUM)

Mismo mock en `NavBar.test.tsx` y `MenuFloatingClient.test.tsx`. Debería estar en `src/test-utils/matchMedia.ts`.

### 4.6 Sin `renderWithProviders` utility compartido (MEDIUM)

Cada test crea su propio wrapper para providers. No hay factory de mock data compartida.

### 4.7 Componentes sin tests unitarios (HIGH)

| Componente | Severidad |
|---|---|
| `NavigationItems` molecule | HIGH (critical flow) |
| `LogoMenuTrigger` molecule | HIGH (mobile menu trigger) |
| `Footer` organism | HIGH (todas las páginas) |
| `SocialAuthDropdown` molecule | HIGH (auth flow) |
| `httpRequest` lib | HIGH (network layer) |
| `social-urls` lib | MEDIUM |
| `ThemeProvider` provider | HIGH (theme persistence) |
| `RootProvider` provider | HIGH (composes all) |

### 4.8 Coverage E2E faltante

- `/articles/[slug]` y `/projects/[slug]` — detail pages sin E2E
- Axe scan con menu overlay abierto
- Axe scan con chat panel abierto
- Axe scan con auth modal abierta

### 4.9 Sin coverage thresholds en Jest (HIGH)

`jest.config.cjs` no tiene `coverageThreshold`. Una regresión podría eliminar tests sin que CI falle.

### 4.10 Barrel `@/icons` mock aún usado en 2 test files (LOW)

`IconButtonsAriaLabel.test.tsx` y `Education.test.tsx` todavía usan `jest.mock("@/icons", ...)`.

---

## Zona 5: Docs & Config (38 hallazgos)

### 5.1 CRITICAL: Pre-commit hook completamente comentado

`.husky/pre-commit` — TODAS las líneas están comentadas. Ninguna validación local corre antes de commit. `package.json` declara hooks en formato Husky v4, pero Husky v8 usa archivos shell en `.husky/`. Quality gates locales = 0.

### 5.2 README.md efectivamente vacío (HIGH)

44 líneas, solo setup de DB. Falta:
- Descripción del proyecto
- Arquitectura
- Setup de desarrollo (npm, no Docker)
- Contributing guide
- Breakpoints system
- Stack tecnológico

### 5.3 `Dockerfile.dev` severamente desactualizado (HIGH)

- `node:20.9.0` (vieja) vs `node:20-alpine3.21` en prod
- `npm i` en vez de `npm ci --legacy-peer-deps`
- `EXPOSE 3000` pero dev server corre en puerto `9000`

### 5.4 `@typescript-eslint/no-explicit-any` desactivado globalmente (HIGH)

`.eslintrc.js` line 24: `"@typescript-eslint/no-explicit-any": "off"`. Con `strict: true` en tsconfig, tener `any` libre mina la type safety.

### 5.5 `actions/checkout@v5` probablemente no existe (MEDIUM)

`ci.yml` usa `actions/checkout@v5`. El último estable es v4.x.

### 5.6 Story branches no disparan CI (MEDIUM)

CI triggers: `branches: [main, 'epic/*']`. Story branches (actual: `story/23-1-*`) no disparan CI en push directo.

### 5.7 Sin build verification bloqueante en CI (MEDIUM)

`quality` job corre lint + typecheck + tests, pero NO `npm run build`. Build verification solo corre en el job `lighthouse` que es `continue-on-error: true`.

### 5.8 Dependencias potencialmente removibles (MEDIUM)

- `prisma` — sin `schema.prisma` en el proyecto
- `ajv` + `ajv-keywords` — sin uso directo en `src/`
- `dotenv` — Next.js maneja `.env` nativamente
- `@testing-library/react-hooks` — deprecated, `renderHook` ya en `@testing-library/react` v14
- `webpack` pinned — Next.js maneja su webpack internamente

### 5.9 `eslint-config-next` version mismatch (MEDIUM)

`eslint-config-next: 14.0.4` pero `next: ^14.2.33`.

### 5.10 CSP `connect-src 'self'` bloqueará API externa (MEDIUM)

Cuando `NEXT_PUBLIC_USE_MOCKS=false`, el CSP bloquea requests al API host externo.

### 5.11 Missing security headers (MEDIUM)

- `Strict-Transport-Security` (HSTS) — no configurado
- `Cross-Origin-Opener-Policy` — ausente

### 5.12 Solo Chromium en E2E (HIGH per docs agent)

Playwright solo testea Chromium. Portfolio visitors probablemente usan Safari proporcionalmente alto.

### 5.13 E2E contra dev server, no production build (MEDIUM)

`playwright.config.ts` usa `npm run dev`. Dev mode difiere de production en: no minification, no `removeConsole`, no `optimizeCss`, CSP con `unsafe-eval`.

### 5.14 `framer-motion` en v10, estable actual es v11 (MEDIUM per docs agent)

v11 ofrece bundle sizes nativamente más pequeños.

### 5.15 `NEXT_PUBLIC_TECHNOLOGIES` usado en código pero falta en `.env.template` (HIGH)

Variable referenciada en `technology/model/mock.ts` pero no documentada.

---

## Zona 6: Domain & State (34 hallazgos)

### 6.1 CRITICAL: Operator precedence bug en contact-point mock

```typescript
// src/domains/contact-point/model/mock.ts:46
`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}` || "mailto:contact@example.com"
```

El template literal **siempre es truthy** (produce `"mailto:undefined"` cuando env var no existe). El fallback `"mailto:contact@example.com"` **nunca se alcanza**. Usuarios sin `NEXT_PUBLIC_CONTACT_EMAIL` ven un link a `mailto:undefined`.

**Fix:** `` `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com"}` ``

### 6.2 Technology model salta Zod validation (HIGH)

`src/domains/technology/model/index.ts` — `fetchAll()` retorna `mockData` y data de API **sin** `TechnologiesSchema.parse()`. Es el ÚNICO dominio que no valida en el model layer. La validación ocurre en el query hook por accidente.

### 6.3 `content.fetchById` retorna dato incorrecto en miss (HIGH)

`src/domains/content/model/index.ts:45` — cuando content no se encuentra por ID, silenciosamente retorna `mockData[0]` en vez de `null` o throw. El usuario recibe data incorrecta.

### 6.4 `profile.fetchById` ignora parámetro `id` (HIGH)

`src/domains/profile/model/index.ts:44` — siempre retorna `mockData[0]` sin considerar el `id` pasado como parámetro. El argumento es inútil.

### 6.5 Providers usan `useSelector`/`useDispatch` raw en vez de wrappers tipados (MEDIUM)

`ThemeProvider` y `AuthProvider` importan directamente de `react-redux` en vez de usar `useAppSelector`/`useAppDispatch` tipados.

### 6.6 `authPanel` selector sin `shallowEqual` (MEDIUM)

`authPanel/hooks.ts:32-34` selecciona el sub-objeto completo `state.authPanel`, creando nueva referencia cada render. `EmailClipboard/hooks.ts` correctamente usa `shallowEqual`.

### 6.7 ThemeMode + AuthPanel: SSR singleton store risk (MEDIUM x2)

`getInitialTheme()` y `getInitialAuthState()` se llaman a nivel de módulo (module scope). En SSR, el store de Redux es singleton — el estado computado en server persiste entre requests.

### 6.8 State Adapter layer — dead code (LOW)

`src/state/adapters/` contiene 5 archivos (2 vacíos, 3 con código) que implementan una abstracción `StateAdapter` que **nadie consume**. Todos los componentes importan directamente de Redux slices.

### 6.9 `utils.ts` async/sync mismatch (MEDIUM)

`src/lib/utils.ts:14` — `const file = async (name) => await fs.readFileSync(...)`. Usa `readFileSync` (sync) dentro de `async/await` (no-op misleading).

### 6.10 `article-jsonld.ts` author hardcoded (MEDIUM)

`src/lib/seo/article-jsonld.ts:47` — Author name hardcoded como `"Angel Thunder"` en vez de usar `NEXT_PUBLIC_AUTHOR_NAME`.

### 6.11 `FetchOptions` interface duplicada en cada dominio (LOW)

`{ useMockFallback?: boolean }` se define independientemente en 11 archivos `model/index.ts`. Debería extraerse a `src/lib/types.ts`.

### 6.12 Zod parse errors no capturados en mock branches (MEDIUM)

`Schema.parse()` en los branches mock de todos los dominios no está dentro de try/catch. Un `ZodError` no capturado burbujea sin mensaje user-friendly.

### 6.13 Doble validación Zod en query hooks (MEDIUM x2)

`contact-point/queries/useContactPoints.ts` y `technology/queries/useTechnologies.ts` re-parsean data con Zod después de que el model ya validó. Redundante (excepto technology donde el model NO valida — finding 6.2).

---

## Top 25 Fixes — Prioridad Máxima

Ordenados por impacto (datos rotos > funcionalidad rota > seguridad > a11y > arquitectura > convención).

| # | Finding | Zona | Severidad | Esfuerzo |
|---|---|---|---|---|
| 1 | `contact-point` mock: `mailto:${undefined}` fallback nunca alcanzado | Domain | CRITICAL | S |
| 2 | Pre-commit hook desactivado — 0 quality gates locales | Config | CRITICAL | S |
| 3 | `content.fetchById` retorna dato incorrecto en miss (`mockData[0]`) | Domain | HIGH | S |
| 4 | `profile.fetchById` ignora parámetro `id` | Domain | HIGH | S |
| 5 | `technology` model salta Zod validation completamente | Domain | HIGH | S |
| 6 | `var(--dark/light/primary)` nunca definidas — colores rotos | CSS | HIGH | S |
| 7 | `[data-theme="dark"]` nunca dispara en CustomersSlider | CSS | HIGH | S |
| 8 | `prefers-color-scheme` en vez de `.dark` class (globals, coming-soon) | CSS | HIGH | S |
| 9 | Bug unidades faltantes `skill/styles.css` — positioning roto | CSS | HIGH | S |
| 10 | WordCloud search input sin `aria-label` | Component | HIGH | S |
| 11 | WordCloud tags sin keyboard access (no `tabindex`, no `role`) | Component | HIGH | M |
| 12 | SkillDetail sin focus management (open/close) | Component | HIGH | M |
| 13 | Solo Hero con ErrorBoundary — organisms desprotegidos | Component | HIGH | M |
| 14 | `chatPanel` slice sin tests + Chat E2E "TBD" | Testing | HIGH | M |
| 15 | README.md vacío | Config | HIGH | M |
| 16 | `Dockerfile.dev` desactualizado (port, npm, image) | Config | HIGH | S |
| 17 | `no-explicit-any: off` global — type safety minada | Config | HIGH | S |
| 18 | `bg-blue-500` copy-paste en Author + WhatsApp disabled | CSS | HIGH | S |
| 19 | `ChatButton active: green` — color named, sin token | CSS | HIGH | S |
| 20 | `Floating` acoplado a Redux slices específicos | Component | HIGH | M |
| 21 | `HireMe` URL Telegram hardcoded | Component | HIGH | S |
| 22 | `AuthButton` no es atómico — organismo en capa atom | Component | HIGH | L |
| 23 | Sin guard de barrel import regression post-Epic 23 | Testing | HIGH | S |
| 24 | Jest sin coverage thresholds | Testing | HIGH | S |
| 25 | Zod parse errors no capturados en mock branches | Domain | MEDIUM | S |

**Leyenda Esfuerzo:** S = Small (< 1h), M = Medium (1-4h), L = Large (4h+)

---

## Agrupaciones Temáticas para Epic Planning

### Grupo A: "Cosas Rotas" (funcionalidad actualmente incorrecta)
- Fix #1 — contact-point mailto:undefined (CRITICAL)
- Fix #3, #4 — content/profile fetchById retorna datos incorrectos
- Fix #5 — technology sin Zod validation
- Fix #6, #7, #8, #9, #18, #19 — CSS fixes puntuales (colores, dark mode, units)
- Fix #21 — HireMe hardcoded URL
- Esfuerzo total: ~4h

### Grupo B: "Accesibilidad" (WCAG violations activas)
- Fix #6, #7, #8 — WordCloud a11y
- FeaturedArticlesCarousel role fix
- LogoMenuTrigger `aria-haspopup="dialog"`
- Esfuerzo total: ~6h

### Grupo C: "Resiliencia" (error boundaries + tests de gaps críticos)
- Fix #9 — ErrorBoundary coverage
- Fix #10 — chatPanel tests + E2E
- Missing tests: Footer, NavigationItems, LogoMenuTrigger, ThemeProvider
- Esfuerzo total: ~8h

### Grupo D: "Developer Experience" (tooling + docs)
- Fix #1 — pre-commit hook
- Fix #11 — README
- Fix #12 — Dockerfile.dev
- Fix #13 — ESLint `no-explicit-any`
- Fix #19, #20 — barrel guard + coverage thresholds
- Esfuerzo total: ~4h

### Grupo E: "CSS Normalization" (convenciones + dedup)
- BEM `_` → `__` rename (80+ clases)
- Glass effect extraction to shared
- Progressive title scaling extraction
- Breakpoints tokenization (560, 720, 768, 880, 1024)
- Dual social color cleanup
- Esfuerzo total: ~12h

### Grupo F: "Component Refactoring" (SRP + atomic design)
- WordCloud decomposition (hooks extraction)
- AuthButton → organism
- Floating overlay decoupling
- MobileMenuOverlay skeleton decoupling
- Esfuerzo total: ~10h

---

## Métricas de Referencia (Post-Epic 24)

| Métrica | Valor |
|---|---|
| Tests unitarios | 1110 passing (105 suites) |
| Tests E2E | 223 passed, 30 skipped |
| Build sizes | /: 161kB, /about: 164kB, /projects: 176kB |
| `!important` count | 74 (10 necesarios, 3 defensivos, 8 problemáticos) |
| CSS BEM violations | 84 clases con `_` en vez de `__` |
| Missing ErrorBoundaries | 9 organisms sin protección |
| Missing unit tests | ~25 componentes/módulos |
| Storybook play functions | 2 de 49+ stories |

---

### Grupo G: "Domain Data Integrity" (datos incorrectos en runtime)
- Fix #1 — contact-point mailto:undefined (CRITICAL)
- Fix #3 — content fetchById wrong data
- Fix #4 — profile fetchById ignores id
- Fix #5 — technology no Zod validation
- Fix #25 — Zod parse errors uncaught in mock branches
- State adapter dead code removal
- Providers: migrate to typed useAppSelector/useAppDispatch
- Esfuerzo total: ~3h

---

## Conteos Finales

| Categoría | Valor |
|---|---|
| Total hallazgos | **366** |
| CRITICAL | 2 |
| HIGH | 73 |
| MEDIUM | 195 |
| LOW | 94 |
| Zonas auditadas | 6 |
| Archivos inspeccionados | 200+ |
| Agentes especializados | 6 |

*Documento generado como input para planificación de Epic 25+. Este listado es exhaustivo e intencional — no todo requiere acción inmediata. Los Grupos A, D y G son pre-requisitos (funcionalidad rota + tooling); B, C, E, F pueden priorizarse según visión del Project Lead.*
