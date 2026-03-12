## ADDED Requirements

### Requirement: Cubo con orientacion discreta y consistente

El sistema SHALL modelar el logo como un cubo de 6 caras con un estado de orientacion explicito (`front`, `back`, `top`, `bottom`, `left`, `right`) y actualizar dicho estado mediante acciones discretas (`rotateUp`, `rotateDown`, `rotateLeft`, `rotateRight`).

#### Scenario: Rotacion hacia arriba

- **WHEN** se ejecuta la accion `rotateUp` desde una orientacion valida
- **THEN** la cara `top` MUST pasar a `front`, `front` MUST pasar a `bottom`, `bottom` MUST pasar a `back`, y `back` MUST pasar a `top`

#### Scenario: Rotacion hacia la izquierda

- **WHEN** se ejecuta la accion `rotateLeft` desde una orientacion valida
- **THEN** la cara `right` MUST pasar a `front`, `front` MUST pasar a `left`, `left` MUST pasar a `back`, y `back` MUST pasar a `right`

### Requirement: Integracion en el mismo slot del logo actual

El sistema SHALL renderizar el nuevo logo-cubo en el mismo lugar funcional y visual donde hoy se usa el logo en header desktop (`Logo`) y trigger mobile (`LogoMenuTrigger`), preservando comportamiento de navegacion/menu existente.

#### Scenario: Header desktop

- **WHEN** la aplicacion se renderiza en breakpoint `navContent` o superior
- **THEN** el area de marca MUST mostrar el logo-cubo en lugar del logo estatico sin alterar la disposicion de zonas del header

#### Scenario: Header mobile trigger

- **WHEN** la aplicacion se renderiza por debajo de `navContent` y el usuario toca el trigger de logo
- **THEN** el componente MUST seguir actuando como disparador de apertura/cierre de menu y el logo-cubo MUST renderizarse dentro del mismo control

### Requirement: Capa visual separada de la logica de orientacion

El sistema SHALL separar la logica de orientacion del cubo de la capa de animacion visual para evitar acumulacion indefinida de transforms y mantener consistencia espacial.

#### Scenario: Fin de transicion discreta

- **WHEN** finaliza una transicion de 90 grados asociada a una accion de rotacion
- **THEN** el sistema MUST consolidar el nuevo estado logico de orientacion y MUST resetear el estado visual temporal de animacion

### Requirement: Accesibilidad y reduced motion

El sistema SHALL respetar `prefers-reduced-motion` para el logo-cubo en header y menu trigger.

#### Scenario: Usuario con reduced motion activo

- **WHEN** `prefers-reduced-motion` esta habilitado
- **THEN** el logo-cubo MUST mostrarse en estado estable sin animaciones de rotacion

### Requirement: Estabilidad responsive del contenedor de logo

El sistema SHALL mantener el logo-cubo dentro de los limites de tamano y alineacion esperados por el header en mobile y desktop.

#### Scenario: Render en mobile y desktop

- **WHEN** el logo-cubo se renderiza en los breakpoints definidos del sistema de layout
- **THEN** el componente MUST ajustarse al bounding box del logo existente y MUST NOT provocar overflow visual ni desplazamiento de zonas del header
