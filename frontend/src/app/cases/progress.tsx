import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { CasesService, AttemptProgress } from '@/services/cases.service';
import { AuthService, UserSession } from '@/services/auth.service';

export default function ProgressScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [attempts, setAttempts] = useState<AttemptProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      const email = user?.email || 'student@mediquest.edu';
      const progressData = await CasesService.getUserProgress(email);
      setAttempts(progressData);
    } catch {
      // Si falla, se mantiene la lista vacía o previa
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (isMounted) setCurrentUser(user);
        const email = user?.email || 'student@mediquest.edu';
        const progressData = await CasesService.getUserProgress(email);
        if (isMounted) setAttempts(progressData);
      } catch {
        // Ignora error silencioso
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadProgress();
  }, [loadProgress]);

  const stats = useMemo(() => {
    const totalAttempts = attempts.length;
    if (totalAttempts === 0) {
      return {
        completedCasesCount: 0,
        totalCasesCount: 3,
        accuracyPercentage: 0,
        averageScore: 0,
      };
    }

    const uniqueCases = new Set(attempts.map((a) => a.caseId)).size;
    const correctCount = attempts.filter((a) => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalAttempts) * 100);
    const avgScore = Math.round(
      attempts.reduce((sum, a) => sum + (a.scorePercentage || 0), 0) / totalAttempts
    );

    return {
      completedCasesCount: uniqueCases,
      totalCasesCount: Math.max(3, uniqueCases),
      accuracyPercentage: accuracy,
      averageScore: avgScore,
    };
  }, [attempts]);

  const specialties = useMemo(() => {
    const allSpecs = [
      { name: 'Trauma', color: '#ef4444' },
      { name: 'Cardiovascular', color: '#f59e0b' },
      { name: 'Respiratorio', color: '#3b82f6' },
      { name: 'Neurología', color: '#8b5cf6' },
      { name: 'Pediatría', color: '#ec4899' },
      { name: 'Toxicología', color: '#10b981' },
    ];

    return allSpecs.map((spec) => {
      const completed = attempts.filter(
        (a) => a.specialty?.toUpperCase() === spec.name.toUpperCase() && a.isCorrect
      ).length;
      return {
        ...spec,
        completed,
        total: Math.max(1, completed),
      };
    });
  }, [attempts]);

  const initials = useMemo(() => {
    if (!currentUser?.name) return 'AP';
    const parts = currentUser.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }, [currentUser]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Mi Progreso APH',
          headerTintColor: '#0b3d91',
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#0b3d91']} />
        }
      >
        {/* Ficha del Estudiante */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {currentUser?.name || 'Estudiante APH'}
            </Text>
            <Text style={styles.profileEmail}>
              {currentUser?.email || 'student@mediquest.edu'}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {currentUser?.role === 'ROLE_TEACHER' ? 'Docente APH' : 'Estudiante de APH'}
              </Text>
            </View>
          </View>
        </View>

        {/* Métricas Generales (RF11) */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {stats.completedCasesCount}/{stats.totalCasesCount}
            </Text>
            <Text style={styles.statLabel}>Casos Resueltos</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>
              {stats.accuracyPercentage}%
            </Text>
            <Text style={styles.statLabel}>Tasa de Acierto</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#0b3d91' }]}>
              {stats.averageScore}
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
                      {item.completed} resuelto{item.completed === 1 ? '' : 's'}
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
          <Text style={styles.sectionTitle}>Historial de Intentos (MySQL)</Text>
          <Text style={styles.sectionSubtitle}>
            Intentos registrados y evaluados en la base de datos
          </Text>

          {isLoading ? (
            <ActivityIndicator size="small" color="#0b3d91" style={{ marginVertical: 20 }} />
          ) : attempts.length === 0 ? (
            <View style={styles.emptyAttemptsBox}>
              <Text style={styles.emptyAttemptsText}>
                Aún no has resuelto ningún caso clínico.
              </Text>
              <Pressable
                style={styles.solveFirstCaseBtn}
                onPress={() => router.replace('/cases')}
              >
                <Text style={styles.solveFirstCaseBtnText}>Resolver un caso ahora →</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.attemptsList}>
              {attempts.map((att) => (
                <View key={att.attemptId} style={styles.attemptItem}>
                  <View style={styles.attemptTop}>
                    <View style={styles.attemptSpecialty}>
                      <Text style={styles.attemptSpecialtyText}>{att.specialty}</Text>
                    </View>
                    <Text style={styles.attemptDate}>
                      {att.completedAt
                        ? att.completedAt.replace('T', ' ').substring(0, 16)
                        : 'Reciente'}
                    </Text>
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
                    <Text style={styles.attemptScore}>{att.scorePercentage} pts</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Botón de cerrar sesión */}
        <Pressable
          style={styles.logoutButton}
          onPress={async () => {
            await AuthService.logout();
            router.replace('/');
          }}
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
  emptyAttemptsBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyAttemptsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  solveFirstCaseBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  solveFirstCaseBtnText: {
    color: '#0b3d91',
    fontWeight: '700',
    fontSize: 13,
  },
});
