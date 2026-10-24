import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CLINICAL_CASES } from '@/data/mock-cases';
import { CaseOption, ClinicalCase } from '@/types/clinical-case';
import { HttpCatAlert } from '@/components/ui/http-cat-alert';
import { CasesService, SolveCaseResponse } from '@/services/cases.service';
import { AuthService, UserSession } from '@/services/auth.service';

export default function CaseSolveScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solveResult, setSolveResult] = useState<SolveCaseResponse | null>(null);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [startTime] = useState<number>(() => Date.now());

  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(() => {
    return CLINICAL_CASES.find((c) => c.id === id) || null;
  });
  const [isLoading, setIsLoading] = useState(!clinicalCase);

  useEffect(() => {
    AuthService.getCurrentUser().then(setCurrentUser);
    if (id) {
      CasesService.getCaseById(id)
        .then((c) => {
          if (c) setClinicalCase(c);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color="#0b3d91" />
        <Text style={styles.loadingText}>Cargando evaluación clínica...</Text>
      </SafeAreaView>
    );
  }

  if (!clinicalCase) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['bottom', 'left', 'right']}>
        <HttpCatAlert
          visible={true}
          statusCode={404}
          title="Caso No Encontrado"
          message="El caso clínico que intentas resolver no está disponible."
          onClose={() => router.replace('/cases')}
        />
        <Text style={styles.errorText}>Caso no encontrado</Text>
        <Pressable onPress={() => router.replace('/cases')}>
          <Text style={styles.linkText}>Volver a casos</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { question, vitals } = clinicalCase;

  const handleEvaluate = async () => {
    if (!selectedOptionId || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const elapsedSeconds = Math.max(5, Math.round((Date.now() - startTime) / 1000));
      const userEmail = currentUser?.email || 'student@mediquest.edu';

      const result = await CasesService.solveCase(
        clinicalCase.id,
        selectedOptionId,
        elapsedSeconds,
        userEmail
      );
      setSolveResult(result);
      setIsEvaluated(true);
    } catch {
      // Fallback local si el backend no responde
      const opt = question.options.find((o) => o.id === selectedOptionId);
      const correctOpt = question.options.find((o) => o.isCorrect) || question.options[0];
      const isCorrect = opt ? opt.isCorrect : false;
      setSolveResult({
        caseId: clinicalCase.id,
        selectedOptionKey: selectedOptionId,
        correctOptionKey: correctOpt.id as 'A' | 'B' | 'C' | 'D',
        isCorrect,
        scorePercentage: isCorrect ? 100 : 0,
        clinicalFeedback: opt?.feedback || 'Evaluación registrada.',
        protocolReference: clinicalCase.protocolReference,
        completedAt: new Date().toISOString(),
      });
      setIsEvaluated(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsEvaluated(false);
    setSolveResult(null);
  };

  const getOptionStyle = (option: CaseOption) => {
    if (!isEvaluated || !solveResult) {
      if (selectedOptionId === option.id) {
        return [styles.optionCard, styles.optionSelected];
      }
      return styles.optionCard;
    }

    if (option.id === solveResult.correctOptionKey) {
      return [styles.optionCard, styles.optionCorrect];
    }

    if (selectedOptionId === option.id && !solveResult.isCorrect) {
      return [styles.optionCard, styles.optionIncorrect];
    }

    return [styles.optionCard, styles.optionMuted];
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Resolución de Caso',
          headerTintColor: '#0b3d91',
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barra resumen de signos vitales */}
        <View style={styles.vitalsBar}>
          <Text style={styles.vitalPill}>FC: {vitals.fc}</Text>
          <Text style={styles.vitalPill}>TA: {vitals.ta}</Text>
          <Text style={styles.vitalPill}>SpO2: {vitals.spo2}%</Text>
          <Text style={styles.vitalPill}>GCS: {vitals.glasgow.total}/15</Text>
        </View>

        {/* Enunciado de la Pregunta */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTag}>Pregunta Clínica</Text>
          <Text style={styles.questionText}>{question.prompt}</Text>
        </View>

        {/* Opciones de Respuesta */}
        <View style={styles.optionsList}>
          {question.options.map((option) => (
            <Pressable
              key={option.id}
              disabled={isEvaluated}
              style={getOptionStyle(option)}
              onPress={() => setSelectedOptionId(option.id)}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionLetterBadge}>
                  <Text style={styles.optionLetter}>{option.id}</Text>
                </View>
                <Text style={styles.optionText}>{option.text}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Retroalimentación Post-Evaluación */}
        {isEvaluated && solveResult && (
          <View
            style={[
              styles.feedbackCard,
              solveResult.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {solveResult.isCorrect ? '✓ ¡Respuesta Correcta! (100%)' : '✕ Respuesta Incorrecta (0%)'}
            </Text>
            <Text style={styles.feedbackText}>{solveResult.clinicalFeedback}</Text>

            {!solveResult.isCorrect && (
              <View style={styles.correctRevealBox}>
                <Text style={styles.correctRevealTitle}>
                  Conducta esperada (Opción {solveResult.correctOptionKey}):
                </Text>
                <Text style={styles.correctRevealText}>
                  {question.options.find((o) => o.id === solveResult.correctOptionKey)?.text ||
                    'Revisar las guías de manejo de la especialidad.'}
                </Text>
              </View>
            )}

            <Text style={styles.protocolRef}>
              Referencia: {solveResult.protocolReference || clinicalCase.protocolReference}
            </Text>
          </View>
        )}

        {/* Botones de acción */}
        {!isEvaluated ? (
          <Pressable
            disabled={!selectedOptionId || isSubmitting}
            style={[
              styles.primaryButton,
              (!selectedOptionId || isSubmitting) && styles.buttonDisabled,
            ]}
            onPress={handleEvaluate}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Evaluando con servidor...' : 'Validar Respuesta'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.actionsRow}>
            <Pressable style={styles.secondaryButton} onPress={handleReset}>
              <Text style={styles.secondaryButtonText}>Reintentar</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.replace('/cases')}
            >
              <Text style={styles.primaryButtonText}>Volver al Catálogo</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  vitalsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  vitalPill: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  questionTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  optionSelected: {
    borderColor: '#0b3d91',
    backgroundColor: '#eff6ff',
  },
  optionCorrect: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  optionIncorrect: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  optionMuted: {
    opacity: 0.6,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLetterBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0b3d91',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    lineHeight: 20,
  },
  feedbackCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  feedbackCorrect: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  feedbackIncorrect: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  feedbackText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  correctRevealBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    marginTop: 4,
  },
  correctRevealTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065f46',
    marginBottom: 2,
  },
  correctRevealText: {
    fontSize: 13,
    color: '#1f2937',
  },
  keyPointsBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  keyPointsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
    marginBottom: 4,
  },
  keyPointItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  protocolRef: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748b',
    marginTop: 6,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0b3d91',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  linkText: {
    color: '#0b3d91',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
});
