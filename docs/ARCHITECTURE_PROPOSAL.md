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
- Facilita las pruebas y el mantenimiento.
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

- `received`
- `in_progress`
- `selected`
- `discarded`

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
        │   │   ├── models.py
        │   │   └── service.py
        │   │
        │   ├── pipeline/
        │   │   ├── router.py
        │   │   ├── schemas.py
        │   │   ├── models.py
        │   │   └── service.py
        │   │
        │   └── notes/
        │       ├── router.py
        │       ├── schemas.py
        │       ├── models.py
        │       └── service.py
        │
        └── dependencies.py
```

Esta estructura separa claramente routers, schemas, modelos, lógica de negocio y configuración.

### Responsabilidad de cada archivo

#### `main.py`

Sería el punto de entrada de la aplicación FastAPI.

Su responsabilidad debería ser principalmente:

- Crear la aplicación.
- Registrar routers.
- Aplicar configuración global.
- Configurar middleware.

No debería contener toda la lógica del negocio.

#### `router.py`

Contendría las rutas HTTP pertenecientes al dominio.

Por ejemplo, el router de candidatos contendría las rutas relacionadas con candidatos.

#### `schemas.py`

Definiría las estructuras de datos utilizadas para recibir y devolver información mediante la API.

Esto permite validar qué información recibe cada endpoint y qué información devuelve.

#### `models.py`

Contendría los modelos que representan las entidades internas del dominio y, cuando exista una capa de persistencia, su representación relacionada con los datos almacenados.

Separar los modelos de los schemas permite distinguir entre la representación interna de los datos y las estructuras utilizadas para recibir o devolver información mediante la API.

#### `service.py`

Contendría la lógica de negocio.

Por ejemplo, si para cambiar el estado de un candidato fuera necesario comprobar previamente determinadas condiciones, esa lógica debería estar en el servicio y no directamente dentro del endpoint.

#### `core/`

Contendría configuración compartida por toda la aplicación, evitando duplicar este tipo de lógica dentro de los módulos.

---

## 5. Organización de routers y endpoints

FastAPI permite separar las rutas utilizando `APIRouter`.

En lugar de tener todos los endpoints dentro de `main.py`, cada dominio tendría su propio router.

### Candidates

```text
GET    /candidates
GET    /candidates/{candidate_id}
POST   /candidates
PUT    /candidates/{candidate_id}
DELETE /candidates/{candidate_id}
```

Estas rutas se agruparían dentro del router correspondiente al dominio `candidates`.

### Pipeline

```text
PATCH  /candidates/{candidate_id}/status
```

Esta ruta permitiría modificar el estado de un candidato dentro del proceso de selección.

La lógica asociada al cambio de estado pertenecería al dominio del pipeline.

### Notes

```text
GET    /candidates/{candidate_id}/notes
POST   /candidates/{candidate_id}/notes
DELETE /candidates/{candidate_id}/notes/{note_id}
```

Estas rutas permitirían gestionar las notas asociadas a un candidato.

Agrupar las rutas de esta forma permite identificar rápidamente qué parte de la aplicación es responsable de cada funcionalidad.

También evita que `main.py` termine convirtiéndose en un archivo demasiado grande y difícil de mantener.

---

## 6. Convenciones de FastAPI investigadas

Antes de realizar esta propuesta he revisado la documentación oficial de FastAPI sobre la organización de aplicaciones grandes.

FastAPI propone utilizar `APIRouter` para dividir una aplicación en diferentes archivos y módulos cuando el proyecto empieza a crecer.

Este enfoque permite que cada parte de la aplicación tenga sus propias rutas y después se registre dentro de la aplicación principal utilizando `include_router()`.

La documentación también muestra estructuras donde las responsabilidades se separan en distintos módulos, evitando concentrar toda la aplicación en un único archivo.

Estas convenciones influyen directamente en la estructura propuesta para Brasaland, donde cada dominio dispone de sus propios routers, schemas, modelos y servicios, mientras que la configuración común se mantiene separada dentro de `core`.

Fuente:

https://fastapi.tiangolo.com/tutorial/bigger-applications/

---

## 7. Separación entre frontend y backend

El frontend y el backend deben considerarse sistemas separados aunque formen parte del mismo producto.

El frontend será responsable de:

- Interfaz de usuario.
- Formularios.
- Navegación.
- Visualización de candidatos.
- Interacción del usuario.

El backend será responsable de:

- Reglas de negocio.
- Gestión de datos.
- Validaciones.
- Endpoints de la API.
- Comunicación con persistencia o servicios externos.

La comunicación entre ambos se realizará mediante peticiones HTTP a la API.

Por ejemplo:

```text
Frontend
   |
   | HTTP / JSON
   ↓
FastAPI Backend
   |
   ↓
Datos / servicios
```

El frontend no debería depender de cómo está organizada internamente la lógica del backend.

Solo necesita conocer el contrato de la API.

---

## 8. Organización dentro del monorepo

Actualmente Brasaland utiliza un monorepo que contiene diferentes partes del proyecto.

Mantendría frontend y backend dentro del mismo repositorio, pero claramente separados.

Una posible organización sería:

```text
brasaland-hito-2/
│
├── docs/
│   └── ARCHITECTURE_PROPOSAL.md
│
├── uis/
│   └── backoffice/
│
├── services/
│   └── backend/
│
├── shared/
│
└── README.md
```

Este enfoque permite mantener el proyecto dentro de un único repositorio sin mezclar las responsabilidades del frontend y el backend.

También facilita compartir documentación y configuraciones comunes manteniendo cada aplicación en su propio directorio.

---

## 9. Comunicación mediante API

El frontend no debería acceder directamente a la lógica interna o los datos del backend.

La comunicación se realizaría utilizando endpoints HTTP.

Por ejemplo, para obtener los candidatos:

```text
GET /candidates
```

El backend respondería con información estructurada, normalmente utilizando JSON.

Esto permite que frontend y backend puedan evolucionar de forma relativamente independiente mientras se mantenga estable el contrato de la API.

---

## 10. CORS

Cuando frontend y backend se ejecutan en orígenes diferentes, el navegador aplica restricciones de seguridad relacionadas con CORS.

Por ejemplo, durante desarrollo podría existir una situación similar a:

```text
Frontend:
http://localhost:3000

