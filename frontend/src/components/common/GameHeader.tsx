/**
 * KaalNetra — Game Header
 *
 * Provides persistent top-level navigation:
 *   - Current stage progression indicator (Home → Scenario → Context → Briefing → Decision 1 → Simulation → Decision 2 → Outcome)
 *   - Back navigation
 *   - Reset / Restart control
 *   - Developer Debug mode toggle
 */

import { useStage, type GameStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';

const STAGE_LABELS: Record<GameStage, string> = {
  HOME: 'Home',
  SCENARIO: 'Scenario',
  CONTEXT: 'Historical Context',
  BRIEFING: 'Briefing',
  DECISION_1: 'Decision 1',
  SIMULATION_1: 'Simulation',
  DECISION_2: 'Decision 2',
  OUTCOME: 'Final Outcome',
  COMPARE: 'Comparison',
  REFLECTION: 'Reflection',
};

const PLAYABLE_STAGES: GameStage[] = [
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
];

interface GameHeaderProps {
  currentStage?: GameStage;
  badge?: 'historical' | 'simulation' | 'result';
}

export default function GameHeader({ badge }: GameHeaderProps) {
  const { stage, prevStage, reset } = useStage();
  const { restart, showDebugModal, setShowDebugModal } = useGameplay();

  const handleRestart = () => {
    restart();
    reset();
  };

  return (
    <header className="game-header">
      <div className="game-header-top">
        {/* Brand */}
        <div className="game-header-brand" onClick={handleRestart} style={{ cursor: 'pointer' }}>
          <span className="brand-kaal">Kaal</span>
          <span className="brand-netra">Netra</span>
          <span className="brand-subtitle">SIH 26208</span>
        </div>

        {/* Dynamic Context Badge */}
        {badge === 'historical' && (
          <span className="badge-historical">
            📜 Historical Record
          </span>
        )}
        {badge === 'simulation' && (
          <span className="badge-simulation">
            ⚔️ Your Simulation
          </span>
        )}
        {badge === 'result' && (
          <span className="badge-result">
            ⚖️ Simulation Result
          </span>
        )}

        {/* Global Controls */}
        <div className="game-header-actions">
          {stage !== 'HOME' && (
            <>
              <button
                className="header-btn"
                onClick={prevStage}
                title="Go back to previous stage"
              >
                ← Back
              </button>
              <button
                className="header-btn"
                onClick={handleRestart}
                title="Reset simulation to beginning"
              >
                ↺ Restart
              </button>
            </>
          )}

          <button
            className={`header-btn ${showDebugModal ? 'header-btn-active' : ''}`}
            onClick={() => setShowDebugModal(!showDebugModal)}
            title="Open Phase 2 / Phase 3 Developer Debug Inspector"
          >
            🛠️ Dev Debug
          </button>
        </div>
      </div>

      {/* Linear Stepper */}
      {stage !== 'HOME' && (
        <nav className="game-stepper" aria-label="Game Progress">
          {PLAYABLE_STAGES.map((s, idx) => {
            const currentIdx = PLAYABLE_STAGES.indexOf(stage);
            const isCompleted = idx < currentIdx;
            const isCurrent = s === stage;

            return (
              <div
                key={s}
                className={`stepper-step ${isCurrent ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
              >
                <span className="step-number">{idx + 1}</span>
                <span className="step-name">{STAGE_LABELS[s]}</span>
                {idx < PLAYABLE_STAGES.length - 1 && <span className="step-divider">›</span>}
              </div>
            );
          })}
        </nav>
      )}
    </header>
  );
}
