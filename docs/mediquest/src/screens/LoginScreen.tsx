import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { ArrowLeft, Mail, Lock, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onGoToRegister: () => void;
  onBackToLanding: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor completá correo y contraseña.');
      return;
    }

    // Authenticate or restore saved user
    const savedUserStr = localStorage.getItem('mediquest_user');
    let user: UserProfile;

    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        user = {
          ...parsed,
          email: email.trim().toLowerCase(),
        };
      } catch (err) {
        user = createDefaultUser(email);
      }
    } else {
      user = createDefaultUser(email);
    }

    onLoginSuccess(user);
  };

  const createDefaultUser = (userEmail: string): UserProfile => ({
    id: `usr-${Date.now()}`,
    firstName: 'Mateo',
    lastName: 'Vargas',
    email: userEmail.trim().toLowerCase(),
    role: 'Estudiante APH - Nivel 2',
    institution: 'Instituto Superior de Emergencias Médicas',
    score: 180,
    completedCaseIds: ['aph-002'],
    history: [
      {
        caseId: 'aph-002',
        selectedOption: 'A',
        isCorrect: true,
        score: 100,
        timestamp: 'Ayer, 18:30',
        timeSpentSeconds: 145,
      },
    ],
  });

  const fillQuickDemo = () => {
    setEmail('aph.estudiante@mediquest.edu');
    setPassword('emergencias2026');
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-full p-6 bg-white justify-between">
      {/* Top Navigation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToLanding}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" />
          <div className="w-8"></div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Iniciar sesión
          </h2>
          <p className="text-sm text-[#666666] mt-1">
            Ingresá a tu cuenta para continuar con tus casos clínicos activos.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Correo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="tu.correo@aph.edu"
                className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => alert('Para fines de evaluación académica, podés usar cualquier contraseña o hacer clic en "Rellenar datos de prueba".')}
                className="text-[11px] text-[#0B3D91] hover:underline"
              >
                ¿Olvidaste tu clave?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Ingresá tu contraseña"
                className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Botón Iniciar sesión: 48px, 12px, #0B3D91 */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full cursor-pointer shadow-xs"
            >
              Iniciar sesión
            </button>
          </div>

          {/* Quick Demo Credentials button */}
          <button
            type="button"
            onClick={fillQuickDemo}
            className="w-full py-2.5 px-3 rounded-[10px] bg-blue-50/70 border border-blue-200/60 text-xs font-medium text-[#0B3D91] hover:bg-blue-100/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Rellenar con credenciales demo de estudiante APH</span>
          </button>
        </form>
      </div>

      {/* Enlace estricto: ¿No tenés cuenta? Registrate */}
      <div className="text-center pt-6 pb-2 border-t border-slate-100">
        <p className="text-sm text-[#666666]">
          ¿No tenés cuenta?{' '}
          <button
            onClick={onGoToRegister}
            className="font-semibold text-[#0B3D91] hover:underline cursor-pointer"
          >
            Registrate
          </button>
        </p>
      </div>
    </div>
  );
};
