# Talent Pipeline Rules

## Scope

Esta regla aplica a cualquier archivo relacionado con la aplicación de selección de Brasaland, especialmente:

- `uis/backoffice/**`
- componentes de candidatos
- filtros y búsquedas
- formularios de candidatos
- lógica relacionada con estados, etapas y notas internas

## Reglas obligatorias

1. Nunca mostrar directamente en la interfaz valores internos de la API como:
   - `received`
   - `in_progress`
   - `selected`
   - `discarded`
   - `pending`
   - `personal_interview`
   - `technical_interview`
   - `offer_presented`

2. Mostrar siempre sus etiquetas legibles en español.

3. Las notas internas de candidatos solo pueden aparecer dentro de la vista de detalle del candidato.

4. La búsqueda por nombre o email debe funcionar sin recargar completamente la página.

5. Los filtros por estado y etapa deben funcionar sin recargar completamente la página.

6. No modificar el contrato de la API ni inventar nuevos campos sin confirmación del desarrollador.

7. El formulario de creación de candidatos debe respetar todos los campos requeridos por la API.

## Protección de decisiones

El agente debe solicitar confirmación explícita antes de:

- cambiar valores permitidos de estado o etapa;
- modificar el comportamiento de las notas internas;
- cambiar la estructura del contrato de la API;
- eliminar funcionalidades existentes del proceso de selección.