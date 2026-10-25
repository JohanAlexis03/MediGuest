---
name: aph-clinical-modeler
description: Modela, valida y genera casos clínicos de alta fidelidad prehospitalaria bajo estándares PHTLS, ATLS y AHA, estructurando evaluación primaria ABCDE, anamnesis SAMPLE y semillas MySQL normalizadas (DataSeeder) hacia la meta de 100 casos.
---

# APH Clinical Modeler & Simulation Guard

Esta skill define el protocolo clínico obligatorio para la concepción, redacción, validación médica y estructuración de casos clínicos de **Atención Prehospitalaria (APH)** en **MediQuest**.

---

## 🎯 MISIÓN DEL AGENTE
Asegurar que cada escenario clínico refleje con rigor la práctica de campo de la medicina prehospitalaria, guiando el razonamiento inductivo del estudiante desde el despacho en escena hasta la entrega hospitalaria, erradicando preguntas memorísticas y fomentando la toma de decisiones basada en protocolos internacionales vigentes (**PHTLS**, **ATLS**, **AHA**).

---

## 🩺 PROTOCOLO CLÍNICO OBLIGATORIO POR CASO

Todo caso clínico modelado debe contar sin excepción con las siguientes secciones:

### 1. Ficha de Despacho e Identificación
* **ID Inmutable:** Formato slug (`caso-<tema>-<detalle>`, ej: `caso-neumotorax-tension`).
* **Título Descriptivo:** Claro y profesional.
* **Especialidad:** Una de `TRAUMA`, `CARDIOVASCULAR`, `RESPIRATORIO`, `NEUROLOGIA`, `PEDIATRIA`, `TOXICOLOGIA`.
* **Dificultad:** `BASICO`, `INTERMEDIO`, `AVANZADO`.
* **Datos del Paciente:** Edad, unidad (`años`/`meses`), sexo, peso aproximado en kg y ocupación/contexto.
* **Contexto de Despacho y Escena:** Información radial de la llamada y seguridad de la escena.
* **Cinemática del Trauma / Tiempo de Inicio:** Vector de impacto, desaceleración o tiempo transcurrido desde el inicio súbito del cuadro.

### 2. Signos Vitales y Triaje Inicial
* **Frecuencia Cardíaca (FC):** lpm.
* **Frecuencia Respiratoria (FR):** rpm.
* **Presión Arterial (TA):** Sistólica/Diastólica en mmHg.
* **Saturación de Oxígeno (SpO₂):** Porcentaje (%).
* **Temperatura Corporal:** Grados Celsius (°C).
* **Escala de Coma de Glasgow (GCS /15):** Desglosada obligatoriamente en:
  * Respuesta Ocular (/4).
  * Respuesta Verbal (/5).
  * Respuesta Motora (/6).
  * Puntuación Total (/15).

### 3. Evaluación Primaria Sistemática (Algoritmo X-ABCDE)
* **X / C Extrema (si aplica):** Control de hemorragias exanguinantes externas (torniquete, empaquetamiento).
* **A (Airway):** Permeabilidad de vía aérea y control cervical bimanual estricto en línea media.
* **B (Breathing):** Expansión torácica, murmullo vesicular, ruidos agregados, trabajo respiratorio y percusión.
* **C (Circulation):** Calidad de pulsos radiales/carotídeos, llenado capilar, color/temperatura de piel y signos de shock.
* **D (Disability):** Nivel de conciencia (Glasgow), reactividad pupilar (tamaño en mm, simetría y fotorreactividad) y déficit focal.
* **E (Exposure / Environment):** Exposición controlada corporal en busca de lesiones ocultas y prevención activa de hipotermia.

### 4. Evaluación Secundaria (Anamnesis SAMPLE)
* **S (Signos y Síntomas):** Queja principal y semiología del dolor (OPQRST).
* **A (Alergias):** Fármacos, alimentos o sustancias ambientales.
* **M (Medicamentos):** Medicación prescrita habitual o consumo reciente.
* **P (Past medical history):** Patologías de base, cirugías previas o comorbilidades.
* **L (Last oral intake):** Hora y tipo de última ingesta de alimentos/líquidos.
* **E (Events):** Secuencia de hechos que desencadenaron la emergencia médica o traumática.

### 5. Imagen Diagnóstica o Apoyo Visual (RF06)
* **Tipo:** `ecg`, `xray`, `monitor`, `scale`, `algorithm`.
* **Título y Subtítulo:** Indicando hallazgo clave (ej. "Radiografía AP de Tórax", "Tira de Ritmo en DII").
* **Hallazgos:** Descripción semiológica de lo observable en la imagen.
* **URL:** Enlace a recurso visual o biblioteca académica curada.

### 6. Desafío Clínico y Pregunta de Juicio Crítico (RF07, RF08, RF09)
* **Enunciado de la Pregunta:** Situación dilemática en escena donde el estudiante debe elegir la conducta prioritaria.
* **4 Opciones de Respuesta (A, B, C, D):**
  * Exactamente 1 opción correcta basada en la guía oficial.
  * 3 distractores plausibles que representen errores frecuentes de campo (ej. sobrecarga de cristaloides, intubación prematura, compresión pélvica reiterada).
* **Retroalimentación Pedagógica Inmediata:**
  * Justificación fisiopatológica del acierto.
  * Explicación de por qué cada distractor es perjudicial o secundario según el protocolo.
* **Referencia Bibliográfica Oficial:** Capítulo y edición del manual correspondiente (ej. *PHTLS 9na Edición, Cap. 7*).

---

## 🔒 BLINDAJE DE SEGURIDAD ACADÉMICA
1. **Separación de Capas:** El modelador entrega la definición para almacenamiento en MySQL. Las respuestas correctas (`is_correct`) y la justificación clínica (`clinical_feedback`) son privadas del servidor y jamás viajan en el DTO de consulta inicial (`ClinicalCaseDetailDto`).
2. **UTF-8 Completo (`utf8mb4`):** Toda salida debe usar notación médica estándar: `SpO₂`, `µg/kg/min`, `°C`, flechas `↑`, `↓`.

---

## 🚀 PLANTILLA DE SALIDA JAVA PARA DATASEEDER / INGESTA MASIVA

```java
ClinicalCase caso = ClinicalCase.builder()
        .id("slug-del-caso")
        .title("Título del caso clínico")
        .specialty(Specialty.TRAUMA)
        .difficulty(Difficulty.AVANZADO)
        .dispatchContext("Contexto del despacho")
        .scene("Evaluación de la escena")
        .kinematicsOrOnset("Cinemática o inicio del cuadro")
        .protocolReference("PHTLS 9na Edición, Cap. X")
        .patient(PatientInfo.builder()
                .age(40).ageUnit("años").sex("Masculino").weightKg(75.0).occupation("Ocupación")
                .build())
        .vitals(VitalSigns.builder()
                .heartRate(110).respiratoryRate(24).bloodPressure("90/60")
                .oxygenSaturation(92).bodyTemperature(36.0)
                .glasgow(GlasgowScale.builder().ocularResponse(4).verbalResponse(4).motorResponse(6).totalScore(14).build())
                .build())
        .primarySurvey(PrimarySurvey.builder()
                .airway("...").breathing("...").circulation("...").disability("...").exposure("...")
                .build())
        .sampleHistory(SampleHistory.builder()
                .symptoms("...").allergies("...").medications("...").pastHistory("...").lastMeal("...").events("...")
                .build())
        .media(ClinicalMedia.builder()
                .mediaType("xray").title("...").subtitle("...").findings("...").badgeLabel("Rx").imageUrl("...").imageCaption("...")
                .build())
        .build();
```
