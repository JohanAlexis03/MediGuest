# MediQuest — Guía Maestra de Arquitectura, Dominio Clínico APH y Base de Datos

> **Documento fuente preparado para Google NotebookLM.**  
> Este documento sintetiza la visión, la arquitectura de software de 3 capas, el modelo de datos relacional en MySQL y el dominio clínico de Atención Prehospitalaria (APH) para el proyecto universitario **MediQuest**.

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
  * Módulo de evaluación con preguntas de selección múltiple, cálculo de puntuación inmediata y retroalimentación pedagógica detallada basada en guías oficiales (**PHTLS / ATLS / AHA**).
  * Registro histórico de intentos y progreso del alumno por especialidad (**RF10 / RF11**).
  * Banco de **al menos 100 casos clínicos** almacenados en base de datos.
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
|   - Consumo de API REST vía Servicios / Adaptadores         |
+------------------------------+------------------------------+
                               | Peticiones HTTP / JSON
                               v
+-------------------------------------------------------------+
|                     CAPA 2: LÓGICA DE NEGOCIO               |
|            Backend API REST (Java 23 con Spring Boot 3)     |
|   - Controladores REST (Exposición de endpoints)            |
|   - Servicios de Negocio (Algoritmo de evaluación segura)   |
|   - Seguridad: Protege las respuestas correctas             |
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
|   - Historial inmutable de calificaciones de estudiantes    |
+-------------------------------------------------------------+
```

### 2.1. El Rol de Cada Capa
1. **Frontend (La Vista):** Diseñado directamente en código nativo de Expo sin dependencias de maquetadores externos. Captura los gestos del usuario, muestra los signos vitales con colores clínicos y envía las selecciones del alumno al servidor.
2. **Backend (El Cerebro):** Implementado con Spring Boot. Su rol crítico es la **seguridad lógica**: las respuestas correctas y sus explicaciones **jamás se envían al cliente antes de resolver el caso**. El servidor recibe las opciones elegidas por el estudiante, las valida contra la base de datos, calcula la ponderación y devuelve la calificación final.
3. **Base de Datos (La Bóveda):** Aloja los 100 casos clínicos y el historial de calificaciones. Si el móvil se reinicia o se pierde la conexión, los datos de los estudiantes y los casos permanecen intactos.

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
| id (PK)          |<-\    | id (PK)           |<-\    | id (PK)               |
| nombre           |  |    | titulo            |  |    | caso_id (FK) ---------+---\
| email            |  |    | categoria         |  |    | enunciado             |   |
| password_hash    |  |    | prioridad_triage  |  |    +-----------------------+   |
| rol              |  |    | escenario_texto   |  |                                |
+------------------+  |    | evaluacion_abcde  |  |    +-----------------------+   |
        |             |    | anamnesis_sample  |  |    |        OPCIONES       |   |
        | 1           |    | signos_vitales    |  |    +-----------------------+   |
        |             |    | imagen_url        |  |    | id (PK)               |   |
        v N           |    +-------------------+  |    | pregunta_id (FK) <----+---/
+------------------+  |              | 1          |    | texto_opcion          |
|     INTENTOS     |  |              |            |    | es_correcta (boolean) |
+------------------+  |              v N          |    | justificacion_clinica |
| id (PK)          |  |    +-------------------+  |    +-----------------------+
| usuario_id (FK) -+--/    |     INTENTOS      |  |
| caso_id (FK) ----+-------+-------------------+  |
| puntaje_obtenido |       | (Vincula alumno   |  |
| tiempo_segundos  |       |  y caso resuelto) |  |
| fecha_creacion   |       +---------+---------+  |
+------------------+                 | 1          |
        |                            |            |
        | 1                          v N          |
        v N                +-------------------+  |
+-----------------------+  | RESPUESTAS_ESTUD. |  |
| RESPUESTAS_ESTUDIANTE |  +-------------------+  |
+-----------------------+  | intento_id (FK) --+--/
| id (PK)               |  | opcion_id (FK)    |
| intento_id (FK)       |  +-------------------+
| pregunta_id (FK)      |
| opcion_seleccionada_id|
+-----------------------+
```

