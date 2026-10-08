# Skill — Candidate UI Review

## Objetivo

Revisar los cambios realizados en la interfaz de candidatos de Brasaland y comprobar que cumplen las reglas funcionales definidas en `CONTEXT.md`.

Esta skill tiene un único objetivo: verificar que la UI del proceso de selección respeta las reglas del negocio antes de entregar cambios.

## Cuándo usar esta skill

Usar esta skill después de modificar archivos relacionados con:

- listado de candidatos;
- detalle de candidato;
- filtros;
- búsqueda;
- estados;
- etapas;
- notas internas;
- formularios de candidatos.

## Inputs

La skill necesita:

1. Los archivos modificados del backoffice.
2. El resultado de `git diff`.
3. Las reglas definidas en:
   - `CONTEXT.md`
   - `memory-bank/projectbrief.md`
   - `.agents/rules/talent-pipeline-rules.md`

## Procedimiento

1. Revisar los archivos modificados.
2. Buscar valores crudos de la API que puedan mostrarse al usuario.
3. Comprobar cómo se representan estados y etapas.
4. Revisar dónde se muestran las notas internas.
5. Verificar el comportamiento de búsqueda y filtros.
6. Revisar los formularios modificados.
7. Generar un resultado indicando si la revisión es correcta o si existen problemas.

## Criterios de aceptación

La revisión se considera correcta únicamente si se cumplen todos estos criterios:

- `received` no aparece como texto visible para el usuario.
- `in_progress` no aparece como texto visible para el usuario.
- `selected` no aparece como texto visible para el usuario.
- `discarded` no aparece como texto visible para el usuario.
- `pending` no aparece como texto visible para el usuario.
- `review` no aparece como texto visible para el usuario.
- `personal_interview` no aparece como texto visible para el usuario.
- `technical_interview` no aparece como texto visible para el usuario.
- `offer_presented` no aparece como texto visible para el usuario.
- Los estados y etapas usan etiquetas legibles en español.
- Las notas internas únicamente aparecen en la vista de detalle del candidato.
- La búsqueda por nombre o email no provoca una recarga completa de página.
- Los filtros por estado y etapa no provocan una recarga completa de página.
- Los formularios respetan los campos requeridos por la API.

## Output esperado

La skill debe devolver uno de estos resultados:

### PASS

Todos los criterios de aceptación se cumplen.

### FAIL

Debe indicar:

- archivo afectado;
- criterio incumplido;
- cambio necesario para corregirlo.