## Why

El footer actual no refleja el nuevo lenguaje visual solicitado: falta una primera seccion con fade gradient, una segunda seccion tecnica con jerarquia tipografica ajustada y mejor balance entre keys/values. Este ajuste se necesita ahora para extender el diseno existente sin perder coherencia responsive ni contratos de layout.

## What Changes

- Reorganizar el footer en dos secciones: una superior con gradient fade y una inferior con fondo solido.
- Centrar en la primera linea superior el copyright y autor, y mantener debajo las columnas `Contact` y `Links`.
- Ajustar iconografia: mover iconos de Telegram/Email a la izquierda y sincronizar escalas (icons de links ligeramente mas grandes, icons de contact ligeramente mas pequenos).
- Actualizar la seccion inferior de metadata con opacidad general (~0.75), linea `Built with...` centrada y tres lineas tecnicas (`State & Data`, `Motion & UI`, `Testing & Accessibility`) con layout balanceado.
- Reducir peso visual de keys (`opacity: 0.6`, `font-weight: 500`) y mantener values con `font-weight: 400`.

## Capabilities

### New Capabilities

- `footer`: Footer de dos secciones con gradient fade, jerarquia tipografica refinada y metadata tecnica balanceada.

### Modified Capabilities

- None.

## Impact

- Afecta principalmente `src/ui/organisms/Footer/index.tsx` y `src/ui/organisms/Footer/styles.css`.
- Puede requerir ajuste de pruebas de contrato visual/selectores en suites E2E o CSS si dependian del markup anterior.
- Sin cambios de API/backend; impacto enfocado en estructura y estilos frontend.
