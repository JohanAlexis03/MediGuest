# Modelo de Datos — MediQuest

Versión 1.0 — Fase 1

## Entidades

- **CASO_CLINICO** (id) — raíz: contiene paciente, signos vitales y preguntas
- **PACIENTE** (id, caso_id → CASO_CLINICO) — nombre1, nombre2, apellido1, apellido2, sexo, edad
- **SIG_VITALES** (id, caso_id → CASO_CLINICO) — temperatura, PA, FC, FR, SatO2
- **PREGUNTA** (id, caso_id → CASO_CLINICO) — enunciado
- **OPCION** (id, pregunta_id → PREGUNTA) — texto, es_correcta (bool), explicacion
- **USUARIO** (id) — nombre, apellido, correo, contraseña (hash), rol (estudiante/admin)
- **RESULTADO** (id, usuario_id → USUARIO, caso_id → CASO_CLINICO) — puntaje, fecha

## Dato derivado

PROGRESO no es tabla: se calcula desde RESULTADO (casos resueltos, promedio, últimos intentos). Regla: nunca guardar lo que se puede calcular.

## Regla de retroalimentación

Explicación por OPCIÓN (Diseño 2): cada opción explica por qué es correcta o incorrecta.