# Epic 21 — Storybook: Documentacion Visual de Componentes

> Status: BACKLOG
> Phase: Growth (Post-MVP)
> Type: TOOLING + DOCUMENTATION (Storybook setup + component stories)
> Depends on: Epic 20 (architecture conventions defined)
> Requerimientos: GR3 (Storybook documentacion completa), EC1 (Storybook Setup)

---

## Objective

El desarrollador puede explorar, probar y documentar visualmente todos los componentes del portfolio en aislamiento, verificando variantes, estados, temas y responsividad.

Storybook se convierte en la referencia visual del design system, complementando los 7 docs de arquitectura de Epic 20.

---

## Out of Scope

- **TypeScript migration** — Los stories se escriben para componentes tal como estan (JS o TS). Migration es Epic 22.
- **Barrel file cleanup** — Stories importan por path directo (regla ya establecida). Cleanup es Epic 23.
- **Breakpoint migration** — Stories usan breakpoints actuales (semantic + legacy). Migration es Epic 24.
- **Every Layout utilities** — Se documentan como patrones en Storybook si existen, no se crean. Implementacion es Epic 24.
- **Visual regression testing** — Chromatic o similar es scope futuro. Este epic solo setupea a11y addon.
- **CI integration blocking** — `build-storybook` se agrega como script pero NO bloquea CI.

---

## Success Criteria

1. `npm run storybook` lanza Storybook 8 con Tailwind, dark mode, y breakpoints custom funcionando
2. Decorators globales para Redux, React Query, y LazyMotion permiten renderizar cualquier componente
3. ~108 componentes tienen stories (~60% del inventario de 181)
4. Todos los 58 icons estan en un gallery searchable
5. `npm run build-storybook` genera build estatico sin errores
6. Addon a11y muestra auditorias axe-core en cada story

---

## Current State (measured from codebase audit)

| Metric | Value |
|--------|-------|
| Total UI components | 181 (123 atoms, 30 molecules, 21 organisms, 2 overlays, 2 shared) |
| Storybook installed | NO |
| `.storybook/` config | NO |
| `.stories.tsx` files | 0 |
| StorybookIcon component | Exists (ironic — icon without Storybook) |
| Components with tests | ~35 |
| Components with styles.css | ~150 |
| Components with skeleton | ~40 |
| TypeScript components (.tsx) | ~55 |
| JavaScript components (.jsx) | ~126 |
| Components with Redux state | ~10 |
| Components with m.* (framer-motion) | 18 |
| Components with .types.ts | 5 (ArticleCard, ProjectCard, ArticleHoverThumbnail, ArticleAppearance, ArticleListItem) |

---

## Technical Risk Assessment: ALTO

| Riesgo | Descripcion | Mitigacion |
|--------|-------------|------------|
| Tailwind custom breakpoints | phablet, mobile, nav, stage no son breakpoints estandar de Storybook | Configurar PostCSS + viewport addon con presets custom |
| Framer Motion + LazyMotion | `m.*` requiere provider wrapper, `strict` mode rechaza `motion.*` | Decorator global con LazyMotionProvider |
| Redux state | ~10 componentes dependen de slices | Decorator global con configureStore |
| Mixed JS/TS | 126 JSX + 55 TSX | Storybook 8 soporta ambos nativamente |
| BEM + @apply | styles.css con `@apply` necesita PostCSS pipeline identico al de Next.js | Reusar postcss.config.js y tailwind.config.js |
| Icons barrel | 58 icons — importar individualmente, no desde barrel | Gallery story con imports directos |
| --legacy-peer-deps | Storybook puede agregar peer dependency conflicts | Instalar con --legacy-peer-deps |

---

## Story Breakdown

---

### Story 21.1 — Storybook Infrastructure & Tailwind Integration

**Objective:** Instalar Storybook 8 y configurarlo para que renderice componentes con Tailwind CSS, breakpoints custom, dark mode toggle, y PostCSS pipeline identico al de Next.js.

**Affected Files:**
| File | Action |
|------|--------|
| `.storybook/main.ts` | CREATE — Storybook config |
| `.storybook/preview.ts` | CREATE — global decorators, viewports, dark mode |
| `.storybook/preview-head.html` | CREATE — font/CSS imports si necesario |
| `package.json` | MODIFY — scripts storybook, build-storybook + dependencies |
| `.gitignore` | MODIFY — add storybook-static/ |

