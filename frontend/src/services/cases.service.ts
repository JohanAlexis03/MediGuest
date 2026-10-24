import { CLINICAL_CASES } from '@/data/mock-cases';
import { apiRequest } from '@/services/api';
import { ClinicalCase, CaseOption, Difficulty, Specialty } from '@/types/clinical-case';

export interface BackendCaseSummary {
  id: string;
  title: string;
  specialty: string;
  difficulty: string;
  dispatchContext?: string;
  mediaImageUrl?: string;
  mediaBadgeLabel?: string;
  protocolReference?: string;
}

export interface BackendCaseDetail {
  id: string;
  title: string;
  specialty: string;
  difficulty: string;
  dispatchContext: string;
  scene?: string;
  kinematicsOrOnset?: string;
  protocolReference: string;
  patient: {
    age: number;
    ageUnit: 'años' | 'meses';
    sex: 'Masculino' | 'Femenino';
    weightKg?: number;
    occupation?: string;
  };
  vitals: {
    heartRate: number;
    respiratoryRate: number;
    bloodPressure: string;
    oxygenSaturation: number;
    bodyTemperature: number;
    glasgow?: {
      ocularResponse: number;
      verbalResponse: number;
      motorResponse: number;
      totalScore: number;
    };
  };
  primarySurvey?: {
    airway: string;
    breathing: string;
    circulation: string;
    disability: string;
    exposure: string;
  };
  sampleHistory?: {
    symptoms: string;
    allergies: string;
    medications: string;
    pastHistory: string;
    lastMeal: string;
    events: string;
  };
  media?: {
    mediaType: 'ecg' | 'xray' | 'monitor' | 'scale' | 'algorithm';
    title: string;
    subtitle: string;
    findings: string;
    badgeLabel: string;
    imageUrl?: string;
    imageCaption?: string;
  };
  questions: {
    id: number;
    prompt: string;
    protocolReference?: string;
    options: {
      id: number;
      optionKey: 'A' | 'B' | 'C' | 'D';
      text: string;
    }[];
  }[];
}

export interface SolveCaseResponse {
  caseId: string;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D';
  correctOptionKey: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  scorePercentage: number;
  clinicalFeedback: string;
  protocolReference?: string;
  completedAt: string;
}

export interface AttemptProgress {
  attemptId: number;
  caseId: string;
  caseTitle: string;
  specialty: Specialty;
  difficulty: Difficulty;
  selectedOptionKey: string;
  isCorrect: boolean;
  scorePercentage: number;
  timeSpentSeconds: number;
  completedAt: string;
}

function mapBackendToClinicalCase(b: BackendCaseDetail): ClinicalCase {
  const q = b.questions && b.questions.length > 0 ? b.questions[0] : null;

  const options: CaseOption[] = q
    ? q.options.map((opt) => ({
        id: opt.optionKey,
        text: opt.text,
        isCorrect: false, // Oculto hasta resolver
        feedback: '',
      }))
    : [];

  return {
    id: b.id,
    title: b.title,
    specialty: b.specialty as Specialty,
    difficulty: b.difficulty as Difficulty,
    dispatchContext: b.dispatchContext || '',
    patient: b.patient,
    vitals: {
      fc: b.vitals.heartRate,
      fr: b.vitals.respiratoryRate,
      ta: b.vitals.bloodPressure,
      spo2: b.vitals.oxygenSaturation,
      temp: b.vitals.bodyTemperature,
      glasgow: {
        total: b.vitals.glasgow?.totalScore || 15,
        ocular: b.vitals.glasgow?.ocularResponse || 4,
        verbal: b.vitals.glasgow?.verbalResponse || 5,
        motor: b.vitals.glasgow?.motorResponse || 6,
      },
    },
    clinicalPresentation: {
      scene: b.scene || '',
      kinematicsOrOnset: b.kinematicsOrOnset || '',
      primarySurvey: {
        airway: b.primarySurvey?.airway || 'Permeable',
        breathing: b.primarySurvey?.breathing || 'Normal',
        circulation: b.primarySurvey?.circulation || 'Estable',
        disability: b.primarySurvey?.disability || 'Alerta',
        exposure: b.primarySurvey?.exposure || 'Sin hallazgos',
      },
      sampleHistory: {
        symptoms: b.sampleHistory?.symptoms || 'Ninguno',
        allergies: b.sampleHistory?.allergies || 'Niega',
        medications: b.sampleHistory?.medications || 'Ninguno',
        pastHistory: b.sampleHistory?.pastHistory || 'Niega',
        lastMeal: b.sampleHistory?.lastMeal || 'Desconocido',
        events: b.sampleHistory?.events || 'No reportados',
      },
    },
    media: b.media
      ? {
          type: b.media.mediaType,
          title: b.media.title,
          subtitle: b.media.subtitle,
          findings: b.media.findings,
          badgeLabel: b.media.badgeLabel,
          imageUrl: b.media.imageUrl,
          imageCaption: b.media.imageCaption,
        }
      : undefined,
    question: {
      prompt: q ? q.prompt : '¿Cuál es la conducta médica indicada?',
      options,
    },
    protocolReference: b.protocolReference || 'Protocolo PHTLS / ATLS',
  };
}

