import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  subtitle?: string;
}

export function BrandLogo({
  size = 'md',
  showWordmark = false,
  subtitle,
}: BrandLogoProps) {
  const sizeMap = {
    sm: { icon: 44, container: 52, title: 20 },
    md: { icon: 70, container: 82, title: 26 },
    lg: { icon: 110, container: 124, title: 30 },
    xl: { icon: 140, container: 156, title: 34 },
  };

  const current = sizeMap[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCard,
          {
            width: current.container,
            height: current.container,
            borderRadius: Math.round(current.container * 0.28),
          },
        ]}
      >
        <Image
          source={require('@/assets/images/mediquest-star-of-life.png')}
          style={{ width: current.icon, height: current.icon, borderRadius: Math.round(current.icon * 0.22) }}
          contentFit="contain"
          transition={200}
        />
      </View>

      {showWordmark && (
        <View style={styles.textContainer}>
          <Text style={[styles.title, { fontSize: current.title }]}>MediQuest</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCard: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0b3d91',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontWeight: '800',
    color: '#0b3d91',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
});
