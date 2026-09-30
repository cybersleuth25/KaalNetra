/**
 * KaalNetra — Gameplay Context
 *
 * Central state management for the core playable flow:
 *   - Loads the active scenario (default: 'chittor_1567')
 *   - Maintains the deterministic simulation session
 *   - Stores the latest turn result for feedback & animations
 *   - Exposes methods to apply decisions via the simulation engine
 *   - Enforces the strict rule: NO state math in React — engine handles all changes!
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { loadScenario } from '../data/scenarioLoader';
import type { Scenario } from '../data/types';
import {
  createSession,
  advanceTurn,
  resetSimulation,
  getAvailableDecisions,
  calculateSustainability,
} from '../simulation';
import type {
  SimulationSession,
  TurnResult,
  DecisionPoint,
} from '../simulation';

interface GameplayContextValue {
  scenario: Scenario | null;
  session: SimulationSession | null;
  lastTurnResult: TurnResult | null;
  isLoading: boolean;
  error: string | null;
  /** Current sustainability score (0–100) */
  sustainability: number;
  /** Available decision points for current state */
  availableDecisions: DecisionPoint[];
  /** Apply a decision via the simulation engine */
  applyPlayerDecision: (decisionId: string, optionId: string) => boolean;
  /** Reset simulation to initial turn */
  restart: () => void;
  /** Developer debug mode toggle */
  showDebugModal: boolean;
  setShowDebugModal: (show: boolean) => void;
}

const GameplayContext = createContext<GameplayContextValue | null>(null);

export function GameplayProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [lastTurnResult, setLastTurnResult] = useState<TurnResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebugModal, setShowDebugModal] = useState<boolean>(false);

  // Load default scenario on mount
  useEffect(() => {
    setIsLoading(true);
    const res = loadScenario('chittor_1567');
    if (res.success && res.scenario) {
      setScenario(res.scenario);
      const initSession = createSession(res.scenario);
      setSession(initSession);
      setError(null);
    } else {
      setError(res.errors[0]?.message ?? 'Failed to load scenario data');
    }
    setIsLoading(false);
  }, []);

  // Compute available decisions
  const availableDecisions = scenario && session
    ? getAvailableDecisions(
        session.currentState,
        scenario.decision_points,
        session.turnHistory.map((t) => t.decisionId)
      )
    : [];

  // Sustainability score
  const sustainability = session ? calculateSustainability(session.currentState) : 0;

  // Apply a decision through pure simulation engine
  const applyPlayerDecision = useCallback(
    (decisionId: string, optionId: string): boolean => {
      if (!scenario || !session) {
        setError('Scenario or session not initialized');
        return false;
      }

      const res = advanceTurn(session, decisionId, optionId, scenario.decision_points);
      if ('error' in res) {
        setError(res.error);
        return false;
      }

      setSession(res.session);
      setLastTurnResult(res.turnResult);
      setError(null);
      return true;
    },
    [scenario, session]
  );

  // Restart simulation
  const restart = useCallback(() => {
    if (!scenario || !session) return;
    const freshSession = resetSimulation(session);
    setSession(freshSession);
    setLastTurnResult(null);
    setError(null);
  }, [scenario, session]);

  const value: GameplayContextValue = {
    scenario,
    session,
    lastTurnResult,
    isLoading,
    error,
    sustainability,
    availableDecisions,
    applyPlayerDecision,
    restart,
    showDebugModal,
    setShowDebugModal,
  };

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
}

export function useGameplay(): GameplayContextValue {
  const ctx = useContext(GameplayContext);
  if (!ctx) {
    throw new Error('useGameplay must be used within a GameplayProvider');
  }
  return ctx;
}
