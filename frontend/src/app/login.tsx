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
import { AuthService } from '@/services/auth.service';

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !contrasena.trim()) {
      setError('Por favor completá correo y contraseña.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.login(correo, contrasena);
      router.replace('/cases');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión. Verificá tus credenciales.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Iniciar sesión',
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
          {/* Top Brand Header */}
          <View style={styles.headerSection}>
            <View style={styles.miniLogoCard}>
              <Image
                source={require('@/assets/images/mediquest-star-of-life.png')}
                style={styles.miniLogo}
                contentFit="cover"
                transition={200}
              />
            </View>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>
              Ingresá a tu cuenta para continuar con tus casos clínicos activos.
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
            {/* Campo Correo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <TextInput
                style={styles.input}
                placeholder="tu.correo@aph.edu"
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

            {/* Campo Contraseña */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>CONTRASEÑA</Text>
                <Pressable
                  onPress={() =>
                    setError('Por seguridad institucional, comunicate con soporte académico o docente para recuperar tu acceso.')
                  }
                >
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu clave?</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ingresá tu contraseña"
                placeholderTextColor="#94a3b8"
                value={contrasena}
                onChangeText={(text) => {
                  setContrasena(text);
                  if (error) setError(null);
                }}
                secureTextEntry
              />
            </View>

            {/* Botón Principal Iniciar Sesión */}
            <Pressable
              style={[styles.btnPrimary, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
              accessibilityRole="button"
            >
              <Text style={styles.btnPrimaryText}>
                {isLoading ? 'Verificando...' : 'Iniciar sesión'}
              </Text>
            </Pressable>
          </View>

          {/* Footer Enlace a Registro */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>¿No tenés cuenta? </Text>
            <Link href="/registro" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.registerLink}>Registrate</Text>
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
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0b3d91',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  miniLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
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
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 11,
    color: '#0b3d91',
    fontWeight: '600',
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
  btnDemo: {
    height: 42,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDemoText: {
    color: '#0b3d91',
    fontSize: 12,
    fontWeight: '700',
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
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0b3d91',
  },
});
