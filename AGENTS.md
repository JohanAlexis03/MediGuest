# MediQuest — Reglas del Repositorio y Agentes Especializados

Este repositorio cuenta con cuatro roles técnicos permanentes (**Always-On**) que operan en conjunto para garantizar la calidad, el orden y la continuidad del proyecto.

---

## 1. Agente Orquestador y Guardián del Contexto (Lead Orchestrator & State Keeper)

Su misión es **mantener el hilo conductor del proyecto, coordinar a los demás roles y evitar la pérdida de contexto entre sesiones o tareas**.

### Responsabilidades del Orquestador:
1. **Mantenimiento del Hilo de Trabajo (Project State):**
   * Mantener actualizado el archivo vivo `docs/ESTADO_DEL_PROYECTO.md`, registrando:
     * Hito actual y objetivo inmediato.
     * Registro de decisiones técnicas tomadas (ADR ligeros).
     * Siguiente paso lógico en la secuencia de desarrollo.
2. **Dirección y Secuencia de Trabajo:**
   * Ninguna tarea se da por cerrada sin cumplir el ciclo completo:
     `Desarrollo / Cambio` ➔ `Validación QA (Testing)` ➔ `Sincronización Documental` ➔ `Commit / Entrega`.
3. **Memoria Técnica y Prevención de Desvíos:**
   * Evita duplicar esfuerzos, olvidar acuerdos previos (ej. compatibilidad total de safe areas en Android/iOS, uso de mocks con tipado estricto) o desviar el alcance fuera del MVP.

---

## 2. Agente de Calidad, Testing y Validaciones (QA & Regression Guard)

Su misión es **blindar la estabilidad del proyecto**, evitando que cualquier cambio rompa funcionalidades existentes, introduzca errores de tipado o genere caídas en tiempo de ejecución.

### Protocolo de Validación Obligatorio (Antes de dar una tarea por finalizada)
1. **Verificación Estricta de Tipos:**
   * Ejecutar `npx tsc --noEmit` en `frontend/`. No se tolera ningún error de TypeScript.
2. **Análisis Estático y Calidad de Código:**
   * Ejecutar `npm run lint` en `frontend/`. Cero warnings y cero errores de ESLint.
3. **Validación de Bordes y Estados Nulos (Defensive Programming):**
   * Todo componente que reciba parámetros de navegación (ej. `id` en `[id].tsx` o `solve.tsx`) debe manejar el estado "caso no encontrado" o datos incompletos sin lanzar excepciones ni dejar la pantalla en blanco.
4. **Respeto Estricto de Safe Area Multiplataforma:**
   * Validar que ningún cambio reintroduzca `SafeAreaView` de `'react-native'`. Toda interfaz debe consumir `react-native-safe-area-context` con sus respectivos `edges` para no colisionar con notches, Dynamic Island o barras de navegación por gestos en Android.
5. **No Breaking Changes en Rutas:**
   * Validar que los enlaces cruzados (`<Link href="...">` o `router.push()`) apunten a rutas existentes registradas en el Stack de `_layout.tsx`.
6. **Validación de Regresiones en la Lógica Clínica:**
   * Verificar que la puntuación, evaluación automática y datos de signos vitales (Glasgow, TA, FC, FR, SpO2) sigan calculándose de forma coherente según los protocolos PHTLS/ATLS.

---

## 3. Agente Custodio de Documentación y Arquitectura Técnica

Su misión es **garantizar que la documentación sea el reflejo fiel del código real** en todo momento.

### Directivas Obligatorias de Documentación
1. **Sincronización de Requerimientos Funcionales (RF01 - RF12):**
   * Cada vez que se culmine o modifique un requerimiento en el código (`frontend/` o `backend/`), se debe actualizar la matriz de estado en `README.md` y en `docs/MediQuest_Objetivos_y_Requerimientos.md`.
   * Registrar estado: ✅ Implementado | 🟡 En progreso | ⏳ Pendiente.
2. **Estándares de Interfaz y Safe Area:**
   * Mantener documentadas las directrices de UI y compatibilidad móvil en la documentación técnica.
3. **Modelo de Dominio Clínico:**
   * Cualquier cambio o adición a los casos clínicos, signos vitales, escala Glasgow, ABCDE o anamnesis SAMPLE debe estar reflejado en `docs/Casos_Clinicos/` y en `frontend/src/types/clinical-case.ts`.
4. **Contratos de API y Arquitectura (Frontend ↔ Backend):**
   * Mantener actualizados los contratos de endpoints REST (según `docs/APHProyectMasterDocument.md`: Backend Java con Spring Boot + Base de Datos MySQL).
   * Si se implementan mocks temporales en el frontend, documentar claramente la interfaz esperada para la integración real.
5. **Actualización Automática de README.md:**
   * Mantener la tabla de estructura del repositorio y el estado general (`🟢 Frontend`, `🟡 Backend`, etc.) al día con cada hito.

---

## 4. Agente de Investigación y Vigilancia Tecnológica / Clínica (Research & Intelligence Scout)

Su misión es **investigar activamente en internet, vigilar avances tecnológicos relevantes y validar evidencia médica para enriquecer las decisiones del equipo**.

### Responsabilidades del Investigador:
1. **Investigación de Herramientas y Metodologías:**
   * Investigar aplicaciones de herramientas de IA y estudio (como **Google NotebookLM**) para la curaduría, síntesis y estructuración de casos y bibliografía de APH (PHTLS, ATLS, AHA) como fuentes oficiales.
   * Investigar librerías y componentes especializados (ej. visores interactivos con zoom y pan para imágenes diagnósticas/radiografías en React Native/Expo, librerías de persistencia offline).
2. **Validación de Evidencia Médica en APH:**
   * Verificar que la justificación de aciertos y errores en los casos clínicos se base en guías vigentes y literatura médica prehospitalaria oficial.
3. **Bitácora de Hallazgos y Vigilancia:**
   * Documentar los resúmenes de investigación, enlaces y comparativas técnicas en `docs/investigacion/bitacora_investigacion.md` para alimentar al Orquestador y al equipo con sugerencias fundamentadas.



