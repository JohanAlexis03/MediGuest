import React, { useState, useEffect } from 'react';
import { ScreenId, ClinicalCase, UserProfile, CaseAttempt } from './types';
import { CLINICAL_CASES } from './data/cases';
import { MobileFrame, DeviceMode } from './components/MobileFrame';
import { LandingScreen } from './screens/LandingScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CaseListScreen } from './screens/CaseListScreen';
import { CaseDetailScreen } from './screens/CaseDetailScreen';
import { CaseSolveScreen } from './screens/CaseSolveScreen';
import { ProgressScreen } from './screens/ProgressScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('ios');
  const [selectedCase, setSelectedCase] = useState<ClinicalCase>(CLINICAL_CASES[0]);

  // Initial user or saved user state from localStorage
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mediquest_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved user', e);
      }
    }
    return {
      id: 'usr-student-01',
      firstName: 'Camila',
      lastName: 'Sánchez',
      email: 'estudiante.aph@mediquest.edu',
      role: 'Estudiante de Atención Prehospitalaria',
      institution: 'Servicio de Emergencias Médicas (SAME / Cruz Roja)',
      score: 100,
      completedCaseIds: ['aph-002'],
      history: [
        {
          caseId: 'aph-002',
          selectedOption: 'A',
          isCorrect: true,
          score: 100,
          timestamp: '16 Oct 2026, 14:20',
          timeSpentSeconds: 110,
        },
      ],
    };
  });

  // Persist user progress
  useEffect(() => {
    localStorage.setItem('mediquest_user', JSON.stringify(user));
  }, [user]);

  // Authentication Handlers
  const handleRegisterSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setCurrentScreen('case_list');
  };

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setCurrentScreen('case_list');
  };

  const handleContinueAsGuest = () => {
    setCurrentScreen('case_list');
  };

  const handleLogout = () => {
    setCurrentScreen('landing');
  };

  // Case Selection
  const handleSelectCase = (c: ClinicalCase) => {
    setSelectedCase(c);
    setCurrentScreen('case_detail');
  };

  const handleSelectCaseById = (caseId: string) => {
    const found = CLINICAL_CASES.find((c) => c.id === caseId);
    if (found) {
      setSelectedCase(found);
      setCurrentScreen('case_detail');
    }
  };

  // Case Evaluation & Attempt Recording
  const handleSaveAttempt = (selectedOptionId: 'A' | 'B' | 'C' | 'D', isCorrect: boolean) => {
    const points = isCorrect ? 100 : 0;
    const now = new Date();
    const formattedDate = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - Hoy`;

    const newAttempt: CaseAttempt = {
      caseId: selectedCase.id,
      selectedOption: selectedOptionId,
      isCorrect,
      score: points,
      timestamp: formattedDate,
      timeSpentSeconds: 95,
    };

    setUser((prev) => {
      const alreadyCompleted = prev.completedCaseIds.includes(selectedCase.id);
      const updatedCompleted = isCorrect && !alreadyCompleted 
        ? [...prev.completedCaseIds, selectedCase.id] 
        : prev.completedCaseIds;

      return {
        ...prev,
        score: prev.score + points,
        completedCaseIds: updatedCompleted,
        history: [newAttempt, ...prev.history],
      };
    });
  };

  const handleResetProgress = () => {
    setUser((prev) => ({
      ...prev,
      score: 0,
      completedCaseIds: [],
      history: [],
    }));
  };

  // Find next case for sequential training
  const currentCaseIndex = CLINICAL_CASES.findIndex((c) => c.id === selectedCase.id);
  const nextCase = currentCaseIndex < CLINICAL_CASES.length - 1 ? CLINICAL_CASES[currentCaseIndex + 1] : null;

  const handleGoToNextCase = nextCase
    ? () => {
        setSelectedCase(nextCase);
        setCurrentScreen('case_detail');
      }
    : undefined;

  return (
    <MobileFrame
      currentScreen={currentScreen}
      onNavigateScreen={(screen) => setCurrentScreen(screen)}
      deviceMode={deviceMode}
      setDeviceMode={setDeviceMode}
    >
      {/* 1. Landing Screen */}
      {currentScreen === 'landing' && (
        <LandingScreen
          onGoToLogin={() => setCurrentScreen('login')}
          onGoToRegister={() => setCurrentScreen('register')}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}

      {/* 2. Registro Screen */}
      {currentScreen === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onGoToLogin={() => setCurrentScreen('login')}
          onBackToLanding={() => setCurrentScreen('landing')}
        />
      )}

      {/* 3. Login Screen */}
      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={() => setCurrentScreen('register')}
          onBackToLanding={() => setCurrentScreen('landing')}
        />
      )}

      {/* 4. Lista de Casos Screen */}
      {currentScreen === 'case_list' && (
        <CaseListScreen
          cases={CLINICAL_CASES}
          user={user}
          onSelectCase={handleSelectCase}
          onGoToProgress={() => setCurrentScreen('progress')}
        />
      )}

      {/* 5. Detalle del Caso Screen */}
      {currentScreen === 'case_detail' && (
        <CaseDetailScreen
          clinicalCase={selectedCase}
          onBackToList={() => setCurrentScreen('case_list')}
          onProceedToSolve={() => setCurrentScreen('case_solve')}
        />
      )}

      {/* 6. Resolución Screen */}
      {currentScreen === 'case_solve' && (
        <CaseSolveScreen
          clinicalCase={selectedCase}
          onBackToDetail={() => setCurrentScreen('case_detail')}
          onSaveAttempt={handleSaveAttempt}
          onGoToNextCase={handleGoToNextCase}
          onGoToProgress={() => setCurrentScreen('progress')}
        />
      )}

      {/* 7. Progreso Screen */}
      {currentScreen === 'progress' && (
        <ProgressScreen
          user={user}
          cases={CLINICAL_CASES}
          onBackToList={() => setCurrentScreen('case_list')}
          onSelectCaseById={handleSelectCaseById}
          onResetProgress={handleResetProgress}
          onLogout={handleLogout}
        />
      )}
    </MobileFrame>
  );
}