#### Descripción de Campos por Tabla:
1. **`usuarios`**: Administra credenciales y roles (`ESTUDIANTE` para resolución y seguimiento, `DOCENTE` / `ADMIN` para gestión de casos).
2. **`casos_clinicos`**: El núcleo clínico. Contiene el escenario descriptivo, categoría de emergencia (Trauma, Médico, Tóxico, Pediatría), prioridad de triage (Rojo/Inmediato, Amarillo/Urgente, Verde), examen físico y signos vitales.
3. **`preguntas`**: Desafíos de razonamiento clínico asociados a cada caso (diagnóstico diferencial, elección de vía aérea, cálculo de fármacos, priorización de traslado).
4. **`opciones`**: Cada pregunta dispone de opciones de respuesta. El campo `es_correcta` es protegido en el servidor. El campo `justificacion_clinica` contiene la retroalimentación médica formativa.
5. **`intentos` y `respuestas_estudiante`**: Almacena el resultado inmutable de cada sesión de entrenamiento. Permite computar estadísticas de desempeño, tiempo de respuesta y tasa de error por especialidad (**RF11**).

---

## 4. Dominio Clínico de Atención Prehospitalaria (APH)

MediQuest no es un banco de trivias genéricas; modela con precisión los protocolos de soporte vital avanzado y prehospitalario reconocidos a nivel internacional:

### 4.1. Evaluación Primaria Sistemática (Protocolo ABCDE - PHTLS/ATLS)
* **A (Airway / Vía Aérea con Control Cervical):** Permeabilidad de la vía aérea, presencia de estridor, broncorrea, cuerpos extraños y necesidad de manejo avanzado (intubación, secuencia rápida de intubación SIR).
* **B (Breathing / Ventilación):** Frecuencia respiratoria, esfuerzo ventilatorio (uso de músculos accesorios, tirajes intercostales), simetría en auscultación y saturometría ($\text{SpO}_2$).
* **C (Circulation / Circulación con Control de Hemorragias):** Frecuencia cardíaca, pulsos centrales y periféricos, presión arterial, llenado capilar, color y temperatura de la piel, monitorización electrocardiográfica.
* **D (Disability / Déficit Neurológico):** Escala de Coma de Glasgow (Ocular /4, Verbal /5, Motor /6), reactividad y diámetro pupilar (midriasis, miosis puntiforme).
* **E (Exposure / Exposición y Control de Hipotermia):** Examen físico completo, control ambiental y detección de lesiones ocultas.

### 4.2. Evaluación Secundaria (Anamnesis Mnemotécnica SAMPLE)
* **S (Signos y Síntomas):** Motivo de consulta inicial del paciente.
* **A (Alergias):** Medicamentosas, alimentarias o ambientales.
* **M (Medicamentos):** Fármacos de uso crónico (ej. betabloqueadores como propranolol, antihipertensivos, hipoglucemiantes).
* **P (Past Medical History / Antecedentes Médicos):** Patologías previas (asma, EPOC, infartos previos, cirugías).
* **L (Last Oral Intake / Última Ingesta):** Tiempo transcurrido desde la última comida (clave para secuencia de intubación rápida y riesgo de broncoaspiración).
* **E (Events / Eventos Previos):** Contexto inmediato previo al incidente (consumo de sustancias, picadura de insectos, colisión vehicular).

---

## 5. El Desafío de los 100 Casos Clínicos (Escala y Persistencia)

### 5.1. ¿Por qué 100 Casos Requieren Base de Datos y No Archivos Locales?
1. **Límites de memoria y empaquetado móvil:** Almacenar 100 casos con signos vitales, descripciones clínicas, múltiples preguntas y retroalimentaciones dentro del código de React Native (`mock-cases.ts`) incrementaría el peso del instalador (bundle size), consumiría memoria innecesaria en el dispositivo y ralentizaría el inicio de la app.
2. **Paginación eficiente:** La base de datos MySQL combinada con Spring Boot (`Pageable`, `PageRequest`) permite enviar los casos al celular en bloques livianos (ej. de 10 en 10), garantizando fluidez de 60 FPS en el catálogo.
3. **Mantenibilidad:** Actualizar un caso o corregir una dosis de fármaco se hace en la base de datos sin requerir que los usuarios tengan que actualizar la aplicación en las tiendas.

