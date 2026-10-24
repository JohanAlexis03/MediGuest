import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CLINICAL_CASES } from '@/data/mock-cases';
import { getClinicalImageSource } from '@/data/clinical-assets';
import { HttpCatAlert } from '@/components/ui/http-cat-alert';
import { CasesService } from '@/services/cases.service';
import { ClinicalCase } from '@/types/clinical-case';

export default function CaseDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'abcde' | 'sample'>('abcde');
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [clinicalCase, setClinicalCase] = useState<ClinicalCase | null>(() => {
    return CLINICAL_CASES.find((c) => c.id === id) || null;
  });
  const [isLoading, setIsLoading] = useState(!clinicalCase);

  useEffect(() => {
    if (id) {
      CasesService.getCaseById(id)
        .then((fetched) => {
          if (fetched) setClinicalCase(fetched);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const imageSource = clinicalCase?.media
    ? getClinicalImageSource(clinicalCase.id, clinicalCase.media.imageUrl)
    : undefined;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color="#0b3d91" />
        <Text style={styles.loadingText}>Cargando expediente clínico...</Text>
      </SafeAreaView>
    );
  }

  if (!clinicalCase) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['bottom', 'left', 'right']}>
        <HttpCatAlert
          visible={true}
          statusCode={404}
          title="Caso Clínico No Encontrado"
          message={`El caso clínico "${id || 'desconocido'}" no existe en la base de datos o fue archivado.`}
          onClose={() => router.back()}
        />
        <Text style={styles.notFoundTitle}>Caso clínico no encontrado</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver al catálogo</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { vitals, patient, clinicalPresentation } = clinicalCase;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: `Caso ${clinicalCase.id.toUpperCase()}`,
          headerTintColor: '#0b3d91',
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado del caso */}
        <View style={styles.headerCard}>
          <View style={styles.badgesRow}>
            <View style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{clinicalCase.specialty}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{clinicalCase.difficulty}</Text>
            </View>
          </View>
          <Text style={styles.title}>{clinicalCase.title}</Text>
          <Text style={styles.context}>{clinicalCase.dispatchContext}</Text>
        </View>

        {/* Ficha del Paciente */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ficha del Paciente</Text>
          <View style={styles.patientGrid}>
            <View style={styles.patientItem}>
              <Text style={styles.patientLabel}>Edad</Text>
              <Text style={styles.patientValue}>
                {patient.age} {patient.ageUnit}
              </Text>
            </View>
            <View style={styles.patientItem}>
              <Text style={styles.patientLabel}>Sexo</Text>
              <Text style={styles.patientValue}>{patient.sex}</Text>
            </View>
            {patient.weightKg && (
              <View style={styles.patientItem}>
                <Text style={styles.patientLabel}>Peso est.</Text>
                <Text style={styles.patientValue}>{patient.weightKg} kg</Text>
              </View>
            )}
            {patient.occupation && (
              <View style={styles.patientItem}>
                <Text style={styles.patientLabel}>Ocupación</Text>
                <Text style={styles.patientValue}>{patient.occupation}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Signos Vitales */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Signos Vitales y Estado Inicial</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>FC</Text>
              <Text style={styles.vitalValue}>{vitals.fc}</Text>
              <Text style={styles.vitalUnit}>lpm</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>TA</Text>
              <Text style={styles.vitalValue}>{vitals.ta}</Text>
              <Text style={styles.vitalUnit}>mmHg</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>FR</Text>
              <Text style={styles.vitalValue}>{vitals.fr}</Text>
              <Text style={styles.vitalUnit}>rpm</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>SpO2</Text>
              <Text style={styles.vitalValue}>{vitals.spo2}%</Text>
              <Text style={styles.vitalUnit}>Ambiente</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Temp</Text>
              <Text style={styles.vitalValue}>{vitals.temp}</Text>
              <Text style={styles.vitalUnit}>°C</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Glasgow</Text>
              <Text style={styles.vitalValue}>{vitals.glasgow.total}/15</Text>
              <Text style={styles.vitalUnit}>
                O{vitals.glasgow.ocular} V{vitals.glasgow.verbal} M{vitals.glasgow.motor}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs de Valoración Clínica (ABCDE vs SAMPLE) */}
        <View style={styles.sectionCard}>
          <View style={styles.tabHeader}>
            <Pressable
              style={[styles.tabButton, activeTab === 'abcde' && styles.tabButtonActive]}
              onPress={() => setActiveTab('abcde')}
            >
              <Text style={[styles.tabText, activeTab === 'abcde' && styles.tabTextActive]}>
                Evaluación ABCDE
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabButton, activeTab === 'sample' && styles.tabButtonActive]}
              onPress={() => setActiveTab('sample')}
            >
              <Text style={[styles.tabText, activeTab === 'sample' && styles.tabTextActive]}>
                Anamnesis SAMPLE
              </Text>
            </Pressable>
          </View>

          {activeTab === 'abcde' ? (
            <View style={styles.tabContent}>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>A - Vía aérea</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.primarySurvey.airway}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>B - Ventilación</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.primarySurvey.breathing}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>C - Circulación</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.primarySurvey.circulation}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>D - Déficit neurológico</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.primarySurvey.disability}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>E - Exposición</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.primarySurvey.exposure}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>S - Síntomas</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.sampleHistory.symptoms}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>A - Alergias</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.sampleHistory.allergies}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>M - Medicamentos</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.sampleHistory.medications}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>P - Patologías previas</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.sampleHistory.pastHistory}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>L - Última ingesta</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.sampleHistory.lastMeal}</Text>
              </View>
              <View style={styles.clinicalItem}>
                <Text style={styles.clinicalTag}>E - Eventos previos</Text>
                <Text style={styles.clinicalText}>{clinicalPresentation.sampleHistory.events}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Recurso Visual / Imagen Diagnóstica (RF06) */}
        {clinicalCase.media && (
          <View style={styles.sectionCard}>
            <View style={styles.mediaHeaderRow}>
              <Text style={styles.sectionTitle}>Hallazgo Diagnóstico ({clinicalCase.media.type.toUpperCase()})</Text>
              <View style={styles.mediaBadge}>
                <Text style={styles.mediaBadgeText}>{clinicalCase.media.badgeLabel || clinicalCase.media.type.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.mediaCard}>
              <Text style={styles.mediaTitle}>{clinicalCase.media.title}</Text>
              <Text style={styles.mediaSubtitle}>{clinicalCase.media.subtitle}</Text>

              {imageSource && (
                <Pressable
                  style={styles.imagePreviewContainer}
                  onPress={() => setIsImageModalVisible(true)}
                  accessibilityLabel="Tocar para ampliar imagen diagnóstica a pantalla completa"
                >
                  <Image
                    source={imageSource}
                    style={styles.imagePreview}
                    contentFit="cover"
                    transition={250}
                  />
                  <View style={styles.imageZoomOverlay}>
                    <Text style={styles.imageZoomText}>🔍 Toca para ampliar y examinar</Text>
                  </View>
                </Pressable>
              )}

              {clinicalCase.media.imageCaption && (
                <Text style={styles.imageCaptionText}>
                  📷 {clinicalCase.media.imageCaption}
                </Text>
              )}

              {clinicalCase.media.leadDetails && clinicalCase.media.leadDetails.length > 0 && (
                <View style={styles.leadDetailsContainer}>
                  {clinicalCase.media.leadDetails.map((detail, index) => (
                    <View key={index} style={styles.leadDetailChip}>
                      <Text style={styles.leadDetailText}>{detail}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.mediaFindings}>{clinicalCase.media.findings}</Text>
            </View>

            {/* Modal Inmersivo de Pantalla Completa con Zoom (RF06) */}
            {imageSource && (
              <Modal
                visible={isImageModalVisible}
                transparent={false}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={() => setIsImageModalVisible(false)}
              >
                <View
                  style={[
                    styles.modalBackdrop,
                    {
                      paddingTop: Math.max(insets.top, 24) + 8,
                      paddingBottom: Math.max(insets.bottom, 16) + 4,
                    },
                  ]}
                >
                  <View style={styles.modalHeader}>
                    <View style={styles.modalHeaderInfo}>
                      <Text style={styles.modalTitle} numberOfLines={1}>
                        {clinicalCase.media.title}
                      </Text>
                      <Text style={styles.modalSubtitle}>
                        Pellizca para zoom • Desliza para explorar
                      </Text>
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        styles.modalCloseButton,
                        pressed && styles.modalCloseButtonPressed,
                      ]}
                      onPress={() => setIsImageModalVisible(false)}
                      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                      accessibilityRole="button"
                      accessibilityLabel="Cerrar visor de imagen"
                    >
                      <Text style={styles.modalCloseText}>✕ Cerrar</Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    style={styles.modalScrollView}
                    contentContainerStyle={styles.modalScrollContent}
                    maximumZoomScale={4}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    centerContent
                  >
                    <Image
                      source={imageSource}
                      style={styles.modalImage}
                      contentFit="contain"
                      transition={300}
                    />
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <Text style={styles.modalFooterCaption}>
                      {clinicalCase.media.imageCaption || clinicalCase.media.findings}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [
                        styles.modalFooterCloseBtn,
                        pressed && styles.modalCloseButtonPressed,
                      ]}
                      onPress={() => setIsImageModalVisible(false)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="button"
                      accessibilityLabel="Cerrar visor"
                    >
                      <Text style={styles.modalFooterCloseBtnText}>✕ Cerrar visor</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        )}

        {/* Botón de Resolver Pregunta */}
        <Pressable
          style={styles.solveButton}
          onPress={() =>
            router.push({
              pathname: '/cases/solve',
              params: { id: clinicalCase.id },
            })
          }
        >
          <Text style={styles.solveButtonText}>Responder Preguntas del Caso →</Text>
        </Pressable>
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
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  specialtyBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  specialtyText: {
    color: '#0b3d91',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#991b1b',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 24,
  },
  context: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  patientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  patientItem: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  patientLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  patientValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vitalBox: {
    flex: 1,
    minWidth: 90,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  vitalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0b3d91',
    marginVertical: 2,
  },
  vitalUnit: {
    fontSize: 10,
    color: '#94a3b8',
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#0b3d91',
    fontWeight: '700',
  },
  tabContent: {
    gap: 10,
  },
  clinicalItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0b3d91',
  },
  clinicalTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
    marginBottom: 2,
  },
  clinicalText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  mediaCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mediaTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  mediaSubtitle: {
    fontSize: 12,
    color: '#0b3d91',
    fontWeight: '600',
    marginBottom: 6,
  },
  mediaFindings: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  solveButton: {
    backgroundColor: '#0b3d91',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  solveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: '#0b3d91',
    fontSize: 14,
    fontWeight: '700',
  },
  mediaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mediaBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mediaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0b3d91',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  imagePreview: {
    width: '100%',
    height: 190,
    backgroundColor: '#0f172a',
  },
  imageZoomOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  imageZoomText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  imageCaptionText: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 16,
  },
  leadDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  leadDetailChip: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  leadDetailText: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalHeaderInfo: {
    flex: 1,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  modalCloseButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  modalCloseButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 420,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  modalFooterCaption: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalFooterCloseBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooterCloseBtnText: {
    color: '#ffffff',
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
