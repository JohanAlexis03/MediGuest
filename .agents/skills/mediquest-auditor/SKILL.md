---
name: mediquest-auditor
description: Audita implacablemente la gobernanza de ramas Git, la continuidad documental (ESTADO_DEL_PROYECTO, README) y el blindaje de calidad (tsc, lint, mvn test) antes de iniciar tareas o realizar commits en MediQuest.
---

# MediQuest Lead Auditor & Workflow Guard

Esta skill define el protocolo obligatorio y no negociable de auditoría para todo desarrollo en el repositorio **MediQuest**.

## 🛑 CHECKLIST BLOQUEANTE DE AUDITORÍA (Ejecutar SIEMPRE antes de actuar)

### 1. Auditoría de Rama Git (PRE-CONDICIÓN OBLIGATORIA)
Antes de crear, editar o proponer cualquier línea de código:
```bash
git branch --show-current
```
* **Regla de Oro:** Prohibido desarrollar directamente en `main` o `develop`.
* **Regla de Aislamiento:** Prohibido mezclar alcances en ramas existentes (ej. cambios de backend o base de datos en `feature/navegacion`).
* **Acción requerida si la rama no coincide con la tarea:**
  1. Crear la rama adecuada: `git checkout -b feature/<alcance>` (ej: `feature/backend-api`, `feature/auth-jwt`, `feature/admin-crud`).
  2. Confirmar que el prompt y los commits se ejecuten en la rama dedicada.

---

### 2. Auditoría de Hilo Documental y Continuidad (POST-CONDICIÓN OBLIGATORIA)
Ninguna tarea se considera finalizada ni lista para commit sin sincronizar:
* [ ] **`docs/ESTADO_DEL_PROYECTO.md`:**
  - Registrar el hito culminado y archivos clave.
  - Actualizar la sección de Decisiones de Arquitectura (ADR) si hubo elecciones técnicas.
  - Declarar el siguiente paso exacto en la secuencia.
* [ ] **`README.md`:**
  - Actualizar la matriz de Requerimientos Funcionales (**RF01 a RF12**) con su estado real (✅ Implementado, 🟡 En progreso, ⏳ Pendiente).
  - Actualizar el estado del backend/frontend en la tabla general.
* [ ] **`docs/MediQuest_Objetivos_y_Requerimientos.md`:** Sincronizado si hubo variaciones en el alcance o requerimientos.

---

### 3. Auditoría de Calidad y Tests (ZERO-WARNINGS POLICY)
Antes de proponer cualquier commit, ejecutar y validar:
* **Frontend:**
  ```bash
  cd frontend && npm run lint && npx tsc --noEmit
  ```
  *Exigencia:* **0 warnings de ESLint y 0 errores de TypeScript**.
* **Backend:**
  ```bash
  cd backend && mvn test
  ```
  *Exigencia:* **`BUILD SUCCESS` con 0 tests fallidos**.
* **Protección Defensiva:**
  * Verificar que toda pantalla móvil maneje estados nulos (ej. caso no encontrado) con el componente `HttpCatAlert` o fallback visible. Cero pantallas en blanco.
  * Consumo estricto de `react-native-safe-area-context` (prohibido `SafeAreaView` de `react-native`).

---

### 4. Auditoría de Commits Atómicos y Estándar Convencional
* **Prohibido el mega-commit:** Si una tarea incluyó documentación, backend y componentes UI, se deben dividir en commits atómicos separados por responsabilidad.
* **Formato Convencional Estricto:**
  - `feat(<scope>): <descripción concisa>`
  - `fix(<scope>): <descripción concisa>`
  - `docs(<scope>): <descripción concisa>`
  - `test(<scope>): <descripción concisa>`
  - `refactor(<scope>): <descripción concisa>`
* **Cero atribuciones artificiales:** Jamás agregar "Co-Authored-By", firmas de IA o comentarios de autoría automatizada.
