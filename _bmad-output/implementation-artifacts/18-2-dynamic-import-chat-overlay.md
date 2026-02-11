# Story 18.2: Dynamic import del Chat overlay

Status: ready-for-dev

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

- [ ] **Task 1:** Extraer o exportar el overlay del Chat para poder cargarlo dinámicamente (AC: #1, #4)
  - [ ] Definir un componente "Chat overlay" (AnimatePresence + FloatingMobile + ChatBox) que hoy vive dentro de `Chat`. Opciones: export nombrado desde `Chat/index.tsx` (ej. `ChatOverlay`) o archivo `Chat/ChatOverlay.tsx`.
  - [ ] Asegurar que el overlay solo dependa de `chatPanel.isOpen` (Redux) y no rompa tests existentes de Chat.
- [ ] **Task 2:** Modificar Footer para dynamic import del overlay (AC: #1, #2, #4)
  - [ ] En `src/ui/organisms/Footer/index.jsx`: import estático de `ChatButton` desde `@/buttons/ChatButton`.
  - [ ] Usar `next/dynamic` para cargar el overlay del Chat (componente extraído). `ssr: false` si el overlay es solo client.
  - [ ] Renderizar el overlay solo cuando `chatPanel.isOpen` sea true (Footer debe usar `useChatPanel` o recibir el estado; si Footer es server component, mover la columna del chat a un client wrapper que lea Redux y haga el dynamic render).
- [ ] **Task 3:** Opcional — preload del chunk (AC: #2)
  - [ ] En `ChatButton`: `onMouseEnter` para preload del dynamic import (ej. `import("@/organisms/Chat/...")`) y así reducir delay al primer clic.
- [ ] **Task 4:** Verificación build, tests y E2E (AC: #3, #4, #5)
  - [ ] `npm run build`: comprobar que el chunk del Footer (o el que incluía Chat) sea menor que antes.
  - [ ] `npm test`: todos los tests pasan; ajustar mocks si Footer o Chat cambian de estructura.
  - [ ] `npm run test:e2e`: flujos que toquen chat/panel (si existen) siguen pasando.

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

- **Status:** ready-for-dev
- **Completion note:** Story 18.2 creada desde epic-18; dependencia 18.1 (LazyMotion) ya implementada en código (Floating/FloatingMobile como .tsx, Chat con `m`).

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
