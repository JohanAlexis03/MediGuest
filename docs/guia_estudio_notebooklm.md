# MediQuest — Guía Maestra de Arquitectura, Dominio Clínico APH y Base de Datos

> **Documento fuente preparado para Google NotebookLM.**  
> Este documento sintetiza la visión, la arquitectura de software de 3 capas, el modelo de datos relacional en MySQL, la gobernanza de ramas Git, el dominio clínico de Atención Prehospitalaria (APH) y la resiliencia defensiva con `http.cat` para el proyecto universitario **MediQuest**.

---

## 1. Contexto, Visión y Propósito del Proyecto

### 1.1. ¿Qué es MediQuest?
**MediQuest** es una plataforma educativa interactiva orientada a dispositivos móviles diseñada específicamente para estudiantes de **Atención Prehospitalaria (APH)** y técnicos en urgencias médicas. Su propósito es permitir la resolución de casos clínicos simulados para entrenar y fortalecer el razonamiento clínico, la toma de decisiones bajo presión y el aprendizaje activo (*active recall*).

### 1.2. Objetivo General
Desarrollar una aplicación móvil que permita a los estudiantes de Atención Prehospitalaria resolver casos clínicos interactivos, con el fin de fortalecer el razonamiento clínico y la toma de decisiones.

### 1.3. Alcance del MVP vs. Funcionalidades Futuras
* **Incluido en el MVP:**
  * Registro e inicio de sesión de estudiantes y docentes.
  * Catálogo de casos clínicos con filtros por categoría (Trauma, Médico, Toxicológico, Pediátrico).
  * Ficha clínica interactiva estructurada en protocolos internacionales (**ABCDE** y **SAMPLE**).
  * Cuadrícula de signos vitales en tiempo real (incluyendo Escala de Coma de Glasgow).
  * Visor inmersivo de imágenes diagnósticas y radiografías con soporte de zoom y pan nativo (**RF06**).
  * Módulo de evaluación con preguntas de selección múltiple, cálculo de puntuación inmediata y retroalimentación pedagógica detallada basada en guías oficiales (**PHTLS / ATLS / AHA**) (**RF08, RF09**).
  * Registro histórico de intentos y progreso del alumno por especialidad en base de datos (**RF10 / RF11**).
  * Banco de **al menos 100 casos clínicos** almacenados en base de datos MySQL con semillas de datos.
  * Manejo defensivo de errores y pantallas no encontradas con alertas visuales de **http.cat**.
* **Fuera de alcance (futuras iteraciones):**
  * Diagnóstico autónomo por IA generativa o generación no supervisada de casos.
  * Modelado o maniquíes en 3D.
  * Historias clínicas reales o datos de pacientes reales (todo el contenido es académico).
  * Chat en vivo o redes sociales médicas.

---

## 2. Arquitectura de Software (Patrón Cliente-Servidor de 3 Capas)

El sistema MediQuest sigue una arquitectura distribuida desacoplada para garantizar escalabilidad, seguridad y mantenibilidad:

```
+-------------------------------------------------------------+
|                     CAPA 1: PRESENTACIÓN                    |
|          Frontend Móvil (React Native con Expo SDK 57)      |
|   - Expo Router (Navegación declarativa)                    |
|   - Safe Area Multiplataforma (react-native-safe-area-ctx)  |
|   - CasesService con patrón Adapter y fallback a mocks      |
|   - HttpCatAlert: Modal de errores con http.cat             |
+------------------------------+------------------------------+
                               | Peticiones HTTP / JSON (CORS)
                               v
+-------------------------------------------------------------+
|                     CAPA 2: LÓGICA DE NEGOCIO               |
|            Backend API REST (Java 23 con Spring Boot 4)     |
|   - ClinicalCaseController (GET /api/cases, GET /{id})      |
|   - EvaluationService (POST /api/cases/{id}/solve)          |
|   - ProgressController (GET /api/progress)                  |
|   - DTOs Seguros: Ocultan isCorrect al estudiante           |
|   - GlobalExceptionHandler: Errores tipados con catUrl      |
|   - Repositorios Spring Data JPA / Hibernate                |
+------------------------------+------------------------------+
                               | Conexión JDBC (HikariCP)
                               v
+-------------------------------------------------------------+
|                     CAPA 3: PERSISTENCIA                    |
|              Base de Datos Relacional (MySQL 9.3)           |
|   - Base de datos: mediquest_db                             |
|   - Codificación: utf8mb4 (símbolos médicos y acentos)      |
|   - Banco de 100+ casos clínicos normalizados               |
|   - Historial inmutable de intentos en tabla 'attempts'     |
+-------------------------------------------------------------+
```

