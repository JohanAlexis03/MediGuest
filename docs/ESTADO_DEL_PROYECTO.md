# MediQuest — Estado Vivo del Proyecto y Bitácora del Orquestador

> **Documento mantenido por el Agente Orquestador (State Keeper).**
> Registra el hilo conductor, las decisiones técnicas clave y el estado exacto del proyecto para garantizar continuidad entre sesiones.

---

## 1. Visión y Rama Activa
* **Proyecto:** MediQuest — Plataforma de Entrenamiento Clínico para Atención Prehospitalaria (APH).
* **Rama Git Activa:** `feature/backend-api`.
* **Stack Tecnológico:**
  * **Frontend:** Expo SDK 57 (React Native 0.86, React 19.2, Expo Router).
  * **Backend:** Java 23 con Spring Boot 4 + Base de Datos Relacional MySQL 9.3 (`mediquest_db`).

---

## 2. Hitos Culminados y Registrados

| Hito | Requerimientos | Estado | Commits / Archivos Clave |
|---|---|:---:|---|
| **Cimientos de Dominio** | Tipado y Casos Mock | ✅ | `frontend/src/types/clinical-case.ts`, `data/mock-cases.ts` (6 casos APH) |
| **Flujo del Estudiante** | RF01, RF02, RF03, RF04, RF05, RF07, RF08, RF09 | ✅ | Commit `9b18c81` (Catálogo, Ficha clínica ABCDE/SAMPLE, Resolución PHTLS) |
| **Progreso e Historial** | RF11 | ✅ | Commit `17d2874` (`cases/progress.tsx`, métricas por especialidad e historial) |
| **Blindaje Safe Area Multiplataforma** | Usabilidad (RNF01, RNF05) | ✅ | Commit `deb4b1c` (Migración a `react-native-safe-area-context` global) |
| **Visor de Imágenes Diagnósticas** | RF06 | ✅ | `cases/[id].tsx` (Visor inmersivo con zoom/pan y modal nativo) |
| **Infraestructura Base de Datos** | Persistencia y Escala | ✅ | Motor MySQL 9.3 activo, BD `mediquest_db` (`utf8mb4`) creada |
| **Banco Clínico Ampliado** | Insumos de Casos | ✅ | 9 casos clínicos redactados en `docs/Casos_Clinicos/` |
| **Guía de Estudio NotebookLM** | Síntesis y Estudio | ✅ | `docs/guia_estudio_notebooklm.md` preparado para estudio interactivo |
| **Backend Spring Boot & JPA** | Dominio y Persistencia | ✅ | Commit `2beea56` (Entidades JPA, repositorios y DataSeeder) |
| **API REST & Evaluación Segura** | RF08, RF09, RF10 | ✅ | Commit `376f454` (Endpoints REST, DTOs seguros, cálculo de notas y http.cat) |
| **Cliente Frontend & Alertas Cat** | Integración y UX Defensiva | ✅ | Commit `83b5ca6` (`services/api.ts`, `HttpCatAlert`, soporte 404/500/503) |
| **Gobernanza Git & Agente Auditor** | Disciplina de Repositorio | ✅ | `.agents/skills/mediquest-auditor/SKILL.md`, `AGENTS.md` (Checklist bloqueante) |

---

## 3. Registro de Decisiones de Arquitectura (ADR)

* **ADR-01 (Manejo de Insets / Safe Area):** Descartar `SafeAreaView` de `react-native`. Montar `<SafeAreaProvider>` en `_layout.tsx` y utilizar `SafeAreaView` de `react-native-safe-area-context` globalmente.
* **ADR-02 (Metodología Clínica de APH):** Estructurar casos bajo protocolos estandarizados PHTLS/ATLS con evaluación primaria ABCDE, anamnesis SAMPLE y escala Glasgow.
* **ADR-03 (Calidad Continua sin Regresiones):** Política de 0 errores de TypeScript (`npx tsc --noEmit`), 0 advertencias de ESLint (`expo lint`) y `BUILD SUCCESS` en backend (`mvn test`).
* **ADR-04 (Visor de Imágenes Diagnósticas RF06):** Zoom fluido y pan nativo combinando `expo-image` con `Modal` y `ScrollView`.
* **ADR-05 (Identidad Visual y Logotipo APH):** Estrella de la Vida en azul prehospitalario (`#0B3D91`) en formato cuadrado 1:1.
* **ADR-06 (Escala de 100 Casos y Persistencia Relacional):** Almacenar y paginar casos en MySQL (`mediquest_db`) con juego `utf8mb4` para soportar el requisito académico de 100 casos mínimos sin sobrecargar el bundle móvil.
* **ADR-07 (Manejo Defensivo de Errores con http.cat):** Integrar `https://http.cat/{status}.jpg` en el `GlobalExceptionHandler` y en el componente móvil `HttpCatAlert` para erradicar pantallas en blanco ante errores 404 o caídas de conexión.
* **ADR-08 (Aislamiento de Ramas Git y Agente Auditor):** Prohibir el desarrollo de backend en ramas de navegación. Aislar el trabajo en `feature/backend-api` y formalizar el Agente 5 con checklist bloqueante.

---

## 4. Estado Actual (En Curso)
* **Frontend:** Integrado con el cliente API y fallback defensivo local (**0 errores TS, 0 warnings lint**).
* **Backend:** Spring Boot activo con endpoints `/api/cases` y `/api/progress` validados (**5/5 tests de integración en verde**).
* **Base de Datos:** MySQL `mediquest_db` poblada con casos iniciales y usuarios de prueba.
* **Gobierno de Proyecto:** Skill de auditoría `mediquest-auditor` activa y ramas aisladas.

---

## 5. Próximos Pasos en Secuencia (Backlog Priorizado)
1. **Paso 1:** Poblar la base de datos con los 6 casos mock restantes y transformar los casos clínicos de `docs/Casos_Clinicos/` en semillas para avanzar hacia los 100 casos.
2. **Paso 2 (RF01/RF02):** Implementar módulo de autenticación con tokens JWT para proteger endpoints.
3. **Paso 3 (RF12):** Módulo de administración para docentes (creación y edición de casos).
