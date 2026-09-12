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

- 🟢 **Frontend:** Expo SDK 57 (React Native 0.86, React 19.2, expo-router) — estructura inicial lista.
- 🟡 **Backend:** por definir (pendiente decisión de stack).
- 🟡 **Documentación:** visión definida; casos y diagramas en elaboración.
- 🟢 **Git:** rama `main`; fase inicial de organización.

## Cómo ejecutar la aplicación

```bash
cd frontend
npm install
npx expo start
```

Escanea el QR con **Expo Go** en tu dispositivo, o usa `npx expo start --web` para el navegador.

## Alcance (MVP)

- Registro e inicio de sesión de estudiantes.
- Catálogo de casos clínicos con información del paciente, signos vitales e imágenes.
- Resolución de casos mediante preguntas de selección múltiple.
- Evaluación automática, puntuación y retroalimentación detallada.
- Historial de resultados y seguimiento básico del progreso.
- Gestión administrativa de casos clínicos.

> **Fuera de alcance en el MVP:** generación de casos con IA, diagnóstico automático, interpretación automática de radiografías, gamificación avanzada, red social, biblioteca médica, integración con hospitales. Estas funcionalidades quedan registradas como **funcionalidades futuras**.