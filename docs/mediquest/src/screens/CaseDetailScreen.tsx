import React, { useState } from 'react';
import { ClinicalCase } from '../types';
import { VitalSignCard } from '../components/VitalSignCard';
import { ClinicalMonitor } from '../components/ClinicalMonitor';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  ShieldAlert, 
  Stethoscope, 
  FileText, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface CaseDetailScreenProps {
  clinicalCase: ClinicalCase;
  onBackToList: () => void;
  onProceedToSolve: () => void;
}

export const CaseDetailScreen: React.FC<CaseDetailScreenProps> = ({
  clinicalCase,
  onBackToList,
  onProceedToSolve,
}) => {
  const [activeTab, setActiveTab] = useState<'survey' | 'sample'>('survey');

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-28">
      {/* Top Clinical Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Volver a la lista"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center max-w-[220px]">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#0B3D91]">
            Caso {clinicalCase.id.toUpperCase()}
          </span>
          <span className="text-xs font-bold text-slate-800 truncate w-full">
            {clinicalCase.specialty}
          </span>
        </div>

        <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0B3D91] border border-blue-200">
          {clinicalCase.difficulty}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Case Title Banner */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs">
          <h1 className="text-lg font-bold text-slate-900 leading-snug mb-2">
            {clinicalCase.title}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-[#666666] bg-slate-50 p-2.5 rounded-[8px] border border-slate-200/60">
            <Clock className="w-4 h-4 text-[#0B3D91] shrink-0" />
            <span>{clinicalCase.dispatchContext}</span>
          </div>
        </div>

        {/* 1. Datos del Paciente (Requerimiento estricto: "datos del paciente (edad, sexo)") */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-3.5 shadow-xs">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <User className="w-4 h-4 text-[#0B3D91]" />
            <span>Ficha del Paciente</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-[8px] border border-slate-100">
              <span className="text-[10px] text-[#666666] block">Edad</span>
              <span className="font-semibold text-slate-900">
                {clinicalCase.patient.age} {clinicalCase.patient.ageUnit}
              </span>
            </div>

            <div className="bg-slate-50 p-2 rounded-[8px] border border-slate-100">
              <span className="text-[10px] text-[#666666] block">Sexo</span>
              <span className="font-semibold text-slate-900">
                {clinicalCase.patient.sex}
              </span>
            </div>

            {clinicalCase.patient.weightKg && (
              <div className="bg-slate-50 p-2 rounded-[8px] border border-slate-100">
                <span className="text-[10px] text-[#666666] block">Peso estimado</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {clinicalCase.patient.weightKg} kg
                </span>
              </div>
            )}

            {clinicalCase.patient.occupation && (
              <div className="bg-slate-50 p-2 rounded-[8px] border border-slate-100">
                <span className="text-[10px] text-[#666666] block">Ocupación / Rol</span>
                <span className="font-semibold text-slate-900 truncate block">
                  {clinicalCase.patient.occupation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Signos Vitales en Tarjetas (Requerimiento estricto:
            "signos vitales en tarjetas (FC, FR, TA, SpO2, Temp, Glasgow)") */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Stethoscope className="w-4 h-4 text-[#0B3D91]" />
              <span>Signos Vitales de Ingreso</span>
            </div>
            <span className="text-[11px] text-[#666666]">
              Monitorización en escena
            </span>
          </div>

          <VitalSignCard vitals={clinicalCase.vitals} />
        </div>

        {/* 3. Espacio para ECG / Imagen (Requerimiento estricto: "espacio para ECG/imagen") */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#0B3D91]" />
              <span>Diagnóstico Instrumental / Trazado ECG</span>
            </div>
          </div>

          <ClinicalMonitor 
            media={clinicalCase.media} 
            vitalsFc={clinicalCase.vitals.fc} 
          />
        </div>

        {/* 4. Presentación Clínica (Requerimiento estricto: "presentación clínica") */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-[#0B3D91]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Presentación Clínica en Escena
            </span>
          </div>

          {/* Scene and Kinematics */}
          <div className="space-y-2 mb-4 text-xs text-slate-700">
            <div className="bg-blue-50/60 p-2.5 rounded-[8px] border border-blue-100/70">
              <strong className="text-[#0B3D91] block mb-0.5">Evaluación de la Escena & Cinemática:</strong>
              <p className="leading-relaxed">{clinicalCase.clinicalPresentation.scene}</p>
              <p className="leading-relaxed mt-1 text-slate-600">{clinicalCase.clinicalPresentation.kinematicsOrOnset}</p>
            </div>
          </div>

          {/* Switchable Tabs: Examen Primario (XABCDE) vs Historia SAMPLE */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-3">
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'survey'
                  ? 'bg-white text-[#0B3D91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Examen Primario (XABCDE)
            </button>
            <button
              onClick={() => setActiveTab('sample')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'sample'
                  ? 'bg-white text-[#0B3D91] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Historia SAMPLE
            </button>
          </div>

          {activeTab === 'survey' ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-[#0B3D91] bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  A
                </span>
                <div>
                  <strong className="text-slate-800">Vía Aérea & Control Cervical:</strong>
                  <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.primarySurvey.airway}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-[#0B3D91] bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  B
                </span>
                <div>
                  <strong className="text-slate-800">Ventilación & Respiración:</strong>
                  <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.primarySurvey.breathing}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-[#0B3D91] bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  C
                </span>
                <div>
                  <strong className="text-slate-800">Circulación & Perfusión:</strong>
                  <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.primarySurvey.circulation}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-[#0B3D91] bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  D
                </span>
                <div>
                  <strong className="text-slate-800">Déficit Neurológico:</strong>
                  <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.primarySurvey.disability}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-[#0B3D91] bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  E
                </span>
                <div>
                  <strong className="text-slate-800">Exposición & Entorno:</strong>
                  <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.primarySurvey.exposure}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block">S - Síntomas Principales:</strong>
                <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.sampleHistory.symptoms}</p>
              </div>

              <div className="p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block">A - Alergias:</strong>
                <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.sampleHistory.allergies}</p>
              </div>

              <div className="p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block">M - Medicamentos Habituales:</strong>
                <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.sampleHistory.medications}</p>
              </div>

              <div className="p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block">P - Patologías / Antecedentes Médicos:</strong>
                <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.sampleHistory.pastHistory}</p>
              </div>

              <div className="p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block">L - Última Ingesta (Last Oral Intake):</strong>
                <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.sampleHistory.lastMeal}</p>
              </div>

              <div className="p-2 rounded-[8px] bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block">E - Eventos Previos al Despacho:</strong>
                <p className="text-slate-600 mt-0.5">{clinicalCase.clinicalPresentation.sampleHistory.events}</p>
              </div>
            </div>
          )}
        </div>

        {/* Protocol Reference Note */}
        <div className="p-3 bg-slate-100 rounded-[10px] text-[11px] text-[#666666] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#0B3D91] shrink-0" />
          <span>Referencia clínica: {clinicalCase.protocolReference}</span>
        </div>
      </div>

      {/* Sticky Bottom Action CTA: 48px, 12px, #0B3D91 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 max-w-md mx-auto z-40">
        <button
          onClick={onProceedToSolve}
          className="btn-primary w-full shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Ir a la resolución del caso</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
