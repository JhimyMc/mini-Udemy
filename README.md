# 🎓 mini-Udemy — Plataforma de cursos con microservicios

**Curso:** Cloud Computing — Universidad Continental
**Producto académico N.º 3** — Actividad grupal

## 👥 Integrantes

| Integrante | Rol | Microservicio |
|------------|-----|---------------|
| @JhimyMc | Líder | Estudiantes |
| @Luis Cristian Rafaele Huaman | Desarrollador | Cursos |
| @Daniel Benjamin Quispirroca Benitez | Desarrollador | Inscripciones |
| @Edwards Andree Ochoa Cutipa | Desarrollador | Progreso |
| @Urpi Radhakrina Pilco Del Alamo | Desarrollador | Certificados |

## 📖 Introducción

En las provincias de la región **Cusco**, muchos jóvenes quieren capacitarse para conseguir mejores oportunidades de trabajo, pero la oferta de cursos se concentra en la ciudad, la conexión a Internet suele ser limitada y, al terminar un curso, no tienen una constancia que puedan mostrar a un empleador.

**mini-Udemy** es una plataforma de cursos en línea, ligera y pensada para usarse desde el celular, donde el estudiante:

1. Se registra.
2. Elige un curso y se inscribe.
3. Avanza lección por lección.
4. Al completar el 100 %, obtiene un **certificado** con un código único.

El sistema está construido con una **arquitectura de microservicios**: cada servicio es independiente, tiene su propia base de datos y se comunica con los demás por HTTP. Se ejecuta con **Docker Compose** y se valida automáticamente con **GitHub Actions**.

## 🧩 Microservicios

| Microservicio | Puerto | Responsabilidad | Se comunica con |
|---------------|--------|-----------------|-----------------|
| **Estudiantes** | 3001 | Registrar y consultar estudiantes | — |
| **Cursos** | 3002 | Catálogo de cursos y número de lecciones | — |
| **Inscripciones** | 3003 | Inscribir a un estudiante en un curso | Estudiantes, Cursos |
| **Progreso** | 3004 | Registrar lecciones completadas y calcular el % de avance | Inscripciones, Cursos |
| **Certificados** | 3005 | Emitir el certificado cuando el progreso llega al 100 % | Inscripciones, Progreso |

```mermaid
flowchart LR
    E[Estudiantes :3001]
    C[Cursos :3002]
    I[Inscripciones :3003]
    P[Progreso :3004]
    X[Certificados :3005]

    I -- valida estudiante --> E
    I -- valida curso --> C
    P -- valida inscripción --> I
    P -- total de lecciones --> C
    X -- valida inscripción --> I
    X -- verifica 100 % --> P
```

**Tecnologías:** Node.js + Express · PostgreSQL · Docker · Docker Compose · Jest + Supertest · GitHub Actions

**Evidencias**
**Jhimy Mc**
Protección de Roles para el PR 
<img width="940" height="668" alt="image" src="https://github.com/user-attachments/assets/e42d538b-8089-49b0-8993-8b13eff8799b" />

Colaboradores Equipo
<img width="940" height="678" alt="image" src="https://github.com/user-attachments/assets/bdd7523a-6465-466d-b281-8b21aa1f6c70" />
<img width="940" height="1200" alt="image" src="https://github.com/user-attachments/assets/ce400a8e-b8f2-45a7-a36b-3db0f39e93bb" />

Pruebas del primer Test de Estudiantes 
<img width="940" height="466" alt="image" src="https://github.com/user-attachments/assets/8af6dbca-2915-4270-a564-db5263d5d544" />

PR2
<img width="940" height="925" alt="image" src="https://github.com/user-attachments/assets/b0190880-7c8c-4f01-9903-875d8b013716" />

Automatizado con CI para la autoverificación con Action
<img width="940" height="923" alt="image" src="https://github.com/user-attachments/assets/6b6dd1d7-a49c-49b9-b92d-c370dbe48351" />
<img width="940" height="510" alt="image" src="https://github.com/user-attachments/assets/6a547707-0a60-415e-9b1a-e1dde6423677" />
<img width="940" height="446" alt="image" src="https://github.com/user-attachments/assets/a72b6e4c-94a7-497c-b939-9addf1af6e69" />
<img width="940" height="510" alt="image" src="https://github.com/user-attachments/assets/3a17cef2-2553-48b9-9f94-4c2231dbc990" />

**Evidencias**
**Cristian-> Luis-sketch993**
Figura 1. Creación de la rama feature/cursos 

<img width="604" height="340" alt="image" src="https://github.com/user-attachments/assets/13b1ad55-46d5-4c0f-ba47-94296378317d" />

Se evidencia la creación correcta de la rama feature/cursos, destinada al desarrollo independiente del microservicio Cursos, manteniendo la rama main como base del proyecto. 

Figura 2. Verificación de la conexión entre Docker Desktop y Ubuntu 

<img width="602" height="347" alt="image" src="https://github.com/user-attachments/assets/91e2fb7d-0956-432d-9736-e5310ebb31c4" />

Se comprueba que Docker está operativo desde Ubuntu mediante la visualización de los contenedores activos. 

