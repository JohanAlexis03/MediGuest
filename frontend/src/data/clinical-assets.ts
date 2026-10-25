import { ImageSourcePropType } from 'react-native';

export const CLINICAL_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  // Casos normalizados en MySQL (Imágenes diagnósticas de alta fidelidad)
  'caso-neumotorax-tension': require('@/assets/images/clinical/pneumothorax_xray.jpg'),
  'caso-shock-cardiogenico-epoc': require('@/assets/images/clinical/stemi_ecg.jpg'),
  'caso-cocaina-dolor-toracico': require('@/assets/images/clinical/stemi_ecg.jpg'),
  'caso-organofosforados': require('@/assets/images/clinical/bradycardia_ecg.jpg'),
  'caso-toxicologia-erct-hiperpotasemia': require('@/assets/images/clinical/bradycardia_ecg.jpg'),
  'caso-asma-severo-broncospasmo': require('@/assets/images/clinical/emphysema_xray.jpg'),
  'caso-pediatrico-nicotina': require('@/assets/images/clinical/croup_steeple_sign_xray.jpg'),
  'caso-sindrome-neuroleptico-maligno': require('@/assets/images/clinical/cincinnati_stroke.jpg'),

  // Identificadores heredados (Compatibilidad hacia atrás)
  'aph-001': require('@/assets/images/clinical/pneumothorax_xray.jpg'),
  'aph-002': require('@/assets/images/clinical/stemi_ecg.jpg'),
  'aph-003': require('@/assets/images/clinical/emphysema_xray.jpg'),
  'aph-004': require('@/assets/images/clinical/croup_steeple_sign_xray.jpg'),
  'aph-005': require('@/assets/images/clinical/bradycardia_ecg.jpg'),
  'aph-006': require('@/assets/images/clinical/cincinnati_stroke.jpg'),
};

export function getClinicalImageSource(
  caseId: string,
  fallbackUri?: string
): ImageSourcePropType | { uri: string } | undefined {
  if (CLINICAL_IMAGE_MAP[caseId]) {
    return CLINICAL_IMAGE_MAP[caseId];
  }

  // Descartar fotos genéricas de stock de Unsplash que no corresponden a auxiliares diagnósticos
  if (fallbackUri && !fallbackUri.includes('unsplash.com')) {
    return { uri: fallbackUri };
  }

  return undefined;
}
