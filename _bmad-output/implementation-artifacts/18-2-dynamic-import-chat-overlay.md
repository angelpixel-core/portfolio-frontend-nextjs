# Story 18.2: Dynamic import del Chat overlay

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como **visitante**,
quiero **que la carga inicial de la página sea más rápida**,
para **empezar a leer contenido sin esperar a que se descargue el código del chat**.

## Acceptance Criteria

1. **Given** la página se carga por primera vez **When** el visitante no ha interactuado con el chat **Then** el JavaScript del Chat no está en el bundle inicial (verificable en pestaña Network).
2. **Given** el visitante hace clic en el botón de Chat **When** se abre el overlay del Chat **Then** el Chat se carga dinámicamente y se muestra sin delay perceptible (<300 ms).
3. **Given** el Chat está abierto y el visitante envía un mensaje **When** la interacción termina **Then** toda la funcionalidad del Chat se comporta igual que antes.
4. **Given** `npm run build` se ejecuta **When** el build termina **Then** el chunk del Footer es más pequeño que antes del cambio.
5. **Given** `npm test` y `npm run test:e2e` (flujos críticos) **When** se ejecutan **Then** no hay regresiones (tests pasan).

## Tasks / Subtasks

- [x] **Task 1:** Extraer o exportar el overlay del Chat para poder cargarlo dinámicamente (AC: #1, #4)
  - [x] Creado `Chat/ChatOverlay.tsx` con AnimatePresence + FloatingMobile + ChatBox.
  - [x] ChatOverlay lee `chatPanel.isOpen` de Redux. Tests existentes de Chat pasan sin cambios (963/963).
- [x] **Task 2:** Modificar Footer para dynamic import del overlay (AC: #1, #2, #4)
  - [x] Creado `FooterChatColumn.tsx` (client wrapper, Opción B) — mantiene Footer como server component.
  - [x] FooterChatColumn: importa ChatButton estáticamente + `next/dynamic` para ChatOverlay con `ssr: false`.
  - [x] Render condicional: `{isOpen && <ChatOverlay />}` — overlay se monta solo al abrir.
- [x] **Task 3:** Opcional — preload del chunk (AC: #2)
  - [x] ChatButton: `onMouseEnter` y `onFocus` ejecutan `import("@/organisms/Chat/ChatOverlay")` para precargar el chunk antes del clic.
- [x] **Task 4:** Verificación build, tests y E2E (AC: #3, #4, #5)
  - [x] `npm run build`: exitoso. Chat en chunks separados 8474 (11 KiB) + 6437 (13 KiB) — no en bundle inicial.
  - [x] `npm test`: 963/963 tests pasan sin cambios en mocks.
  - [x] `npm run test:e2e`: 234 passed, 2 skipped — sin regresiones.

## Dev Notes

- **Objetivo:** El código del Chat (FloatingMobile, ChatBox, AnimatePresence, etc.) no debe ir en el bundle inicial; solo debe cargarse cuando el usuario abre el panel (o en preload al hover del botón).
- **Estado actual:** Footer ya se carga con `dynamic()` en `layout.jsx`, pero dentro de Footer hay `import Chat from "@/organisms/Chat"` estático, por lo que el chunk de Chat va en el mismo chunk que Footer. Al hacer el overlay dinámico y condicional a `isOpen`, el chunk del overlay se carga solo al abrir (o al preload).
- **ChatButton:** Debe seguir visible sin depender del chunk del Chat; por eso se importa estáticamente en Footer desde `@/buttons/ChatButton`. No mover ChatButton dentro del dynamic.
- **Redux:** `chatPanel.isOpen` y `toggleChatPanel` viven en `@/state/slices/chatPanel`. Footer (o un client component que envuelva la columna del chat) debe leer `isOpen` para decidir si montar el overlay dinámico.
- **Riesgo:** Flash o delay al abrir si el chunk tarda; mitigable con preload en `onMouseEnter` del ChatButton.

### Archivos clave

| Archivo | Uso |
|---------|-----|
| `src/ui/organisms/Footer/index.jsx` | Hoy importa y renderiza `<Chat />`. Aquí se hace dynamic del overlay y se mantiene ChatButton estático. |
| `src/ui/organisms/Chat/index.tsx` | Contiene ChatButton + AnimatePresence + (isOpen && FloatingMobile + ChatBox). Extraer la parte overlay a componente/export. |
| `src/ui/atoms/buttons/ChatButton/index.tsx` | Botón que usa `useChatPanel().toggleChatPanel`. Debe seguir en Footer de forma estática. |
| `src/state/slices/chatPanel/hooks.ts` | `useChatPanel()` → `isOpen`, `toggleChatPanel`. Usar en Footer (o wrapper client) para condicional. |

### Estructura objetivo (Footer)

- Opción A: Footer sea client component ("use client") y use `useChatPanel` + `dynamic(() => import(...ChatOverlay))` + render condicional `{isOpen && <ChatOverlay />}`.
- Opción B: Footer siga siendo server (si lo es) y la columna del chat sea un client component que haga lo anterior (ej. `FooterChatColumn`).

### Project Structure Notes

- No mover ChatButton a otro sitio; sigue en `@/buttons/ChatButton`. Footer puede importarlo directamente.
- El overlay dinámico puede vivir como `Chat/ChatOverlay.tsx` o como export desde `Chat/index.tsx`; respetar convención de un componente por carpeta si el equipo lo usa.

### References

- [Source: _bmad-output/planning-artifacts/epic-18-bundle-performance.md] — Story 18.2, contexto técnico, AC, subtasks, orden de ejecución (después de 18.1).
- [Source: CLAUDE.md] — Comandos (npm run build, npm test, test:e2e), estructura src/, alias.
- [Source: 18-1-lazymotion-feature-splitting] — Chat ya usa `m` y LazyMotion; Floating/FloatingMobile son .tsx. No duplicar lógica de framer-motion.

---

## Developer Context (guardrails)

- **Epic 18** es optimización de bundle; no añadir features nuevas. Mantener comportamiento actual del chat (abrir/cerrar, enviar mensaje, a11y).
- **No inventar:** Redux `chatPanel` ya existe; no crear otro estado para "chat loaded". Usar `next/dynamic` como en Auth y Footer en layout.
- **E2E:** Si hay tests E2E que abren el chat, no romperlos; el flujo debe ser el mismo desde fuera (clic en botón → panel abre).

### Technical requirements

- **next/dynamic:** Usar la API actual de Next.js 14 (dynamic con `ssr: false` si el overlay es solo client).
- **Build:** Comparar tamaño del chunk que incluye Footer antes y después (o el chunk que deja de incluir Chat).

### Architecture compliance

- Respetar Atomic Design: Footer en `organisms/`, Chat en `organisms/Chat/`, ChatButton en `atoms/buttons/`.
- Un solo punto de entrada al chat desde la UI (Footer); no duplicar botón ni estado.

### Testing requirements

- Tests unitarios de Chat y ChatButton deben seguir pasando; si Footer ahora renderiza el overlay condicionalmente, los tests que montan Chat directamente no cambian; los que montan Footer pueden necesitar mock del dynamic.
- E2E: ejecutar `npm run test:e2e` y comprobar que los flujos críticos (p. ej. menu, theme) y cualquier flujo de chat sigan verdes.

### Story completion status

- **Status:** done
- **Completion note:** Story 18.2 implementada y code review aplicado. Chat overlay en chunk dinámico. Exit animation preservada via `hasOpened` pattern. Dead code eliminado.

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation.

### Completion Notes List

1. Created `Chat/ChatOverlay.tsx` extracting AnimatePresence + FloatingMobile + ChatBox from `Chat/index.tsx`.
2. Created `Footer/FooterChatColumn.tsx` (client wrapper) with `next/dynamic` + `ssr: false` for ChatOverlay. Footer remains a server component (Opción B from story).
3. ChatButton enhanced with `onMouseEnter` + `onFocus` preload of ChatOverlay chunk.
4. Chat/index.tsx simplified to compose ChatButton + ChatOverlay (preserves existing test compatibility).
5. Build: Chat code now in separate dynamic chunks 8474 (11 KiB) + 6437 (13 KiB), not loaded on initial page load.
6. Build stats unchanged: page sizes identical to 18.1 baseline. Shared +0.4 kB (FooterChatColumn wrapper overhead).
7. Tests: 963/963 pass — no mock changes needed.
8. **[Code Review Fix]** FooterChatColumn: `{isOpen && <ChatOverlay />}` → `hasOpened` pattern to preserve AnimatePresence exit animations. Without this, closing chat unmounted ChatOverlay immediately, breaking exit animation (AC3 regression).
9. **[Code Review Fix]** Removed dead `Chat/index.tsx` — nobody imported it after Footer refactor. Updated organisms barrel.
10. **[Code Review Fix]** Preload memoization: added `let preloaded = false` flag to avoid redundant `import()` calls on repeated hover/focus events.
11. **[Code Review Fix]** Updated `Chat.test.tsx` to import ChatButton + ChatOverlay directly (production components) instead of dead Chat intermediary.
12. **[Code Review Fix]** Added `AuthButton/index.tsx` (prettier formatting only) to File List for completeness.

### File List

**Created:**
- `src/ui/organisms/Chat/ChatOverlay.tsx`
- `src/ui/organisms/Footer/FooterChatColumn.tsx`

**Deleted:**
- `src/ui/organisms/Chat/index.tsx` (dead code after Footer refactor; tests updated to import components directly)

**Modified:**
- `src/ui/organisms/Footer/index.jsx` (replaced `Chat` import with `FooterChatColumn`)
- `src/ui/atoms/buttons/ChatButton/index.tsx` (added preload on hover/focus with memoization)
- `src/ui/atoms/buttons/AuthButton/index.tsx` (prettier formatting only)
- `src/ui/organisms/index.js` (removed dead `Chat` re-export)
- `src/ui/organisms/Chat/__tests__/Chat.test.tsx` (imports ChatButton + ChatOverlay directly)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (18-1 → done, 18-2 → in-progress)
