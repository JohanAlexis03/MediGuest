# MediQuest — Bitácora de Investigación y Vigilancia Tecnológica/Clínica

> **Mantenida por el Agente de Investigación (Research & Intelligence Scout).**
> Registra análisis, herramientas investigadas en internet y mejores prácticas aplicables a MediQuest.

---

## 1. Investigación: Google NotebookLM en Educación Médica y APH

### ¿Qué es y qué ventaja ofrece?
Google NotebookLM es un entorno de trabajo basado en modelos avanzados (Gemini 1.5 Pro) diseñado con una premisa clave: **Grounding estricto (anclaje exclusivo a fuentes documentales cargadas por el usuario)**. A diferencia de un chat general de IA que puede alucinar, NotebookLM responde citando textualmente fragmentos de los PDFs cargados.

### Aplicabilidad directa para MediQuest:
1. **Curaduría de Guías Oficiales de APH:**
   * Cargar manuales oficiales (PHTLS 9ª/10ª Edición, ATLS 10ª Edición, Guías AHA de Soporte Vital Cardiovascular).
   * Generar resúmenes precisos de perlas clínicas y justificaciones de aciertos/errores para alimentar el banco de casos clínicos ([mock-cases.ts](file:///Users/alexis/Documents/MediQuest/MediGuest/frontend/src/data/mock-cases.ts) y futura base de datos).
2. **Generación Asistida para Docentes (Fase Futura / RF12):**
   * Los docentes de APH pueden usar cuadernos temáticos de NotebookLM para redactar casos clínicos verídicos, con signos vitales coherentes y retroalimentación clínica fidedigna sin incurrir en alucinaciones médicas.

---

## 2. Investigación Técnica: Visor de Imágenes Médicas Interactivas (RF06)

### El reto técnico:
En pantallas clínicas móviles ([cases/[id].tsx](file:///Users/alexis/Documents/MediQuest/MediGuest/frontend/src/app/cases/%5Bid%5D.tsx)), los estudiantes necesitan ver radiografías de tórax (ej. neumotórax a tensión) o trazados de electrocardiograma (ECG) con capacidad de:
* Hacer zoom con pellizco (*pinch-to-zoom*).
* Desplazamiento panorámico (*pan*).
* Apertura en pantalla completa (modal inmersivo con fondo oscuro).

### Soluciones evaluadas:
1. **Opción A (Recomendada y Ligera):** `react-native-image-viewing` o modal con `ScrollView` nativo (`maximumZoomScale={3}` y `minimumZoomScale={1}`).
   * *Ventaja:* No agrega dependencias nativas pesadas, 100% compatible con Expo Go y SDK 57, respeta safe areas en landscape y portrait.
2. **Opción B (Avanzada):** `react-native-gesture-handler` + `react-native-reanimated` (`Gesture.Pinch()`).
   * *Ventaja:* Animaciones a 60/120 FPS; ya tenemos ambas librerías instaladas en `package.json`.

---

## 3. Próximas Investigaciones en Cola
* Estructura de modelo relacional JPA para casos clínicos y trazabilidad de intentos de alumnos (MySQL + Spring Data).
* Estrategias de cacheo y persistencia offline de casos clínicos en React Native.
