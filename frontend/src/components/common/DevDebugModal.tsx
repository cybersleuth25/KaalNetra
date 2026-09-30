/**
 * KaalNetra — Developer Debug Modal
 *
 * Allows developers and reviewers to inspect Phase 2 Scenario Data
 * and Phase 3 Simulation Engine at any point in the gameplay flow.
 */

import { useState } from 'react';
import { useGameplay } from '../../app/GameplayContext';
import ScenarioDebugScreen from '../screens/ScenarioDebugScreen';
import SimulationDebugScreen from '../screens/SimulationDebugScreen';

export default function DevDebugModal() {
  const { showDebugModal, setShowDebugModal } = useGameplay();
  const [tab, setTab] = useState<'scenario' | 'simulation'>('simulation');

  if (!showDebugModal) return null;

  return (
    <div className="dev-modal-backdrop" onClick={() => setShowDebugModal(false)}>
      <div className="dev-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="dev-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="dev-modal-title">🛠️ Developer Inspection Console</span>
            <div className="dev-modal-tabs">
              <button
                className={`dev-modal-tab ${tab === 'scenario' ? 'tab-active' : ''}`}
                onClick={() => setTab('scenario')}
              >
                Phase 2: Scenario Data
              </button>
              <button
                className={`dev-modal-tab ${tab === 'simulation' ? 'tab-active' : ''}`}
                onClick={() => setTab('simulation')}
              >
                Phase 3: Simulation Engine
              </button>
            </div>
          </div>

          <button
            className="dev-modal-close"
            onClick={() => setShowDebugModal(false)}
            aria-label="Close Debug Modal"
          >
            ✕
          </button>
        </div>

        <div className="dev-modal-body">
          {tab === 'scenario' ? <ScenarioDebugScreen /> : <SimulationDebugScreen />}
        </div>
      </div>
    </div>
  );
}
