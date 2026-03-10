## Context

El footer ya fue refactorizado en un cambio previo hacia bloques `Contact` y `Links`, pero ahora requiere una extension visual y de composicion: primera seccion con fade gradient, segunda seccion de metadata tecnica con fondo solido y jerarquia tipografica mas sutil para keys/values. El cambio debe preservar el comportamiento responsive, mantener integracion en `src/app/layout.tsx` y evitar regresiones en navegacion/visibilidad del footer por ruta.

## Goals / Non-Goals

**Goals:**

- Implementar un footer de dos secciones con corte visual claro entre gradient superior y slab inferior.
- Mantener copyright/autor centrado en la primera linea y conservar columnas `Contact` y `Links` debajo.
- Sincronizar iconografia entre grupos (contact ligeramente menor, links ligeramente mayor) y mover Telegram/Email a icon-left.
- Reequilibrar metadata tecnica: `Built with...` centrado y tres lineas con keys menos pesadas y values distribuidos.

**Non-Goals:**

- Cambiar contenido de dominio/perfil o APIs para los links existentes.
- Redisenar layout global fuera del organismo Footer.
- Introducir nuevas dependencias de UI o librerias de layout.

## Decisions

### Decision: Keep footer as a single organism update

- **Choice**: Ajustar `src/ui/organisms/Footer/index.tsx` y `src/ui/organisms/Footer/styles.css` en lugar de crear organismos nuevos.
- **Alternatives considered**: Separar en `FooterTop`/`FooterBottom` como componentes independientes; migrar a configuracion de contenido desde dominio.
- **Rationale**: Minimiza riesgo de ruptura de tests y mantiene contratos de montaje/visibilidad existentes.

### Decision: Use layered background for section split

- **Choice**: Implementar un gradient vertical en la seccion superior y fondo solido para la inferior dentro del mismo footer.
- **Alternatives considered**: Unico fondo solido con borde divisor; pseudo-elemento overlay global.
- **Rationale**: Cumple intencion visual de fade sin complejidad extra de stacking/z-index.

### Decision: Standardize icon scale by group semantics

- **Choice**: Aplicar reglas CSS separadas para iconos de `Contact` y `Links`, con links un poco mayores que contact.
- **Alternatives considered**: Escala unica para todos los iconos; ajuste por icono individual hardcodeado.
- **Rationale**: Permite consistencia visual y ajustes futuros sin tocar markup repetidamente.

### Decision: Metadata rows use key/value visual hierarchy

- **Choice**: Keys con `opacity: 0.6` y `font-weight: 500`; values con `font-weight: 400`, ocupando el espacio remanente.
- **Alternatives considered**: Peso identico en keys/values; layout de badges en lugar de texto corrido.
- **Rationale**: Mejora legibilidad y balance visual, alineado con solicitud de menor peso en labels.

## Risks / Trade-offs

- [Ruptura de pruebas por cambios de estructura del DOM] -> Actualizar selectores/assertions en tests de footer en el mismo cambio.
- [Gradient diferente entre breakpoints] -> Definir tokens/variables claros en CSS y validar en mobile + desktop.
- [Desbalance de espaciado en metadata line wrapping] -> Usar grid/flex con columnas estables para keys y bloque flexible para values.

## Migration Plan

1. Ajustar markup del footer para separar seccion superior (hero footer) e inferior (meta footer).
2. Aplicar nuevos estilos de fondo, opacidad, tipografia y escala de iconos.
3. Sincronizar pruebas afectadas (E2E o contratos CSS/DOM) en el mismo PR.
4. Rollback: revertir cambios en `Footer/index.tsx`, `Footer/styles.css` y tests sincronizados.

## Open Questions

- Confirmar valor final del color solido de la segunda seccion (`#111214` propuesto en request).
- Confirmar si `Storybook` debe permanecer en `Motion & UI` o moverse a otra linea de stack.
