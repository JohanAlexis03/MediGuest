# **DOCUMENTO MAESTRO DEL PROYECTO: MEDIQUEST** 

Este documento contiene la definición oficial, alcance, arquitectura y metodología de trabajo para el proyecto de aula MediQuest. Todo el equipo debe basarse estrictamente en estos lineamientos. 

## 1. CONTEXTO DEL PROYECTO 

La idea nace por la necesidad real de estudiantes de Atención Prehospitalaria (APH) que requieren estudiar y repasar constantemente conceptos, procedimientos y situaciones clínicas. 

Inicialmente se pensó en una plataforma gigante (IA, simulación 3D, gamificación), pero para asegurar el éxito del proyecto universitario y poder entregarlo a tiempo, el enfoque se redujo a: 

UNA APLICACIÓN MÓVIL PARA RESOLVER CASOS CLÍNICOS INTERACTIVOS DIRIGIDA A ESTUDIANTES DE ATENCIÓN PREHOSPITALARIA. 

# **2. NOMBRE Y OBJETIVOS** 

Nombre de la aplicación: MediQuest Identidad visual: Logo con el bastón de Asclepio (sin alas), transmitiendo medicina, tecnología y aprendizaje. 

Objetivo General: "Desarrollar una aplicación móvil que permita a los estudiantes de Atención Prehospitalaria resolver casos clínicos interactivos, con el fin de fortalecer el razonamiento clínico y la toma de decisiones." 

Objetivos Específicos: 

1. Diseñar una estructura de casos clínicos interactivos (antecedentes, signos vitales, hallazgos). 

2. Implementar un módulo de análisis y respuesta de preguntas. 

3. Implementar un sistema de evaluación y retroalimentación. 

4. Registrar resultados para seguimiento del progreso. 

# **3. CONCEPTO PRINCIPAL Y FLUJO** 

El núcleo de la aplicación es un proceso lineal de entrenamiento: Selección del caso → Info del paciente → Signos/Síntomas → Imágenes/Radiografías (estáticas) → Preguntas de selección múltiple → Validación → Retroalimentación → Registro en progreso. 

Lo que NO vamos a hacer en este MVP: 

- Generación o diagnóstico mediante Inteligencia Artificial. 

- Maniquíes 3D o interacciones complejas con el cuerpo. 

- Historias clínicas reales de pacientes. 

- Chats médicos o redes sociales. 

# **4. ARQUITECTURA TÉCNICA DEFINIDA** 

Utilizaremos un modelo MVC Distribuido (Cliente-Servidor API REST). 

Frontend (La Vista): 

- Tecnología: React Native con Expo. 

- Diseño UI: Descartamos Figma por temas de agilidad. Diseñaremos directamente en código usando componentes nativos y librerías (ej. React Native Paper). 

- Plataforma: Aplicación móvil. 

Backend (El Modelo y Controlador): 

- Tecnología: Java con Spring Boot. 

- Base de Datos: Relacional, utilizando MySQL. 

- Funcionalidad: API REST que expone los endpoints, calcula las notas y protege las respuestas correctas. 

# **5. REPARTICIÓN DEL EQUIPO (4 PERSONAS)** 

Para evitar bloquearnos o pisarnos el código, dividiremos las responsabilidades así: 

Miembro 1: Frontend Visual (React Native) 

- Encargado de maquetar las pantallas, armar la navegación y aplicar estilos (colores, botones). Construye el esqueleto. 

Miembro 2: Frontend Lógico (React Native) 

- Encargado de capturar la información, manejar estados y consumir la API (conectar las pantallas visuales con los datos reales). 

Miembro 3: Backend (Spring Boot) 

- Encargado de construir los Controladores y Servicios REST, manejar la lógica de evaluación y la seguridad de las peticiones. 

Miembro 4: Arquitectura y Base de Datos 

- Encargado del diseño de tablas en MySQL, los repositorios en Spring Boot, gestión del repositorio en Git y velar por la integración de ambas partes. 

Product Owner (Externo): 

- Validará los casos clínicos de prueba y la utilidad clínica de la aplicación. 

# **6. REGLAS DE TRABAJO Y GIT** 

- Rama main: Intocable. Solo recibe código funcional y revisado. 

- Rama develop: Rama de integración donde unimos el trabajo de todos. 

- Ramas feature: Cada desarrollador creará una rama para su tarea (ej: feature/login, feature/api-casos). 

- Integración: Todo se une mediante Pull Requests. 

Metodología Ágil: Trabajaremos por Sprints cortos (1-2 semanas), asignando tareas específicas en un tablero tipo Kanban (Por hacer, En progreso, Terminado). 

# **7. ESTADO ACTUAL DEL PROYECTO** 

- Requerimientos Funcionales y No Funcionales (RF y RNF): Definidos. 

- Casos clínicos de prueba: Redactados (ej. Trauma de pelvis, Trauma de tórax). 

- Repositorio de GitHub: Creado, clonado e inicializado. 

- Estructura de carpetas local: Lista y con archivo .gitignore. 

- Proyecto móvil: React Native (Expo) ya inicializado en la carpeta /frontend. 

- Siguiente hito: Definir y asignar las tareas del Sprint 1 (Interfaz básica e inicialización del backend). 

