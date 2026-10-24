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
import { Specialty, ClinicalCase } from '@/types/clinical-case';
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

export default function CasesScreen() {
  const router = useRouter();
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<'Todos' | Specialty>('Todos');

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
    if (selectedSpecialty === 'Todos') {
      return cases;
    }
    return cases.filter((c) => c.specialty === selectedSpecialty);
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
          <Text style={styles.headerTitle}>Casos Clínicos Disponibles</Text>
          <Text style={styles.headerDescription}>
            Entrená tu razonamiento clínico resolviendo escenarios simulados basados en protocolos PHTLS / ATLS.
          </Text>
        </View>

        {/* Filtros por Especialidad */}
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec;
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
                </Pressable>
              );
            })}
          </ScrollView>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
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
    paddingHorizontal: 14,
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