### 2.1. El Rol de Cada Capa
1. **Frontend (La Vista):** Diseñado directamente en código nativo de Expo sin dependencias de maquetadores externos. Captura los gestos del usuario, muestra los signos vitales con colores clínicos y envía las selecciones del alumno al servidor. Cuenta con programación defensiva: si el servidor está apagado o sin conexión, conmuta transparentemente a casos locales para no congelar la experiencia del alumno.
2. **Backend (El Cerebro):** Implementado en Java 23 con Spring Boot 4. Su rol crítico es la **seguridad lógica**: las respuestas correctas y sus explicaciones **jamás se envían al cliente antes de resolver el caso**. El servidor recibe la opción elegida por el estudiante, la valida contra la base de datos, calcula la ponderación, persiste el intento en MySQL y devuelve la calificación final con la justificación médica.
3. **Base de Datos (La Bóveda):** Aloja los casos clínicos, las opciones evaluadas y el historial de calificaciones en `mediquest_db`. Si el móvil se reinicia o se cambia de dispositivo, los datos y avances del estudiante permanecen intactos.

---

## 3. Modelo de Datos Relacional (`mediquest_db`)

La base de datos fue creada en MySQL mediante la instrucción:
```sql
CREATE DATABASE mediquest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.1. Justificación Técnica del Juego de Caracteres (`utf8mb4`)
En medicina de urgencias se emplean de forma constante caracteres especiales que exceden los 3 bytes del UTF-8 estándar:
* Saturación de oxígeno con subíndice: $\text{SpO}_2$.
* Microgramos para dosificación farmacológica: $\mu\text{g}$ o $\text{mcg}$.
* Unidades de temperatura: $^\circ\text{C}$.
* Indicadores de tendencia hemodinámica: $\uparrow, \downarrow$.
* Acentos y terminología médica técnica en español.  
`utf8mb4` garantiza almacenamiento de 4 bytes sin corrupción ni pérdida de datos (*mojibake*).

### 3.2. Estructura de Tablas y Entidades Clave

```
+------------------+       +-------------------+       +-----------------------+
|     USUARIOS     |       |   CASOS_CLINICOS  |       |       PREGUNTAS       |
+------------------+       +-------------------+       +-----------------------+
| id (PK)          |<-\    | id (PK, VARCHAR)  |<-\    | id (PK)               |
| nombre           |  |    | titulo            |  |    | clinical_case_id (FK)-+---\
| email (UNIQUE)   |  |    | specialty (ENUM)  |  |    | prompt (TEXT)         |   |
| password_hash    |  |    | difficulty (ENUM) |  |    +-----------------------+   |
| role (ENUM)      |  |    | dispatch_context  |  |                                |
+------------------+  |    | scene             |  |    +-----------------------+   |
        |             |    | kinematics        |  |    |    QUESTION_OPTIONS   |   |
        | 1           |    | primary_survey    |  |    +-----------------------+   |
        |             |    | sample_history    |  |    | id (PK)               |   |
        v N           |    | vitals            |  |    | question_id (FK) <----+---/
