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
  - ✅ Arquitectura de ingesta desacoplada JSON (`classpath*:cases/*.json`) vía `CaseLoaderService` con soporte de upsert.
  - ✅ Banco equilibrado de 30 casos clínicos de alta fidelidad sembrados en las 6 especialidades de APH (con 7 casos respiratorios).
  - ✅ Endpoints REST `/api/cases`, `/api/progress` y `/api/auth` (login y registro) con DTOs seguros.
  - ✅ Evaluación pedagógica en servidor con persistencia inmutable en tabla `attempts` (RF10).
  - ✅ Manejador global de excepciones integrado con **http.cat** (`404.jpg`, `500.jpg`, `503.jpg`) y CORS configurado.
  - ✅ 8/8 pruebas de integración automatizadas en verde (`mvn test`).
- 🟢 **Documentación & Auditoría:** Skill `mediquest-auditor` activa, 5 agentes especializados y bitácora en `ESTADO_DEL_PROYECTO.md`.
- 🟢 **Git:** Rama de trabajo activa `feature/difficulty-filter-and-respiratory-expansion`.

## Matriz de Requerimientos Funcionales (MVP)

| ID | Requerimiento | Estado | Detalle / Ruta |
|---|---|:---:|---|
| **RF01** | Registro de usuario | ✅ | `POST /api/auth/register`, `frontend/src/app/registro.tsx` y tabla `users` |
| **RF02** | Inicio de sesión | ✅ | `POST /api/auth/login`, `frontend/src/app/login.tsx` y `AsyncStorage` |
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

## Cómo ejecutar el proyecto (Guía Multiplataforma)

### 1. Iniciar Base de Datos (MySQL 9.3)

Selecciona el comando según tu sistema operativo:

* **macOS (Homebrew):**
  ```bash
  brew services start mysql
  ```
* **Linux (Ubuntu / Debian):**
  ```bash
  sudo systemctl start mysql
  # o: sudo service mysql start
  ```
* **Windows (CMD o PowerShell como Administrador):**
  ```cmd
  net start MySQL80
  :: o inicia el servicio 'MySQL' desde services.msc
  ```
* **Docker (Universal multiplataforma):**
  ```bash
  docker run --name mediquest-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=mediquest_db -p 3306:3306 -d mysql:9.3
  ```

> **Verificación:** Confirma que la base de datos `mediquest_db` esté creada con codificación `utf8mb4`.

---

### 2. Iniciar API REST Backend (Spring Boot 4 / Java 23)

Requiere **Java JDK 23** instalado.

* **macOS / Linux:**
  ```bash
  cd backend
  mvn spring-boot:run
  ```
* **Windows (CMD / PowerShell):**
  ```cmd
  cd backend
  mvn spring-boot:run
  ```

La API estará disponible en `http://localhost:8080/api/cases` (debe responder con el catálogo de 30 casos en JSON).

---

### 3. Iniciar Aplicación Móvil (Expo SDK 57 / React Native)

#### A. Conectividad LAN para Dispositivos Físicos (Android / iOS)
Para probar en un smartphone físico en tu misma red local:
1. Conecta tu teléfono y tu computadora a la **misma red Wi-Fi**.
2. Obtén la dirección IP local de tu máquina de desarrollo:
   - **Windows:** Ejecuta `ipconfig` en CMD (busca la IPv4 de tu adaptador Wi-Fi, ej: `192.168.1.X`).
   - **macOS:** Ejecuta `ipconfig getifaddr en0`.
   - **Linux:** Ejecuta `hostname -I`.
3. Crea o edita el archivo `frontend/.env` indicando la IP de tu servidor:
   ```env
   EXPO_PUBLIC_API_URL=http://<TU_IP_LOCAL>:8080/api
   ```
   *(Ejemplo: `EXPO_PUBLIC_API_URL=http://192.168.1.137:8080/api`)*.
4. *En Windows/Linux:* Asegúrate de que el Firewall permita conexiones entrantes al puerto `8080`.

#### B. Ejecutar el Servidor de Desarrollo
```bash
cd frontend
npm install
npx expo start
```

#### C. Abrir la Aplicación según tu Dispositivo
* 📱 **Dispositivo Físico Android:**
  1. Instala **Expo Go** desde Google Play Store.
  2. Abre Expo Go y usa la opción **"Scan QR code"** para escanear el código QR de la terminal.
* 🍎 **Dispositivo Físico iOS (iPhone / iPad):**
  1. Instala **Expo Go** desde la App Store.
  2. Abre la app nativa de **Cámara**, enfoca el código QR y pulsa en la notificación emergente para abrir en Expo Go.
* 🤖 **Emulador Android (Android Studio):**
  - Con el emulador iniciado, presiona la tecla `a` en la terminal de Expo.
* 🍏 **Simulador iOS (macOS con Xcode):**
  - Presiona la tecla `i` en la terminal de Expo.
* 🌐 **Navegador Web:**
  - Presiona la tecla `w` en la terminal de Expo para abrir en Chrome, Edge, Firefox o Safari.