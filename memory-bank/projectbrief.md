# Project Brief — Brasaland Talent Pipeline

## Empresa

Brasaland es una cadena de restaurantes de parrilla con 14 locales en Colombia y Florida.

Brasaland Digital es la unidad tecnológica interna responsable de construir las herramientas que utilizan los equipos operativos de la empresa.

## Proyecto

El proyecto consiste en desarrollar una herramienta interna para gestionar el proceso de selección de candidatos de Brasaland.

Actualmente el equipo de People gestiona más de cien candidaturas mediante Google Sheets. Varias personas trabajan simultáneamente sobre el mismo archivo y ya se han producido pérdidas de información.

La herramienta busca sustituir este proceso manual por una interfaz centralizada y más segura.

## Puesto actualmente gestionado

- Puesto: Asistente de Dirección
- Empresa: Brasaland
- Ubicación: Sede corporativa, Medellín
- Perfil: experiencia en asistencia ejecutiva, gestión de agenda y viajes corporativos e inglés profesional.

## Objetivos principales

La aplicación debe permitir:

- Ver todas las candidaturas con nombre, puesto, estado y etapa.
- Buscar candidatos por nombre o email sin recargar la página.
- Filtrar candidatos por estado y etapa.
- Consultar el detalle de cada candidato.
- Cambiar el estado y la etapa de una candidatura.
- Añadir y eliminar notas internas.
- Registrar candidatos manualmente.
- Corregir datos de candidatos existentes.

## Estados de candidatura

Los valores utilizados por la API son:

- `received` → Recibida
- `in_progress` → En proceso
- `selected` → Seleccionada
- `discarded` → Descartada

Los valores internos de la API nunca deben mostrarse directamente al usuario.

## Etapas del proceso

- `pending` → Pendiente de revisión
- `review` → En revisión
- `personal_interview` → Entrevista personal
- `technical_interview` → Entrevista técnica
- `offer_presented` → Oferta presentada

La interfaz debe mostrar siempre las etiquetas legibles y nunca los valores crudos de la API.

## Reglas importantes del producto

- Las notas internas solo pueden mostrarse dentro del detalle del candidato.
- El formulario para registrar candidatos debe contener todos los campos requeridos por la API.
- Los estados y etapas deben presentarse mediante etiquetas legibles para el equipo de People.

## Problema que resuelve

El proyecto reduce el riesgo de pérdida de información y facilita que varias personas del equipo de People puedan gestionar simultáneamente un proceso de selección con más de cien candidaturas.