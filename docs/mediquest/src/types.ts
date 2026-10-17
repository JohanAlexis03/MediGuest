export type Specialty = 
  | 'Trauma' 
  | 'Cardiovascular' 
  | 'Respiratorio' 
  | 'Pediatría' 
  | 'Toxicología' 
  | 'Neurología';

export type Difficulty = 'Básico' | 'Intermedio' | 'Avanzado';

export interface VitalSigns {
  fc: number; // lpm
  fr: number; // rpm
  ta: string; // mmHg
  spo2: number; // %
  temp: number; // °C
  glasgow: {
    total: number;
    ocular: number;
    verbal: number;
    motor: number;
  };
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

export interface ClinicalCase {
  id: string;
  title: string;
  specialty: Specialty;
  difficulty: Difficulty;
  patient: {
    age: number;
    ageUnit: 'años' | 'meses';
    sex: 'Masculino' | 'Femenino';
    weightKg?: number;
    occupation?: string;
  };
  dispatchContext: string;
  clinicalPresentation: {
    scene: string;
    kinematicsOrOnset: string;
    primarySurvey: {
      airway: string;
      breathing: string;
      circulation: string;
      disability: string;
      exposure: string;
    };
    sampleHistory: {
      symptoms: string;
      allergies: string;
      medications: string;
      pastHistory: string;
      lastMeal: string;
      events: string;
    };
  };
  vitals: VitalSigns;
  media: ClinicalMedia;
  question: {
    prompt: string;
    options: CaseOption[];
  };
  protocolReference: string;
}

export interface CaseAttempt {
  caseId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  score: number;
  timestamp: string;
  timeSpentSeconds: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  institution?: string;
  score: number;
  completedCaseIds: string[];
  history: CaseAttempt[];
}

export type ScreenId = 
  | 'landing' 
  | 'register' 
  | 'login' 
  | 'case_list' 
  | 'case_detail' 
  | 'case_solve' 
  | 'progress';
