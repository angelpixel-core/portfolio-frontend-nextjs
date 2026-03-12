# Proposal: Improve LogoCube V2

## Intent

Refinar la primera version de `LogoCube` para que sea mas mantenible y configurable sin romper el header actual. El objetivo es cerrar brechas detectadas en la exploracion: modularizar transforms 3D, habilitar caras personalizables de marca, y ampliar cobertura de pruebas del componente.

## Scope

### In Scope

- Extraer el mapeo de transforms 3D a `cube-transforms.ts` para separar geometria de presentacion.
- Permitir contenido de caras configurable (ej. numeros, letras, simbolos), manteniendo estado de orientacion discreto.
- Agregar pruebas de componente para interacciones clave (`hover`, `idle`, `prefers-reduced-motion`).
- Ajustar estilos del cubo para conservar legibilidad y estabilidad en breakpoints del header.

### Out of Scope

- Reescribir el logo con WebGL/Three.js.
- Redisenar layout del header o zonas de navegacion.
- Cambiar contratos de dominios/contact points o APIs.

## Approach

Seguir un refactor incremental sobre la implementacion actual: mantener la maquina de estados y el patron de sincronizacion `transitionend`, mover transforms a modulo dedicado, introducir configuracion de caras en `LogoCube`, y blindar regresiones con tests de comportamiento del componente y suites de header/menu existentes.

## Affected Areas

| Area                                            | Impact   | Description                                                            |
| ----------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `src/ui/molecules/LogoCube/index.tsx`           | Modified | Exponer configuracion de caras y mantener flujo de animacion discreta. |
| `src/ui/molecules/LogoCube/cube-orientation.ts` | Modified | Generalizar tipo de cara para soportar labels de marca.                |
| `src/ui/molecules/LogoCube/cube-transforms.ts`  | New      | Centralizar reglas de transformacion 3D por posicion.                  |
| `src/ui/molecules/LogoCube/styles.css`          | Modified | Ajustes de legibilidad y responsive para caras configurables.          |
| `src/ui/molecules/LogoCube/__tests__/`          | Modified | Incorporar pruebas de interaccion visual y reduced motion.             |
| `src/ui/molecules/Logo/index.tsx`               | Modified | Consumir `LogoCube` con configuracion de caras (si aplica).            |
| `src/ui/molecules/LogoMenuTrigger/index.tsx`    | Modified | Mantener trigger mobile y render configurable del cubo.                |

## Risks

| Risk                                                      | Likelihood | Mitigation                                                            |
| --------------------------------------------------------- | ---------- | --------------------------------------------------------------------- |
| Caras con texto/simbolos largos rompen legibilidad        | Med        | Definir limites de longitud y estilos adaptativos por breakpoint.     |
| Regresion de sincronizacion logica-visual al refactorizar | Med        | Mantener patron actual de `transitionend` + tests de flujo de accion. |
| Impacto visual en header por cambios de tamano            | Low        | Validar en breakpoints `<880` y `>=880` con suites de NavBar/Overlay. |

## Rollback Plan

Revertir los commits de V2 y mantener `LogoCube` V1 como baseline. Si el problema es aislado, revertir solo integracion de configuracion de caras y conservar mejoras internas no riesgosas (`cube-transforms` + tests).

## Dependencies

- `useReducedMotion` (existente en `src/hooks/ui/useReducedMotion.ts`)
- Jest/RTL para pruebas de componente
- Framer Motion (ya instalado en proyecto)

## Success Criteria

- [ ] `LogoCube` usa modulo `cube-transforms.ts` sin perder comportamiento actual.
- [ ] El componente acepta caras configurables y renderiza contenido de marca correctamente.
- [ ] Interacciones `hover`, `idle` y `reduced-motion` quedan cubiertas por pruebas automatizadas.
- [ ] No hay regresiones en pruebas de `NavBar` y `MobileMenuOverlay`.
