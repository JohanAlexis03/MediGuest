import { ImageSourcePropType } from 'react-native';

export const CLINICAL_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  'aph-001': require('@/assets/images/clinical/pneumothorax_xray.jpg'),
  'aph-002': require('@/assets/images/clinical/stemi_ecg.jpg'),
  'aph-003': require('@/assets/images/clinical/emphysema_xray.jpg'),
  'aph-004': require('@/assets/images/clinical/croup_steeple_sign_xray.jpg'),
  'aph-005': require('@/assets/images/clinical/bradycardia_ecg.jpg'),
  'aph-006': require('@/assets/images/clinical/cincinnati_stroke.jpg'),
};

export function getClinicalImageSource(caseId: string, fallbackUri?: string): ImageSourcePropType | { uri: string } | undefined {
  if (CLINICAL_IMAGE_MAP[caseId]) {
    return CLINICAL_IMAGE_MAP[caseId];
  }
  if (fallbackUri) {
    return { uri: fallbackUri };
  }
  return undefined;
}
