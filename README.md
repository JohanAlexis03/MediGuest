# MediQuest

Aplicación móvil para que estudiantes de **Atención Prehospitalaria (APH)** resuelvan **casos clínicos interactivos**, con el fin de fortalecer el razonamiento clínico y la toma de decisiones.

## Objetivo general

> Desarrollar una aplicación móvil que permita a los estudiantes de Atención Prehospitalaria resolver casos clínicos interactivos, con el fin de fortalecer el razonamiento clínico y la toma de decisiones.

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `assets/` | Material fuente del proyecto: logo, radiografías e imágenes originales |
| `docs/` | Documentación: visión, casos clínicos, mockups, diagramas |
| `backend/` | API REST y base de datos (en construcción) |
| `frontend/` | Aplicación móvil con Expo SDK 57 (React Native + TypeScript) |

## Estado del proyecto

- 🟢 **Frontend (Móvil APH):** Expo SDK 57 (React Native 0.86, React 19.2, Expo Router).
  - ✅ Flujo completo del estudiante implementado (Login, Registro, Catálogo con filtros, Ficha clínica ABCDE/SAMPLE, Resolución evaluada y Progreso).
  - ✅ Safe Area multiplataforma garantizada con `react-native-safe-area-context` (Android gestos, punch-hole, iOS Dynamic Island/notch).
  - 🟡 Pendiente: Visor de imágenes diagnósticas interactivas (RF06).
- 🟡 **Backend:** Java con Spring Boot + MySQL (según Documento Maestro en `docs/`). Carpeta `backend/` lista para iniciar.
- 🟢 **Documentación:** Agente de documentación activo (`AGENTS.md`), documento maestro y matriz de requerimientos sincronizados.
- 🟢 **Git:** Rama de trabajo `feature/navegacion`.

## Matriz de Requerimientos Funcionales (MVP)

| ID | Requerimiento | Estado | Detalle / Ruta |
|---|---|:---:|---|
| **RF01** | Registro de usuario | ✅ | `frontend/src/app/registro.tsx` |
| **RF02** | Inicio de sesión | ✅ | `frontend/src/app/login.tsx` |
| **RF03** | Visualización de casos clínicos | ✅ | `frontend/src/app/cases/index.tsx` (Filtros APH) |
| **RF04** | Selección de caso clínico | ✅ | `frontend/src/components/clinical/case-card.tsx` |
| **RF05** | Presentación de info clínica | ✅ | `frontend/src/app/cases/[id].tsx` (Signos vitales, ABCDE, SAMPLE) |
| **RF06** | Visualización de imágenes diagnósticas | 🟡 | En preparación para ficha clínica |
| **RF07** | Resolución de preguntas | ✅ | `frontend/src/app/cases/solve.tsx` |
| **RF08** | Evaluación automática y puntaje | ✅ | Algoritmo de ponderación y acierto inmediato |
| **RF09** | Retroalimentación clínica | ✅ | Justificaciones basadas en protocolos PHTLS/ATLS |
| **RF10** | Registro y persistencia de resultados | 🟡 | En frontend con mocks; pendiente persistencia en Backend |
| **RF11** | Consulta de progreso e historial | ✅ | `frontend/src/app/cases/progress.tsx` |
| **RF12** | Gestión de casos (Admin/Docente) | ⏳ | Módulo administrativo |

## Cómo ejecutar la aplicación

```bash
cd frontend
npm install
npx expo start
```

Escanea el QR con **Expo Go** en tu dispositivo físico, o presiona `w` para probar en navegador web.