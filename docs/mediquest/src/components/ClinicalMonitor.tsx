import React, { useState } from 'react';
import { ClinicalMedia } from '../types';
import { Maximize2, Minimize2, Activity, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface ClinicalMonitorProps {
  media: ClinicalMedia;
  vitalsFc: number;
}

export const ClinicalMonitor: React.FC<ClinicalMonitorProps> = ({ media, vitalsFc }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'trace' | 'details'>('trace');

  // Generate SVG ECG path according to findings
  const isStemi = media.title.toLowerCase().includes('electrocardiograma') || media.findings.toLowerCase().includes('iamcest');
  const isTachycardia = vitalsFc > 120;
  const isBradycardia = vitalsFc < 55;

  return (
    <div className="bg-[#0F172A] rounded-[12px] border border-slate-800 text-white overflow-hidden shadow-sm">
      {/* Monitor Header */}
      <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold tracking-wide text-slate-200">
            {media.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {media.badgeLabel}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Contraer' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monitor Screen Area */}
      <div className={`relative ecg-grid ${isExpanded ? 'h-72' : 'h-44'} transition-all duration-300 flex flex-col justify-between p-3 overflow-hidden`}>
        {/* Top Telemetry Line */}
        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400/90 z-10">
          <div className="flex items-center gap-3">
            <span>II · 25 mm/s</span>
            <span>10 mm/mV</span>
            <span>0.05-150 Hz</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-slate-400">PULSO:</span>
            <span className="text-emerald-400 tabular-nums">{vitalsFc} lpm</span>
          </div>
        </div>

        {/* ECG SVG Waveform */}
        <div className="w-full h-full absolute inset-0 flex items-center pointer-events-none">
          <svg className="w-full h-28 stroke-emerald-400 fill-none" preserveAspectRatio="none" viewBox="0 0 600 100">
            <defs>
              <linearGradient id="ecgGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#34D399" stopOpacity="1" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {isStemi ? (
              // STEMI ECG Trace with elevated ST segment
              <path
                d="M 0,50 L 30,50 Q 40,43 50,50 L 70,50 L 75,54 L 80,18 L 86,60 L 92,30 Q 110,32 125,50 L 150,50 
                   L 180,50 Q 190,43 200,50 L 220,50 L 225,54 L 230,18 L 236,60 L 242,30 Q 260,32 275,50 L 300,50 
                   L 330,50 Q 340,43 350,50 L 370,50 L 375,54 L 380,18 L 386,60 L 392,30 Q 410,32 425,50 L 450,50 
                   L 480,50 Q 490,43 500,50 L 520,50 L 525,54 L 530,18 L 536,60 L 542,30 Q 560,32 575,50 L 600,50"
                stroke="url(#ecgGlow)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : isTachycardia ? (
              // Tachycardia Rapid Sinus Trace
              <path
                d="M 0,50 L 20,50 Q 25,44 30,50 L 40,50 L 44,53 L 48,20 L 52,65 L 56,48 Q 66,42 74,50 L 85,50
                   L 105,50 Q 110,44 115,50 L 125,50 L 129,53 L 133,20 L 137,65 L 141,48 Q 151,42 159,50 L 170,50
                   L 190,50 Q 195,44 200,50 L 210,50 L 214,53 L 218,20 L 222,65 L 226,48 Q 236,42 244,50 L 255,50
                   L 275,50 Q 280,44 285,50 L 295,50 L 299,53 L 303,20 L 307,65 L 311,48 Q 321,42 329,50 L 340,50
                   L 360,50 Q 365,44 370,50 L 380,50 L 384,53 L 388,20 L 392,65 L 396,48 Q 406,42 414,50 L 425,50
                   L 445,50 Q 450,44 455,50 L 465,50 L 469,53 L 473,20 L 477,65 L 481,48 Q 491,42 499,50 L 510,50
                   L 530,50 Q 535,44 540,50 L 550,50 L 554,53 L 558,20 L 562,65 L 566,48 Q 576,42 584,50 L 600,50"
                stroke="url(#ecgGlow)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              // Standard / Bradycardia Sinus Rhythm
              <path
                d="M 0,50 L 40,50 Q 50,42 60,50 L 85,50 L 90,54 L 95,15 L 102,68 L 108,48 Q 125,40 140,50 L 180,50
                   L 220,50 Q 230,42 240,50 L 265,50 L 270,54 L 275,15 L 282,68 L 288,48 Q 305,40 320,50 L 360,50
                   L 400,50 Q 410,42 420,50 L 445,50 L 450,54 L 455,15 L 462,68 L 468,48 Q 485,40 500,50 L 540,50
                   L 580,50 L 600,50"
                stroke="url(#ecgGlow)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>

        {/* Bottom strip details */}
        <div className="z-10 bg-slate-900/80 px-2 py-1 rounded text-[11px] text-slate-300 flex items-center justify-between border border-slate-800/80">
          <span className="font-medium text-emerald-400">
            {media.subtitle}
          </span>
          <span className="text-[10px] text-slate-400">
            Visualizador clínico APH
          </span>
        </div>
      </div>

      {/* Lead details and diagnostic notes */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-semibold text-white mb-1.5">
          <Eye className="w-3.5 h-3.5 text-[#0B3D91] text-sky-400" />
          <span>Hallazgos clínicos del trazado / imagen:</span>
        </div>
        <p className="leading-relaxed text-slate-300 text-[12px]">
          {media.findings}
        </p>

        {media.leadDetails && media.leadDetails.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
            {media.leadDetails.map((detail, idx) => (
              <div key={idx} className="bg-slate-900/90 px-2 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
                {detail}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