**Scope:**
- Instalar `@storybook/nextjs` framework (Storybook 8)
- Configurar PostCSS para procesar `@apply` de component `styles.css`
- Configurar viewport addon con presets: phablet (400px), mobile (480px), tablet (640px), nav (800px), stage (960px), desktop (1025px), wide (1441px)
- Configurar dark mode toggle que aplique `.dark` class al preview container
- Agregar scripts: `storybook` (dev), `build-storybook` (static)
- Verificar que `npm run build-storybook` genera output en `storybook-static/`

**Risk Level:** Alto (configuracion de PostCSS + Tailwind es el mayor riesgo tecnico)

**Definition of Done:**
- [ ] `npm run storybook` lanza sin errores
- [ ] Componente con Tailwind classes renderiza correctamente
- [ ] Componente con styles.css + `@apply` renderiza correctamente
- [ ] Viewport presets disponibles para 7 breakpoints semanticos
- [ ] Dark mode toggle funciona (`.dark` class applied)
- [ ] `npm run build-storybook` genera storybook-static/ sin errores
- [ ] storybook-static/ en .gitignore

**Complexity:** High

---

### Story 21.2 — Provider Decorators (Redux, React Query, Framer Motion)

**Objective:** Crear decorators globales para que componentes con state management y animaciones rendericen correctamente en Storybook.

**Affected Files:**
| File | Action |
|------|--------|
| `.storybook/decorators/ReduxDecorator.tsx` | CREATE |
| `.storybook/decorators/QueryDecorator.tsx` | CREATE |
| `.storybook/decorators/MotionDecorator.tsx` | CREATE |
| `.storybook/decorators/index.ts` | CREATE — re-exports |
| `.storybook/preview.ts` | MODIFY — register global decorators |

**Scope:**
- **Redux decorator:** Wraps with `<Provider store={configureStore(...)}>` con todos los slices (themeMode, menuPanel, chatPanel, authPanel). Story-level override de initial state via parameters.
- **React Query decorator:** Wraps con `<QueryClientProvider>`. Mock data via `domains/*/model/mock.ts`.
- **Framer Motion decorator:** Wraps con `<LazyMotion features={domAnimation} strict>`. Animaciones funcionan en canvas.
- Decorators se aplican globalmente via `preview.ts`. Stories individuales pueden override.

**Risk Level:** Medio (configurar stores con slices correctos)

**Definition of Done:**
- [ ] Componente con `useAppSelector` renderiza (ej: ThemeButton)
- [ ] Componente con React Query hook renderiza con mock data
- [ ] Componente con `m.*` anima correctamente
- [ ] Decorators aplican automaticamente via preview.ts
- [ ] Story individual puede override Redux initial state

**Complexity:** Medium

---

### Story 21.3 — Atom Stories: Buttons, Links & Interactive Elements

**Objective:** Crear stories para los 12 buttons, 6 links, y 7 text components con variantes, estados, y dark mode.

**Affected Files:**
| File | Action |
|------|--------|
| `src/ui/atoms/buttons/*/stories/*.stories.tsx` | CREATE (12 files) |
| `src/ui/atoms/links/*/stories/*.stories.tsx` | CREATE (6 files) |
| `src/ui/atoms/texts/*/stories/*.stories.tsx` | CREATE (7 files) |

**Scope:**
- Story por cada button: AuthButton, ChatButton, CopyButton, HireMeButton, HireMeHeaderButton, MenuButton, NavigationItemButton, NeumorphicToggle, SkillSelectorButton, ThemeButton, ArrowButton
- Story por cada link: BaseLink, CalendarLink, ImageLink, NavigationItemLink, TransitionLink, WhatsAppLink
- Story por cada text: ActiveMark, ActiveMarkFloating, AnimatedNumber, AnimatedTitle, CircularText, ParagraphText
- Cada story incluye: Default, Dark Mode variantes minimo
- Buttons con skeleton muestran variante "Loading"
- Controls panel expone todas las props del interface

**Risk Level:** Bajo

