import React from 'react';
import { VitalSigns } from '../types';
import { Activity, Wind, Heart, Gauge, Thermometer, Brain } from 'lucide-react';

interface VitalSignCardProps {
  vitals: VitalSigns;
  compact?: boolean;
}

export const VitalSignCard: React.FC<VitalSignCardProps> = ({ vitals, compact = false }) => {
  // Clinical status checks for APH
  const getFcStatus = (fc: number) => {
    if (fc > 100) return { label: 'Taquicardia', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (fc < 60) return { label: 'Bradicardia', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const getFrStatus = (fr: number) => {
    if (fr > 20) return { label: 'Taquipnea', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (fr < 12) return { label: 'Bradipnea', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const getSpo2Status = (spo2: number) => {
    if (spo2 < 90) return { label: 'Hipoxemia severa', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (spo2 < 94) return { label: 'Hipoxemia moderada', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Adecuada', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const getGlasgowStatus = (g: number) => {
    if (g <= 8) return { label: 'Grave (TCE Severo)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (g <= 12) return { label: 'Moderado', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Leve / Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const fcStatus = getFcStatus(vitals.fc);
  const frStatus = getFrStatus(vitals.fr);
  const spo2Status = getSpo2Status(vitals.spo2);
  const glasgowStatus = getGlasgowStatus(vitals.glasgow.total);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {/* FC */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] font-semibold tracking-wider uppercase">FC</span>
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${fcStatus.color}`}>
            {fcStatus.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {vitals.fc}
          </span>
          <span className="text-xs text-[#666666] font-medium">lpm</span>
        </div>
        <div className="text-[10px] text-[#666666] mt-1">Ref: 60 - 100</div>
      </div>

      {/* FR */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[11px] font-semibold tracking-wider uppercase">FR</span>
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${frStatus.color}`}>
            {frStatus.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {vitals.fr}
          </span>
          <span className="text-xs text-[#666666] font-medium">rpm</span>
        </div>
        <div className="text-[10px] text-[#666666] mt-1">Ref: 12 - 20</div>
      </div>

      {/* TA */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase">TA</span>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Arterial
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {vitals.ta}
          </span>
          <span className="text-xs text-[#666666] font-medium">mmHg</span>
        </div>
        <div className="text-[10px] text-[#666666] mt-1">Ref: 120/80</div>
      </div>

      {/* SpO2 */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[11px] font-semibold tracking-wider uppercase">SpO2</span>
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${spo2Status.color}`}>
            {spo2Status.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {vitals.spo2}
          </span>
          <span className="text-xs text-[#666666] font-medium">%</span>
        </div>
        <div className="text-[10px] text-[#666666] mt-1">Ref: ≥ 95%</div>
      </div>

      {/* Temp */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-semibold tracking-wider uppercase">Temp</span>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Axilar
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {vitals.temp}
          </span>
          <span className="text-xs text-[#666666] font-medium">°C</span>
        </div>
        <div className="text-[10px] text-[#666666] mt-1">Ref: 36.5 - 37.5</div>
      </div>

      {/* Glasgow */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-3 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] font-semibold tracking-wider uppercase">Glasgow</span>
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${glasgowStatus.color}`}>
            {glasgowStatus.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {vitals.glasgow.total}
          </span>
          <span className="text-xs text-[#666666] font-medium">/ 15</span>
        </div>
        <div className="text-[10px] text-[#666666] mt-1 tabular-nums font-mono">
          O:{vitals.glasgow.ocular} · V:{vitals.glasgow.verbal} · M:{vitals.glasgow.motor}
        </div>
      </div>
    </div>
  );
};
