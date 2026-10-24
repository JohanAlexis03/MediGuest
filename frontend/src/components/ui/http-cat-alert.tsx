import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface HttpCatAlertProps {
  visible: boolean;
  statusCode?: number;
  catUrl?: string;
  title?: string;
  message: string;
  onRetry?: () => void;
  onClose: () => void;
}

export function HttpCatAlert({
  visible,
  statusCode = 404,
  catUrl,
  title,
  message,
  onRetry,
  onClose,
}: HttpCatAlertProps) {
  const imageUrl = catUrl || `https://http.cat/${statusCode}.jpg`;
  const defaultTitle = statusCode === 404
    ? 'Caso Clínico No Encontrado'
    : statusCode >= 500
    ? 'Error de Servidor o Conexión'
    : 'Atención Requerida';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeContainer}>
          <View style={styles.card}>
            {/* Header del status */}
            <View style={styles.badgeRow}>
              <View style={[styles.statusBadge, statusCode >= 500 ? styles.badgeError : styles.badgeWarn]}>
                <Text style={styles.badgeText}>HTTP {statusCode}</Text>
              </View>
              <Text style={styles.cardHeaderTitle}>{title || defaultTitle}</Text>
            </View>

            {/* Imagen del Gato HTTP (http.cat) */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.catImage}
                contentFit="cover"
                transition={300}
                placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
              />
            </View>

            {/* Mensaje descriptivo */}
            <View style={styles.textContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionRow}>
              {onRetry && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.button, styles.retryButton]}
                  onPress={onRetry}
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.button, styles.closeButton, !onRetry && styles.fullWidthButton]}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 35, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  safeContainer: {
    width: '100%',
    maxWidth: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeWarn: {
    backgroundColor: '#FEF3C7',
  },
  badgeError: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  cardHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#0F172A',
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#0B3D91', // Azul prehospitalario APH
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  closeButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
});