**Definition of Done:**
- [ ] 12 button stories creados con Default + Dark Mode
- [ ] 6 link stories creados
- [ ] 7 text stories creados
- [ ] Buttons con skeleton tienen variante Loading
- [ ] Controls panel funciona para props interactivos
- [ ] Sidebar organizado: Atoms > Buttons, Links, Texts

**Complexity:** Medium (volumen, no complejidad individual)

---

### Story 21.4 — Atom Stories: Icon Gallery

**Objective:** Crear un gallery story que muestre los 58 icons en un grid searchable con variantes de tamano y dark mode.

**Affected Files:**
| File | Action |
|------|--------|
| `src/ui/atoms/icons/IconGallery.stories.tsx` | CREATE |

**Scope:**
- Single story que renderiza los 58 icons en grid
- Cada celda muestra: icon renderizado, nombre del componente, import path directo
- Control de busqueda (filtro por nombre)
- Control de tamano: sm (16px), md (24px), lg (32px), xl (48px)
- Dark mode muestra colores correctos
- **CRITICO:** Todos los imports son directos (`@/atoms/icons/GitHubIcon`), NUNCA desde barrel

**Risk Level:** Bajo

**Definition of Done:**
- [ ] Gallery muestra 58 icons en grid
- [ ] Cada celda tiene: icon, nombre, import path
- [ ] Busqueda filtra icons por nombre
- [ ] Selector de tamano funciona (4 opciones)
- [ ] Dark mode renderiza colores correctos
- [ ] Zero barrel imports en el archivo de story

**Complexity:** Low

---

### Story 21.5 — Molecule Stories: Core Compositions

**Objective:** Crear stories para 15 molecules clave mostrando composicion de atoms con mock data real.

**Affected Files:**
| File | Action |
|------|--------|
| `src/ui/molecules/*/stories/*.stories.tsx` | CREATE (~15 files) |

**Scope:**
Molecules prioritarios (por uso y complejidad):
1. Experience — expandable, domain data
2. Education — domain data, skeleton
3. Article — domain data
4. ArticleListItem — hover interaction, types.ts
5. CopyEmail — clipboard, skeleton
6. WhatsApp — external link, skeleton
7. Calendar — Calendly link
8. SocialNetworkLink — icon mapping
9. SocialShareButtons — multiple platforms
10. TechnologyFilter — toggle, clear all
11. TransitionEffect — framer-motion
12. FeaturedArticlesCarousel — carousel, responsive
13. NavigationItems — responsive, skeleton
14. Logo — branding
15. HireMe — CTA

- Cada story usa mock data de `domains/*/model/mock.ts`
- Variantes: Default, Dark Mode, Loading (skeleton donde existe)
- Controls panel para props modificables

**Risk Level:** Medio (mock data setup)

**Definition of Done:**
- [ ] 15 molecule stories creados
- [ ] Mock data de domains usado correctamente
- [ ] Variante Loading para molecules con skeleton
- [ ] Dark mode funciona en todas las stories
- [ ] Responsive preview funciona para molecules responsivos
- [ ] Sidebar organizado: Molecules > [ComponentName]

**Complexity:** Medium

---

### Story 21.6 — Organism Stories: Page Sections

**Objective:** Crear stories para 10 organisms complejos con Redux state, variantes, y responsive preview.

**Affected Files:**
| File | Action |
|------|--------|
| `src/ui/organisms/*/stories/*.stories.tsx` | CREATE (~10 files) |

**Scope:**
Organisms prioritarios:
1. NavBar — responsive, Redux (menuPanel)
2. Footer — responsive, FooterChatColumn
3. Menu — Redux (menuPanel), mobile overlay
4. Auth — modal, forms, OAuth buttons, Redux (authPanel)
5. Chat — ChatOverlay, form inputs, Redux (chatPanel)
6. ProjectCard — variants (Featured, Grid), types.ts
7. ArticleCard — variants (Featured, Grid), types.ts
8. ArticleContent — code blocks, responsive
9. Skills — skill selector interaction
10. Experiences — expandable list, domain data

