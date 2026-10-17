import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { CLINICAL_CASES } from '@/data/mock-cases';

export default function ProgressScreen() {
  const router = useRouter();

  // Datos simulados de progreso del estudiante (RF11)
  const student = {
    name: 'Alexis Estudiante',
    email: 'estudiante@aph.edu',
    role: 'Estudiante de APH - 4to Semestre',
    completedCasesCount: 2,
    totalCasesCount: CLINICAL_CASES.length,
    accuracyPercentage: 85,
    averageScore: 92,
  };

  const specialties = [
    { name: 'Trauma', completed: 1, total: 1, color: '#ef4444' },
    { name: 'Cardiovascular', completed: 1, total: 1, color: '#f59e0b' },
    { name: 'Respiratorio', completed: 0, total: 1, color: '#3b82f6' },
    { name: 'Neurología', completed: 0, total: 1, color: '#8b5cf6' },
    { name: 'Pediatría', completed: 0, total: 1, color: '#ec4899' },
    { name: 'Toxicología', completed: 0, total: 1, color: '#10b981' },
  ];

  const recentAttempts = [
    {
      id: 'att-1',
      caseTitle: 'Accidente de tránsito con neumotórax a tensión',
      specialty: 'Trauma',
      date: 'Hoy, 15:30',
      isCorrect: true,
      score: 100,
    },
    {
      id: 'att-2',
      caseTitle: 'Dolor precordial opresivo con irradiación a mandíbula',
      specialty: 'Cardiovascular',
      date: 'Ayer, 18:20',
      isCorrect: true,
      score: 85,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Mi Progreso APH',
          headerTintColor: '#0b3d91',
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ficha del Estudiante */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AE</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{student.name}</Text>
            <Text style={styles.profileEmail}>{student.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{student.role}</Text>
            </View>
          </View>
        </View>

        {/* Métricas Generales (RF11) */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {student.completedCasesCount}/{student.totalCasesCount}
            </Text>
            <Text style={styles.statLabel}>Casos Resueltos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>
              {student.accuracyPercentage}%
            </Text>
            <Text style={styles.statLabel}>Tasa de Acierto</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#0b3d91' }]}>
              {student.averageScore}
            </Text>
            <Text style={styles.statLabel}>Promedio / 100</Text>
          </View>
        </View>

        {/* Rendimiento por Especialidad APH */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Rendimiento por Especialidad</Text>
          <Text style={styles.sectionSubtitle}>
            Seguimiento de tu razonamiento clínico en cada área
          </Text>

          <View style={styles.specialtiesList}>
            {specialties.map((item) => {
              const progressPct = item.total > 0 ? (item.completed / item.total) * 100 : 0;
              return (
                <View key={item.name} style={styles.specialtyItem}>
                  <View style={styles.specialtyHeader}>
                    <Text style={styles.specialtyName}>{item.name}</Text>
                    <Text style={styles.specialtyCount}>
                      {item.completed} de {item.total} resueltos
                    </Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progressPct}%`,
                          backgroundColor: progressPct > 0 ? '#0b3d91' : '#cbd5e1',
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Historial de Intentos Recientes (RF10 + RF11) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Historial de Intentos</Text>
          <Text style={styles.sectionSubtitle}>
            Últimos casos clínicos evaluados por el sistema
          </Text>

          <View style={styles.attemptsList}>
            {recentAttempts.map((att) => (
              <View key={att.id} style={styles.attemptItem}>
                <View style={styles.attemptTop}>
                  <View style={styles.attemptSpecialty}>
                    <Text style={styles.attemptSpecialtyText}>{att.specialty}</Text>
                  </View>
                  <Text style={styles.attemptDate}>{att.date}</Text>
                </View>

                <Text style={styles.attemptTitle}>{att.caseTitle}</Text>

                <View style={styles.attemptBottom}>
                  <View
                    style={[
                      styles.resultBadge,
                      att.isCorrect ? styles.resultCorrect : styles.resultIncorrect,
                    ]}
                  >
                    <Text
                      style={[
                        styles.resultText,
                        att.isCorrect ? styles.resultCorrectText : styles.resultIncorrectText,
                      ]}
                    >
                      {att.isCorrect ? '✓ Aprobado' : '✕ A reforzar'}
                    </Text>
                  </View>
                  <Text style={styles.attemptScore}>{att.score} pts</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <Pressable
          style={styles.logoutButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0b3d91',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0b3d91',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 14,
  },
  specialtiesList: {
    gap: 12,
  },
  specialtyItem: {
    gap: 6,
  },
  specialtyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialtyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  specialtyCount: {
    fontSize: 11,
    color: '#64748b',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  attemptsList: {
    gap: 10,
  },
  attemptItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  attemptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attemptSpecialty: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  attemptSpecialtyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0b3d91',
    textTransform: 'uppercase',
  },
  attemptDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  attemptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
    marginBottom: 8,
  },
  attemptBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultCorrect: {
    backgroundColor: '#ecfdf5',
  },
  resultIncorrect: {
    backgroundColor: '#fef2f2',
  },
  resultText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resultCorrectText: {
    color: '#065f46',
  },
  resultIncorrectText: {
    color: '#991b1b',
  },
  attemptScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0b3d91',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
