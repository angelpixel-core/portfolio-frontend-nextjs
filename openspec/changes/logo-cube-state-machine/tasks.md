## 1. Modelo de orientacion del cubo

- [x] 1.1 Crear modulo de tipos y estado base de orientacion (6 caras) para el logo-cubo.
- [x] 1.2 Implementar funciones puras `rotateUp`, `rotateDown`, `rotateLeft`, `rotateRight` y dispatcher de acciones.
- [x] 1.3 Agregar pruebas unitarias para validar transiciones de orientacion en cada accion.

## 2. Capa visual 3D del logo

- [x] 2.1 Crear componente `LogoCube` con estructura de 6 caras y geometria CSS 3D (`preserve-3d`, `translateZ`, `rotateX/Y`).
- [x] 2.2 Implementar animacion discreta de 90 grados por accion separando estado visual temporal de estado logico.
- [x] 2.3 Integrar fallback de `prefers-reduced-motion` para mostrar estado estable sin rotaciones.

## 3. Integracion en header y trigger mobile

- [x] 3.1 Reemplazar `LogoIcon` por `LogoCube` en `Logo` (desktop) manteniendo layout y tamaño actuales.
- [x] 3.2 Reemplazar `LogoIcon` por `LogoCube` en `LogoMenuTrigger` (mobile) preservando apertura/cierre de menu.
- [x] 3.3 Ajustar estilos para evitar overflow o desplazamientos en breakpoints del sistema (`<880` y `>=880`).

## 4. Validacion y hardening

- [x] 4.1 Verificar comportamiento visual en light/dark y estados de hover/idle definidos para v1.
- [x] 4.2 Ejecutar pruebas relevantes de header/menu y corregir regresiones.
- [x] 4.3 Documentar decisiones clave de implementacion en comentarios minimos o notas de cambio si aplica.