### 5.2. Casos Documentados en el Repositorio (`docs/Casos_Clinicos/`)
El proyecto cuenta con insumos estructurados listos para ser transformados en semillas de base de datos:
* **Caso 1:** Anafilaxia en paciente betabloqueado (Fisiopatología de receptores adrenérgicos y uso de glucagón como alternativa).
* **Caso 2:** Dolor torácico e hipertensión tras uso de cocaína (Riesgo del uso de betabloqueantes aislados y manejo con benzodiacepinas/nitratos).
* **Caso 3:** Preparación quirúrgica de un feocromocitoma (Secuencia de bloqueo alfa previo al bloqueo beta).
* **Caso 4:** Intoxicación por nicotina líquida en paciente pediátrico (Ajuste de atropina, dosis mínima para evitar bradicardia paradójica y SIR en pediatría).
* **Caso 5:** Broncoaspiración y distress respiratorio en trauma (Manejo de vía aérea difícil y ventilación mecánica de transporte).
* **Caso 6:** Síndrome colinérgico por intoxicación con organofosforados en zona agrícola (Bradicardia severa, broncorrea masiva, contraindicación de succinilcolina por colinesterasas plasmáticas y uso de atropina/oximas).
* **Caso 7:** Broncoespasmo agudo inducido por fármacos (Uso no selectivo de propranolol en asma).
* **Caso 8:** Manejo farmacológico de arritmias ventriculares prehospitalarias.
* **Caso 9:** Shock cardiogénico en paciente con EPOC (Perfil hemodinámico de noradrenalina vs dopamina).

---

## 6. Resumen de Requerimientos del Sistema (Matriz de Trazabilidad)

| Código | Requerimiento | Capa Responsable | Estado en el Proyecto |
|---|---|:---:|:---:|
| **RF01** | Registro de usuario | Frontend + Backend + BD | Frontend completado; backend por conectar |
| **RF02** | Inicio de sesión | Frontend + Backend + BD | Frontend completado; autenticación JWT pendiente |
| **RF03** | Visualización de casos clínicos | Frontend + Backend | Frontend con catálogo y filtros activo |
| **RF04** | Selección de caso clínico | Frontend | Completado con tarjetas interactivas |
| **RF05** | Presentación de info clínica | Frontend + BD | Ficha ABCDE y SAMPLE activa |
| **RF06** | Visualización de imágenes diagnósticas | Frontend | Visor inmersivo con zoom/pan culminado |
| **RF07** | Resolución de preguntas | Frontend + Backend | Componente de selección múltiple activo |
| **RF08** | Evaluación automática y nota | Backend (Spring Boot) | Lógica validada en cliente; requiere blindaje en servidor |
| **RF09** | Retroalimentación clínica | Backend + BD | Justificaciones formativas PHTLS listas |
| **RF10** | Registro de resultados | Backend + BD | Base de datos `mediquest_db` lista; requiere endpoints |
| **RF11** | Consulta de historial y progreso | Frontend + Backend | Pantalla de métricas lista; pendiente datos reales |
| **RF12** | Gestión de casos (CRUD Docente) | Backend + Web/App Admin | Módulo administrativo planificado |

---

## 7. Preguntas Clave para Defensa y Estudio Académico

### ¿Por qué se utilizó Spring Boot en lugar de dejar todo en Firebase o Supabase?
Para cumplir con los objetivos académicos de arquitectura de software universitaria: construir una arquitectura multicapa estándar donde el equipo tiene control total de las reglas de negocio, la seguridad en el cálculo de notas y el esquema relacional en MySQL sin depender de servicios de terceros propietarios.

### ¿Por qué las respuestas correctas no se envían al frontend?
Porque cualquier usuario con conocimientos básicos de desarrollo móvil o herramientas de depuración (React DevTools, proxies HTTP como Fiddler o Charles) podría inspeccionar la memoria del dispositivo y obtener la respuesta correcta sin razonar clínicamente. El servidor actúa como evaluador imparcial y seguro.

### ¿Por qué la base de datos se modeló de forma relacional y no con NoSQL?
Porque el dominio de casos clínicos, preguntas, opciones, usuarios e intentos tiene una estructura estrictamente relacionada con integridad referencial. Una respuesta no puede existir sin su pregunta, un intento debe estar atado de forma inmutable a un usuario y a un caso, y las consultas de progreso exigen agregaciones relacionales (promedios, sumatorias de puntajes y agrupaciones por especialidad).