- Organisms con Redux: store pre-populated con initial state apropiado
- ProjectCard y ArticleCard: stories por cada variant
- Auth: stories para Login, Signup, OAuth, AuthDropdown
- Chat: panel con preset messages
- Responsive: mobile/desktop viewport switch

**Risk Level:** Alto (Redux state + variant complexity)

**Definition of Done:**
- [ ] 10 organism stories creados
- [ ] Redux state funciona (toggle menu, theme, chat, auth)
- [ ] ProjectCard: variant Featured + Grid
- [ ] ArticleCard: variant Featured + Grid + List
- [ ] Auth: Login, Signup, OAuth, Dropdown variants
- [ ] Responsive preview funciona (mobile/desktop)
- [ ] Sidebar organizado: Organisms > [ComponentName]

**Complexity:** High

---

### Story 21.7 — Storybook Build & Accessibility Addon

**Objective:** Integrar addon de accesibilidad y verificar que el build estatico funciona correctamente.

**Affected Files:**
| File | Action |
|------|--------|
| `.storybook/main.ts` | MODIFY — add a11y addon |
| `package.json` | MODIFY — add @storybook/addon-a11y |

**Scope:**
- Instalar y configurar `@storybook/addon-a11y`
- Verificar que tab Accessibility muestra resultados axe-core en cada story
- Verificar que violations se highlighted en preview
- `npm run build-storybook` funciona con todas las stories + addons
- Documentar en comentario en `.github/workflows/ci.yml` donde agregar build-storybook cuando se decida

**Risk Level:** Bajo

**Definition of Done:**
- [ ] @storybook/addon-a11y instalado y configurado
- [ ] Tab Accessibility muestra resultados en cualquier story
- [ ] Violations highlighted en preview
- [ ] `npm run build-storybook` exitoso con 0 errores
- [ ] Scripts en package.json: `storybook`, `build-storybook`
- [ ] Comentario en ci.yml documentando futuro paso de Storybook

**Complexity:** Low

---

## Recommended Execution Order

| Order | Story | Rationale |
|:-----:|-------|-----------|
| 1 | **21.1** Infrastructure | Foundation — todo lo demas depende de esto |
| 2 | **21.2** Decorators | Habilita stories con state management |
| 3 | **21.4** Icon Gallery | Quick win — 58 componentes de golpe, bajo riesgo |
| 4 | **21.3** Buttons/Links/Texts | Atoms simples, builds confidence |
| 5 | **21.5** Molecules | Complejidad media, usa decorators |
| 6 | **21.6** Organisms | Mas complejo, necesita decorators maduros |
| 7 | **21.7** Build & A11y | Cierre — verifica que todo buildea |

Stories 21.1 + 21.2 son el **critical path** (pueden tomar 2-3 sesiones por riesgo tecnico).
Stories 21.3 + 21.4 son el **segundo bloque** (1-2 sesiones).
Stories 21.5 + 21.6 son el **tercer bloque** (2-3 sesiones).
Story 21.7 es **cierre** (1 sesion).

---

## Dependency Graph

```
21.1 (Infrastructure + Tailwind)
  │
  ├──> 21.2 (Decorators) ──> 21.3 (Buttons/Links/Texts)
  │                      ──> 21.5 (Molecules)
  │                      ──> 21.6 (Organisms)
  │
  ├──> 21.4 (Icon Gallery — no necesita decorators, icons son puros)
  │
  └──> 21.7 (Build & A11y — solo necesita infrastructure)
```

---

## Coverage Summary

| Categoria | Total | Stories en Epic 21 | Cobertura |
|-----------|-------|-------------------|-----------|
| Atoms (buttons) | 12 | 12 | 100% |
| Atoms (icons) | 58 | 58 (gallery) | 100% |
| Atoms (links) | 6 | 6 | 100% |
| Atoms (texts) | 7 | 7 | 100% |
| Atoms (shadows, motion, hocs, other) | 40 | 0 | 0% |
| Molecules | 30 | 15 | 50% |
| Organisms | 21 | 10 | 48% |
| Overlays | 2 | 0 | 0% |
| Shared | 2 | 0 | 0% |
| **Total** | **181** | **~108** | **~60%** |

Componentes no cubiertos (shadows, HOCs, motion atoms, molecules menores, overlays) se pueden agregar incrementalmente post-epic.
