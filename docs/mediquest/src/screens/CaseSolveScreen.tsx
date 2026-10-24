import React, { useState } from 'react';
import { ClinicalCase, CaseOption } from '../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight,
  Stethoscope,
  BookOpen
} from 'lucide-react';

interface CaseSolveScreenProps {
  clinicalCase: ClinicalCase;
  onBackToDetail: () => void;
  onSaveAttempt: (selectedOptionId: 'A' | 'B' | 'C' | 'D', isCorrect: boolean) => void;
  onGoToNextCase?: () => void;
  onGoToProgress: () => void;
}

export const CaseSolveScreen: React.FC<CaseSolveScreenProps> = ({
  clinicalCase,
  onBackToDetail,
  onSaveAttempt,
  onGoToNextCase,
  onGoToProgress,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const selectedOption = clinicalCase.question.options.find((o) => o.id === selectedOptionId);
  const correctOption = clinicalCase.question.options.find((o) => o.isCorrect);

  const handleEvaluate = () => {
    if (!selectedOptionId || !selectedOption) return;
    setIsEvaluated(true);
    onSaveAttempt(selectedOptionId, selectedOption.isCorrect);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsEvaluated(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-28">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBackToDetail}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Volver a los datos del caso"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#0B3D91]">
            Resolución Clínica
          </span>
          <span className="text-xs font-bold text-slate-800">
            {clinicalCase.specialty}
          </span>
        </div>

        <button
          onClick={onBackToDetail}
          className="text-xs font-semibold text-[#0B3D91] hover:underline"
        >
          Revisar signos
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Vitals Summary Pill Bar */}
        <div className="bg-white border border-slate-200 rounded-[10px] p-2.5 flex items-center justify-between text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-sans">FC:</span>
            <strong className="text-slate-900">{clinicalCase.vitals.fc}</strong>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-sans">TA:</span>
            <strong className="text-slate-900">{clinicalCase.vitals.ta}</strong>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-sans">SpO2:</span>
            <strong className="text-slate-900">{clinicalCase.vitals.spo2}%</strong>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-sans">GCS:</span>
            <strong className="text-slate-900">{clinicalCase.vitals.glasgow.total}/15</strong>
          </div>
        </div>

        {/* Enunciado del caso (Requerimiento estricto: "enunciado") */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-[#0B3D91]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Pregunta de Toma de Decisiones
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {clinicalCase.question.prompt}
          </p>
        </div>

        {/* Opciones A/B/C/D (Requerimiento estricto: "opciones A/B/C/D") */}
        <div className="space-y-2.5">
          {clinicalCase.question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            
            // Visual states post-evaluation
            let optionStyles = 'bg-white border-slate-200 hover:border-slate-300';
            let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

            if (!isEvaluated && isSelected) {
              optionStyles = 'bg-blue-50/70 border-[#0B3D91] shadow-xs ring-1 ring-[#0B3D91]';
              badgeStyles = 'bg-[#0B3D91] text-white border-[#0B3D91]';
            } else if (isEvaluated) {
              if (option.isCorrect) {
                optionStyles = 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400';
                badgeStyles = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-rose-50 border-rose-400 ring-1 ring-rose-400';
                badgeStyles = 'bg-rose-600 text-white border-rose-600';
              } else {
                optionStyles = 'bg-white border-slate-200 opacity-60';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => {
                  if (!isEvaluated) setSelectedOptionId(option.id);
                }}
                className={`border rounded-[12px] p-3.5 transition-all flex items-start gap-3 ${
                  !isEvaluated ? 'cursor-pointer active:scale-[0.99]' : ''
                } ${optionStyles}`}
              >
                {/* Option Identifier Badge (A, B, C, D) */}
                <div
                  className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-bold text-xs shrink-0 border ${badgeStyles}`}
                >
                  {option.id}
                </div>

                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    {option.text}
                  </p>

                  {/* Immediate feedback note under each option when evaluated */}
                  {isEvaluated && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5 mb-1 font-semibold text-xs">
                        {option.isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Opción Correcta</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-700">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Opción Incorrecta</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {option.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Retroalimentación por opción destacada tras pulsar "Evaluar" (Requerimiento estricto) */}
        {isEvaluated && selectedOption && (
          <div
            className={`rounded-[12px] p-4 border shadow-xs animate-in fade-in duration-300 ${
              selectedOption.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              {selectedOption.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Excelente intervención prehospitalaria! (+100 pts)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Respuesta incorrecta en el protocolo prehospitalario</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed mb-3">
              {selectedOption.feedback}
            </p>

            {selectedOption.keyPoints && selectedOption.keyPoints.length > 0 && (
              <div className="bg-white/80 p-2.5 rounded-[8px] border border-slate-200/50 mb-3 text-xs space-y-1 text-slate-700">
                <span className="font-semibold block text-slate-900">
                  Puntos clave según protocolo:
                </span>
                {selectedOption.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B3D91]"></span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[11px] text-[#666666] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>Base doctrinal: {clinicalCase.protocolReference}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions:
          Botón "Evaluar" (altura 48px, esquinas 12px, #0B3D91)
          y botones de avance post-evaluación
      */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 max-w-md mx-auto z-40">
        {!isEvaluated ? (
          <button
            onClick={handleEvaluate}
            disabled={!selectedOptionId}
            className={`btn-primary w-full shadow-md cursor-pointer ${
              !selectedOptionId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Evaluar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="h-12 px-3 rounded-[12px] border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Volver a intentar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reintentar</span>
            </button>

            {onGoToNextCase ? (
              <button
                onClick={onGoToNextCase}
                className="btn-primary flex-1 shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <span>Siguiente caso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onGoToProgress}
                className="btn-primary flex-1 shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <span>Ver mi progreso</span>
                <Award className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
