import React from 'react';
import { UserProfile, ClinicalCase } from '../types';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart3, 
  RotateCcw, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';

interface ProgressScreenProps {
  user: UserProfile;
  cases: ClinicalCase[];
  onBackToList: () => void;
  onSelectCaseById: (caseId: string) => void;
  onResetProgress: () => void;
  onLogout: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  user,
  cases,
  onBackToList,
  onSelectCaseById,
  onResetProgress,
  onLogout,
}) => {
  const totalCasesCount = cases.length;
  const completedCount = user.completedCaseIds.length;
  const progressPercentage = Math.round((completedCount / (totalCasesCount || 1)) * 100);

  // Calculate success rate
  const correctAttempts = user.history.filter((h) => h.isCorrect).length;
  const totalAttempts = user.history.length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  // Breakdown by specialty
  const specialtyBreakdown = [
    'Trauma', 
    'Cardiovascular', 
    'Respiratorio', 
    'Pediatría', 
    'Toxicología', 
    'Neurología'
  ].map((spec) => {
    const specCases = cases.filter((c) => c.specialty === spec);
    const specCompleted = specCases.filter((c) => user.completedCaseIds.includes(c.id)).length;
    return {
      name: spec,
      total: specCases.length,
      completed: specCompleted,
      isFinished: specCases.length > 0 && specCompleted === specCases.length,
    };
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Volver a los casos"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-sm font-bold text-slate-900">
          Mi Progreso APH
        </h2>

        <button
          onClick={onLogout}
          className="p-2 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* User Card */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0B3D91] text-white flex items-center justify-center font-bold text-base shadow-xs">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-[#666666] truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-semibold text-[#0B3D91] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Puntaje y Métricas Principales (Requerimiento estricto: "puntaje, casos completados") */}
        <div className="grid grid-cols-2 gap-3">
          {/* Puntaje Card */}
          <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Puntaje Global
              </span>
              <Award className="w-4 h-4 text-[#0B3D91]" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-[#0B3D91] tabular-nums">
                {user.score}
              </span>
              <span className="text-xs text-[#666666] font-medium ml-1">pts</span>
            </div>
            <div className="text-[10px] text-[#666666] mt-1">
              +100 pts por caso acertado
            </div>
          </div>

          {/* Casos Completados Card */}
          <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Casos Resueltos
              </span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {completedCount}
              </span>
              <span className="text-xs text-[#666666] font-medium ml-1">
                / {totalCasesCount}
              </span>
            </div>
            <div className="text-[10px] text-[#666666] mt-1">
              {progressPercentage}% del currículum
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-800">
              Avance del entrenamiento
            </span>
            <span className="font-bold text-[#0B3D91] tabular-nums">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B3D91] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Competencias por Especialidad */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <BarChart3 className="w-4 h-4 text-[#0B3D91]" />
              <span>Avance por Especialidad</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {specialtyBreakdown.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-[11px] text-[#666666] tabular-nums font-mono">
                    {item.completed} / {item.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0B3D91] rounded-full transition-all"
                    style={{
                      width: `${item.total > 0 ? (item.completed / item.total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Historial (Requerimiento estricto: "e historial.") */}
        <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Clock className="w-4 h-4 text-[#0B3D91]" />
              <span>Historial de Intentos y Evaluaciones</span>
            </div>
            <span className="text-[11px] text-[#666666]">
              {user.history.length} registros
            </span>
          </div>

          {user.history.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#666666]">
              Aún no registraste intentos en ningún caso. ¡Empezá a resolver casos en la lista!
            </div>
          ) : (
            <div className="space-y-2.5">
              {user.history.map((attempt, index) => {
                const targetCase = cases.find((c) => c.id === attempt.caseId);
                return (
                  <div
                    key={index}
                    onClick={() => targetCase && onSelectCaseById(targetCase.id)}
                    className="p-3 rounded-[10px] bg-slate-50 border border-slate-200/80 hover:border-[#0B3D91]/60 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {attempt.isCorrect ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[190px]">
                          {targetCase?.title || attempt.caseId}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#666666] mt-0.5">
                          <span>Opción {attempt.selectedOption}</span>
                          <span>·</span>
                          <span>{attempt.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          attempt.isCorrect ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        +{attempt.score}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reset Progress Action */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              if (confirm('¿Querés reiniciar tu puntaje e historial para volver a entrenar desde cero?')) {
                onResetProgress();
              }
            }}
            className="text-xs text-[#666666] hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar historial de entrenamiento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
