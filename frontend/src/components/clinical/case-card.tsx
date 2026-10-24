import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ClinicalCase } from '@/types/clinical-case';

interface CaseCardProps {
  clinicalCase: ClinicalCase;
  onPress: () => void;
}

export function CaseCard({ clinicalCase, onPress }: CaseCardProps) {
  const getDifficultyBadgeStyle = (difficulty: ClinicalCase['difficulty']) => {
    switch (difficulty) {
      case 'Básico':
        return styles.difficultyBasic;
      case 'Intermedio':
        return styles.difficultyIntermediate;
      case 'Avanzado':
        return styles.difficultyAdvanced;
      default:
        return styles.difficultyBasic;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Caso ${clinicalCase.title}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.specialtyBadge}>
          <Text style={styles.specialtyText}>{clinicalCase.specialty}</Text>
        </View>
        <View style={[styles.difficultyBadge, getDifficultyBadgeStyle(clinicalCase.difficulty)]}>
          <Text style={styles.difficultyText}>{clinicalCase.difficulty}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {clinicalCase.title}
      </Text>

      <View style={styles.patientRow}>
        <Text style={styles.patientLabel}>Paciente:</Text>
        <Text style={styles.patientValue}>
          {clinicalCase.patient.sex}, {clinicalCase.patient.age} {clinicalCase.patient.ageUnit}
        </Text>
      </View>

      <Text style={styles.contextText} numberOfLines={2}>
        {clinicalCase.dispatchContext}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.actionText}>Resolver caso clínico →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyBasic: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  difficultyIntermediate: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  difficultyAdvanced: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 22,
    marginBottom: 8,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  patientLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  patientValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  contextText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0b3d91',
  },
});
