package com.mediquest.backend.config;

import com.mediquest.backend.domain.enums.Difficulty;
import com.mediquest.backend.domain.enums.Role;
import com.mediquest.backend.domain.enums.Specialty;
import com.mediquest.backend.domain.model.*;
import com.mediquest.backend.repository.ClinicalCaseRepository;
import com.mediquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClinicalCaseRepository clinicalCaseRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedClinicalCases();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Usuarios ya inicializados en la base de datos.");
            return;
        }

        User student = User.builder()
                .name("Estudiante APH")
                .email("student@mediquest.edu")
                .passwordHash("password123") // En producción con BCrypt
                .role(Role.ROLE_STUDENT)
                .build();

        User teacher = User.builder()
                .name("Profesor Instructor APH")
                .email("docente@mediquest.edu")
                .passwordHash("password123")
                .role(Role.ROLE_TEACHER)
                .build();

        userRepository.saveAll(List.of(student, teacher));
        log.info("Usuarios semilla creados exitosamente (student@mediquest.edu, docente@mediquest.edu).");
    }

    private void seedClinicalCases() {
        if (clinicalCaseRepository.count() > 0) {
            log.info("Casos clínicos ya inicializados en la base de datos.");
            return;
        }

        List<ClinicalCase> cases = new ArrayList<>();

        // Caso 1: Trauma de Pelvis
        ClinicalCase casoPelvis = ClinicalCase.builder()
                .id("caso-trauma-pelvis")
                .title("Shock hipovolémico por fractura inestable de pelvis")
                .specialty(Specialty.TRAUMA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Colisión vehicular frontal de alta energía. Conductor atrapado tras impacto a 80 km/h.")
                .scene("Deformidad severa del habitáculo. Parabrisas estrellado en ojo de buey. Volante doblado.")
                .kinematicsOrOnset("Desaceleración brusca con impacto de rodillas contra el tablero y compresión lateral del anillo pélvico.")
                .protocolReference("PHTLS 9na Edición, Cap. 12 (Trauma Musculoesquelético y Pélvico)")
                .patient(PatientInfo.builder()
                        .age(38)
                        .ageUnit("años")
                        .sex("Masculino")
                        .weightKg(78.0)
                        .occupation("Conductor de transporte")
                        .build())
                .vitals(VitalSigns.builder()
                        .heartRate(132)
                        .respiratoryRate(28)
                        .bloodPressure("84/52")
                        .oxygenSaturation(91)
                        .bodyTemperature(35.8)
                        .glasgow(GlasgowScale.builder()
                                .ocularResponse(3)
                                .verbalResponse(4)
                                .motorResponse(5)
                                .totalScore(12)
                                .build())
                        .build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable, con control bimanual estricto de columna cervical en línea media.")
                        .breathing("Taquipneico, murmullo vesicular simétrico sin ruidos agregados ni ingurgitación yugular.")
                        .circulation("Pulsos periféricos filiformes, taquicardia marcada, llenado capilar de 4 segundos. Piel pálida, fría y diaforética. Inestabilidad y dolor a la compresión suave de crestas ilíacas.")
                        .disability("Glasgow 12/15 por hipoperfusión cerebral aguda. Pupilas isocóricas reactivas a la luz (3mm).")
                        .exposure("Equimosis perineal incipiente. Extremidad inferior izquierda acortada y en rotación externa.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Dolor pélvico lancinante intolerable, sensación de desvanecimiento y sed intensa.")
                        .allergies("Niega alergias a medicamentos.")
                        .medications("Ninguno habitual.")
                        .pastHistory("Apendicectomía a los 18 años.")
                        .lastMeal("Almuerzo hace 4 horas.")
                        .events("Conducía con cinturón de dos puntos. Vehículo impactó contra un pilar de concreto.")
                        .build())
                .media(ClinicalMedia.builder()
                        .mediaType("xray")
                        .title("Radiografía AP de Pelvis en Cuarto de Reanimación")
                        .subtitle("Visualización de diástasis de sínfisis púbica")
                        .findings("Apertura de sínfisis púbica > 2.5 cm en libro abierto con luxación sacroilíaca izquierda.")
                        .badgeLabel("Imagen Diagnóstica")
                        .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80")
                        .imageCaption("Diástasis sínfisis del pubis y asimetría sacroilíaca evidente.")
                        .build())
                .build();

        Question qPelvis = Question.builder()
                .prompt("Ante la inestabilidad hemodinámica y sospecha de fractura de pelvis en libro abierto en la fase prehospitalaria, ¿cuál es la intervención prioritaria inmediata?")
                .protocolReference("PHTLS 9na Edición")
                .clinicalCase(casoPelvis)
                .build();

        List<Option> optsPelvis = List.of(
                Option.builder()
                        .optionKey("A")
                        .text("Colocación inmediata de faja pélvica comercial o sábana a nivel de trocánteres mayores y reanimación hipotensiva permisiva.")
                        .isCorrect(true)
                        .clinicalFeedback("¡Correcto! La faja pélvica a nivel de trocánteres mayores reduce el volumen pélvico, estabiliza el hematoma retroperitoneal y mitiga el sangrado de plexos venosos pélvicos. Se acompaña de reanimación hipotensiva (PAS 80-90 mmHg) para no remover coágulos.")
                        .question(qPelvis)
                        .build(),
                Option.builder()
                        .optionKey("B")
                        .text("Administración agresiva de 3 litros de solución salina 0.9% en bolo rápido para normalizar la PA por encima de 120/80.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. La sobrecarga masiva de cristaloides genera hemodilución de factores de coagulación, hipotermia y disrupción mecánica de coágulos formados ('pop the clot').")
                        .question(qPelvis)
                        .build(),
                Option.builder()
                        .optionKey("C")
                        .text("Compresión manual repetida de crestas ilíacas cada 5 minutos para evaluar si persiste la inestabilidad ósea.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. La pelvis solo se evalúa UNA vez con presión suave. Palparla repetidamente desaloja coágulos y desata hemorragias catastróficas.")
                        .question(qPelvis)
                        .build(),
                Option.builder()
                        .optionKey("D")
                        .text("Tracción cutánea de la extremidad inferior acortada antes de la inmovilización en tabla espinal.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. Traccionar la extremidad sin antes cerrar el anillo pélvico expande el espacio retroperitoneal e incrementa el volumen de sangrado oculto.")
                        .question(qPelvis)
                        .build()
        );
        qPelvis.setOptions(optsPelvis);
        casoPelvis.setQuestions(List.of(qPelvis));
        cases.add(casoPelvis);

        // Caso 2: Síndrome colinérgico (de caso6.md)
        ClinicalCase casoColin = ClinicalCase.builder()
                .id("caso-organofosforados")
                .title("Síndrome colinérgico por intoxicación con organofosforados")
                .specialty(Specialty.TOXICOLOGIA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Incidente en depósito agrícola. Agricultor encontrado inconsciente con recipiente abierto de insecticida concentrado.")
                .scene("Olor penetrante a químicos. Paciente empapado con ropa impregnada de pesticida organofosforado.")
                .kinematicsOrOnset("Exposición dérmica e inhalatoria masiva aguda con inhibición irreversible de la acetilcolinesterasa.")
                .protocolReference("Guías Toxicológicas APH y Protocolo ATLS/PHTLS de Incidentes con Materiales Peligrosos")
                .patient(PatientInfo.builder()
                        .age(34)
                        .ageUnit("años")
                        .sex("Masculino")
                        .weightKg(70.0)
                        .occupation("Agricultor")
                        .build())
                .vitals(VitalSigns.builder()
                        .heartRate(42)
                        .respiratoryRate(34)
                        .bloodPressure("85/50")
                        .oxygenSaturation(82)
                        .bodyTemperature(36.2)
                        .glasgow(GlasgowScale.builder()
                                .ocularResponse(2)
                                .verbalResponse(2)
                                .motorResponse(4)
                                .totalScore(8)
                                .build())
                        .build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Vía aérea parcialmente obstruida por sialorrea profusa y broncorrea masiva hialina.")
                        .breathing("Taquipnea severa superficial con tirajes intercostales. Auscultación con roncantes y sibilancias bilaterales difusas.")
                        .circulation("Bradicardia severa (42 lpm), hipotensión, llenado capilar 4 seg, diaforesis profusa.")
                        .disability("Glasgow 8/15. Pupilas puntiformes mióticas (1 mm) hiporreactivas. Fasciculaciones musculares generalizadas.")
                        .exposure("Ropa impregnada de sustancia química con olor penetrante.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Dificultad respiratoria extrema, visión borrosa, vómitos y diarrea involuntaria.")
                        .allergies("No conocidas.")
                        .medications("Ninguno.")
                        .pastHistory("Sin antecedentes patológicos relevantes.")
                        .lastMeal("Desayuno hace 6 horas.")
                        .events("Manipulación de pesticida agrícola concentrado sin equipo de protección personal.")
                        .build())
                .media(ClinicalMedia.builder()
                        .mediaType("ecg")
                        .title("Tira de Ritmo de Monitorización Prehospitalaria")
                        .subtitle("Bradicardia sinusal extrema")
                        .findings("Bradicardia sinusal a 42 lpm con complejos ventriculares prematuros aislados.")
                        .badgeLabel("Tira de ECG")
                        .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80")
                        .imageCaption("Monitor evidencia ritmo sinusal bradicárdico severo secundario a hiperestimulación muscarínica.")
                        .build())
                .build();

        Question qColin = Question.builder()
                .prompt("Si el paciente requiere Secuencia de Intubación Rápida (SIR) por Glasgow 8 y desaturación refractaria, ¿cuál es la conducta correcta respecto a los bloqueantes neuromusculares?")
                .protocolReference("Farmacología Prehospitalaria Avanzada")
                .clinicalCase(casoColin)
                .build();

        List<Option> optsColin = List.of(
                Option.builder()
                        .optionKey("A")
                        .text("Evitar Succinilcolina debido a que los organofosforados inhiben las pseudocolinesterasas plasmáticas, prolongando el bloqueo por horas; usar Rocuronio a dosis ajustada.")
                        .isCorrect(true)
                        .clinicalFeedback("¡Correcto! Los organofosforados inhiben tanto la acetilcolinesterasa como la butirilcolinesterasa (pseudocolinesterasa plasmática). Administrar succinilcolina causa una parálisis prolongada impredecible y empeora las fasciculaciones. El rocuronio (1.2 mg/kg) es el paralizante de elección.")
                        .question(qColin)
                        .build(),
                Option.builder()
                        .optionKey("B")
                        .text("Administrar Succinilcolina a dosis estándar (1.5 mg/kg) ya que actúa como antagonista competitivo de la acetilcolina.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. La succinilcolina es un bloqueante despolarizante hidrolizado por pseudocolinesterasas; al estar inhibidas, el bloqueo neuromuscular persiste por horas.")
                        .question(qColin)
                        .build(),
                Option.builder()
                        .optionKey("C")
                        .text("Intubar sin relajantes neuromusculares ni sedación para no deprimir más el sistema nervioso central.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. Intentar intubar a un paciente con laringoespasmo y reflejos protectores residuales sin relajación incrementa el riesgo de broncoaspiración masiva y trauma de vía aérea.")
                        .question(qColin)
                        .build(),
                Option.builder()
                        .optionKey("D")
                        .text("Administrar Flumazenil antes de la laringoscopia para contrarrestar el efecto tóxico.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. El flumazenil es un antagonista de benzodiacepinas y no tiene ningún rol en la intoxicación por organofosforados.")
                        .question(qColin)
                        .build()
        );
        qColin.setOptions(optsColin);
        casoColin.setQuestions(List.of(qColin));
        cases.add(casoColin);

        // Caso 3: Anafilaxia en paciente betabloqueado (de caso1.md)
        ClinicalCase casoAnafilaxia = ClinicalCase.builder()
                .id("caso-anafilaxia-beta")
                .title("Anafilaxia refractaria en paciente bajo tratamiento crónico con betabloqueadores")
                .specialty(Specialty.CARDIOVASCULAR)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Llamada por reacción alérgica grave tras picadura de abeja en paciente hipertenso en tratamiento con propranolol.")
                .scene("Paciente sentado con disnea aguda, edema periorbitario y labial marcado.")
                .kinematicsOrOnset("Reacción anafiláctica severa con respuesta clínica nula a dos dosis de adrenalina intramuscular.")
                .protocolReference("Guías AHA / ERC de Soporte Vital y Manejo de Anafilaxia Refractaria")
                .patient(PatientInfo.builder()
                        .age(54)
                        .ageUnit("años")
                        .sex("Masculino")
                        .weightKg(82.0)
                        .occupation("Comerciante")
                        .build())
                .vitals(VitalSigns.builder()
                        .heartRate(58)
                        .respiratoryRate(26)
                        .bloodPressure("78/44")
                        .oxygenSaturation(89)
                        .bodyTemperature(36.6)
                        .glasgow(GlasgowScale.builder()
                                .ocularResponse(4)
                                .verbalResponse(4)
                                .motorResponse(6)
                                .totalScore(14)
                                .build())
                        .build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Estridor laríngeo inspiratorio audible, edema de úvula y labios.")
                        .breathing("Disnea marcada, sibilancias espiratorias bilaterales y saturación 89% con oxígeno.")
                        .circulation("Hipotensión refractaria (78/44), bradicardia relativa o inapropiada (58 lpm) por bloqueo beta-adrenérgico.")
                        .disability("Alerta pero ansioso y agitado por hipoxia.")
                        .exposure("Urticaria difusa con placas eritematosas pruriginosas en tórax y abdomen.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Sensación de asfixia, mareo postural y calor corporal intenso.")
                        .allergies("Picadura de himenópteros diagnosticada hace 5 años.")
                        .medications("Propranolol 40 mg cada 12 horas por hipertensión y temblor esencial.")
                        .pastHistory("Hipertensión arterial controlada.")
                        .lastMeal("Desayuno hace 2 horas.")
                        .events("Picadura múltiple de insecto mientras realizaba jardinería.")
                        .build())
                .build();

        Question qAnafilaxia = Question.builder()
                .prompt("Tras dos dosis de adrenalina IM (0.5 mg) sin respuesta en la presión arterial ni el estridor, ¿cuál es el fármaco de segunda línea indicado y por qué mecanismo actúa?")
                .protocolReference("Farmacología Clínica en Urgencias - PHTLS / AHA")
                .clinicalCase(casoAnafilaxia)
                .build();

        List<Option> optsAnafilaxia = List.of(
                Option.builder()
                        .optionKey("A")
                        .text("Glucagón IV (1 a 5 mg), ya que estimula la adenilil ciclasa y eleva el AMPc miocárdico de manera independiente a los receptores beta-adrenérgicos.")
                        .isCorrect(true)
                        .clinicalFeedback("¡Correcto! En pacientes con betabloqueo crónico, los receptores beta están saturados y la adrenalina no puede generar suficiente efecto inotrópico ni cronotrópico. El glucagón activa directamente la adenilato ciclasa a través de receptores específicos, superando el bloqueo beta para revertir el colapso cardiovascular.")
                        .question(qAnafilaxia)
                        .build(),
                Option.builder()
                        .optionKey("B")
                        .text("Aumentar la dosis de adrenalina IM a 2 mg cada 2 minutos en bolo.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. Dosis masivas de adrenalina en presencia de betabloqueo no selectivo pueden inducir vasoconstricción alfa-1 masiva sin oposición beta-2, desatando crisis hipertensiva o hemorragia intracraneal.")
                        .question(qAnafilaxia)
                        .build(),
                Option.builder()
                        .optionKey("C")
                        .text("Administrar Difenhidramina oral y esperar 45 minutos a que haga efecto.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los antihistamínicos son coadyuvantes para prurito y edema cutáneo, pero NO revierten el choque distributivo ni el compromiso de la vía aérea.")
                        .question(qAnafilaxia)
                        .build(),
                Option.builder()
                        .optionKey("D")
                        .text("Hidrocortisona IV como único tratamiento para estabilizar la membrana del mastocito de forma inmediata.")
                        .isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los corticoides tardan entre 4 a 6 horas en actuar genómicamente; no tienen ningún impacto en el shock anafiláctico agudo.")
                        .question(qAnafilaxia)
                        .build()
        );
        qAnafilaxia.setOptions(optsAnafilaxia);
        casoAnafilaxia.setQuestions(List.of(qAnafilaxia));
        cases.add(casoAnafilaxia);

        clinicalCaseRepository.saveAll(cases);
        log.info("Casos clínicos semilla insertados exitosamente en MySQL (Total casos: {}).", cases.size());
    }
}