Figura 3. Primer commit del microservicio Cursos 

<img width="606" height="109" alt="image" src="https://github.com/user-attachments/assets/75566557-cda7-4808-9b96-2299ff1e3273" />

Se registra el primer avance del microservicio Cursos, incluyendo la estructura inicial, la conexión a PostgreSQL, las dependencias y la configuración de Docker. 

Figura 4. Despliegue del microservicio Cursos mediante Docker Compose 

<img width="607" height="417" alt="image" src="https://github.com/user-attachments/assets/549218d2-8280-41d0-817c-cd4a161f5073" />

Se evidencia la construcción de la imagen Docker, la inicialización de PostgreSQL y el inicio correcto del contenedor del microservicio Cursos. 

Figura 5. Verificación de los registros iniciales en PostgreSQL.

<img width="619" height="345" alt="image" src="https://github.com/user-attachments/assets/7db80d4d-fad0-4421-8d4d-ba135f633ccf" />

Se evidencia la creación de la tabla cursos y la inserción de los tres registros iniciales definidos en el script init.sql. 

Figura 6. Segundo commit del microservicio Cursos 

<img width="606" height="339" alt="image" src="https://github.com/user-attachments/assets/3ceb05ee-2570-4ef9-8543-6fe291aa377f" />

Se evidencia la incorporación del script SQL para la creación y carga inicial de cursos, junto con la implementación de los endpoints y validaciones de la API REST. 

Figura 7. Ejecución satisfactoria de las pruebas automatizadas del microservicio Cursos 

<img width="608" height="344" alt="image" src="https://github.com/user-attachments/assets/1185935a-c878-4baf-b39d-fc572ec03624" />

Se evidencia la ejecución de siete pruebas mediante Jest y Supertest, todas aprobadas, verificando los endpoints, las validaciones y el registro de cursos. 

Figura 8. Pull Request del microservicio Cursos hacia el repositorio central 

<img width="608" height="314" alt="image" src="https://github.com/user-attachments/assets/b3a325fd-9f15-4347-ac2a-0047f0ce05f9" />

Pull request enviado a la rama central , para su revision respectiva

Evidencias de aprobacion y revision:

<img width="1659" height="823" alt="image" src="https://github.com/user-attachments/assets/57ea3573-2003-473a-aaea-5d9585c1cfbc" />


















 

**Evidencias**
**Daniel -> Daniel318767 (Microservicio Inscripciones)**

El microservicio **Inscripciones** (puerto 3003) registra la inscripción de un estudiante en un curso. Antes de guardar, consulta por HTTP a **Estudiantes** y a **Cursos** para validar que ambos existan, y evita inscripciones duplicadas. Sus datos son consultados luego por **Progreso** y **Certificados**.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/inscripciones` | Lista todas las inscripciones |
| GET | `/inscripciones/:id` | Consulta una inscripción (404 si no existe) |
| POST | `/inscripciones` | Crea una inscripción (400 si el estudiante o curso no existe, 409 si ya está inscrito, 503 si no responde Estudiantes o Cursos) |
| DELETE | `/inscripciones/:id` | Elimina una inscripción |

Figura 1. Rama feature/inscripciones y commits del microservicio

<img width="700" alt="Rama y commits de Inscripciones" src="docs/capturas/inscripciones/fig1-rama-commits.png" />

Se evidencia la rama feature/inscripciones, creada a partir de main y ya subida a GitHub (origin/feature/inscripciones), con sus tres commits: estructura, conexión a BD y Dockerfile; API REST e init.sql; y pruebas automatizadas.

Figura 2. Despliegue con Docker Compose desde Ubuntu (WSL)

<img width="700" alt="Docker Compose" src="docs/capturas/inscripciones/fig2-docker.png" />

Se evidencia la construcción de las imágenes y el inicio de los contenedores de Estudiantes, Cursos e Inscripciones, con sus bases de datos PostgreSQL en estado Healthy.

Figura 3. Consulta de las inscripciones iniciales

<img width="700" alt="GET /inscripciones" src="docs/capturas/inscripciones/fig3-api.png" />

Se evidencia la respuesta del endpoint GET /inscripciones (puerto 3003) con los tres registros iniciales definidos en init.sql.

Figura 4. Ejecución satisfactoria de las pruebas automatizadas

<img width="700" alt="Pruebas Jest" src="docs/capturas/inscripciones/fig4-tests.png" />

Se evidencia la ejecución de seis pruebas (I1 a I6) con Jest y Supertest, todas aprobadas, verificando la validación contra Estudiantes y Cursos, el rechazo de datos inexistentes y de inscripciones duplicadas.

Figura 5. Pull Request y verificación automática con GitHub Actions

<img width="700" alt="Pull Request y CI" src="docs/capturas/inscripciones/fig5-pr-ci.png" />

Pull Request enviado a la rama main de JhimyMc/mini-Udemy. El flujo CI construye las imágenes, levanta los contenedores y ejecuta las pruebas de cada microservicio con resultado exitoso; queda pendiente la revisión del líder para fusionar.
