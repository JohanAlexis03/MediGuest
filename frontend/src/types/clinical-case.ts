export type Specialty =
  | 'Trauma'
  | 'Cardiovascular'
  | 'Respiratorio'
  | 'Pediatría'
  | 'Toxicología'
  | 'Neurología';

export type Difficulty = 'Básico' | 'Intermedio' | 'Avanzado';

export interface GlasgowScale {
  total: number;
  ocular: number;
  verbal: number;
  motor: number;
}

export interface VitalSigns {
  fc: number; // lpm (frecuencia cardíaca)
  fr: number; // rpm (frecuencia respiratoria)
  ta: string; // mmHg (tensión arterial, ej: "120/80")
  spo2: number; // % (saturación de oxígeno)
  temp: number; // °C (temperatura corporal)
  glasgow: GlasgowScale;
}

export interface CaseOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  feedback: string;
  keyPoints?: string[];
}

export interface ClinicalMedia {
  type: 'ecg' | 'xray' | 'monitor' | 'scale' | 'algorithm';
  title: string;
  subtitle: string;
  findings: string;
  badgeLabel: string;
  leadDetails?: string[];
}

export interface PrimarySurvey {
  airway: string; // Vía aérea con control de columna cervical
  breathing: string; // Ventilación y oxigenación
  circulation: string; // Circulación y control de hemorragias
  disability: string; // Déficit neurológico
  exposure: string; // Exposición y control de hipotermia
}

export interface SampleHistory {
  symptoms: string; // S - Signos y síntomas
  allergies: string; // A - Alergias
  medications: string; // M - Medicamentos habituales
  pastHistory: string; // P - Patologías previas
  lastMeal: string; // L - Libaciones / última ingesta
  events: string; // E - Eventos previos al incidente
}

export interface PatientInfo {
  age: number;
  ageUnit: 'años' | 'meses';
  sex: 'Masculino' | 'Femenino';
  weightKg?: number;
  occupation?: string;
}

export interface ClinicalPresentation {
  scene: string;
  kinematicsOrOnset: string;
  primarySurvey: PrimarySurvey;
  sampleHistory: SampleHistory;
}

export interface CaseQuestion {
  prompt: string;
  options: CaseOption[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  specialty: Specialty;
  difficulty: Difficulty;
  patient: PatientInfo;
  dispatchContext: string;
  clinicalPresentation: ClinicalPresentation;
  vitals: VitalSigns;
  media?: ClinicalMedia;
  question: CaseQuestion;
  protocolReference: string;
}

export interface CaseAttempt {
  caseId: string;
  selectedOptionId: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  score: number;
  timestamp: string;
}
