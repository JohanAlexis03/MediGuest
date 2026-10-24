import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AuthService, UserSession } from '@/services/auth.service';

export default function IndexScreen() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    AuthService.getCurrentUser().then(setCurrentUser);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Clinical Trust Marker */}
        <View style={styles.trustMarkerRow}>
          <View style={styles.trustBadge}>
            <Text style={styles.trustBadgeText}>ENTRENAMIENTO PREHOSPITALARIO</Text>
          </View>
          <View style={styles.protocolBadge}>
            <Text style={styles.protocolText}>⚡ PHTLS / ACLS</Text>
          </View>
        </View>

        {/* Hero Visual & Branding Card */}
        <View style={styles.heroSection}>
          <View style={styles.logoCard}>
            <Image
              source={require('@/assets/images/mediquest-star-of-life.png')}
              style={styles.logoImage}
              contentFit="cover"
              transition={200}
            />
          </View>
          <Text style={styles.appTitle}>MediQuest</Text>
          <Text style={styles.appSubtitle}>
            Casos clínicos interactivos para estudiantes de APH
          </Text>

          {/* Módulos de simulación clínica */}
          <View style={styles.competenciesCard}>
            <View style={styles.competenciesHeader}>
              <Text style={styles.competenciesIcon}>📖</Text>
              <Text style={styles.competenciesTitle}>MÓDULOS DE SIMULACIÓN EN ESCENA</Text>
            </View>
            <View style={styles.competenciesGrid}>
              <View style={styles.competencyItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.competencyText}>Trauma y PHTLS</Text>
              </View>
              <View style={styles.competencyItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.competencyText}>Cardio & ECG</Text>
              </View>
              <View style={styles.competencyItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.competencyText}>Vía aérea crítica</Text>
              </View>
              <View style={styles.competencyItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.competencyText}>Pediatría & Tox</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {currentUser ? (
            <>
              <Pressable
                style={styles.btnPrimary}
                onPress={() => router.push('/cases')}
                accessibilityRole="button"
              >
                <Text style={styles.btnPrimaryText}>
                  Continuar como {currentUser.name} →
                </Text>
              </Pressable>
              <Pressable
                style={styles.btnSecondary}
                onPress={async () => {
                  await AuthService.logout();
                  setCurrentUser(null);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.btnSecondaryText}>Cambiar de cuenta</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Link href="/login" asChild>
                <Pressable style={styles.btnPrimary} accessibilityRole="button">
                  <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
                </Pressable>
              </Link>

              <Link href="/registro" asChild>
                <Pressable style={styles.btnSecondary} accessibilityRole="button">
                  <Text style={styles.btnSecondaryText}>Crear cuenta</Text>
                </Pressable>
              </Link>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  trustMarkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trustBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  trustBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0b3d91',
    letterSpacing: 0.5,
  },
  protocolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  protocolText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 'auto',
    paddingVertical: 12,
  },
  logoCard: {
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0b3d91',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 22,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0b3d91',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 20,
  },
  competenciesCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 14,
  },
  competenciesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  competenciesIcon: {
    fontSize: 12,
  },
  competenciesTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
  },
  competenciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  competencyItem: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0b3d91',
  },
  competencyText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  actionsSection: {
    gap: 12,
    paddingTop: 16,
  },
  btnPrimary: {
    width: '100%',
    height: 48,
    backgroundColor: '#0b3d91',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0b3d91',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    width: '100%',
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#0b3d91',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: '#0b3d91',
    fontSize: 16,
    fontWeight: '700',
  },
  btnGuest: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGuestText: {
    fontSize: 13,
    color: '#0b3d91',
    fontWeight: '600',
  },
});
