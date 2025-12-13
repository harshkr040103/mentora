import React, { createContext, useContext, useState } from 'react';
import { Assessment as AssessmentType } from '../components/Assessment';

export type Mode = 'personal' | 'organisation';

type ContextType = {
  mode: Mode;
  setMode: (m: Mode) => void;
  goals: string[];
  setGoals: (g: string[]) => void;
  assessment: AssessmentType | null;
  setAssessment: (a: AssessmentType) => void;
  recommendations: string[];
  setRecommendations: (r: string[]) => void;
};

const MentoraContext = createContext<ContextType | undefined>(undefined);

export function MentoraProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('personal');
  const [goals, setGoals] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<AssessmentType | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  return (
    <MentoraContext.Provider
      value={{ mode, setMode, goals, setGoals, assessment, setAssessment, recommendations, setRecommendations }}
    >
      {children}
    </MentoraContext.Provider>
  );
}

export function useMentora() {
  const ctx = useContext(MentoraContext);
  if (!ctx) throw new Error('useMentora must be used within MentoraProvider');
  return ctx;
}

export default MentoraContext;
