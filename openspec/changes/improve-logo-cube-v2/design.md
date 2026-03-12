# Design: Improve LogoCube V2

## Technical Approach

Aplicar un refactor incremental sobre `LogoCube` V1: mover la geometria de caras a un modulo dedicado (`cube-transforms.ts`), permitir contenido configurable por cara (sin romper la orientacion discreta), y ampliar pruebas de comportamiento del componente (hover, idle, reduced motion). Se mantiene el patron actual de sincronizacion por `transitionend` para preservar consistencia logica/visual.

## Architecture Decisions

### Decision: Mantener state machine de orientacion y extraer transforms

**Choice**: conservar `cube-orientation.ts` como fuente de verdad de estado y crear `cube-transforms.ts` para mapear posicion de cara -> transform CSS 3D.
**Alternatives considered**: mantener transforms hardcodeados en clases CSS o mover toda la geometria al componente.
**Rationale**: separa responsabilidades (estado vs geometria), reduce acoplamiento y facilita pruebas unitarias del mapeo 3D.

### Decision: Configuracion de caras con fallback seguro

**Choice**: exponer una API de caras configurables para `LogoCube` con fallback a set completo por defecto.
**Alternatives considered**: mantener solo caras numericas fijas (1..6).
**Rationale**: habilita identidad de marca (letras/simbolos) sin comprometer robustez cuando falta configuracion.

### Decision: Preservar sincronizacion por transitionend

**Choice**: mantener el flujo accion -> animacion -> commit orientacion -> reset visual usando `onTransitionEnd`.
**Alternatives considered**: usar `setTimeout` para consolidar estado.
**Rationale**: `transitionend` evita drift y desincronizacion por variaciones reales de timing/render.

### Decision: Cobertura de pruebas de comportamiento de componente

**Choice**: agregar pruebas de `LogoCube` para reduced-motion, hover-trigger e idle trigger (con timers controlados).
**Alternatives considered**: depender solo de pruebas unitarias de orientacion.
**Rationale**: los riesgos de v2 estan en interaccion/animacion, no solo en transformaciones logicas.

## Data Flow

`Logo` / `LogoMenuTrigger`
│
▼
`LogoCube` (props: faceConfig opcional)
│
├── Estado logico: `orientation` (cube-orientation)
├── Estado visual: `rotation`, `isAnimating`, `isResetting`
├── Geometria: `getFaceTransform(position, size)` (cube-transforms)
└── Preferencia UX: `useReducedMotion()`
│
▼
Render 6 caras + animacion discreta + fallback estable

## File Changes

| File                                                           | Action | Description                                                                                    |
| -------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `src/ui/molecules/LogoCube/cube-transforms.ts`                 | Create | Nuevo modulo para mapear posicion de cara a transform 3D.                                      |
| `src/ui/molecules/LogoCube/index.tsx`                          | Modify | Introducir configuracion de caras, usar `cube-transforms`, mantener flujo con `transitionend`. |
| `src/ui/molecules/LogoCube/cube-orientation.ts`                | Modify | Generalizar tipo de valor de cara para soportar simbolos/strings.                              |
| `src/ui/molecules/LogoCube/styles.css`                         | Modify | Ajustes de legibilidad y contencion para caras configurables en header.                        |
| `src/ui/molecules/LogoCube/__tests__/cube-orientation.test.ts` | Modify | Mantener cobertura logica y ajustar tipos/expectations si cambian valores.                     |
| `src/ui/molecules/LogoCube/__tests__/LogoCube.test.tsx`        | Create | Pruebas de interaccion de componente (hover, idle, reduced-motion).                            |
| `src/ui/molecules/Logo/index.tsx`                              | Modify | Pasar configuracion de caras (si aplica) al host desktop.                                      |
| `src/ui/molecules/LogoMenuTrigger/index.tsx`                   | Modify | Pasar configuracion de caras (si aplica) en trigger mobile sin romper toggle.                  |

## Interfaces / Contracts

```ts
export type FacePosition =
  | "front"
  | "back"
  | "top"
  | "bottom"
  | "left"
  | "right";

export type FaceValue = string | number;

export type CubeOrientation = Record<FacePosition, FaceValue>;

export type CubeAction =
  | "rotateUp"
  | "rotateDown"
  | "rotateLeft"
  | "rotateRight";

export type CubeFaceConfig = Partial<Record<FacePosition, FaceValue>>;

export interface LogoCubeProps {
  className?: string;
  faces?: CubeFaceConfig;
}

export function getFaceTransform(position: FacePosition, size: number): string;
```

Contrato funcional:

- `faces` MAY ser parcial; el sistema SHALL completar faltantes con defaults.
- Las acciones de rotacion SHALL operar sobre orientacion completa y valida de 6 caras.

## Testing Strategy

| Layer       | What to Test                                  | Approach                                                                                 |
| ----------- | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Unit        | `rotateUp/Down/Left/Right`, `applyCubeAction` | Jest con asserts de mapeo de orientacion y invariantes de 6 caras unicas.                |
| Unit        | `getFaceTransform`                            | Jest validando transform esperado por cada `FacePosition` y fallback seguro.             |
| Integration | `LogoCube` interacciones                      | RTL + fake timers para hover e idle; mock de `useReducedMotion` para ruta sin animacion. |
| Integration | Hosts de header (`Logo`, `LogoMenuTrigger`)   | Verificar render y no regresion funcional del trigger mobile.                            |
| E2E         | No alcance obligatorio en v2                  | Mantener smoke existente de header/menu; agregar E2E solo si se detecta regresion real.  |

## Migration / Rollout

No migration required.

Rollout:

1. Refactor interno (`cube-transforms` + tipos) sin cambiar API externa.
2. Activar configuracion de caras en hosts.
3. Ejecutar pruebas de componente y suites de header/menu.

## Open Questions

- [ ] Definir set final de caras de marca para produccion (ej. `A S Z Y M K` vs simbolos).
- [ ] Confirmar politica visual para contenido multi-caracter en caras pequenas (truncado, escala, o limite estricto).
