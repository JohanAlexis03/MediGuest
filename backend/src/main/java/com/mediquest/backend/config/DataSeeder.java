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
                .passwordHash("password123")
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
        List<ClinicalCase> allCases = new ArrayList<>();
        allCases.add(buildCasoPelvis());
        allCases.add(buildCasoOrganofosforados());
        allCases.add(buildCasoAnafilaxia());
        allCases.add(buildCasoPediatricoNicotina());
        allCases.add(buildCasoErctHiperpotasemia());
        allCases.add(buildCasoNeurolepticoMaligno());
        allCases.add(buildCasoShockCardiogenico());
        allCases.add(buildCasoCocaina());
        allCases.add(buildCasoNeumotoraxTension());
        allCases.add(buildCasoAsmaSevero());

        List<ClinicalCase> toInsert = allCases.stream()
                .filter(c -> !clinicalCaseRepository.existsById(c.getId()))
                .toList();

        if (toInsert.isEmpty()) {
            log.info("Todos los casos clínicos ({}) ya están sincronizados en MySQL.", allCases.size());
            return;
        }

        clinicalCaseRepository.saveAll(toInsert);
        log.info("Se insertaron {} nuevos casos clínicos en MySQL. Total en catálogo: {}",
                toInsert.size(), clinicalCaseRepository.count());
    }

    // --- Caso 1: Trauma de Pelvis ---
    private ClinicalCase buildCasoPelvis() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-trauma-pelvis")
                .title("Shock hipovolémico por fractura inestable de pelvis")
                .specialty(Specialty.TRAUMA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Colisión vehicular frontal de alta energía. Conductor atrapado tras impacto a 80 km/h.")
                .scene("Deformidad severa del habitáculo. Parabrisas estrellado en ojo de buey. Volante doblado.")
                .kinematicsOrOnset("Desaceleración brusca con impacto de rodillas contra el tablero y compresión lateral del anillo pélvico.")
                .protocolReference("PHTLS 9na Edición, Cap. 12 (Trauma Musculoesquelético y Pélvico)")
                .patient(PatientInfo.builder().age(38).ageUnit("años").sex("Masculino").weightKg(78.0).occupation("Conductor de transporte").build())
                .vitals(VitalSigns.builder().heartRate(132).respiratoryRate(28).bloodPressure("84/52").oxygenSaturation(91).bodyTemperature(35.8)
                        .glasgow(GlasgowScale.builder().ocularResponse(3).verbalResponse(4).motorResponse(5).totalScore(12).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable, con control bimanual estricto de columna cervical en línea media.")
                        .breathing("Taquipneico, murmullo vesicular simétrico sin ruidos agregados ni ingurgitación yugular.")
                        .circulation("Pulsos periféricos filiformes, taquicardia marcada, llenado capilar de 4 segundos. Piel pálida, fría y diaforética. Inestabilidad y dolor a la compresión suave de crestas ilíacas.")
                        .disability("Glasgow 12/15 por hipoperfusión cerebral aguda. Pupilas isocóricas reactivas a la luz (3mm).")
                        .exposure("Equimosis perineal incipiente. Extremidad inferior izquierda acortada y en rotación externa.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Dolor pélvico lancinante intolerable, sensación de desvanecimiento y sed intensa.")
                        .allergies("Niega alergias a medicamentos.").medications("Ninguno habitual.").pastHistory("Apendicectomía a los 18 años.")
                        .lastMeal("Almuerzo hace 4 horas.").events("Conducía con cinturón de dos puntos. Vehículo impactó contra un pilar de concreto.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("xray").title("Radiografía AP de Pelvis en Cuarto de Reanimación").subtitle("Visualización de diástasis de sínfisis púbica")
                        .findings("Apertura de sínfisis púbica > 2.5 cm en libro abierto con luxación sacroilíaca izquierda.").badgeLabel("Imagen Diagnóstica")
                        .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80").imageCaption("Diástasis sínfisis del pubis y asimetría sacroilíaca evidente.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante la inestabilidad hemodinámica y sospecha de fractura de pelvis en libro abierto en la fase prehospitalaria, ¿cuál es la intervención prioritaria inmediata?")
                .protocolReference("PHTLS 9na Edición").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Colocación inmediata de faja pélvica comercial o sábana a nivel de trocánteres mayores y reanimación hipotensiva permisiva.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! La faja pélvica a nivel de trocánteres mayores reduce el volumen pélvico, estabiliza el hematoma retroperitoneal y mitiga el sangrado de plexos venosos pélvicos. Se acompaña de reanimación hipotensiva (PAS 80-90 mmHg) para no remover coágulos.").question(q).build(),
                Option.builder().optionKey("B").text("Administración agresiva de 3 litros de solución salina 0.9% en bolo rápido para normalizar la PA por encima de 120/80.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La sobrecarga masiva de cristaloides genera hemodilución de factores de coagulación, hipotermia y disrupción mecánica de coágulos formados ('pop the clot').").question(q).build(),
                Option.builder().optionKey("C").text("Compresión manual repetida de crestas ilíacas cada 5 minutos para evaluar si persiste la inestabilidad ósea.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La pelvis solo se evalúa UNA vez con presión suave. Palparla repetidamente desaloja coágulos y desata hemorragias catastróficas.").question(q).build(),
                Option.builder().optionKey("D").text("Tracción cutánea de la extremidad inferior acortada antes de la inmovilización en tabla espinal.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Traccionar la extremidad sin antes cerrar el anillo pélvico expande el espacio retroperitoneal e incrementa el volumen de sangrado oculto.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 2: Intoxicación por Organofosforados ---
    private ClinicalCase buildCasoOrganofosforados() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-organofosforados")
                .title("Síndrome colinérgico por intoxicación con organofosforados")
                .specialty(Specialty.TOXICOLOGIA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Incidente en depósito agrícola. Agricultor encontrado inconsciente con recipiente abierto de insecticida concentrado.")
                .scene("Olor penetrante a químicos. Paciente empapado con ropa impregnada de pesticida organofosforado.")
                .kinematicsOrOnset("Exposición dérmica e inhalatoria masiva aguda con inhibición irreversible de la acetilcolinesterasa.")
                .protocolReference("Guías Toxicológicas APH y Protocolo ATLS/PHTLS de Incidentes con Materiales Peligrosos")
                .patient(PatientInfo.builder().age(34).ageUnit("años").sex("Masculino").weightKg(70.0).occupation("Agricultor").build())
                .vitals(VitalSigns.builder().heartRate(42).respiratoryRate(34).bloodPressure("85/50").oxygenSaturation(82).bodyTemperature(36.2)
                        .glasgow(GlasgowScale.builder().ocularResponse(2).verbalResponse(2).motorResponse(4).totalScore(8).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Vía aérea parcialmente obstruida por sialorrea profusa y broncorrea masiva hialina.")
                        .breathing("Taquipnea severa superficial con tirajes intercostales. Auscultación con roncantes y sibilancias bilaterales difusas.")
                        .circulation("Bradicardia severa (42 lpm), hipotensión, llenado capilar 4 seg, diaforesis profusa.")
                        .disability("Glasgow 8/15. Pupilas puntiformes mióticas (1 mm) hiporreactivas. Fasciculaciones musculares generalizadas.")
                        .exposure("Ropa impregnada de sustancia química con olor penetrante.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Dificultad respiratoria extrema, visión borrosa, vómitos y diarrea involuntaria.")
                        .allergies("No conocidas.").medications("Ninguno.").pastHistory("Sin antecedentes patológicos relevantes.")
                        .lastMeal("Desayuno hace 6 horas.").events("Manipulación de pesticida agrícola concentrado sin equipo de protección personal.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("ecg").title("Tira de Ritmo de Monitorización Prehospitalaria").subtitle("Bradicardia sinusal extrema")
                        .findings("Bradicardia sinusal a 42 lpm con complejos ventriculares prematuros aislados.").badgeLabel("Tira de ECG")
                        .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80").imageCaption("Monitor evidencia ritmo sinusal bradicárdico severo secundario a hiperestimulación muscarínica.").build())
                .build();

        Question q = Question.builder()
                .prompt("Si el paciente requiere Secuencia de Intubación Rápida (SIR) por Glasgow 8 y desaturación refractaria, ¿cuál es la conducta correcta respecto a los bloqueantes neuromusculares?")
                .protocolReference("Farmacología Prehospitalaria Avanzada").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Evitar Succinilcolina debido a que los organofosforados inhiben las pseudocolinesterasas plasmáticas, prolongando el bloqueo por horas; usar Rocuronio a dosis ajustada.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! Los organofosforados inhiben tanto la acetilcolinesterasa como la butirilcolinesterasa (pseudocolinesterasa plasmática). Administrar succinilcolina causa una parálisis prolongada impredecible y empeora las fasciculaciones. El rocuronio (1.2 mg/kg) es el paralizante de elección.").question(q).build(),
                Option.builder().optionKey("B").text("Administrar Succinilcolina a dosis estándar (1.5 mg/kg) ya que actúa como antagonista competitivo de la acetilcolina.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La succinilcolina es un bloqueante despolarizante hidrolizado por pseudocolinesterasas; al estar inhibidas, el bloqueo neuromuscular persiste por horas.").question(q).build(),
                Option.builder().optionKey("C").text("Intubar sin relajantes neuromusculares ni sedación para no deprimir más el sistema nervioso central.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Intentar intubar a un paciente con laringoespasmo y reflejos protectores residuales sin relajación incrementa el riesgo de broncoaspiración masiva y trauma de vía aérea.").question(q).build(),
                Option.builder().optionKey("D").text("Administrar Flumazenil antes de la laringoscopia para contrarrestar el efecto tóxico.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. El flumazenil es un antagonista de benzodiacepinas y no tiene ningún rol en la intoxicación por organofosforados.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 3: Anafilaxia en Paciente Betabloqueado ---
    private ClinicalCase buildCasoAnafilaxia() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-anafilaxia-beta")
                .title("Anafilaxia refractaria en paciente bajo tratamiento crónico con betabloqueadores")
                .specialty(Specialty.CARDIOVASCULAR)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Llamada por reacción alérgica grave tras picadura de abeja en paciente hipertenso en tratamiento con propranolol.")
                .scene("Paciente sentado con disnea aguda, edema periorbitario y labial marcado.")
                .kinematicsOrOnset("Reacción anafiláctica severa con respuesta clínica nula a dos dosis de adrenalina intramuscular.")
                .protocolReference("Guías AHA / ERC de Soporte Vital y Manejo de Anafilaxia Refractaria")
                .patient(PatientInfo.builder().age(54).ageUnit("años").sex("Masculino").weightKg(82.0).occupation("Comerciante").build())
                .vitals(VitalSigns.builder().heartRate(58).respiratoryRate(26).bloodPressure("78/44").oxygenSaturation(89).bodyTemperature(36.6)
                        .glasgow(GlasgowScale.builder().ocularResponse(4).verbalResponse(4).motorResponse(6).totalScore(14).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Estridor laríngeo inspiratorio audible, edema de úvula y labios.")
                        .breathing("Disnea marcada, sibilancias espiratorias bilaterales y saturación 89% con oxígeno.")
                        .circulation("Hipotensión refractaria (78/44), bradicardia relativa o inapropiada (58 lpm) por bloqueo beta-adrenérgico.")
                        .disability("Alerta pero ansioso y agitado por hipoxia.")
                        .exposure("Urticaria difusa con placas eritematosas pruriginosas en tórax y abdomen.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Sensación de asfixia, mareo postural y calor corporal intenso.")
                        .allergies("Picadura de himenópteros diagnosticada hace 5 años.").medications("Propranolol 40 mg cada 12 horas por hipertensión y temblor esencial.")
                        .pastHistory("Hipertensión arterial controlada.").lastMeal("Desayuno hace 2 horas.").events("Picadura múltiple de insecto mientras realizaba jardinería.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("monitor").title("Monitor Multiparámetro").subtitle("Hipotensión y bradicardia inapropiada")
                        .findings("Trazo electrocardiográfico con bradicardia sinusal y curva pletismográfica de baja amplitud.").badgeLabel("Monitor")
                        .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80").imageCaption("Curva arterial amortiguada con colapso hemodinámico refractario.").build())
                .build();

        Question q = Question.builder()
                .prompt("Tras dos dosis de adrenalina IM (0.5 mg) sin respuesta en la presión arterial ni el estridor, ¿cuál es el fármaco de segunda línea indicado y por qué mecanismo actúa?")
                .protocolReference("Farmacología Clínica en Urgencias - PHTLS / AHA").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Glucagón IV (1 a 5 mg), ya que estimula la adenilil ciclasa y eleva el AMPc miocárdico de manera independiente a los receptores beta-adrenérgicos.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! En pacientes con betabloqueo crónico, los receptores beta están saturados y la adrenalina no puede generar suficiente efecto inotrópico ni cronotrópico. El glucagón activa directamente la adenilato ciclasa a través de receptores específicos, superando el bloqueo beta para revertir el colapso cardiovascular.").question(q).build(),
                Option.builder().optionKey("B").text("Aumentar la dosis de adrenalina IM a 2 mg cada 2 minutos en bolo.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Dosis masivas de adrenalina en presencia de betabloqueo no selectivo pueden inducir vasoconstricción alfa-1 masiva sin oposición beta-2, desatando crisis hipertensiva o hemorragia intracraneal.").question(q).build(),
                Option.builder().optionKey("C").text("Administrar Difenhidramina oral y esperar 45 minutos a que haga efecto.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los antihistamínicos son coadyuvantes para prurito y edema cutáneo, pero NO revierten el choque distributivo ni el compromiso de la vía aérea.").question(q).build(),
                Option.builder().optionKey("D").text("Hidrocortisona IV como único tratamiento para estabilizar la membrana del mastocito de forma inmediata.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los corticoides tardan entre 4 a 6 horas en actuar genómicamente; no tienen ningún impacto en el shock anafiláctico agudo.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 4: Intoxicación Pediátrica por Nicotina Líquida ---
    private ClinicalCase buildCasoPediatricoNicotina() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-pediatrico-nicotina")
                .title("Intoxicación colinérgica nicotínica accidental en paciente pediátrico")
                .specialty(Specialty.PEDIATRIA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Llamada de urgencia por preescolar de 3 años que ingirió líquido de recarga concentrada para vapeador.")
                .scene("Hogar familiar. Frasco abierto de e-liquid sobre la mesa baja del salón.")
                .kinematicsOrOnset("Ingesta accidental por vía oral de nicotina concentrada hace 20 minutos con rápido inicio de vómitos y dificultad respiratoria.")
                .protocolReference("PHTLS Pediátrico / Guías PALS (Pediatric Advanced Life Support)")
                .patient(PatientInfo.builder().age(3).ageUnit("años").sex("Masculino").weightKg(15.0).occupation("Preescolar").build())
                .vitals(VitalSigns.builder().heartRate(175).respiratoryRate(48).bloodPressure("110/70").oxygenSaturation(83).bodyTemperature(36.4)
                        .glasgow(GlasgowScale.builder().ocularResponse(2).verbalResponse(2).motorResponse(5).totalScore(9).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Estridor inspiratorio intenso, sialorrea profusa y tiraje subcostal/intercostal severo con laringoespasmo inminente.")
                        .breathing("Taquipnea marcada (48 rpm), SatO₂ 83% con máscara de reservorio, sibilancias audibles a distancia.")
                        .circulation("Frecuencia cardíaca 175 lpm (taquicardia por estímulo nicotínico temprano), pulsos periféricos débiles, llenado capilar 3 segundos.")
                        .disability("Glasgow Pediátrico 9/15 (O:2, V:2, M:5). Pupilas mióticas reactivas. Fasciculaciones finas en lengua y musculatura facial.")
                        .exposure("Diaforesis, frialdad distal y palidez cutánea generalizada.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Vómitos repetidos, llanto débil, babeo excesivo y ahogo.")
                        .allergies("Sin alergias conocidas.").medications("Baclofeno en suspensión por parálisis cerebral infantil leve.")
                        .pastHistory("Nacido a término sin complicaciones neonatales.").lastMeal("Almuerzo hace 3 horas.")
                        .events("El niño tomó el envase de recarga creyendo que era jarabe dulce.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("monitor").title("Tira de Monitorización Pediátrica").subtitle("Taquicardia sinusal estrecha")
                        .findings("Taquicardia sinusal extrema a 175 lpm con onda P visible y complejos QRS estrechos.").badgeLabel("ECG Pediátrico")
                        .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80").imageCaption("Taquicardia simpática/nicotínica aguda secundaria a sobreestimulación ganglionar.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante la sialorrea profusa, desaturación refractaria y peso estimado de 15 kg, ¿cuál es la dosis y consideración farmacológica de Atropina para revertir la hipersecreción pulmonar?")
                .protocolReference("PALS 2025 / Guías de Toxicología Pediátrica APH").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Atropina 0.02 mg/kg IV (0.3 mg) respetando una dosis mínima de 0.1 mg para evitar bradicardia paradójica mediada por receptores M1 presinápticos.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! En pediatría la dosis de atropina es de 0.02 mg/kg. Dosis subterapéuticas inferiores a 0.1 mg bloquean receptores presinápticos autorreguladores M1, aumentando la liberación de acetilcolina y precipitando bradicardia refleja potencialmente letal.").question(q).build(),
                Option.builder().optionKey("B").text("Atropina 0.5 mg IV en bolo rápido sin considerar el peso del paciente.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. 0.5 mg es la dosis fija de adulto; en un niño de 15 kg puede inducir toxicidad anticolinérgica con hipertermia, delirio y convulsiones.").question(q).build(),
                Option.builder().optionKey("C").text("Pralidoxima IV directa sin necesidad de atropinización previa.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La reactivación enzimática con oximas no revierte de forma inmediata la broncorrea masiva que amenaza con asfixiar al niño.").question(q).build(),
                Option.builder().optionKey("D").text("Inducción de vómito con jarabe de Ipecacuana o carbón activado inmediato por sonda.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Con un Glasgow de 9/15 y compromiso laríngeo, inducir emesis o administrar carbón conlleva un riesgo inaceptable de broncoaspiración mortal.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 5: Organofosforados en Paciente Renal con Hiperpotasemia ---
    private ClinicalCase buildCasoErctHiperpotasemia() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-toxicologia-erct-hiperpotasemia")
                .title("Crisis colinérgica por organofosforados en paciente renal anúrico con hiperpotasemia")
                .specialty(Specialty.TOXICOLOGIA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Hombre de 58 años en hemodiálisis encontrado inconsciente en garaje tras fumigación agrícola doméstica.")
                .scene("Olor fuerte a insecticida. Paciente en decúbito supino con vómito y sialorrea abundante.")
                .kinematicsOrOnset("Inhalación accidental de pesticida organofosforado concentrado con omisión de las últimas dos sesiones de diálisis por paro de transporte.")
                .protocolReference("Manejo de Emergencias Toxicológicas y Alteraciones Electrolíticas en APH")
                .patient(PatientInfo.builder().age(58).ageUnit("años").sex("Masculino").weightKg(70.0).occupation("Obrero jubilado").build())
                .vitals(VitalSigns.builder().heartRate(38).respiratoryRate(32).bloodPressure("80/40").oxygenSaturation(80).bodyTemperature(35.9)
                        .glasgow(GlasgowScale.builder().ocularResponse(1).verbalResponse(2).motorResponse(4).totalScore(7).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Vía aérea totalmente inundada de secreciones salivales y bronquiales espumosas.")
                        .breathing("Taquipnea de 32 rpm con roncus y estertores crepitantes bilaterales. SatO₂ 80% al aire ambiente.")
                        .circulation("Bradicardia extrema a 38 lpm, hipotensión marcada (80/40), llenado capilar 5 seg. Fístula arteriovenosa normofuncionante en MSI.")
                        .disability("Glasgow 7/15. Pupilas puntiformes en cabeza de alfiler (1 mm). Fasciculaciones torácicas y diafragmáticas marcadas.")
                        .exposure("Ropa impregnada de pesticida. Piel fría, diaforética y pálida.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Inconsciencia, disnea asfíctica y convulsiones mioclónicas breves.")
                        .allergies("Penicilina.").medications("Eritropoyetina, carbonato de calcio, amlodipino.")
                        .pastHistory("Enfermedad Renal Crónica Terminal (ERCT) en hemodiálisis trisemanal.").lastMeal("Desconocida.")
                        .events("Fumigaba en espacio cerrado sin mascarilla ni ventilación adecuada.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("ecg").title("ECG de 12 Derivaciones").subtitle("Ondas T picudas simétricas y QRS ancho")
                        .findings("Bradicardia severa con complejos QRS ensanchados a 0.14 s y ondas T hiperagudas simétricas características de hiperpotasemia severa.").badgeLabel("ECG Cardiotóxico")
                        .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80").imageCaption("Signos electrocardiográficos inminentes de paro en actividad eléctrica sin pulso.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante la necesidad de intubación urgente (Glasgow 7) y los hallazgos electrocardiográficos de hiperpotasemia, ¿cuál es la conducta combinada prioritaria?")
                .protocolReference("Protocolos de Secuencia de Intubación Rápida en Paciente Renal y Toxicológico").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Administrar Gluconato de Calcio 10% IV para estabilizar membrana miocárdica + Atropina; contraindicar de forma absoluta la Succinilcolina y utilizar Rocuronio para la inducción.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! El calcio estabiliza de inmediato el umbral miocárdico ante la hiperpotasemia letal. La succinilcolina está absolutamente contraindicada porque eleva el potasio extracelular en 0.5-1.0 mEq/L adicional, lo que desencadenaría fibrilación ventricular o asistolia instantánea en este paciente.").question(q).build(),
                Option.builder().optionKey("B").text("Proceder a intubación rápida con Succinilcolina (1.5 mg/kg) para asegurar la vía aérea antes de cualquier otra intervención.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La succinilcolina en un paciente anúrico con hiperpotasemia y ondas T picudas precipita paro cardíaco refractario por paro despolarizante.").question(q).build(),
                Option.builder().optionKey("C").text("Infusión rápida de Bicarbonato de Sodio como único tratamiento antes de tocar la vía aérea.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. El bicarbonato tiene un inicio de acción lento y no estabiliza de inmediato la membrana miocárdica frente al calcio.").question(q).build(),
                Option.builder().optionKey("D").text("Cardioversión eléctrica sincronizada a 100 Joules para elevar la frecuencia cardíaca.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La cardioversión no trata bradiarritmias sinusales tóxicas ni trastornos metabólicos de membrana.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 6: Síndrome Neuroléptico Maligno ---
    private ClinicalCase buildCasoNeurolepticoMaligno() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-sindrome-neuroleptico-maligno")
                .title("Hipertermia y rigidez muscular severa por Síndrome Neuroléptico Maligno")
                .specialty(Specialty.NEUROLOGIA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Mujer de 38 años encontrada confusa, muy rígida y con fiebre alta tras ajuste de medicación psiquiátrica.")
                .scene("Habitación con calefacción encendida. Paciente sudorosa y rígida en cama.")
                .kinematicsOrOnset("Aparición subaguda en 48 horas de rigidez plástica 'en tubo de plomo' y deterioro cognitivo tras recibir haloperidol oral.")
                .protocolReference("Guías Neurocríticas de Urgencias Médicas y Reacciones Adversas Psiquiátricas")
                .patient(PatientInfo.builder().age(38).ageUnit("años").sex("Femenino").weightKg(62.0).occupation("Docente").build())
                .vitals(VitalSigns.builder().heartRate(118).respiratoryRate(26).bloodPressure("160/95").oxygenSaturation(94).bodyTemperature(38.9)
                        .glasgow(GlasgowScale.builder().ocularResponse(2).verbalResponse(3).motorResponse(5).totalScore(10).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable pero con trismo mandibular moderado por hipertonía muscular generalizada.")
                        .breathing("Taquipneica (26 rpm), murmullo vesicular rudo bilateral sin secreciones abundantes.")
                        .circulation("Taquicardia sinusal a 118 lpm, hipertensión arterial reactiva (160/95), pulsos llenos y piel caliente.")
                        .disability("Glasgow 10/15. Estado confusional fluctuante, desorientación témporo-espacial, mutismo acinético intermitente.")
                        .exposure("Hipertermia marcada (38.9 °C), diaforesis profusa y rigidez generalizada en rueda dentada / tubo de plomo.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Rigidez corporal dolorosa, sudoración empapante, temblores e incoherencia verbal.")
                        .allergies("Sin alergias conocidas.").medications("Haloperidol 10 mg/día iniciado hace 48h y carbonato de litio.")
                        .pastHistory("Trastorno Afectivo Bipolar tipo I en fase maníaca reciente.").lastMeal("Líquidos hace 6 horas.")
                        .events("Ajuste ambulatorio de antipsicóticos por agitación psicomotriz severa.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("scale").title("Evaluación Neurológica de Tono Muscular").subtitle("Tétrada Clínica de SNM")
                        .findings("Hipertermia + Rigidez extrapiramidal severa + Inestabilidad autonómica + Alteración del estado de conciencia.").badgeLabel("Semiología Neuro")
                        .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80").imageCaption("Tétrada clínica clásica representativa del Síndrome Neuroléptico Maligno.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante la tétrada de hipertermia (38.9 °C), rigidez en tubo de plomo, inestabilidad autonómica y uso de haloperidol, ¿cuál es la conducta prehospitalaria prioritaria?")
                .protocolReference("Manejo Prehospitalario de Urgencias Neuropsiquiátricas").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Suspensión inmediata del antipsicótico, enfriamiento físico activo agresivo y fluidoterapia abundante con cristaloides isotónicos para prevenir rabdomiólisis e injuria renal.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! El SNM es una emergencia por bloqueo dopaminérgico agudo. El enfriamiento físico disipa el calor generado por la contracción muscular tónica y la hidratación vigorosa protege los túbulos renales de la mioglobina precipitada por rabdomiólisis.").question(q).build(),
                Option.builder().optionKey("B").text("Administrar Haloperidol intramuscular adicional para controlar el estado confusional y la agitación residual.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Repetir el neuroléptico exacerba la catástrofe dopaminérgica y precipita colapso autonómico mortal.").question(q).build(),
                Option.builder().optionKey("C").text("Administrar Paracetamol oral o intravenoso para normalizar el centro termorregulador hipotalámico.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los antipiréticos actúan sobre prostaglandinas en fiebre por pirógenos; la hipertermia del SNM es periférica por hiperactividad muscular y no responde a antipiréticos.").question(q).build(),
                Option.builder().optionKey("D").text("Inmovilización mecánica en posición prona para contener la hipertonía.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La contención en prono en hipertermia y rabdomiólisis aumenta la acidosis láctica y causa muerte súbita por asfixia postural.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 7: Shock Cardiogénico e Infarto en EPOC ---
    private ClinicalCase buildCasoShockCardiogenico() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-shock-cardiogenico-epoc")
                .title("Shock cardiogénico refractario con compromiso hemodinámico tras infarto agudo de miocardio")
                .specialty(Specialty.CARDIOVASCULAR)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Hombre de 68 años con dolor precordial opresivo, disnea y mareo profundo.")
                .scene("Vivienda. Paciente pálido, frío y con livideces en rodillas, sentado en sillón reclinable.")
                .kinematicsOrOnset("Infarto agudo de miocardio transmural anterior extenso con evolución de 4 horas hacia falla de bomba aguda.")
                .protocolReference("Guías AHA/ERC de Síndromes Coronarios Agudos y Shock Cardiogénico")
                .patient(PatientInfo.builder().age(68).ageUnit("años").sex("Masculino").weightKg(74.0).occupation("Pensionado").build())
                .vitals(VitalSigns.builder().heartRate(115).respiratoryRate(28).bloodPressure("76/48").oxygenSaturation(88).bodyTemperature(36.1)
                        .glasgow(GlasgowScale.builder().ocularResponse(3).verbalResponse(4).motorResponse(6).totalScore(13).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable sin estridor ni cuerpos extraños.")
                        .breathing("Taquipnea superficial, crepitantes húmedos bilaterales basales en marea ascendente. SatO₂ 88% con cánula nasal.")
                        .circulation("Shock cardiogénico evidente (PA 76/48, FC 115 lpm), pulsos periféricos casi imperceptibles, llenado capilar 4.5 s. Extremidades frías.")
                        .disability("Glasgow 13/15 por hipoperfusión encefálica. Somnoliento pero responde a la voz.")
                        .exposure("Palidez terrosa, diaforesis fría y livideces reticulares en miembros inferiores.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Dolor opresivo retroesternal desgarrador, sensación de muerte inminente y ahogo.")
                        .allergies("Sin alergias conocidas.").medications("Inhalador de Bromuro de Ipratropio y Enalapril 10 mg.")
                        .pastHistory("EPOC de larga data y tabaquismo pesado.").lastMeal("Cena liviana hace 7 horas.")
                        .events("Dolor torácico iniciado en reposo a las 04:00 AM con progresivo desvanecimiento.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("ecg").title("Electrocardiograma de 12 Derivaciones").subtitle("Elevación del segmento ST en cara anterior extensa")
                        .findings("Supradesnivel del segmento ST de 4 mm en V1-V4 con ondas Q patológicas incipientes y taquicardia sinusal.").badgeLabel("ECG IAMCEST")
                        .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80").imageCaption("Infarto agudo de miocardio transmural con compromiso de ventrículo izquierdo y falla de bomba.").build())
                .build();

        Question q = Question.builder()
                .prompt("En presencia de shock cardiogénico con hipotensión profunda (PA 76/48) y estertores crepitantes, ¿cuál es el soporte inotrópico/vasopresor de primera línea recomendado?")
                .protocolReference("Guías AHA/ESC de Soporte en Shock Cardiogénico").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Noradrenalina en infusión continua: provee soporte presor potente por estimulación alfa-1 con menor taquicardia arritmogénica y menor consumo de oxígeno miocárdico que la dopamina.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! En shock cardiogénico hipotensivo, la noradrenalina es el fármaco de elección para restaurar la presión de perfusión coronaria sin inducir taquiarritmias severas ni sobrecargar el gasto metabólico miocárdico frente a la dopamina.").question(q).build(),
                Option.builder().optionKey("B").text("Dopamina en dosis altas (> 15 mcg/kg/min) en bolo directo.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Las dosis altas de dopamina disparan la incidencia de arritmias ventriculares y mortalidad en comparación directa con la noradrenalina.").question(q).build(),
                Option.builder().optionKey("C").text("Infusión rápida de 2000 ml de solución salina para elevar la precarga cardíaca.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. En shock cardiogénico con falla ventricular izquierda, la sobrecarga hídrica causa edema agudo de pulmón masivo y asfixia.").question(q).build(),
                Option.builder().optionKey("D").text("Propranolol intravenoso para disminuir la frecuencia cardíaca a menos de 60 lpm.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los betabloqueadores están absolutamente contraindicados en shock cardiogénico por ser inotrópicos negativos.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 8: Dolor Torácico por Cocaína ---
    private ClinicalCase buildCasoCocaina() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-cocaina-dolor-toracico")
                .title("Vasoespasmo coronario e hipertensión crítica secundaria a consumo de cocaína")
                .specialty(Specialty.TOXICOLOGIA)
                .difficulty(Difficulty.INTERMEDIO)
                .dispatchContext("Varón de 29 años con dolor precordial opresivo agudo tras consumo de sustancias ilícitas en evento social.")
                .scene("Ambiente ruidoso. Paciente sumamente agitado, combativo y sudoroso.")
                .kinematicsOrOnset("Consumo intranasal de clorhidrato de cocaína hace 40 minutos con aparición de opresión retroesternal irradiada a mandíbula.")
                .protocolReference("Protocolos AHA y PHTLS para Tóxicos Simpaticomiméticos y Dolor Torácico Agudo")
                .patient(PatientInfo.builder().age(29).ageUnit("años").sex("Masculino").weightKg(78.0).occupation("Empleado de comercio").build())
                .vitals(VitalSigns.builder().heartRate(128).respiratoryRate(24).bloodPressure("198/112").oxygenSaturation(97).bodyTemperature(37.8)
                        .glasgow(GlasgowScale.builder().ocularResponse(4).verbalResponse(4).motorResponse(6).totalScore(14).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable, hiperventilación evidente.")
                        .breathing("Taquipnea sin tirajes, campos pulmonares limpios y murmullo vesicular presente bilateralmente.")
                        .circulation("Taquicardia marcada (128 lpm), crisis hipertensiva crítica (198/112), pulsos radiales saltones y llenos.")
                        .disability("Glasgow 14/15 por agitación psicomotriz. Pupilas midriáticas bilaterales de 6 mm simétricas con fotorreactividad lenta.")
                        .exposure("Diaforesis intensa, hipertermia moderada (37.8 °C) y temblor distal en ambas manos.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Dolor opresivo retroesternal que no cede con el reposo, palpitaciones veloces y cefalea punzante.")
                        .allergies("Niega alergias.").medications("Ninguno habitual.")
                        .pastHistory("Consumo recreativo esporádico de alcohol y estimulantes.").lastMeal("Cena hace 4 horas.")
                        .events("Inhaló cocaína hace 40 minutos en una fiesta y comenzó con opresión torácica 20 minutos después.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("ecg").title("ECG Prehospitalario de 12 Derivaciones").subtitle("Taquicardia sinusal con cambios dinámicos de repolarización")
                        .findings("Taquicardia sinusal a 128 lpm con infradesnivel transitorio del segmento ST en derivaciones laterales.").badgeLabel("ECG Tóxico")
                        .imageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80").imageCaption("Vasoespasmo coronario agudo inducido por inhibición de la recaptación de catecolaminas.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante la sospecha de vasoespasmo coronario e hipertensión severa por cocaína, ¿cuál es el abordaje farmacológico de primera línea y qué grupo de fármacos debe evitarse?")
                .protocolReference("Guías AHA de Síndrome Coronario Asociado a Cocaína").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Benzodiacepinas IV (Diazepam o Lorazepam) y vasodilatadores; evitar betabloqueadores puros por riesgo de estimulación alfa-1 sin oposición que agrava el vasoespasmo y la hipertensión.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! Las benzodiacepinas atenúan el exceso simpático central. Los betabloqueadores no selectivos dejan los receptores alfa vasculares expuestos a las catecolaminas sin balance vasodilatador beta-2, desencadenando crisis hipertensivas paradójicas e infarto fulminante.").question(q).build(),
                Option.builder().optionKey("B").text("Administrar Propranolol o Metoprolol IV en bolo para frenar rápidamente la taquicardia y la tensión.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. El bloqueo beta aislado deja la estimulación alfa sin oposición ('unopposed alpha stimulation'), disparando la vasoconstricción coronaria y el riesgo de paro.").question(q).build(),
                Option.builder().optionKey("C").text("Morfina en altas dosis como único tratamiento para calmar el dolor y la ansiedad.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La morfina no frena la hiperestimulación adrenérgica de base y puede enlentecer la absorción de otros medicamentos.").question(q).build(),
                Option.builder().optionKey("D").text("Maniobras de Valsalva continuas y masaje carotídeo en escena.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Las maniobras vagales no son efectivas ante la tormenta adrenérgica simpaticomimética por cocaína y conllevan riesgo carotídeo.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 9: Neumotórax a Tensión ---
    private ClinicalCase buildCasoNeumotoraxTension() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-neumotorax-tension")
                .title("Shock obstructivo por neumotórax a tensión traumático con compromiso ventilatorio crítico")
                .specialty(Specialty.TRAUMA)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Accidente de motocicleta a 70 km/h contra vehículo estacionado. Motociclista despedido a 6 metros.")
                .scene("Vía pública. Casco quebrado en el pavimento. Conductor en decúbito lateral con evidente dificultad respiratoria.")
                .kinematicsOrOnset("Traumatismo torácico cerrado de alta energía por impacto directo del manubrio contra hemitórax derecho.")
                .protocolReference("PHTLS 9na Edición, Cap. 10 (Trauma Torácico)")
                .patient(PatientInfo.builder().age(24).ageUnit("años").sex("Masculino").weightKg(72.0).occupation("Mensajero motociclista").build())
                .vitals(VitalSigns.builder().heartRate(138).respiratoryRate(36).bloodPressure("74/38").oxygenSaturation(81).bodyTemperature(36.0)
                        .glasgow(GlasgowScale.builder().ocularResponse(3).verbalResponse(3).motorResponse(5).totalScore(11).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable con control cervical bimanual. Desviación visible de la tráquea hacia el lado izquierdo.")
                        .breathing("Dificultad respiratoria extrema (36 rpm), cianosis peribucal, ausencia total de murmullo vesicular en hemitórax derecho con timpanismo marcado a la percusión. SatO₂ 81% con O₂.")
                        .circulation("Shock obstructivo severo (PA 74/38, FC 138 lpm taquicárdico filiforme), ingurgitación yugular bilateral evidente, piel fría y pegajosa.")
                        .disability("Glasgow 11/15 por hipoxia cerebral severa. Agitado, combativo y confuso.")
                        .exposure("Equimosis y deformidad costal en 4ta y 5ta costilla derecha. Sin heridas abiertas soplantes.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Imposibilidad de respirar, dolor torácico agudo lacerante y sensación de muerte inminente.")
                        .allergies("Ninguna.").medications("Ninguno.").pastHistory("Joven previamente sano.")
                        .lastMeal("Hace 2 horas.").events("Impacto frontal contra automóvil al esquivar un obstáculo en la calzada.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("xray").title("Radiografía de Tórax de Simulación Clínica").subtitle("Neumotórax hipertensivo derecho masivo")
                        .findings("Colapso pulmonar derecho completo, aplanamiento del hemidiafragma derecho y desplazamiento mediastínico contralateral severo.").badgeLabel("Rx de Tórax")
                        .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80").imageCaption("Desplazamiento mediastínico agudo con colapso de retorno venoso a la aurícula derecha.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante la tríada clínica de hipotensión severa (74/38), ingurgitación yugular y timpanismo con silencio auscultatorio derecho, ¿cuál es la conducta inmediata?")
                .protocolReference("PHTLS 9na Edición / ATLS 10ma Edición").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Descompresión torácica inmediata con catéter grueso (14G o 10G) en el 2do espacio intercostal línea medioclavicular o 5to espacio línea axilar anterior del hemitórax afectado.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! El neumotórax a tensión es una emergencia con riesgo inminente de paro en actividad eléctrica sin pulso (AESP). El diagnóstico es estrictamente clínico y la descompresión con aguja debe preceder a cualquier estudio radiológico o intubación.").question(q).build(),
                Option.builder().optionKey("B").text("Intubación orotraqueal inmediata con ventilación a presión positiva para forzar la oxigenación.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Ventilar a presión positiva un neumotórax a tensión no descomprimido eleva aún más la presión intratorácica y detiene inmediatamente el retorno venoso, provocando paro cardíaco.").question(q).build(),
                Option.builder().optionKey("C").text("Traslado urgente en código rojo sin realizar intervenciones torácicas en escena.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. El colapso hemodinámico es irreversible en minutos; el paciente entrará en paro durante el transporte si no se descomprime de inmediato.").question(q).build(),
                Option.builder().optionKey("D").text("Punción pericárdica subxifoidea para descartar taponamiento cardíaco.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La asimetría ventilatoria, el timpanismo y la tráquea desviada definen neumotórax a tensión, no taponamiento cardíaco donde los ruidos son apagados y los campos pulmonares ventilan simétricamente.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }

    // --- Caso 10: Asma Severo Casi Fatal ---
    private ClinicalCase buildCasoAsmaSevero() {
        ClinicalCase caso = ClinicalCase.builder()
                .id("caso-asma-severo-broncospasmo")
                .title("Crisis asmática casi fatal con tórax silente y fallo ventilatorio inminente")
                .specialty(Specialty.RESPIRATORIO)
                .difficulty(Difficulty.AVANZADO)
                .dispatchContext("Mujer de 33 años con antecedentes asmáticos graves en paro respiratorio inminente en su domicilio.")
                .scene("Paciente sentada en posición de trípode, cianótica, sin poder pronunciar palabras.")
                .kinematicsOrOnset("Evolución de 24 horas de disnea progresiva tras exposición a alérgenos que no respondió a su inhalador habitual.")
                .protocolReference("Guías GINA (Global Initiative for Asthma) y Protocolos de Urgencias Respiratorias APH")
                .patient(PatientInfo.builder().age(33).ageUnit("años").sex("Femenino").weightKg(58.0).occupation("Arquitecta").build())
                .vitals(VitalSigns.builder().heartRate(134).respiratoryRate(38).bloodPressure("140/90").oxygenSaturation(84).bodyTemperature(36.8)
                        .glasgow(GlasgowScale.builder().ocularResponse(3).verbalResponse(4).motorResponse(6).totalScore(13).build()).build())
                .primarySurvey(PrimarySurvey.builder()
                        .airway("Permeable pero con fatiga muscular severa y habla entrecortada por monosílabos.")
                        .breathing("Taquipnea severa (38 rpm), tiraje intercostal y supraclavicular extremo, tórax silente a la auscultación (ausencia de sibilancias por falta de flujo aéreo). SatO₂ 84% con oxígeno.")
                        .circulation("Taquicardia sinusal a 134 lpm, pulso paradójico palpable, diaforesis fría y llenado capilar 3 s.")
                        .disability("Glasgow 13/15. Agotamiento extremo, somnolencia incipiente por hipercapnia y narcosis por CO₂.")
                        .exposure("Piel diaforética, extremidades frías, sin lesiones traumáticas.")
                        .build())
                .sampleHistory(SampleHistory.builder()
                        .symptoms("Sensación de asfixia total, agotamiento físico extremo y opresión torácica.")
                        .allergies("Acaros del polvo y polen.").medications("Salbutamol y budesonida inhalada (uso irregular).")
                        .pastHistory("Dos ingresos previos a UCI con intubación por asma casi fatal.").lastMeal("Almuerzo hace 5 horas.")
                        .events("Agotó dos cartuchos de salbutamol en las últimas 12 horas sin mejoría.")
                        .build())
                .media(ClinicalMedia.builder().mediaType("monitor").title("Monitor Respiratorio y Oximetría").subtitle("Tórax silente y fatiga ventilatoria")
                        .findings("Curva de pletismografía amortiguada con desaturación persistente a 84% y taquicardia sinusal marcada.").badgeLabel("Oximetría")
                        .imageUrl("https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80").imageCaption("Patrón de colapso de flujo aéreo con inminencia de paro por fatiga diafragmática.").build())
                .build();

        Question q = Question.builder()
                .prompt("Ante el tórax silente (silencio auscultatorio por colapso del flujo aéreo) y fatiga respiratoria inminente, ¿cuál es la pauta terapéutica combinada de rescate en la ambulancia?")
                .protocolReference("GINA 2025 / Manejo de Asma Casi Fatal en Emergencias").clinicalCase(caso).build();

        List<Option> opts = List.of(
                Option.builder().optionKey("A").text("Nebulización continua con Salbutamol + Bromuro de Ipratropio impulsada con O₂, Corticoide sistémico IV y Sulfato de Magnesio 2g IV en infusión de 20 minutos.").isCorrect(true)
                        .clinicalFeedback("¡Correcto! En asma casi fatal con tórax silente, el sulfato de magnesio intravenoso relaja potentemente el músculo liso bronquial al modular los canales de calcio. La combinación con beta-2 agonistas y anticolinérgicos nebulizados a flujo alto optimiza la penetración alveolar antes de requerir ventilación invasiva.").question(q).build(),
                Option.builder().optionKey("B").text("Sedación inmediata con midazolam para calmar la angustia y bajar el consumo de oxígeno.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Los sedantes en crisis asmática abolen el impulso ventilatorio reflejo provocando paro respiratorio y muerte inmediata.").question(q).build(),
                Option.builder().optionKey("C").text("Administrar únicamente inhalador de dosis medida con aerocámara sin oxígeno suplementario.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. Con una saturación de 84% y tórax silente, la paciente no puede generar el flujo inspiratorio necesario para coordinar un MDI.").question(q).build(),
                Option.builder().optionKey("D").text("Infusión rápida de 3000 ml de solución salina fría para fluidificar secreciones.").isCorrect(false)
                        .clinicalFeedback("Incorrecto. La sobrecarga hídrica masiva no tiene efecto broncodilatador y los fluidos fríos pueden desencadenar broncoespasmo reflejo.").question(q).build()
        );
        q.setOptions(opts);
        caso.setQuestions(List.of(q));
        return caso;
    }
}
