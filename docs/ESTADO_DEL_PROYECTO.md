# MediQuest — Estado Vivo del Proyecto y Bitácora del Orquestador

> **Documento mantenido por el Agente Orquestador (State Keeper).**
> Registra el hilo conductor, las decisiones técnicas clave y el estado exacto del proyecto para garantizar continuidad entre sesiones.

---

## 1. Visión y Rama Activa
* **Proyecto:** MediQuest — Plataforma de Entrenamiento Clínico para Atención Prehospitalaria (APH).
* **Rama Git Activa:** `feature/navegacion`.
* **Stack Tecnológico:**
  * **Frontend:** Expo SDK 57 (React Native 0.86, React 19.2, Expo Router).
  * **Backend:** Java con Spring Boot + Base de Datos Relacional MySQL (Definido en Documento Maestro).

---

## 2. Hitos Culminados y Registrados

| Hito | Requerimientos | Estado | Commits / Archivos Clave |
|---|---|:---:|---|
| **Cimientos de Dominio** | Tipado y Casos Mock | ✅ | `frontend/src/types/clinical-case.ts`, `data/mock-cases.ts` (6 casos APH) |
| **Flujo del Estudiante** | RF01, RF02, RF03, RF04, RF05, RF07, RF08, RF09 | ✅ | Commit `9b18c81` (Catálogo, Ficha clínica ABCDE/SAMPLE, Resolución PHTLS) |
| **Progreso e Historial** | RF11 | ✅ | Commit `17d2874` (`cases/progress.tsx`, métricas por especialidad e historial) |
| **Blindaje Safe Area Multiplataforma** | Usabilidad (RNF01, RNF05) | ✅ | Migración a `react-native-safe-area-context` en todas las pantallas y raíz |
| **Gobierno de Agentes Técnicos** | Reglas permanentes | ✅ | `AGENTS.md` (Orquestador, QA/Testing Guard, Custodio Documental) |

---

## 3. Registro de Decisiones de Arquitectura (ADR)

* **ADR-01 (Manejo de Insets / Safe Area):**
  * *Decisión:* Descartar `SafeAreaView` de `react-native` (incompatible con Android).
  * *Solución:* Montar `<SafeAreaProvider>` en `_layout.tsx` y utilizar `SafeAreaView` con `edges={['bottom', 'left', 'right']}` en pantallas con cabecera nativa, y bordes completos en pantallas splash/landing.
* **ADR-02 (Metodología Clínica de APH):**
  * *Decisión:* Estructurar la presentación de casos bajo protocolos estandarizados PHTLS/ATLS.
  * *Solución:* Cuadrícula de signos vitales (incluyendo escala de coma de Glasgow), alternancia de tabs para evaluación primaria (ABCDE) y anamnesis médica (SAMPLE).
* **ADR-03 (Calidad Continua sin Regresiones):**
  * *Decisión:* Establecer como política de proyecto que ningún cambio se apruebe con errores de TypeScript (`npx tsc --noEmit`) o advertencias de ESLint (`expo lint`).

---

## 4. Estado Actual (En Curso)
* **Trabajo en curso en el Working Tree:**
  * Ajustes de Safe Area en todas las pantallas (`_layout.tsx`, `index.tsx`, `login.tsx`, `registro.tsx`, `cases/index.tsx`, `cases/[id].tsx`, `cases/solve.tsx`, `cases/progress.tsx`).
  * Reglas de agentes en `AGENTS.md` y actualización de `README.md`.
  * Validación QA: **0 errores de TypeScript, 0 warnings de linter**.

---

## 5. Próximos Pasos en Secuencia (Backlog Priorizado)
1. **Paso 1:** Guardar commit de safe areas y gobierno de agentes en `feature/navegacion`.
2. **Paso 2 (RF06):** Diseñar e implementar el visor de imágenes diagnósticas (radiografías/ECG) en la ficha clínica (`cases/[id].tsx`).
3. **Paso 3 (Backend / RF10):** Inicializar la estructura de backend en Java Spring Boot con entidades JPA para casos y persistencia de resultados de estudiantes en MySQL.
4. **Paso 4 (RF12):** Módulo de administración para docentes (creación y edición de casos).
