import React from 'react';
import { Logo } from '../components/Logo';
import { ShieldCheck, BookOpen, Activity, ArrowRight, UserCheck } from 'lucide-react';

interface LandingScreenProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onContinueAsGuest: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGoToLogin,
  onGoToRegister,
  onContinueAsGuest,
}) => {
  return (
    <div className="flex flex-col min-h-full justify-between p-6 bg-white">
      {/* Top Clinical Trust Marker */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0B3D91] bg-blue-50 px-2.5 py-1 rounded-[6px] border border-blue-100">
          Entrenamiento Prehospitalario
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#666666]">
          <Activity className="w-3.5 h-3.5 text-[#0B3D91]" />
          <span>Protocolos PHTLS / ACLS</span>
        </div>
      </div>

      {/* Hero Visual & Branding */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        {/* Official Real Logo Container */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center max-w-[320px] w-full">
          <Logo size="xl" variant="full" />
        </div>

        {/* Subtitle strictly matching requirement */}
        <p className="text-base text-[#666666] font-medium max-w-xs leading-relaxed mb-6">
          Casos clínicos para estudiantes de APH
        </p>

        {/* Clinical Competencies Preview */}
        <div className="w-full max-w-xs bg-slate-50 border border-slate-200/80 rounded-[12px] p-3.5 text-left mb-4">
          <div className="text-[11px] font-semibold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span>Módulos de simulación en escena</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-[#666666]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D91]"></span>
              <span>Trauma y PHTLS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D91]"></span>
              <span>Cardio & ECG</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D91]"></span>
              <span>Vía aérea crítica</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D91]"></span>
              <span>Pediatría & Tox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons strictly complying with:
          - Botón primario "Iniciar sesión" (48px, esquinas 12px, #0B3D91)
          - Botón secundario "Crear cuenta" (48px, esquinas 12px)
      */}
      <div className="w-full flex flex-col gap-3 pb-2">
        <button
          onClick={onGoToLogin}
          className="btn-primary w-full shadow-sm cursor-pointer"
        >
          <span>Iniciar sesión</span>
        </button>

        <button
          onClick={onGoToRegister}
          className="btn-secondary w-full cursor-pointer"
        >
          <span>Crear cuenta</span>
        </button>

        {/* Fast Guest Mode to test without friction */}
        <button
          onClick={onContinueAsGuest}
          className="text-xs text-[#666666] hover:text-[#0B3D91] transition-colors py-2 flex items-center justify-center gap-1.5 font-medium cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Explorar casos como Estudiante de Prueba</span>
        </button>
      </div>
    </div>
  );
};
