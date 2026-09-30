import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

/**
 * All game stages in linear order.
 * The stage controller enforces sequential progression.
 */
export const STAGES = [
  'HOME',
  'SCENARIO',
  'CONTEXT',
  'BRIEFING',
  'DECISION_1',
  'SIMULATION_1',
  'DECISION_2',
  'OUTCOME',
  'COMPARE',
  'REFLECTION',
] as const;

export type GameStage = typeof STAGES[number];

interface StageContextValue {
  stage: GameStage;
  stageIndex: number;
  /** Advance to the next stage in the linear flow */
  nextStage: () => void;
  /** Go back to the previous stage */
  prevStage: () => void;
  /** Jump to a specific stage (use sparingly — for reset) */
  goToStage: (stage: GameStage) => void;
  /** Reset to HOME */
  reset: () => void;
}

const StageContext = createContext<StageContextValue | null>(null);

export function StageProvider({ children }: { children: ReactNode }) {
  const [stageIndex, setStageIndex] = useState(0);

  const nextStage = useCallback(() => {
    setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));
  }, []);

  const prevStage = useCallback(() => {
    setStageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStage = useCallback((target: GameStage) => {
    const idx = STAGES.indexOf(target);
    if (idx !== -1) {
      setStageIndex(idx);
    }
  }, []);

  const reset = useCallback(() => {
    setStageIndex(0);
  }, []);

  const value: StageContextValue = {
    stage: STAGES[stageIndex],
    stageIndex,
    nextStage,
    prevStage,
    goToStage,
    reset,
  };

  return (
    <StageContext.Provider value={value}>
      {children}
    </StageContext.Provider>
  );
}

export function useStage(): StageContextValue {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error('useStage must be used within a StageProvider');
  }
  return context;
}
