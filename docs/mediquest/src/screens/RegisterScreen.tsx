import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { ArrowLeft, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface RegisterScreenProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onGoToLogin: () => void;
  onBackToLanding: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onGoToLogin,
  onBackToLanding,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor completá todos los campos requeridos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      role: 'Estudiante APH',
      institution: 'Cruz Roja / Escuela de Emergencias Prehospitalarias',
      score: 0,
      completedCaseIds: [],
      history: [],
    };

    onRegisterSuccess(newUser);
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

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Crear cuenta
          </h2>
          <p className="text-sm text-[#666666] mt-1">
            Comenzá a resolver casos clínicos y fortalecé tu toma de decisiones en APH.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ej. Lucas"
                  className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Ej. Romero"
                  className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

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
                placeholder="estudiante.aph@emergencias.edu"
                className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Terms note */}
          <div className="text-[11px] text-[#666666] leading-relaxed pt-1">
            Al registrarte tendrás acceso libre a simulaciones basadas en estándares PHTLS, ACLS y AMLS.
          </div>

          {/* Botón primario Registrarse: 48px, 12px */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full cursor-pointer shadow-xs"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>

      {/* Enlace al login */}
      <div className="text-center pt-6 pb-2 border-t border-slate-100">
        <p className="text-sm text-[#666666]">
          ¿Ya tenés cuenta?{' '}
          <button
            onClick={onGoToLogin}
            className="font-semibold text-[#0B3D91] hover:underline cursor-pointer"
          >
            Iniciá sesión
          </button>
        </p>
      </div>
    </div>
  );
};
