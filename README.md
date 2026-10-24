# MediQuest

Aplicación móvil para que estudiantes de **Atención Prehospitalaria (APH)** resuelvan **casos clínicos interactivos**, con el fin de fortalecer el razonamiento clínico y la toma de decisiones.

## Objetivo general

> Desarrollar una aplicación móvil que permita a los estudiantes de Atención Prehospitalaria resolver casos clínicos interactivos, con el fin de fortalecer el razonamiento clínico y la toma de decisiones.

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `assets/` | Material fuente del proyecto: logo, radiografías e imágenes originales |
| `docs/` | Documentación: visión, casos clínicos, mockups, diagramas |
| `backend/` | API REST en Java 23 (Spring Boot 4) y base de datos relacional MySQL 9.3 |
| `frontend/` | Aplicación móvil con Expo SDK 57 (React Native + TypeScript) |

## Estado del proyecto

- 🟢 **Frontend (Móvil APH):** Expo SDK 57 (React Native 0.86, React 19.2, Expo Router).
  - ✅ Flujo completo del estudiante implementado (Login, Registro, Catálogo con filtros, Ficha clínica ABCDE/SAMPLE, Resolución evaluada y Progreso).
  - ✅ Safe Area multiplataforma garantizada con `react-native-safe-area-context` (Android gestos, punch-hole, iOS Dynamic Island/notch).
  - ✅ Visor de imágenes diagnósticas interactivo con zoom y pantalla completa (RF06).
  - ✅ Manejo defensivo de errores y pantallas no encontradas con alertas visuales de **http.cat**.
- 🟢 **Backend (API REST & Persistencia):** Java 23 con Spring Boot 4 + MySQL 9.3 (`mediquest_db`).
  - ✅ Dominio clínico JPA normalizado (`ClinicalCase`, `Question`, `Option`, `User`, `Attempt`).
  - ✅ Endpoints REST `/api/cases` y `/api/progress` con DTOs seguros que protegen las respuestas correctas.
  - ✅ Evaluación pedagógica en servidor con persistencia inmutable en tabla `attempts` (RF10).
  - ✅ Manejador global de excepciones integrado con **http.cat** (`404.jpg`, `500.jpg`, `503.jpg`) y CORS configurado.
  - ✅ 5/5 pruebas de integración automatizadas en verde (`mvn test`).
- 🟢 **Documentación & Auditoría:** Skill `mediquest-auditor` activa, 5 agentes especializados y bitácora en `ESTADO_DEL_PROYECTO.md`.
- 🟢 **Git:** Rama de trabajo activa `feature/backend-api`.

## Matriz de Requerimientos Funcionales (MVP)

| ID | Requerimiento | Estado | Detalle / Ruta |
|---|---|:---:|---|
| **RF01** | Registro de usuario | ✅ | `frontend/src/app/registro.tsx` y tabla `users` |
| **RF02** | Inicio de sesión | ✅ | `frontend/src/app/login.tsx` |
| **RF03** | Visualización de casos clínicos | ✅ | `GET /api/cases` y `frontend/src/app/cases/index.tsx` |
| **RF04** | Selección de caso clínico | ✅ | `frontend/src/components/clinical/case-card.tsx` |
| **RF05** | Presentación de info clínica | ✅ | `GET /api/cases/{id}` y `frontend/src/app/cases/[id].tsx` (ABCDE, SAMPLE) |
| **RF06** | Visualización de imágenes diagnósticas | ✅ | Visor inmersivo con zoom/pan y campo `ClinicalMedia` |
| **RF07** | Resolución de preguntas | ✅ | Selección múltiple con DTOs seguros |
| **RF08** | Evaluación automática y puntaje | ✅ | Algoritmo en servidor `EvaluationService` |
| **RF09** | Retroalimentación clínica | ✅ | Justificaciones formativas PHTLS/ATLS retornadas tras evaluar |
| **RF10** | Registro y persistencia de resultados | ✅ | Guardado inmutable en tabla `attempts` de MySQL (`mediquest_db`) |
| **RF11** | Consulta de progreso e historial | ✅ | `GET /api/progress` y `frontend/src/app/cases/progress.tsx` |
| **RF12** | Gestión de casos (Admin/Docente) | ⏳ | Módulo administrativo para creación de casos |

## Cómo ejecutar el proyecto

### 1. Iniciar Base de Datos y Backend (Spring Boot)
```bash
# Iniciar motor de base de datos
brew services start mysql

# Ejecutar API REST
cd backend
mvn spring-boot:run
```
La API estará disponible en `http://localhost:8080/api/cases`.

### 2. Iniciar Aplicación Móvil (Expo)
```bash
cd frontend
npm install
npx expo start
```

Escanea el QR con **Expo Go** en tu dispositivo físico, o presiona `w` para probar en navegador web.