# Tech Context — Brasaland Talent Pipeline

## Arquitectura del repositorio

El proyecto se desarrolla dentro del monorepo de Brasaland.

Las interfaces de usuario deben vivir dentro de:

- `./uis/website` → web pública de Brasaland.
- `./uis/backoffice` → aplicación interna del equipo de Brasaland.

Cualquier servicio backend propio debe colocarse dentro de:

- `./services`

El monorepo no dispone actualmente de un runner global en la raíz, por lo que cada aplicación debe mantener su propia configuración y comandos de ejecución.

## Stack tecnológico

Para las interfaces de este hito se utilizará:

- Next.js
- React
- TypeScript

Se priorizarán componentes reutilizables y una estructura sencilla y mantenible.

## Backend y datos

El backend del proceso de selección ya existe mediante una API mock centralizada.

No es necesario modificar la estructura de datos de la API.

La interfaz debe trabajar con los valores definidos por el backend, pero nunca mostrar los valores internos directamente al usuario.

## Estados

Valores de API:

- `received`
- `in_progress`
- `selected`
- `discarded`

Etiquetas visibles:

- Recibida
- En proceso
- Seleccionada
- Descartada

## Etapas

Valores de API:

- `pending`
- `review`
- `personal_interview`
- `technical_interview`
- `offer_presented`

Etiquetas visibles:

- Pendiente de revisión
- En revisión
- Entrevista personal
- Entrevista técnica
- Oferta presentada

## Restricciones técnicas y funcionales

- Los valores crudos de `status` y `stage` nunca deben aparecer en la interfaz.
- Las notas internas solo deben mostrarse dentro del detalle del candidato.
- La búsqueda por nombre o email debe funcionar sin recargar la página.
- Los filtros por estado y etapa deben funcionar sin recargar la página.
- El formulario de alta debe incluir todos los campos requeridos por la API.
- El backoffice debe mostrar información relevante del proceso de selección directamente en pantalla.
- Se debe respetar la estructura existente del monorepo y evitar duplicar carpetas o funcionalidades.

## Decisiones de arquitectura iniciales

- Mantener la web pública y el backoffice como aplicaciones separadas.
- Mantener layouts independientes para `website` y `backoffice`.
- Centralizar las traducciones de estados y etapas para evitar mostrar valores internos de la API.
- Reutilizar componentes cuando sea posible.