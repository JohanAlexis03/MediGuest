# MediQuest — Estado Vivo del Proyecto y Bitácora del Orquestador

> **Documento mantenido por el Agente Orquestador (State Keeper).**
> Registra el hilo conductor, las decisiones técnicas clave y el estado exacto del proyecto para garantizar continuidad entre sesiones.

---

## 1. Visión y Rama Activa
* **Proyecto:** MediQuest — Plataforma de Entrenamiento Clínico para Atención Prehospitalaria (APH).
* **Rama Git Activa:** `feature/json-cases-loader`.
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
| **Producción & Persistencia Real** | RF01, RF02, RF08, RF10, RF11 | ✅ | Limpieza de pistas de prueba, `AuthService` con `AsyncStorage`, endpoints `/api/auth`, catálogo, resolución y progreso 100% conectados a MySQL |
| **Expansión a 10 Casos APH** | RF03, RF05, RF06, RF08, RF09 | ✅ | `DataSeeder.java` normalizado e idempotente con 10 casos en las 6 especialidades clínicas (Trauma, Tóxicos, Cardio, Respiratorio, Neuro, Pediatría) |
| **Normalización de Filtros y Resiliencia** | RF01, RF02, RF03 | ✅ | Normalización diacrítica de especialidades y dificultades, blindaje de URLs `/api/` en `api.ts` y manejo 404 en backend |
| **Imágenes Clínicas & Conectividad LAN** | RF06, RNF01 | ✅ | Vinculación de imágenes diagnósticas reales por ID de caso (ECG, tórax, Cincinnati), erradicación de fotos Unsplash y detección dinámica de IP para Expo Go |
| **Arquitectura Ingesta JSON & 15 Casos** | RF03, RF05, RF06, RF08, RF09 | ✅ | `CaseLoaderService.java`, `CaseJsonDto.java`, `classpath*:cases/*.json`, reducción de `DataSeeder.java` (590 a 45 líneas) y banco ampliado a 15 casos |

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
* **ADR-09 (Autenticación Real, Sesión con AsyncStorage y Reactividad en Producción):** Desacoplar definitivamente la aplicación de mocks en memoria. Persistir la sesión en el dispositivo con `@react-native-async-storage/async-storage`, sincronizar registro y login contra MySQL (`/api/auth`), y ligar la resolución clínica y estadísticas de progreso al usuario autenticado.
* **ADR-10 (Sembrado Idempotente y Banco Clínico Normalizado de 10 Casos):** Garantizar la persistencia y ampliación continua del banco de datos sin pérdida de intentos previos, verificando la existencia por ID de cada caso clínico antes de persistir, expandiendo la cobertura diagnóstica a las 6 especialidades reglamentarias (Trauma, Toxicología, Cardiovascular, Respiratorio, Neurología, Pediatría) bajo directrices PHTLS, ATLS y AHA.
* **ADR-11 (Normalización Canónica de Enums y Filtros APH):** Desacoplar las representaciones textuales de especialidades y dificultades entre backend (`TRAUMA`, `TOXICOLOGIA`) y frontend (`Trauma`, `Toxicología`), aplicando normalización insensible a diacríticos (NFD) y mayúsculas en el servicio de casos y componentes de catálogo/progreso.
* **ADR-12 (Auxiliares Diagnósticos Pertinentes y Conectividad LAN Multi-dispositivo):** Descartar fotos genéricas de stock de Unsplash y vincular los casos a imágenes diagnósticas reales de alta fidelidad (ECGs de 12 derivaciones, placas de tórax AP, escalas neurológicas) mapeadas por ID de caso. Resolver la IP anfitriona dinámicamente mediante `expo-constants` para posibilitar pruebas desde dispositivos físicos en la misma red Wi-Fi sin configuración manual.
* **ADR-13 (Arquitectura de Ingesta Masiva JSON y Desacoplamiento de Semillas):** Para escalar de forma sostenible hacia el objetivo pedagógico de 100 casos clínicos sin inflar clases de configuración Java (`DataSeeder.java`), se implementa una arquitectura desacoplada basada en DTOs JSON (`CaseJsonDto`) y un servicio de carga automática (`CaseLoaderService`) que escanea recursos `classpath*:cases/*.json`. La persistencia mantiene idempotencia verificando `existsById` y preserva la integridad relacional JPA bidireccional.

---

## 4. Estado Actual (En Curso)
* **Frontend:** 100% productivo con auxiliares diagnósticos médicos reales, filtros calibrados y conectividad LAN dinámica (**0 errores TS, 0 warnings lint**).
* **Backend:** Spring Boot activo en puerto 8080 con MySQL 9.3 (**8/8 tests en verde**, carga masiva JSON operativa).
* **Base de Datos:** MySQL `mediquest_db` con 15 casos clínicos completos sembrados de forma idempotente.
* **Gobierno de Proyecto:** Rama `feature/json-cases-loader` con auditoría activa.

---

## 5. Próximos Pasos en Secuencia (Backlog Priorizado)
1. **Paso 1:** Escalar banco de 15 a 30 casos clínicos mediante archivos JSON normalizados bajo estándares APH (`aph-clinical-modeler`).
2. **Paso 2:** Consolidar meta de 100 casos clínicos distribuidos en las 6 especialidades clínicas.
3. **Paso 3 (RF12):** Módulo de administración para docentes (creación, edición y auditoría de casos desde UI).
