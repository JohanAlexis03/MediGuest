import React, { useState, useMemo } from 'react';
import { ClinicalCase, Specialty, Difficulty, UserProfile } from '../types';
import { Logo } from '../components/Logo';
import { Search, Filter, CheckCircle2, ChevronRight, Award, User, X } from 'lucide-react';

interface CaseListScreenProps {
  cases: ClinicalCase[];
  user: UserProfile;
  onSelectCase: (c: ClinicalCase) => void;
  onGoToProgress: () => void;
}

export const CaseListScreen: React.FC<CaseListScreenProps> = ({
  cases,
  user,
  onSelectCase,
  onGoToProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Todas');

  const specialties = ['Todas', 'Trauma', 'Cardiovascular', 'Respiratorio', 'Pediatría', 'Toxicología', 'Neurología'];
  const difficulties = ['Todas', 'Básico', 'Intermedio', 'Avanzado'];

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dispatchContext.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty = selectedSpecialty === 'Todas' || c.specialty === selectedSpecialty;
      const matchesDifficulty = selectedDifficulty === 'Todas' || c.difficulty === selectedDifficulty;

      return matchesSearch && matchesSpecialty && matchesDifficulty;
    });
  }, [cases, searchQuery, selectedSpecialty, selectedDifficulty]);

  // Color mappings for difficulty as requested: "nivel de dificultad con color"
  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'Básico':
        return {
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          dotColor: 'bg-emerald-500',
        };
      case 'Intermedio':
        return {
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          dotColor: 'bg-amber-500',
        };
      case 'Avanzado':
        return {
          textColor: 'text-rose-700',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          dotColor: 'bg-rose-500',
        };
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-20">
      {/* Top Clinical App Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          
          <button
            onClick={onGoToProgress}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#0B3D91] hover:bg-blue-100/70 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span className="tabular-nums font-bold">{user.score} pts</span>
          </button>
        </div>

        {/* Buscador reactivo strictly requested: "buscador" */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por caso, patología o síntoma..."
            className="w-full h-11 pl-10 pr-9 text-sm bg-slate-100 border border-slate-200 rounded-[12px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3D91] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Specialty Filter Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-0.5">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-[#0B3D91] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Case Count and Stats Ribbon */}
      <div className="px-4 py-2.5 flex items-center justify-between text-xs text-[#666666]">
        <span>
          Mostrando <strong className="text-slate-900 font-semibold">{filteredCases.length}</strong> casos prehospitalarios
        </span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{user.completedCaseIds.length} resueltos</span>
        </div>
      </div>

      {/* Cards List strictly complying with:
          "tarjetas con título, especialidad (ej. Trauma) y nivel de dificultad con color."
      */}
      <div className="px-4 space-y-3">
        {filteredCases.map((c) => {
          const diffBadge = getDifficultyBadge(c.difficulty);
          const isCompleted = user.completedCaseIds.includes(c.id);

          return (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-xs hover:border-[#0B3D91]/60 hover:shadow-sm transition-all cursor-pointer active:scale-[0.99] group"
            >
              {/* Specialty & Difficulty Line */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#0B3D91] tracking-wide uppercase">
                    {c.specialty}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-[#666666]">
                    {c.patient.age} {c.patient.ageUnit} ({c.patient.sex[0]})
                  </span>
                </div>

                {/* Nivel de dificultad con color */}
                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${diffBadge.bgColor} ${diffBadge.textColor} ${diffBadge.borderColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${diffBadge.dotColor}`}></span>
                  <span>{c.difficulty}</span>
                </div>
              </div>

              {/* Título del caso */}
              <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#0B3D91] transition-colors mb-2">
                {c.title}
              </h3>

              {/* Context Summary */}
              <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed mb-3">
                {c.dispatchContext}
              </p>

              {/* Card Footer: Vitals Preview + Status + Action Arrow */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>FC: {c.vitals.fc}</span>
                  <span>·</span>
                  <span>TA: {c.vitals.ta}</span>
                  <span>·</span>
                  <span>SpO2: {c.vitals.spo2}%</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Resuelto</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#0B3D91] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Ver caso
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredCases.length === 0 && (
          <div className="bg-white rounded-[12px] border border-slate-200 p-8 text-center my-6">
            <p className="text-sm font-semibold text-slate-800">
              No se encontraron casos con esos criterios
            </p>
            <p className="text-xs text-[#666666] mt-1 mb-4">
              Intentá buscar con otros términos o seleccioná todas las especialidades.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('Todas');
                setSelectedDifficulty('Todas');
              }}
              className="text-xs font-semibold text-[#0B3D91] underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