export const CasesService = {
  /**
   * Obtiene la lista de casos clínicos desde el backend de Spring Boot
   * Si la API está inaccesible, recurre a los casos locales como respaldo.
   */
  async getCases(specialty?: Specialty, difficulty?: Difficulty): Promise<ClinicalCase[]> {
    try {
      const params = new URLSearchParams();
      if (specialty) params.append('specialty', specialty.toUpperCase());
      if (difficulty) params.append('difficulty', difficulty.toUpperCase());

      const query = params.toString() ? `?${params.toString()}` : '';
      const remoteCases = await apiRequest<BackendCaseSummary[]>(`/cases${query}`);

      if (remoteCases && remoteCases.length > 0) {
        // Enriquecer con detalle o retornar casos combinados
        const details = await Promise.allSettled(
          remoteCases.map((rc) => apiRequest<BackendCaseDetail>(`/cases/${rc.id}`))
        );

        const mappedCases: ClinicalCase[] = [];
        details.forEach((res) => {
          if (res.status === 'fulfilled') {
            mappedCases.push(mapBackendToClinicalCase(res.value));
          }
        });

        if (mappedCases.length > 0) {
          return mappedCases;
        }
      }
    } catch {
      // Modo offline / fallback a mocks
    }

    // Filtrar mocks locales
    return CLINICAL_CASES.filter((c) => {
      const matchSpecialty = specialty ? c.specialty === specialty : true;
      const matchDifficulty = difficulty ? c.difficulty === difficulty : true;
      return matchSpecialty && matchDifficulty;
    });
  },

  /**
   * Obtiene la ficha clínica completa de un caso por su ID.
   */
  async getCaseById(id: string): Promise<ClinicalCase | null> {
    try {
      const remoteCase = await apiRequest<BackendCaseDetail>(`/cases/${id}`);
      return mapBackendToClinicalCase(remoteCase);
    } catch {
      // Fallback a mock local
      const found = CLINICAL_CASES.find((c) => c.id === id);
      return found || null;
    }
  },

  /**
   * Envía la opción elegida por el estudiante para evaluación y persistencia en base de datos (RF08, RF10).
   */
  async solveCase(
    caseId: string,
    selectedOptionKey: 'A' | 'B' | 'C' | 'D',
    timeSpentSeconds: number = 30
  ): Promise<SolveCaseResponse> {
    try {
      return await apiRequest<SolveCaseResponse>(`/cases/${caseId}/solve`, {
        method: 'POST',
        body: JSON.stringify({
          selectedOptionKey,
          timeSpentSeconds,
          userEmail: 'student@mediquest.edu',
        }),
      });
    } catch (error) {
      // Si el backend no responde, resolver localmente con los mocks para no trabar al alumno
      const localCase = CLINICAL_CASES.find((c) => c.id === caseId);
      if (localCase) {
        const opt = localCase.question.options.find((o) => o.id === selectedOptionKey);
        const correctOpt = localCase.question.options.find((o) => o.isCorrect) || localCase.question.options[0];
        const isCorrect = opt ? opt.isCorrect : false;

        return {
          caseId,
          selectedOptionKey,
          correctOptionKey: correctOpt.id,
          isCorrect,
          scorePercentage: isCorrect ? 100 : 0,
          clinicalFeedback: opt?.feedback || correctOpt.feedback,
          protocolReference: localCase.protocolReference,
          completedAt: new Date().toISOString(),
        };
      }
      throw error;
    }
  },

  /**
   * Obtiene el historial de intentos y progreso desde el backend (RF11).
   */
  async getProgress(): Promise<AttemptProgress[]> {
    try {
      return await apiRequest<AttemptProgress[]>('/progress?userEmail=student@mediquest.edu');
    } catch {
      return [];
    }
  },
};