+------------------+  |    | media             |  |    | option_key (A,B,C,D)  |
|     ATTEMPTS     |  |    +-------------------+  |    | text (TEXT)           |
+------------------+  |              | 1          |    | is_correct (BIT)      |
| id (PK)          |  |              |            |    | clinical_feedback     |
| user_id (FK) ----+--/              v N          |    +-----------------------+
| clinical_case_id-+-----------------+            |
| selected_opt_key |                              |
| is_correct (BIT) |                              |
| score_percentage |                              |
| time_spent_sec   |                              |
| completed_at     |                              |
+------------------+                              |
```

#### Descripción de Campos por Tabla:
1. **`users`**: Administra credenciales y roles (`ROLE_STUDENT` para resolución y seguimiento, `ROLE_TEACHER` / `ROLE_ADMIN` para gestión docente).
2. **`clinical_cases`**: El núcleo clínico. Contiene el escenario descriptivo, categoría de emergencia (`TRAUMA`, `CARDIOVASCULAR`, `RESPIRATORIO`, `TOXICOLOGIA`, `PEDIATRIA`, `NEUROLOGIA`), dificultad (`BASICO`, `INTERMEDIO`, `AVANZADO`), examen físico ABCDE, anamnesis SAMPLE y signos vitales embebidos.
3. **`questions`**: Desafíos de toma de decisiones clínicas asociados a cada caso (diagnóstico diferencial, elección de vía aérea, cálculo de fármacos, priorización de traslado).
4. **`question_options`**: Opciones A, B, C y D. El campo `is_correct` es protegido en el servidor. El campo `clinical_feedback` contiene la justificación médica formativa.
5. **`attempts`** (RF10 y RF11): Registro inmutable de cada sesión de entrenamiento. Guarda la nota (0-100%), la opción seleccionada, el tiempo empleado y la fecha para graficar el avance del alumno.

---

## 4. Dominio Clínico de Atención Prehospitalaria (APH)

MediQuest modela con rigor los protocolos de soporte vital avanzado prehospitalario:

### 4.1. Evaluación Primaria Sistemática (Protocolo ABCDE - PHTLS/ATLS)
* **A (Airway / Vía Aérea con Control Cervical):** Permeabilidad de la vía aérea, presencia de estridor, broncorrea masiva, laringoespasmo y necesidad de Secuencia de Intubación Rápida (SIR).
* **B (Breathing / Ventilación):** Frecuencia respiratoria, esfuerzo ventilatorio (uso de músculos accesorios, tirajes intercostales), simetría en auscultación y saturometría ($\text{SpO}_2$).
* **C (Circulation / Circulación con Control de Hemorragias):** Frecuencia cardíaca, pulsos centrales y periféricos, presión arterial, llenado capilar, color y temperatura de la piel, monitorización electrocardiográfica.
* **D (Disability / Déficit Neurológico):** Escala de Coma de Glasgow (Ocular /4, Verbal /5, Motor /6, Total /15), reactividad y diámetro pupilar (midriasis, miosis puntiforme).
* **E (Exposure / Exposición y Control de Hipotermia):** Examen físico completo, control térmico ambiental y detección de lesiones ocultas.

### 4.2. Evaluación Secundaria (Anamnesis Mnemotécnica SAMPLE)
* **S (Signos y Síntomas):** Motivo de consulta inicial del paciente.
* **A (Alergias):** Medicamentosas, alimentarias o ambientales (ej. picadura de himenópteros).
* **M (Medicamentos):** Fármacos de uso crónico (ej. propranolol, antihipertensivos, hipoglucemiantes).
* **P (Past Medical History / Antecedentes Médicos):** Patologías previas (asma, EPOC, infartos previos, cirugías).
* **L (Last Oral Intake / Última Ingesta):** Tiempo transcurrido desde la última comida (clave para secuencia de intubación rápida y riesgo de broncoaspiración).
* **E (Events / Eventos Previos):** Contexto inmediato previo al incidente (manipulación de insecticidas agrícolas sin EPP, colisión vehicular).

---

## 5. El Desafío de los 100 Casos Clínicos (Escala y Persistencia)

### 5.1. ¿Por qué 100 Casos Requieren Base de Datos y No Archivos Locales?
1. **Límites de empaquetado móvil:** Almacenar 100 casos con signos vitales, descripciones clínicas, múltiples preguntas y retroalimentaciones dentro del código de React Native (`mock-cases.ts`) incrementaría el peso del instalador (bundle size), consumiría memoria innecesaria en el dispositivo y ralentizaría el inicio de la app.
2. **Paginación eficiente:** La base de datos MySQL combinada con Spring Boot (`Pageable`, `PageRequest`) permite enviar los casos al celular en bloques livianos (ej. de 10 en 10), garantizando fluidez de 60 FPS en el catálogo.
3. **Mantenibilidad:** Actualizar un caso o corregir una dosis de fármaco se hace en la base de datos sin requerir que los usuarios tengan que actualizar la aplicación en las tiendas.

### 5.2. Banco de Casos en el Repositorio (`docs/Casos_Clinicos/` y `DataSeeder`)
* **Caso Trauma de Pelvis:** Shock hipovolémico en colisión frontal con apertura de sínfisis púbica en libro abierto y reanimación hipotensiva permisiva.
* **Caso Organofosforados:** Síndrome colinérgico severo en agricultor con inhibición de pseudocolinesterasas plasmáticas, contraindicación de succinilcolina y atropinización.
* **Caso Anafilaxia en Betabloqueado:** Reacción anafiláctica refractaria a adrenalina por bloqueo de receptores beta-2, revertida mediante infusión de glucagón por vía de adenilato ciclasa.
* **Casos 4 al 9:** Intoxicación pediátrica por nicotina líquida, broncoaspiración en trauma, broncoespasmo agudo por betabloqueo, arritmias ventriculares y shock cardiogénico en paciente con EPOC.

---

## 6. Resiliencia de UX y Manejo de Errores con `http.cat`

Para cumplir con la directriz de **programación defensiva** de [`AGENTS.md`](file:///Users/alexis/Documents/MediQuest/MediGuest/AGENTS.md) (prohibición estricta de pantallas en blanco), se implementó un sistema de alertas visuales integrado con **[http.cat](https://http.cat/)**:

1. **Backend (`GlobalExceptionHandler`):**
   * Ante cualquier excepción HTTP, el servidor devuelve un payload enriquecido:
     ```json
     {
       "status": 404,
       "error": "Recurso No Encontrado",
       "message": "Caso clínico no encontrado.",
       "catUrl": "https://http.cat/404.jpg",
       "timestamp": "2026-10-24T15:00:00"
     }
     ```
2. **Frontend (`HttpCatAlert`):**
   * Componente modal multiplataforma que renderiza la imagen del gato correspondiente (ej: `404 Not Found`, `500 Server Error`, `503 Service Unavailable`) usando `expo-image`, con tipografía clínica y botones de acción ("Reintentar" o "Entendido"), garantizando compatibilidad total con Safe Areas.

---

## 7. Gobernanza Git, Git Flow y el Agente Auditor (Rol 5)

MediQuest cuenta con una estricta disciplina de ramas establecida en [`AGENTS.md`](file:///Users/alexis/Documents/MediQuest/MediGuest/AGENTS.md) y auditada por la skill `.agents/skills/mediquest-auditor/SKILL.md`:

### 7.1. Modelo de Ramas (Git Flow)
* **`main`:** Rama productiva intocable.
* **`develop`:** Rama de integración continua.
* **`feature/<modulo>`:** Ramas aisladas por responsabilidad técnica:
  * `feature/navegacion`: Código visual y pantallas del frontend móvil.
  * `feature/backend-api`: Entidades JPA, API REST, base de datos MySQL y cliente HTTP.

### 7.2. Checklist Bloqueante del Agente Auditor
Antes de codear o hacer commit, se audita obligatoriamente:
1. **Filtro de Rama:** ¿La rama activa coincide con la tarea? (`git branch --show-current`).
2. **Filtro Documental:** ¿Se actualizó `ESTADO_DEL_PROYECTO.md` y `README.md`?
3. **Filtro de Calidad (Zero-Warnings):** `npm run lint` (0 warnings), `npx tsc --noEmit` (0 errores) y `mvn test` (`BUILD SUCCESS`).
4. **Filtro de Commits:** Commits atómicos con formato convencional (`feat:`, `fix:`, `docs:`, `test:`), sin "Co-Authored-By".

---

## 8. Resumen de Requerimientos del Sistema (Matriz de Trazabilidad)

| Código | Requerimiento | Capa Responsable | Estado en el Proyecto |
|---|---|:---:|:---:|
| **RF01** | Registro de usuario | Frontend + Backend + BD | ✅ Implementado en móvil y tabla `users` |
| **RF02** | Inicio de sesión | Frontend + Backend + BD | ✅ Implementado en móvil |
| **RF03** | Visualización de casos clínicos | Frontend + Backend | ✅ `GET /api/cases` con catálogo y filtros |
| **RF04** | Selección de caso clínico | Frontend | ✅ Ficha interactiva con tarjetas |
| **RF05** | Presentación de info clínica | Frontend + BD | ✅ `GET /api/cases/{id}` con ABCDE y SAMPLE |
| **RF06** | Visualización de imágenes diagnósticas | Frontend | ✅ Visor inmersivo con zoom/pan y `ClinicalMedia` |
| **RF07** | Resolución de preguntas | Frontend + Backend | ✅ Opciones A/B/C/D con DTOs protegidos |
| **RF08** | Evaluación automática y nota | Backend (Spring Boot) | ✅ `EvaluationService` califica en servidor |
| **RF09** | Retroalimentación clínica | Backend + BD | ✅ Justificaciones formativas PHTLS/ATLS |
| **RF10** | Registro de resultados | Backend + BD | ✅ Persistencia inmutable en tabla `attempts` |
| **RF11** | Consulta de historial y progreso | Frontend + Backend | ✅ `GET /api/progress` y pantalla de métricas |
| **RF12** | Gestión de casos (CRUD Docente) | Backend + Web/App Admin | ⏳ Módulo administrativo planificado |

---

## 9. Preguntas Clave para Defensa y Estudio Académico

### ¿Por qué se utilizó Spring Boot en lugar de dejar todo en Firebase o Supabase?
Para cumplir con los objetivos académicos de arquitectura de software universitaria: construir una arquitectura multicapa estándar donde el equipo tiene control total de las reglas de negocio, la seguridad en el cálculo de notas y el esquema relacional en MySQL sin depender de servicios de terceros propietarios.

### ¿Por qué las respuestas correctas no se envían al frontend?
Porque cualquier usuario con herramientas de depuración (React DevTools o proxies HTTP) podría inspeccionar la memoria del dispositivo y obtener la respuesta correcta sin razonar clínicamente. El servidor actúa como evaluador imparcial y seguro.

### ¿Por qué la base de datos se modeló de forma relacional y no con NoSQL?
Porque el dominio de casos clínicos, preguntas, opciones, usuarios e intentos tiene una estructura estrictamente relacionada con integridad referencial. Una respuesta no puede existir sin su pregunta, un intento debe estar atado de forma inmutable a un usuario y a un caso, y las consultas de progreso exigen agregaciones relacionales (promedios, sumatorias de puntajes y agrupaciones por especialidad).

### ¿Cómo se evita que la aplicación quede en blanco si el servidor se cae o no hay conexión?
A través de un patrón de arquitectura defensiva: el servicio `CasesService` en el frontend intenta comunicarse con el backend REST; si la llamada falla por desconexión de red o caída del servicio, recurre automáticamente a los casos locales preempaquetados de respaldo. Si un caso solicitado no existe, el componente `HttpCatAlert` renderiza de forma amigable la imagen de **http.cat** (`404.jpg` o `503.jpg`) con explicación clara y botón de reintento.

### ¿Por qué se aisló el desarrollo en ramas como `feature/backend-api` y `feature/navegacion`?
Para respetar el principio de aislamiento de cambios de Git Flow establecido en el Documento Maestro. Esto evita que cambios en la lógica de persistencia o controladores rompan la estabilidad de la navegación móvil, facilitando revisiones de código limpias (*Pull Requests*) y trazabilidad exacta en el historial de Git.
