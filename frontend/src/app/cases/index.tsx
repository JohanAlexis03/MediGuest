import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { CasesService } from '@/services/cases.service';
import { AuthService, UserSession } from '@/services/auth.service';
import { Specialty, Difficulty, ClinicalCase } from '@/types/clinical-case';
import { CaseCard } from '@/components/clinical/case-card';

const SPECIALTIES: ('Todos' | Specialty)[] = [
  'Todos',
  'Trauma',
  'Cardiovascular',
  'Respiratorio',
  'Neurología',
  'Pediatría',
  'Toxicología',
];

const DIFFICULTIES: ('Todas' | Difficulty)[] = [
  'Todas',
  'Básico',
  'Intermedio',
  'Avanzado',
];

export default function CasesScreen() {
  const router = useRouter();
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<'Todos' | Specialty>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Todas' | Difficulty>('Todas');

  const loadData = useCallback(async () => {
    try {
      const [fetchedCases, currentUser] = await Promise.all([
        CasesService.getAllCases(),
        AuthService.getCurrentUser(),
      ]);
      setCases(fetchedCases);
      setUser(currentUser);
    } catch {
      // Fallback a los datos iniciales
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [fetchedCases, currentUser] = await Promise.all([
          CasesService.getAllCases(),
          AuthService.getCurrentUser(),
        ]);
        if (isMounted) {
          setCases(fetchedCases);
          setUser(currentUser);
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (selectedSpecialty !== 'Todos') {
        const cleanTarget = selectedSpecialty
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        const cleanCaseSpec = (c.specialty || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        if (cleanCaseSpec !== cleanTarget) return false;
      }
      if (selectedDifficulty !== 'Todas') {
        const cleanTargetDiff = selectedDifficulty
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        const cleanCaseDiff = (c.difficulty || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        if (cleanCaseDiff !== cleanTargetDiff) return false;
      }
      return true;
    });
  }, [cases, selectedSpecialty, selectedDifficulty]);

  const specialtyCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: 0 };
    const baseCases = selectedDifficulty === 'Todas'
      ? cases
      : cases.filter((c) => {
          const cleanCaseDiff = (c.difficulty || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          const cleanTargetDiff = selectedDifficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          return cleanCaseDiff === cleanTargetDiff;
        });

    counts['Todos'] = baseCases.length;
    SPECIALTIES.forEach((spec) => {
      if (spec === 'Todos') return;
      const cleanSpec = spec
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      counts[spec] = baseCases.filter((c) => {
        const cleanCaseSpec = (c.specialty || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        return cleanCaseSpec === cleanSpec;
      }).length;
    });
    return counts;
  }, [cases, selectedDifficulty]);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: 0 };
    const baseCases = selectedSpecialty === 'Todos'
      ? cases
      : cases.filter((c) => {
          const cleanCaseSpec = (c.specialty || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          const cleanTargetSpec = selectedSpecialty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          return cleanCaseSpec === cleanTargetSpec;
        });

    counts['Todas'] = baseCases.length;
    DIFFICULTIES.forEach((diff) => {
      if (diff === 'Todas') return;
      const cleanDiff = diff
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
      counts[diff] = baseCases.filter((c) => {
        const cleanCaseDiff = (c.difficulty || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        return cleanCaseDiff === cleanDiff;
      }).length;
    });
    return counts;
  }, [cases, selectedSpecialty]);

  const handleSelectCase = (caseItem: ClinicalCase) => {
    router.push({
      pathname: '/cases/[id]',
      params: { id: caseItem.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* Banner Superior */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerSubtitle}>
              APH {user ? `• ${user.name}` : ''}
            </Text>
            <Link href="/cases/progress" asChild>
              <Pressable style={styles.progressButton}>
                <Text style={styles.progressButtonText}>Mi Progreso 📊</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Casos Clínicos</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>{cases.length} casos</Text>
            </View>
          </View>

          <Text style={styles.headerDescription}>
            Entrená tu razonamiento clínico resolviendo escenarios simulados basados en protocolos PHTLS / ATLS.
          </Text>

          {/* Tarjeta de Resumen de Banco */}
          <View style={styles.statsSummaryCard}>
            <View style={styles.statsSummaryItem}>
              <Text style={styles.statsSummaryNumber}>{cases.length}</Text>
              <Text style={styles.statsSummaryLabel}>Banco Total</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsSummaryItem}>
              <Text style={styles.statsSummaryNumber}>6</Text>
              <Text style={styles.statsSummaryLabel}>Especialidades</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsSummaryItem}>
              <Text style={styles.statsSummaryNumber}>{filteredCases.length}</Text>
              <Text style={styles.statsSummaryLabel}>En Pantalla</Text>
            </View>
          </View>
        </View>

        {/* Filtros por Especialidad y Dificultad */}
        <View style={styles.filterWrapper}>
          {/* Fila 1: Especialidad */}
          <View style={styles.filterCategoryHeader}>
            <Text style={styles.filterCategoryTitle}>Especialidad</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              const count = specialtyCounts[spec] ?? 0;
              return (
                <Pressable
                  key={spec}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setSelectedSpecialty(spec)}
                >
                  <Text
                    style={[styles.filterText, isSelected && styles.filterTextActive]}
                  >
                    {spec}
                  </Text>
                  <View
                    style={[
                      styles.filterBadge,
                      isSelected && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        isSelected && styles.filterBadgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Fila 2: Nivel de Dificultad */}
          <View style={[styles.filterCategoryHeader, styles.filterCategoryHeaderSecond]}>
            <Text style={styles.filterCategoryTitle}>Dificultad</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff;
              const count = difficultyCounts[diff] ?? 0;
              return (
                <Pressable
                  key={diff}
                  style={[
                    styles.difficultyPill,
                    isSelected && styles.difficultyPillActive,
                    diff === 'Básico' && styles.difficultyPillBasico,
                    diff === 'Intermedio' && styles.difficultyPillIntermedio,
                    diff === 'Avanzado' && styles.difficultyPillAvanzado,
                    isSelected && diff === 'Básico' && styles.difficultyPillBasicoActive,
                    isSelected && diff === 'Intermedio' && styles.difficultyPillIntermedioActive,
                    isSelected && diff === 'Avanzado' && styles.difficultyPillAvanzadoActive,
                  ]}
                  onPress={() => setSelectedDifficulty(diff)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      isSelected && styles.difficultyTextActive,
                    ]}
                  >
                    {diff}
                  </Text>
                  <View
                    style={[
                      styles.filterBadge,
                      isSelected && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        isSelected && styles.filterBadgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Barra Indicadora de Casos Filtrados */}
          <View style={styles.activeFilterBar}>
            <Text style={styles.activeFilterText}>
              Mostrando {filteredCases.length} de {cases.length} casos
              {selectedSpecialty !== 'Todos' ? ` • ${selectedSpecialty}` : ''}
              {selectedDifficulty !== 'Todas' ? ` • ${selectedDifficulty}` : ''}
            </Text>
            {(selectedSpecialty !== 'Todos' || selectedDifficulty !== 'Todas') && (
              <Pressable
                onPress={() => {
                  setSelectedSpecialty('Todos');
                  setSelectedDifficulty('Todas');
                }}
                hitSlop={8}
              >
                <Text style={styles.clearFilterText}>Restablecer</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Lista de Casos */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0b3d91" />
            <Text style={styles.loadingText}>Cargando casos desde el servidor...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCases}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CaseCard
                clinicalCase={item}
                onPress={() => handleSelectCase(item)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#0b3d91']} />
            }
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No hay casos en esta especialidad</Text>
                <Text style={styles.emptySubtitle}>
                  Probá seleccionando otra categoría o &quot;Todos&quot;.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  progressButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  totalBadge: {
    backgroundColor: '#0b3d91',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  statsSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsSummaryNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0b3d91',
  },
  statsSummaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statsDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  filterWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterPillActive: {
    backgroundColor: '#0b3d91',
    borderColor: '#0b3d91',
  },
  filterBadge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterBadgeTextActive: {
    color: '#ffffff',
  },
  filterCategoryHeader: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  filterCategoryHeaderSecond: {
    paddingTop: 10,
  },
  filterCategoryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  difficultyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  difficultyPillActive: {
    backgroundColor: '#0b3d91',
    borderColor: '#0b3d91',
  },
  difficultyPillBasico: {
    borderColor: '#a7f3d0',
  },
  difficultyPillBasicoActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  difficultyPillIntermedio: {
    borderColor: '#fde68a',
  },
  difficultyPillIntermedioActive: {
    backgroundColor: '#d97706',
    borderColor: '#d97706',
  },
  difficultyPillAvanzado: {
    borderColor: '#fecaca',
  },
  difficultyPillAvanzadoActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  difficultyTextActive: {
    color: '#ffffff',
  },
  activeFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0b3d91',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});
