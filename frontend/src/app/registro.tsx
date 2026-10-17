import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Link, useRouter, Stack } from 'expo-router';

export default function RegistroScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    if (!nombre.trim() || !apellido.trim() || !correo.trim() || !contrasena.trim()) {
      setError('Por favor completá todos los campos requeridos.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError(null);
    router.replace('/cases');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Crear cuenta',
          headerTintColor: '#0b3d91',
        }}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.miniLogoCard}>
              <Image
                source={require('@/assets/images/Logo_MediQuest_v1.svg')}
                style={styles.miniLogo}
                contentFit="contain"
              />
            </View>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Comenzá a resolver casos clínicos y fortalecé tu toma de decisiones en APH.
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formCard}>
            {/* Nombre y Apellido en Fila */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Text style={styles.inputLabel}>NOMBRE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Lucas"
                  placeholderTextColor="#94a3b8"
                  value={nombre}
                  onChangeText={(text) => {
                    setNombre(text);
                    if (error) setError(null);
                  }}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.nameField}>
                <Text style={styles.inputLabel}>APELLIDO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Romero"
                  placeholderTextColor="#94a3b8"
                  value={apellido}
                  onChangeText={(text) => {
                    setApellido(text);
                    if (error) setError(null);
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Correo Electrónico */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                style={styles.input}
                placeholder="estudiante.aph@emergencias.edu"
                placeholderTextColor="#94a3b8"
                value={correo}
                onChangeText={(text) => {
                  setCorreo(text);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONTRASEÑA (MÍNIMO 6 CARACTERES)</Text>
              <TextInput
                style={styles.input}
                placeholder="Crea tu contraseña segura"
                placeholderTextColor="#94a3b8"
                value={contrasena}
                onChangeText={(text) => {
                  setContrasena(text);
                  if (error) setError(null);
                }}
                secureTextEntry
              />
            </View>

            {/* Botón Principal Registrarse */}
            <Pressable
              style={styles.btnPrimary}
              onPress={handleRegister}
              accessibilityRole="button"
            >
              <Text style={styles.btnPrimaryText}>Crear cuenta</Text>
            </Pressable>

            {/* Beneficios de la Formación APH */}
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>BENEFICIOS ACADÉMICOS INCLUIDOS</Text>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Acceso inmediato a los 6 casos clínicos de alta fidelidad</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Evaluación y retroalimentación con protocolos PHTLS / ATLS</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>✓</Text>
                <Text style={styles.benefitText}>Métricas de progreso y tasa de acierto por especialidad</Text>
              </View>
            </View>
          </View>

          {/* Footer Enlace a Login */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
            <Link href="/login" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.loginLink}>Iniciá sesión</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginBottom: 20,
  },
  miniLogoCard: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  miniLogo: {
    width: 44,
    height: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#e11d48',
    fontSize: 13,
    fontWeight: '600',
  },
  formCard: {
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
    gap: 6,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  btnPrimary: {
    height: 48,
    backgroundColor: '#0b3d91',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#0b3d91',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  benefitsCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginTop: 4,
  },
  benefitsTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0b3d91',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitIcon: {
    color: '#10b981',
    fontWeight: '800',
    fontSize: 12,
    marginTop: 1,
  },
  benefitText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0b3d91',
  },
});


