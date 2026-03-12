## Why

El logo actual del header es un icono 2D estatico y no expresa la identidad visual interactiva que se busca para la marca. Necesitamos evolucionarlo ahora a un cubo 3D con estados discretos para lograr un comportamiento espacial coherente sin romper la usabilidad del header en mobile y desktop.

## What Changes

- Reemplazar el logo actual en header (desktop) y en `LogoMenuTrigger` (mobile) por un componente `LogoCube` en la misma ubicacion visual y de interaccion.
- Introducir una maquina de estados de orientacion del cubo con 6 caras y acciones discretas: `rotateUp`, `rotateDown`, `rotateLeft`, `rotateRight`.
- Separar la logica de orientacion (estado) de la capa visual (animacion/transicion) para evitar rotaciones acumulativas inconsistentes.
- Implementar animacion 3D basada en CSS Transforms (con apoyo opcional de Framer Motion para orquestacion) y fallback para `prefers-reduced-motion`.
- Mantener dimensiones, contraste y comportamiento responsive actuales del area de logo para no afectar layout ni accesibilidad del header.

## Capabilities

### New Capabilities

- `logo-cube-orientation`: Define y renderiza un logo-cubo 3D con orientacion real, transiciones discretas por eje y comportamiento consistente en header desktop/mobile.

### Modified Capabilities

- Ninguna.

## Impact

- Codigo afectado (esperado):
  - `src/ui/atoms/icons/LogoIcon/index.tsx`
  - `src/ui/molecules/Logo/index.tsx`
  - `src/ui/molecules/Logo/styles.css`
  - `src/ui/molecules/LogoMenuTrigger/index.tsx`
  - `src/ui/molecules/LogoMenuTrigger/styles.css`
  - Nuevos modulos de logica/visual del cubo bajo `src/ui/...` (por definir en diseno)
- Dependencias/sistemas:
  - CSS 3D transforms (nativo)
  - Framer Motion (ya presente) para transicion controlada
  - Hook `useReducedMotion` existente
- Sin cambios de API publica externa.
