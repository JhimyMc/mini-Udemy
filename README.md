# 🎓 mini-Udemy — Plataforma de cursos con microservicios

**Curso:** Cloud Computing — Universidad Continental
**Producto académico N.º 3** — Actividad grupal
**Repositorio central:** https://github.com/JhimyMc/mini-Udemy

---

## 👥 Integrantes y avance

| Integrante | Usuario GitHub | Rol | Microservicio | Avance |
|------------|----------------|-----|---------------|--------|
| Jhimy Mercado Caceres | [@JhimyMc](https://github.com/JhimyMc) | Líder | Estudiantes + docker-compose + CI | ✅ 100 % |
| Luis Cristian Rafaele Huaman | [@Luis-sketch993](https://github.com/Luis-sketch993) | Desarrollador | Cursos | ✅ 100 % |
| Daniel Benjamin Quispirroca Benitez | [@Daniel318767](https://github.com/Daniel318767) | Desarrollador | Inscripciones | ✅ 100 % |
| Edwards Andree Ochoa Cutipa | [@andres8a21](https://github.com/andres8a21) | Desarrollador | Progreso | ❌ 0 % |
| Urpi Radhakrisna Pilco Del Alamo | [@sakataaaaaa](https://github.com/sakataaaaaa) | Desarrollador | Certificados | ✅ 100 % |

> ⚠️ **Estado actual:** 4 de los 5 microservicios están implementados, probados y fusionados en `main`. La carpeta `progreso/` está vacía porque **el microservicio Progreso no fue entregado**. Ver la sección [Estado actual y limitaciones](#-estado-actual-y-limitaciones).

---

## 📖 Introducción

En las provincias de la región **Cusco**, muchos jóvenes quieren capacitarse para conseguir mejores oportunidades de trabajo, pero la oferta de cursos se concentra en la ciudad, la conexión a Internet suele ser limitada y, al terminar un curso, no tienen una constancia que puedan mostrar a un empleador.

**mini-Udemy** es una plataforma de cursos en línea, ligera y pensada para usarse desde el celular, donde el estudiante:

1. Se registra.
2. Elige un curso y se inscribe.
3. Avanza lección por lección.
4. Al completar el 100 %, obtiene un **certificado** con un código único que un empleador puede verificar.

El sistema está construido con una **arquitectura de microservicios**: cada servicio es independiente, tiene su propia base de datos PostgreSQL y se comunica con los demás por HTTP. Se ejecuta con **Docker Compose** y se valida automáticamente con **GitHub Actions**.

---

## 🧩 Microservicios

| Microservicio | Puerto | Responsabilidad | Se comunica con | Estado |
|---------------|--------|-----------------|-----------------|--------|
| **Estudiantes** | 3001 | Registrar y consultar estudiantes | — | ✅ |
| **Cursos** | 3002 | Catálogo de cursos y número de lecciones | — | ✅ |
| **Inscripciones** | 3003 | Inscribir a un estudiante en un curso | Estudiantes, Cursos | ✅ |
| **Progreso** | 3004 | Registrar lecciones completadas y calcular el % de avance | Inscripciones, Cursos | ❌ No entregado |
| **Certificados** | 3005 | Emitir el certificado cuando el progreso llega al 100 % | Inscripciones, Progreso | ✅ (depende de Progreso) |

```mermaid
flowchart LR
    E[Estudiantes :3001]
    C[Cursos :3002]
    I[Inscripciones :3003]
    P[Progreso :3004<br/>NO ENTREGADO]
    X[Certificados :3005]

    I -- valida estudiante --> E
    I -- valida curso --> C
    P -- valida inscripción --> I
    P -- total de lecciones --> C
    X -- valida inscripción --> I
    X -- verifica 100 % --> P

    style P fill:#f8d7da,stroke:#c0392b,color:#000
```

**Tecnologías:** Node.js + Express · PostgreSQL 16 · Docker · Docker Compose · Jest + Supertest · GitHub Actions

### Reglas de negocio

| Regla | Servicio | Respuesta si no se cumple |
|-------|----------|---------------------------|
| Email de estudiante único | Estudiantes | `409` |
| Precio ≥ 0 y número de lecciones > 0 | Cursos | `400` |
| El estudiante y el curso deben existir para inscribirse | Inscripciones | `400` |
| No se permite inscribir dos veces al mismo estudiante en el mismo curso | Inscripciones | `409` |
| El certificado solo se emite con el progreso al 100 % | Certificados | `400` |
| Solo un certificado por inscripción | Certificados | `409` |
| Si un servicio del que se depende no responde | Inscripciones, Certificados | `503` |

---

## 🗂️ Organización del repositorio y flujo de trabajo

- **Líder:** @JhimyMc, responsable de revisar, aprobar y fusionar los Pull Requests.
- **Protección de `main`:** ningún cambio entra directamente; todo pasa por **Pull Request con al menos 1 aprobación**.
- **Forks y ramas:** cada integrante trabajó en su **fork** y en una rama `feature/<microservicio>`, y envió su PR al repositorio central.
- **Integración continua:** cada PR ejecuta automáticamente la construcción de imágenes Docker y las pruebas.

```
usuario/mini-Udemy (fork)
   └── rama feature/<servicio> ──Pull Request──► JhimyMc/mini-Udemy (main)
                                                  ├─ CI: build + pruebas ✅
                                                  └─ Revisión y aprobación del líder
```

### Pull Requests fusionados

| PR | Autor | Contenido |
|----|-------|-----------|
| #1 | @JhimyMc | `docker-compose.yml` con los 5 servicios y sus 5 bases de datos |
| #2 | @JhimyMc | Microservicio Estudiantes |
| #3 | @JhimyMc | CI con GitHub Actions |
| #4 | @JhimyMc | Evidencias del líder en el README |
| #6 / #7 | @Luis-sketch993 | Microservicio Cursos y evidencias |
| #8 | @Daniel318767 | Microservicio Inscripciones y evidencias |
| #5 | @sakataaaaaa | Microservicio Certificados y evidencias |

---

## 🧪 Pruebas automatizadas

Las pruebas usan **Jest + Supertest** y se ejecutan dentro de cada contenedor:

```bash
docker compose exec <servicio> npm test
```

| ID | Microservicio | Funcionalidad que verifica | Comportamiento esperado |
|----|---------------|----------------------------|-------------------------|
| E1 | Estudiantes | `GET /health` | `200` y `servicio: "estudiantes"` |
| E2 | Estudiantes | Listar estudiantes | `200` y lista con registros |
| E3 | Estudiantes | `GET /estudiantes/1` | `200` y `id = 1` |
| E4 | Estudiantes | `GET /estudiantes/9999` | `404` "Estudiante no encontrado" |
| E5 | Estudiantes | `POST` sin email | `400` |
| E6 | Estudiantes | `POST` válido | `201` |
| E7 | Estudiantes | `POST` con email repetido | `409` |
| C1 | Cursos | `GET /health` | `200` y `servicio: "cursos"` |
| C2 | Cursos | Listar cursos | `200` y lista con registros |
| C3 | Cursos | `GET /cursos/1` | `200` y `total_lecciones = 3` |
| C4 | Cursos | `GET /cursos/9999` | `404` "Curso no encontrado" |
| C5 | Cursos | `POST` con `total_lecciones = 0` | `400` |
| C6 | Cursos | `POST` con precio negativo | `400` |
| C7 | Cursos | `POST` válido | `201` |
| I1 | Inscripciones | `GET /health` | `200` y `servicio: "inscripciones"` |
| I2 | Inscripciones | `GET /inscripciones/1` | `200` |
| I3 | Inscripciones | Inscripción válida (consulta Estudiantes y Cursos) | `201` |
| I4 | Inscripciones | Estudiante inexistente | `400` "El estudiante o curso no existe" |
| I5 | Inscripciones | Curso inexistente | `400` |
| I6 | Inscripciones | Inscripción duplicada | `409` |
| P1–P7 | Progreso | — | ❌ **No implementadas (servicio no entregado)** |
| X1 | Certificados | `GET /health` | `200` y `servicio: "certificados"` |
| X2 | Certificados | Progreso incompleto (33 %) | `400` "El curso no está completado" |
| X3 | Certificados | Inscripción inexistente | `400` |
| X4 | Certificados | Emitir con 100 %, verificar por código y rechazar duplicado | `201`, `200`, `409` |
| X5 | Certificados | Código inexistente | `404` |

**Resumen:** Estudiantes 7/7 ✅ · Cursos 7/7 ✅ · Inscripciones 6/6 ✅ · Certificados 5/5 ✅ (con Progreso levantado localmente) · Progreso 0/7 ❌

---

## ⚙️ Integración continua (GitHub Actions)

El archivo `.github/workflows/ci.yml` se ejecuta en cada **push** y **Pull Request** hacia `main`:

1. Descarga el código.
2. Detecta qué microservicios tienen código.
3. Valida el `docker-compose.yml`.
4. **Construye las imágenes Docker**.
5. Levanta los contenedores y espera a que cada API responda en `/health`.
6. **Ejecuta las pruebas** de cada microservicio.
7. Si algo falla, muestra los registros; al final detiene los contenedores.

---

## 📸 Evidencias

### Jhimy Mercado Caceres — @JhimyMc (Líder · Estudiantes · docker-compose · CI)

**Figura 1.** Protección de la rama `main` (Pull Request obligatorio con 1 aprobación)

<img width="940" height="668" alt="Protección de main" src="https://github.com/user-attachments/assets/e42d538b-8089-49b0-8993-8b13eff8799b" />

**Figura 2.** Colaboradores del equipo

<img width="940" height="678" alt="Colaboradores" src="https://github.com/user-attachments/assets/bdd7523a-6465-466d-b281-8b21aa1f6c70" />
<img width="940" height="1200" alt="Colaboradores" src="https://github.com/user-attachments/assets/ce400a8e-b8f2-45a7-a36b-3db0f39e93bb" />

**Figura 3.** Pruebas del microservicio Estudiantes (7 pruebas aprobadas)

<img width="940" height="466" alt="Pruebas Estudiantes" src="https://github.com/user-attachments/assets/8af6dbca-2915-4270-a564-db5263d5d544" />

**Figura 4.** Pull Request #2 del microservicio Estudiantes, revisado y aprobado

<img width="940" height="925" alt="PR 2" src="https://github.com/user-attachments/assets/b0190880-7c8c-4f01-9903-875d8b013716" />

**Figura 5.** Integración continua con GitHub Actions: construcción de imágenes y pruebas automáticas

<img width="940" height="923" alt="CI" src="https://github.com/user-attachments/assets/6b6dd1d7-a49c-49b9-b92d-c370dbe48351" />
<img width="940" height="510" alt="CI" src="https://github.com/user-attachments/assets/6a547707-0a60-415e-9b1a-e1dde6423677" />
<img width="940" height="446" alt="CI" src="https://github.com/user-attachments/assets/a72b6e4c-94a7-497c-b939-9addf1af6e69" />
<img width="940" height="510" alt="CI" src="https://github.com/user-attachments/assets/3a17cef2-2553-48b9-9f94-4c2231dbc990" />

---

### Luis Cristian Rafaele Huaman — @Luis-sketch993 (Cursos)

**Figura 1.** Creación de la rama `feature/cursos`

<img width="604" height="340" alt="Rama feature/cursos" src="https://github.com/user-attachments/assets/13b1ad55-46d5-4c0f-ba47-94296378317d" />

Se evidencia la creación correcta de la rama `feature/cursos`, destinada al desarrollo independiente del microservicio Cursos, manteniendo `main` como base del proyecto.

**Figura 2.** Verificación de la conexión entre Docker Desktop y Ubuntu

<img width="602" height="347" alt="Docker y Ubuntu" src="https://github.com/user-attachments/assets/91e2fb7d-0956-432d-9736-e5310ebb31c4" />

Se comprueba que Docker está operativo desde Ubuntu mediante la visualización de los contenedores activos.

**Figura 3.** Primer commit del microservicio Cursos

<img width="606" height="109" alt="Primer commit" src="https://github.com/user-attachments/assets/75566557-cda7-4808-9b96-2299ff1e3273" />

Se registra el primer avance: estructura inicial, conexión a PostgreSQL, dependencias y configuración de Docker.

**Figura 4.** Despliegue del microservicio Cursos con Docker Compose

<img width="607" height="417" alt="Docker Compose Cursos" src="https://github.com/user-attachments/assets/549218d2-8280-41d0-817c-cd4a161f5073" />

Se evidencia la construcción de la imagen, la inicialización de PostgreSQL y el inicio correcto del contenedor.

**Figura 5.** Registros iniciales en PostgreSQL

<img width="619" height="345" alt="Registros PostgreSQL" src="https://github.com/user-attachments/assets/7db80d4d-fad0-4421-8d4d-ba135f633ccf" />

Se evidencia la creación de la tabla `cursos` y la inserción de los tres registros definidos en `init.sql`.

**Figura 6.** Segundo commit del microservicio Cursos

<img width="606" height="339" alt="Segundo commit" src="https://github.com/user-attachments/assets/3ceb05ee-2570-4ef9-8543-6fe291aa377f" />

Se incorpora el script SQL de creación y carga inicial, junto con los endpoints y validaciones de la API REST.

**Figura 7.** Pruebas automatizadas del microservicio Cursos (7 aprobadas)

<img width="608" height="344" alt="Pruebas Cursos" src="https://github.com/user-attachments/assets/1185935a-c878-4baf-b39d-fc572ec03624" />

Se ejecutan siete pruebas con Jest y Supertest, verificando endpoints, validaciones y el registro de cursos.

**Figura 8.** Pull Request del microservicio Cursos hacia el repositorio central

<img width="608" height="314" alt="PR Cursos" src="https://github.com/user-attachments/assets/b3a325fd-9f15-4347-ac2a-0047f0ce05f9" />

**Figura 9.** Revisión y aprobación del Pull Request

<img width="1659" height="823" alt="Aprobación PR Cursos" src="https://github.com/user-attachments/assets/57ea3573-2003-473a-aaea-5d9585c1cfbc" />

---

### Daniel Benjamin Quispirroca Benitez — @Daniel318767 (Inscripciones)

El microservicio **Inscripciones** (puerto 3003) registra la inscripción de un estudiante en un curso. Antes de guardar, consulta por HTTP a **Estudiantes** y a **Cursos** para validar que ambos existan, y evita inscripciones duplicadas.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/inscripciones` | Lista todas las inscripciones |
| GET | `/inscripciones/:id` | Consulta una inscripción (404 si no existe) |
| POST | `/inscripciones` | Crea una inscripción (400 si el estudiante o curso no existe, 409 si ya está inscrito, 503 si no responde Estudiantes o Cursos) |
| DELETE | `/inscripciones/:id` | Elimina una inscripción |

**Figura 1.** Rama `feature/inscripciones` y commits del microservicio

<img width="700" alt="Rama y commits de Inscripciones" src="docs/capturas/inscripciones/fig1-rama-commits.png" />

Se evidencia la rama `feature/inscripciones` subida a GitHub con sus tres commits: estructura y Dockerfile; API REST e `init.sql`; y pruebas automatizadas.

**Figura 2.** Despliegue con Docker Compose desde Ubuntu (WSL)

<img width="700" alt="Docker Compose" src="docs/capturas/inscripciones/fig2-docker.png" />

Se construyen e inician los contenedores de Estudiantes, Cursos e Inscripciones, con sus bases de datos en estado *Healthy*.

**Figura 3.** Consulta de las inscripciones iniciales

<img width="700" alt="GET /inscripciones" src="docs/capturas/inscripciones/fig3-api.png" />

Respuesta de `GET /inscripciones` con los tres registros iniciales.

**Figura 4.** Pruebas automatizadas (6 aprobadas)

<img width="700" alt="Pruebas Jest" src="docs/capturas/inscripciones/fig4-tests.png" />

Se verifican la validación contra Estudiantes y Cursos, el rechazo de datos inexistentes y de inscripciones duplicadas.

**Figura 5.** Pull Request y verificación automática con GitHub Actions

<img width="700" alt="Pull Request y CI" src="docs/capturas/inscripciones/fig5-pr-ci.png" />

El flujo CI construye las imágenes, levanta los contenedores y ejecuta las pruebas con resultado exitoso.

---

### Edwards Andree Ochoa Cutipa — @andres8a21 (Progreso)

❌ **Sin entregas.** No se registraron commits, rama ni Pull Request del microservicio Progreso en el repositorio central. La carpeta `progreso/` permanece vacía.

---

### Urpi Radhakrisna Pilco Del Alamo — @sakataaaaaa (Certificados)

El microservicio **Certificados** (puerto 3005) emite el certificado cuando el progreso llega al 100 %. Antes de guardarlo, consulta a **Inscripciones** y a **Progreso**. Cada certificado recibe un código único `MU-XXXXXXXX` que un empleador puede verificar.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio |
| GET | `/certificados` | Lista todos los certificados |
| GET | `/certificados/:id` | Consulta un certificado (404 si no existe) |
| GET | `/certificados/codigo/:codigo` | Verifica un certificado por su código (404 si no existe) |
| POST | `/certificados` | Emite un certificado (400 si la inscripción no existe o el curso no está completado, 409 si ya existe, 503 si no responde Inscripciones o Progreso) |
| DELETE | `/certificados/:id` | Elimina un certificado |

**Figura 1.** Fork del repositorio en GitHub

<img width="700" alt="Fork en GitHub" src="docs/capturas/certificados/fig1-fork.jpeg" />

Fork `sakataaaaaa/mini-Udemy` creado a partir de `JhimyMc/mini-Udemy`.

**Figura 2.** Remotos `origin` y `upstream`

<img width="700" alt="git remote -v" src="docs/capturas/certificados/fig2-remotes.jpeg" />

Repositorio clonado con el remoto `origin` (fork) y `upstream` (repositorio del líder).

**Figura 3.** Rama `feature/certificados`

<img width="700" alt="git branch" src="docs/capturas/certificados/fig3-rama.jpeg" />

**Figura 4.** Commits del microservicio

<img width="700" alt="git log" src="docs/capturas/certificados/fig4-commits.jpeg" />

**Figura 5.** Despliegue con Docker Compose

<img width="700" alt="docker compose ps" src="docs/capturas/certificados/fig5-docker.jpeg" />

**Figura 6.** Pruebas automatizadas (5 aprobadas)

<img width="700" alt="Pruebas Jest" src="docs/capturas/certificados/fig6-tests.jpeg" />

Se verifican la emisión, la verificación por código, el rechazo de cursos incompletos y de certificados duplicados.

**Figura 7.** Emisión, verificación y rechazo de certificados

<img width="700" alt="Demo con curl" src="docs/capturas/certificados/fig7-demo.jpeg" />

Emisión para una inscripción al 100 % (código `MU-9A50825D`), verificación por código (`200`) y rechazo de una inscripción al 33 % (`400`, "El curso no está completado").

**Figura 8.** Commits y push de la rama

<img width="700" alt="git push" src="docs/capturas/certificados/fig8-push.jpeg" />

---

## ⚠️ Estado actual y limitaciones

El microservicio **Progreso** no fue entregado, y esto afecta al flujo completo de la plataforma:

| Funcionalidad | Estado |
|---------------|--------|
| Registrar y consultar estudiantes | ✅ Funciona |
| Consultar y gestionar cursos | ✅ Funciona |
| Inscribir estudiantes en cursos | ✅ Funciona |
| Registrar avance de lecciones y calcular % | ❌ No disponible |
| Emitir certificados | ❌ Falla: Certificados no puede consultar el % de avance y responde `503 "No se pudo contactar a Inscripciones o Progreso"` |
| Verificar un certificado por código | ✅ Funciona para certificados ya emitidos |

Aun así, el caso demuestra una ventaja de la arquitectura de microservicios: **la falta de un servicio no detiene a los demás**. Estudiantes, Cursos e Inscripciones siguen funcionando con normalidad; solo se pierde la funcionalidad que depende directamente de Progreso.

---

## ▶️ Cómo ejecutar el proyecto

```bash
git clone https://github.com/JhimyMc/mini-Udemy.git
cd mini-Udemy

# Levantar los servicios disponibles
docker compose up -d --build estudiantes cursos inscripciones

# Probar
curl http://localhost:3001/estudiantes
curl http://localhost:3002/cursos
curl http://localhost:3003/inscripciones

# Pruebas
docker compose exec estudiantes npm test
docker compose exec cursos npm test
docker compose exec inscripciones npm test

# Detener
docker compose down -v
```
