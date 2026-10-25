import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';

export type DeviceMode = 'ios' | 'android' | 'full';

interface MobileFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenId;
  onNavigateScreen: (screen: ScreenId) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  currentScreen,
  onNavigateScreen,
  deviceMode,
  setDeviceMode,
}) => {
  const [currentTime] = useState('09:41');

  const screensList: { id: ScreenId; label: string; number: number }[] = [
    { id: 'landing', label: '1. Landing', number: 1 },
    { id: 'register', label: '2. Registro', number: 2 },
    { id: 'login', label: '3. Login', number: 3 },
    { id: 'case_list', label: '4. Casos', number: 4 },
    { id: 'case_detail', label: '5. Detalle', number: 5 },
    { id: 'case_solve', label: '6. Resolución', number: 6 },
    { id: 'progress', label: '7. Progreso', number: 7 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
      {/* Top Academic & Presentation Bar */}
      <header className="w-full bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0B3D91] flex items-center justify-center font-bold text-xs text-white">
              MQ
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              MediQuest <span className="text-[#38BDF8] text-xs font-normal">| Simulador Móvil APH</span>
            </span>
          </div>
        </div>

        {/* Device Switcher (iOS vs Android vs Full View) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('ios')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === 'ios'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista iOS</span>
          </button>

          <button
            onClick={() => setDeviceMode('android')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === 'android'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Vista Android</span>
          </button>

          <button
            onClick={() => setDeviceMode('full')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === 'full'
                ? 'bg-[#0B3D91] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Completa</span>
          </button>
        </div>

        {/* Quick Screen Preview Navigator */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-0.5">
          {screensList.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onNavigateScreen(sc.id)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                currentScreen === sc.id
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {deviceMode === 'full' ? (
          // Full responsive viewport
          <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden min-h-[720px] flex flex-col border border-slate-200">
            {children}
          </div>
        ) : (
          // Realistic Phone Frame (iOS or Android)
          <div
            className={`relative w-full max-w-[395px] bg-black shadow-2xl border-[8px] sm:border-[12px] ${
              deviceMode === 'ios'
                ? 'rounded-[50px] border-slate-950 ring-1 ring-slate-800'
                : 'rounded-[40px] border-slate-900 ring-1 ring-slate-800'
            } overflow-hidden flex flex-col h-[780px] max-h-[92vh]`}
          >
            {/* Native Status Bar */}
            <div className="bg-white text-slate-900 px-6 pt-3 pb-1 flex items-center justify-between select-none shrink-0 z-50">
              <span className="text-xs font-semibold tabular-nums">
                {currentTime}
              </span>

              {/* iOS Dynamic Island OR Android Camera Notch */}
              {deviceMode === 'ios' ? (
                <div className="w-24 h-5 bg-black rounded-full mx-auto -mt-1 flex items-center justify-end pr-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800"></div>
                </div>
              ) : (
                <div className="w-3.5 h-3.5 bg-black rounded-full mx-auto -mt-1 ring-1 ring-slate-800"></div>
              )}

              <div className="flex items-center gap-1.5 text-slate-800">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <div className="flex items-center gap-0.5">
                  <Battery className="w-4 h-4 fill-slate-800" />
                </div>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 bg-white text-slate-900 overflow-y-auto no-scrollbar relative flex flex-col">
              {children}
            </div>

            {/* Bottom Home Indicator */}
            <div className="bg-white py-1.5 flex justify-center shrink-0 z-50">
              <div
                className={`h-1 bg-slate-300 rounded-full transition-all ${
                  deviceMode === 'ios' ? 'w-32' : 'w-20'
                }`}
              ></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
