## Context

El header actual usa `LogoIcon` (SVG 2D estatico) en dos superficies: `Logo` (desktop) y `LogoMenuTrigger` (mobile). El cambio requiere reemplazar ese logo en la misma posicion por un cubo 3D con orientacion real y transiciones discretas por ejes.

Restricciones clave del sistema:

- El header tiene reglas estrictas de breakpoints y tamano (42px/44px en area de logo).
- El proyecto ya utiliza Framer Motion y `useReducedMotion` para animaciones accesibles.
- El comportamiento del trigger mobile no debe romper apertura/cierre del menu.

Stakeholder principal: producto/diseno (Angel DevStack).

## Goals / Non-Goals

**Goals:**

- Implementar un `LogoCube` con 6 caras y estado de orientacion discreto.
- Soportar acciones de rotacion `rotateUp`, `rotateDown`, `rotateLeft`, `rotateRight` sin drift acumulativo.
- Mantener la experiencia visual y layout del header en desktop y mobile.
- Respetar accesibilidad con fallback para `prefers-reduced-motion`.

**Non-Goals:**

- No introducir render 3D con WebGL/Three.js.
- No redisenar layout de header ni cambiar zonas del sistema de navegacion.
- No alterar APIs de dominios ni contratos de datos de backend.

## Decisions

1. **Separar logica y visual del cubo**
   - Decision: crear un modulo de orientacion (state machine pura) separado del componente visual.
   - Rationale: evita acoplar transformaciones visuales con reglas espaciales, y reduce errores de consistencia.
   - Alternativa considerada: mantener estado visual acumulativo en el componente. Rechazada por mayor riesgo de desincronizacion.

2. **Usar CSS 3D para geometria del cubo**
   - Decision: representar caras con `transform-style: preserve-3d`, `rotateX/rotateY`, `translateZ`.
   - Rationale: suficiente para un logo de navbar, liviano y sin dependencia extra.
   - Alternativa considerada: canvas/WebGL. Rechazada por sobrecosto de complejidad y mantenimiento.

3. **Usar Framer Motion solo para orquestacion de transiciones**
   - Decision: la rotacion es discreta por accion; Framer controla timing/easing y reset visual post-transicion.
   - Rationale: reutiliza patrones ya presentes en el proyecto y permite transiciones suaves controladas.
   - Alternativa considerada: solo CSS transitions. Valida pero menos flexible para secuencias y estados.

4. **Integracion por reemplazo de `LogoIcon` en puntos existentes**
   - Decision: mantener `Logo` y `LogoMenuTrigger` como hosts; sustituir icono por `LogoCube`.
   - Rationale: minimiza impacto en layout y evita tocar flujo de navegacion/menu.
   - Alternativa considerada: nuevo wrapper de header. Rechazada por scope innecesario.

5. **Fallback de movimiento reducido**
   - Decision: desactivar transiciones y mostrar estado estable cuando `useReducedMotion` sea true.
   - Rationale: alineado con politica de accesibilidad existente.
   - Alternativa considerada: reducir velocidad sin desactivar. Rechazada para v1 por ambiguedad UX.

## Risks / Trade-offs

- **[Riesgo] Regresion visual en header por overflow/perspectiva** -> **Mitigacion**: limitar tamano del cubo al bounding box actual del logo y testear en breakpoints 0-879 y 880+.
- **[Riesgo] Desincronizacion entre orientacion logica y animacion** -> **Mitigacion**: aplicar patron accion -> animacion -> update logico -> reset visual.
- **[Riesgo] Performance por animaciones frecuentes en navbar** -> **Mitigacion**: usar animacion discreta (no libre/infinita), throttle para idle y respetar reduced motion.
- **[Trade-off] Mayor complejidad inicial frente a logo estatico** -> **Mitigacion**: encapsular en modulo reutilizable y cubrir rotaciones con tests unitarios.

## Migration Plan

1. Implementar modulo de orientacion del cubo y tests unitarios de rotaciones.
2. Implementar `LogoCube` con CSS 3D y comportamiento base sin afectar interacciones de logo/menu.
3. Reemplazar uso de `LogoIcon` en `Logo` y `LogoMenuTrigger`.
4. Ajustar estilos para mantener tamano/contraste en desktop y mobile.
5. Validar accesibilidad/reduced motion y ejecutar suites de header/menu relevantes.

Rollback:

- Revertir reemplazo a `LogoIcon` manteniendo modulo nuevo sin uso (o revert commit atomico de integracion).

## Open Questions

- Definir trigger primario de rotacion en v1: hover-only, click, idle discreto, o combinacion.
- Definir lenguaje visual de caras (numeros, simbolos o grafica de marca) para la primera version.