Backend:
http://localhost:8000
```

Aunque ambos se ejecuten en el mismo ordenador, los puertos diferentes hacen que sean orígenes distintos.

FastAPI proporciona `CORSMiddleware` para definir explícitamente qué orígenes pueden realizar peticiones al backend.

No configuraría CORS permitiendo indiscriminadamente cualquier origen en producción.

Los orígenes permitidos deberían configurarse según el entorno.

Fuente:

https://fastapi.tiangolo.com/tutorial/cors/

---

## 11. Variables de entorno

Algunos valores de configuración no deberían escribirse directamente dentro del código.

Por ejemplo:

- URL del frontend.
- URL de una base de datos.
- Tokens.
- API keys.
- Credenciales.
- Configuración específica de cada entorno.

Estos valores deberían gestionarse mediante variables de entorno.

Esto evita incluir información sensible en GitHub y permite utilizar diferentes configuraciones para desarrollo y producción.

FastAPI documenta el uso de configuración y variables de entorno como parte de la gestión de settings de una aplicación.

Fuente:

https://fastapi.tiangolo.com/advanced/settings/

---

## 12. Separación de responsabilidades

Una decisión importante es evitar colocar toda la lógica dentro de los endpoints.

Un endpoint debería recibir la petición, validar los datos necesarios y delegar la operación al módulo correspondiente.

Ejemplo conceptual:

```text
Petición HTTP
      ↓
Router
      ↓
Service
      ↓
Modelos / Datos
```

De esta forma, cada capa tiene una responsabilidad concreta.

### Router

Gestiona la comunicación HTTP y organiza los endpoints.

### Schemas

Definen y validan los datos que entran y salen de la API.

### Models

Representan las entidades internas del sistema y su posible relación con la persistencia.

### Service

Gestiona las reglas del negocio y coordina las operaciones necesarias.

### Core

Gestiona la configuración y elementos compartidos por toda la aplicación.

Esta separación facilita entender el sistema y modificar una parte sin afectar innecesariamente a las demás.

---

## 13. Riesgos y puntos de atención

### Riesgo 1: concentrar demasiada lógica en `main.py`

Un riesgo habitual al comenzar un proyecto FastAPI pequeño es añadir todos los endpoints directamente en `main.py`.

Esto puede funcionar inicialmente, pero a medida que aparecen nuevas funcionalidades el archivo se vuelve difícil de mantener.

**Decisión:** utilizar routers separados desde el principio.

### Riesgo 2: mezclar lógica de negocio con endpoints

Si las reglas del negocio se escriben directamente dentro de los routers, será más difícil reutilizarlas, probarlas y modificarlas.

**Decisión:** separar la lógica mediante archivos `service.py`.

### Riesgo 3: confundir schemas y modelos

Si no existe una separación clara entre los datos utilizados por la API y las entidades internas del sistema, el equipo podría terminar mezclando responsabilidades.

**Decisión:** utilizar `schemas.py` para las estructuras de entrada y salida de la API y `models.py` para las entidades internas o relacionadas con persistencia.

### Riesgo 4: problemas de comunicación entre frontend y backend

Si frontend y backend se ejecutan en orígenes diferentes pueden aparecer errores de CORS.

**Decisión:** configurar explícitamente los orígenes autorizados mediante `CORSMiddleware`.

### Riesgo 5: incluir configuración sensible en Git

Credenciales, tokens o API keys podrían exponerse accidentalmente si se escriben directamente en el código.

**Decisión:** utilizar variables de entorno y evitar subir archivos locales con secretos al repositorio.

### Riesgo 6: crear una arquitectura excesivamente compleja

Introducir microservicios u otras capas innecesarias desde el inicio podría aumentar la dificultad de desarrollo y mantenimiento sin aportar una ventaja real al estado actual de Brasaland.

**Decisión:** comenzar con un monolito modular y reevaluar la arquitectura si el tamaño o las necesidades del sistema cambian.

---

## 14. Conclusión

Para esta fase de Brasaland propongo construir el backend como una aplicación FastAPI basada en una arquitectura monolítica modular organizada por dominios y responsabilidades.

Los dominios principales serían inicialmente candidatos, pipeline y notas.

Cada dominio tendría sus propios routers, schemas, modelos y servicios, evitando concentrar toda la aplicación en un único archivo.

El frontend y el backend permanecerían separados y se comunicarían exclusivamente mediante una API HTTP.

También se tendría en cuenta desde el inicio la configuración de CORS y el uso de variables de entorno.

Esta arquitectura mantiene el proyecto sencillo en su fase actual, pero proporciona una estructura suficientemente clara para incorporar nuevas funcionalidades en el futuro sin tener que reorganizar completamente el backend.

---

## 15. Referencias

- FastAPI — Bigger Applications:  
  https://fastapi.tiangolo.com/tutorial/bigger-applications/

- FastAPI — CORS:  
  https://fastapi.tiangolo.com/tutorial/cors/

- FastAPI — Settings and Environment Variables:  
  https://fastapi.tiangolo.com/advanced/settings/