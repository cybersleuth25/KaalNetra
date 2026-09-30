/**
 * KaalNetra — Simulation Turn Screen
 *
 * PRD §8:
 *   Layout:
 *     - Header: CHITTOR 1567 | TURN 1 (or 2)
 *     - Left: Map / Environmental Scene (fort walls or siege camp)
 *     - Right: StateHUD with animated deltas (Food, Water, Defenders, Morale, Fort, Siege)
 *     - Bottom: Event log with causal sentence & triggered thresholds
 *   Labels:
 *     - [ Your Simulation ]
 *     - [ Simulation Result ]
 *   CTA:
 *     - "Proceed to Council Decision 2" (or "View Final Outcome" if simulation ended)
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import PhaserTacticalMap from '../map/PhaserTacticalMap';
import DialoguePanel, { type DialogueEntry } from '../common/DialoguePanel';
import { ENVIRONMENTS } from '../../assets/registry';

export default function SimulationScreen() {
  const { goToStage } = useStage();
  const { session, lastTurnResult } = useGameplay();
  const [viewMode, setViewMode] = useState<'map' | 'scene'>('map');

  if (!session || !lastTurnResult) {
    return (
      <div className="game-screen-container">
        <GameHeader badge="simulation" />
        <div className="game-error-card">
          <p>Simulation turn data not found. Please make a decision first.</p>
          <button className="game-btn game-btn-primary" onClick={() => goToStage('DECISION_1')}>
            Go to Decision 1
          </button>
        </div>
      </div>
    );
  }

  const {
    turn,
    state_after,
    effects,
    event_description,
    thresholdEffects,
    events,
    endCondition,
  } = lastTurnResult;

  const isComplete = session.isComplete || endCondition !== null;

  const handleProceed = () => {
    if (isComplete) {
      goToStage('OUTCOME');
    } else {
      goToStage('DECISION_2');
    }
  };

  const simulationDialogues: DialogueEntry[] = [
    {
      characterId: 'jaimal',
      speakerName: 'Rao Jaimal Rathore',
      title: 'Post-Turn Field Assessment',
      text: turn === 1
        ? 'The defensive orders slowed their sap construction along the eastern ravine, but every exchange chips away at our masonry. The men need to see their commanders on the parapets.'
        : 'The breaches are contested with fury. We are holding the line at tremendous cost, but their heavy cannon battery on Chittori hill continues its relentless barrage.',
      perspectiveTag: 'Garrison Command Report',
    },
    {
      characterId: 'mirza_yusuf',
      speakerName: 'Mirza Yusuf Khan',
      title: 'Mughal Sapper Observation',
      text: turn === 1
        ? 'The garrison is vigilant. Their night sortie inflicted losses on our woodcutters, but the Padshah has ordered three thousand more laborers from Ajmer. The sabat advances regardless.'
        : 'Our mines have done their work on the Lakhota curtain. Even as Rajput swordsmen fill the breach, imperial mortar fire will prevent them from raising permanent masonry.',
      perspectiveTag: 'Imperial Sapper Log',
    },
  ];

  return (
    <div className="game-screen-container">
      <GameHeader badge="result" />

      <main className="simulation-screen-layout">
        {/* Header Strip */}
        <div className="simulation-turn-header">
          <div className="simulation-badge-group">
            <span className="badge-simulation">⚔️ Your Simulation</span>
            <span className="badge-result">⚡ Simulation Result</span>
            <span className="simulation-date-pill">{state_after.date_label}</span>
          </div>

          <div className="simulation-turn-indicator">
            <span className="turn-label">Resolved Turn:</span>
            <span className="turn-number">Turn {turn} of 5</span>
          </div>
        </div>

        {/* 2-Column Split: Scene Left, HUD Right */}
        <div className="simulation-split-grid">
          {/* Left Column: Environmental Scene & Character Reaction */}
          <div className="simulation-scene-pane flex flex-col gap-3">
            {/* View Switcher Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-700'
                }`}
              >
                <span>🗺️</span>
                <span>Tactical Map (Interactive Phaser)</span>
              </button>
              <button
                onClick={() => setViewMode('scene')}
                className={`text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  viewMode === 'scene'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'bg-stone-800 text-stone-300 hover:text-amber-200 border border-stone-700'
                }`}
              >
                <span>🏰</span>
                <span>Ramparts Scene</span>
              </button>
            </div>

            {/* Interactive Phaser Map View or Static Environment View */}
            {viewMode === 'map' ? (
              <PhaserTacticalMap height={320} />
            ) : (
              <div className="simulation-scene-frame">
                <img
                  src={
                    turn === 1
                      ? ENVIRONMENTS.fort_walls.src
                      : ENVIRONMENTS.mughal_siege_camp.src
                  }
                  alt="Siege environment"
                  className="simulation-scene-img object-cover rounded-md"
                  style={{ aspectRatio: '16/9', maxHeight: '320px', width: '100%' }}
                />
                <div className="scene-overlay-tag">
                  {turn === 1
                    ? 'Curtain Walls of Chittor &mdash; Sector Reinforcements'
                    : 'Mughal Imperial Battery &amp; Sapping Approaches'}
                </div>
              </div>
            )}

            {/* Character Reaction Dialogue Panel */}
            <DialoguePanel
              entries={simulationDialogues}
              title="Field Intelligence &amp; Sapper Assessment"
            />
          </div>

          {/* Right Column: State Parameters & Deltas */}
          <div className="simulation-hud-pane">
            <div className="hud-pane-header">
              <h3>State Transition (Turn {turn})</h3>
              <span className="hud-subtext">Passive drain + decision deltas applied</span>
            </div>

            {/* State HUD with net effects deltas */}
            <StateHUD
              state={state_after}
              deltas={effects}
              sustainability={Math.round(
                (state_after.food + state_after.water + state_after.defenders +
                  state_after.morale + state_after.fort_integrity + (100 - state_after.siege_progress)) / 6
              )}
            />

            {/* Critical Warnings if any */}
            {endCondition && (
              <div className="end-condition-alert">
                <span className="alert-icon">⚠️</span>
                <div>
                  <strong>Critical Threshold Met:</strong> {endCondition.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Event Log & Causal Result Feedback */}
        <section className="simulation-event-log-section">
          <div className="event-log-header">
            <h3>Causal Consequence &amp; Tactical Events</h3>
            <span className="event-count-badge">{events.length + thresholdEffects.length} Event(s) Recorded</span>
          </div>

          <div className="event-log-card">
            {/* Primary Order Outcome */}
            <div className="primary-event-row">
              <span className="event-icon">📜</span>
              <div className="primary-event-text">
                <h4>Decision Consequence</h4>
                <p>{event_description}</p>
              </div>
            </div>

            {/* Threshold Rules Triggered */}
            {thresholdEffects.length > 0 && (
              <div className="threshold-events-group">
                <span className="threshold-group-label">Threshold Triggers:</span>
                {thresholdEffects.map((te, i) => (
                  <div key={i} className="threshold-item">
                    <span className="threshold-dot">●</span>
                    <div>
                      <strong>{te.description}</strong> &mdash; Condition: <code>{te.condition}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Engine Sub-events */}
            {events.length > 0 && (
              <div className="sub-events-list">
                {events.map((ev) => (
                  <div key={ev.id} className="sub-event-item">
                    <span className="sub-event-title">{ev.title}</span>
                    <span className="sub-event-desc">{ev.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="screen-footer">
          <button
            className="game-btn game-btn-primary game-btn-lg"
            onClick={handleProceed}
            id="proceed-next-turn-btn"
          >
            {isComplete ? 'Proceed to Final Outcome &rarr;' : 'Proceed to Council Decision 2 &rarr;'}
          </button>
        </footer>
      </main>
    </div>
  );
}
