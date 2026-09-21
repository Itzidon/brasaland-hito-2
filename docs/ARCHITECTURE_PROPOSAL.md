# Propuesta de Arquitectura de Backend — Brasaland

## 1. Objetivo

El objetivo de este documento es definir una propuesta inicial para la arquitectura del backend de Brasaland antes de comenzar su implementación.

Brasaland dispone de un Talent Pipeline Tracker para gestionar candidatos durante un proceso de selección. El backend deberá permitir centralizar la lógica relacionada con candidatos, estados del proceso, notas y operaciones necesarias para que el frontend pueda consultar y modificar información mediante una API.

La intención de esta propuesta es establecer una estructura sencilla, mantenible y preparada para crecer sin introducir complejidad innecesaria desde el inicio.

---

## 2. Patrón arquitectónico propuesto

Propongo utilizar una **arquitectura monolítica modular organizada por capas y dominios**.

Esto significa que el backend se desplegará inicialmente como una única aplicación FastAPI, pero internamente estará dividido en módulos con responsabilidades claramente diferenciadas.

No considero necesario utilizar microservicios en esta fase porque el sistema todavía tiene un alcance controlado y los principales procesos están estrechamente relacionados.

Una arquitectura de microservicios introduciría desde el principio mayor complejidad en despliegues, comunicación entre servicios, configuración, monitorización y gestión de datos.

El enfoque monolítico modular permite mantener la simplicidad del sistema y, al mismo tiempo, evita concentrar toda la lógica en un único archivo.

### Ventajas para Brasaland

- Permite desarrollar el backend de forma progresiva.
- Facilita localizar la lógica de cada dominio.
- Reduce el acoplamiento entre diferentes partes del sistema.
- Facilita pruebas y mantenimiento.
- Permite añadir nuevos módulos sin reorganizar toda la aplicación.
- Si el sistema creciera mucho en el futuro, algunos módulos podrían separarse posteriormente en servicios independientes.

---

## 3. Organización por dominios

La aplicación se organizaría principalmente alrededor de los dominios del negocio.

Inicialmente identifico los siguientes:

### Candidates

Responsable de la información relacionada con los candidatos.

Entre sus responsabilidades estarían:

- Crear candidatos.
- Consultar candidatos.
- Actualizar información de candidatos.
- Eliminar candidatos si fuera necesario.
- Buscar y filtrar candidatos.
- Consultar un candidato concreto.

### Pipeline

Responsable del estado de cada candidato dentro del proceso de selección.

Por ejemplo:

- received
- in_progress
- selected
- discarded

Este dominio permitirá cambiar la etapa o estado de un candidato sin mezclar esa lógica directamente con otras responsabilidades.

### Notes

Responsable de las notas internas asociadas a cada candidato.

Permitirá, por ejemplo:

- Consultar notas.
- Añadir notas.
- Eliminar notas.
- Asociar cada nota al candidato correspondiente.

### Core

Contendrá elementos compartidos por toda la aplicación como:

- Configuración.
- Variables de entorno.
- Configuración de CORS.
- Conexión con servicios externos.
- Configuración general del backend.

---

## 4. Estructura de carpetas propuesta

Una posible estructura para el backend sería:

```text
services/
└── backend/
    └── app/
        ├── main.py
        │
        ├── core/
        │   ├── config.py
        │   └── cors.py
        │
        ├── modules/
        │   ├── candidates/
        │   │   ├── router.py
        │   │   ├── schemas.py
        │   │   └── service.py
        │   │
        │   ├── pipeline/
        │   │   ├── router.py
        │   │   ├── schemas.py
        │   │   └── service.py
        │   │
        │   └── notes/
        │       ├── router.py
        │       ├── schemas.py
        │       └── service.py
        │
        └── dependencies.py

## 1. Objetivo

El objetivo de este documento es definir una propuesta inicial para la arquitectura del backend de Brasaland antes de comenzar su implementación.

Brasaland dispone de un Talent Pipeline Tracker para gestionar candidatos durante un proceso de selección. El backend deberá permitir centralizar la lógica relacionada con candidatos, estados del proceso, notas y operaciones necesarias para que el frontend pueda consultar y modificar información mediante una API.

La intención de esta propuesta es establecer una estructura sencilla, mantenible y preparada para crecer sin introducir complejidad innecesaria desde el inicio.

---

## 2. Patrón arquitectónico propuesto

Propongo utilizar una **arquitectura monolítica modular organizada por capas y dominios**.

Esto significa que el backend se desplegará inicialmente como una única aplicación FastAPI, pero internamente estará dividido en módulos con responsabilidades claramente diferenciadas.

No considero necesario utilizar microservicios en esta fase porque el sistema todavía tiene un alcance controlado y los principales procesos están estrechamente relacionados.

Una arquitectura de microservicios introduciría desde el principio mayor complejidad en despliegues, comunicación entre servicios, configuración, monitorización y gestión de datos.

El enfoque monolítico modular permite mantener la simplicidad del sistema y, al mismo tiempo, evita concentrar toda la lógica en un único archivo.

### Ventajas para Brasaland

- Permite desarrollar el backend de forma progresiva.
- Facilita localizar la lógica de cada dominio.
- Reduce el acoplamiento entre diferentes partes del sistema.
- Facilita pruebas y mantenimiento.
- Permite añadir nuevos módulos sin reorganizar toda la aplicación.
- Si el sistema creciera mucho en el futuro, algunos módulos podrían separarse posteriormente en servicios independientes.

---

## 3. Organización por dominios

La aplicación se organizaría principalmente alrededor de los dominios del negocio.

Inicialmente identifico los siguientes:

### Candidates

Responsable de la información relacionada con los candidatos.

Entre sus responsabilidades estarían:

- Crear candidatos.
- Consultar candidatos.
- Actualizar información de candidatos.
- Eliminar candidatos si fuera necesario.
- Buscar y filtrar candidatos.
- Consultar un candidato concreto.

### Pipeline

Responsable del estado de cada candidato dentro del proceso de selección.

Por ejemplo:

- received
- in_progress
- selected
- discarded

Este dominio permitirá cambiar la etapa o estado de un candidato sin mezclar esa lógica directamente con otras responsabilidades.

### Notes

Responsable de las notas internas asociadas a cada candidato.

Permitirá, por ejemplo:

- Consultar notas.
- Añadir notas.
- Eliminar notas.
- Asociar cada nota al candidato correspondiente.

### Core

Contendrá elementos compartidos por toda la aplicación como:

- Configuración.
- Variables de entorno.
- Configuración de CORS.
- Conexión con servicios externos.
- Configuración general del backend.

---

## 4. Estructura de carpetas propuesta

Una posible estructura para el backend sería:

```text
services/
└── backend/
    └── app/
        ├── main.py
        │
        ├── core/
        │   ├── config.py
        │   └── cors.py
        │
        ├── modules/
        │   ├── candidates/
        │   │   ├── router.py
        │   │   ├── schemas.py
        │   │   └── service.py
        │   │
        │   ├── pipeline/
        │   │   ├── router.py
        │   │   ├── schemas.py
        │   │   └── service.py
        │   │
        │   └── notes/
        │       ├── router.py
        │       ├── schemas.py
        │       └── service.py
        │
        └── dependencies.py