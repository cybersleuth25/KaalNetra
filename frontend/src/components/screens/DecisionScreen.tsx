/**
 * KaalNetra — Decision Screen
 *
 * PRD §7:
 *   Main component: 2×2 decision cards.
 *   Each card contains:
 *     - title
 *     - 1-sentence description
 *     - expected strategic trade-off
 *     - NO "correct/wrong" indicator
 *   Confirmation interaction:
 *     - Selecting a card highlights it
 *     - Confirmation bar appears
 *     - "Confirm Decision & Execute Order" applies the decision via the simulation engine
 *     - Enforces deterministic rule: NO state changes calculated in UI!
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import DialoguePanel, { type DialogueEntry } from '../common/DialoguePanel';
import { calculateConsequences } from '../../simulation';
import { ENVIRONMENTS } from '../../assets/registry';
import type { DecisionOption } from '../../data/types';

interface DecisionScreenProps {
  decisionNumber: 1 | 2;
}

export default function DecisionScreen({ decisionNumber }: DecisionScreenProps) {
  const { prevStage, goToStage } = useStage();
  const { scenario, session, applyPlayerDecision, error } = useGameplay();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  if (!scenario || !session) return null;

  // Select decision point based on decisionNumber
  const targetId = decisionNumber === 1 ? 'decision_1' : 'decision_2';
  const decisionPoint = scenario.decision_points.find((d) => d.id === targetId) ?? scenario.decision_points[0];

  const selectedOption: DecisionOption | undefined = decisionPoint.options.find(
    (o) => o.id === selectedOptionId
  );

  // Tactical council dialogue entries per decision
  const councilDialogueEntries: DialogueEntry[] = decisionNumber === 1
    ? [
        {
          characterId: 'jaimal',
          text: 'The outer battlements are our first line of salvation. Concentrating defenders on the curtains will deter direct ladder assaults, but risks casualties if Mughal siege guns open concentrated fire.',
          perspectiveTag: 'Commander\'s Assessment',
        },
        {
          characterId: 'patta',
          text: 'A fierce night sortie into the ravines will disrupt their sabat carpenters! Give me five hundred veteran Rajput blades and we will burn their rawhide mantlets before their tunnels reach our footings.',
          perspectiveTag: 'Vanguard Sortie Doctrine',
        },
        {
          characterId: 'resource_steward',
          text: 'Sorties and constant wall watches consume grain and water at an alarming rate. If we do not conserve rations, the Gaumukh reservoir will run dry long before the Mughal army tires.',
          perspectiveTag: 'Logistical Prudence',
        },
        {
          characterId: 'mirza_yusuf',
          text: 'The Padshah has ordered three great sabats driven directly toward Lakhota and Suraj Pol. Shielded by raw bull hides, our miners dig day and night undisturbed by their arrows.',
          perspectiveTag: 'Mughal Sapper Intelligence',
        },
      ]
    : [
        {
          characterId: 'jaimal',
          text: 'The subterranean mine blast has torn a catastrophic gap in the Lakhota curtain wall. Debris chokes the ditch. We must concentrate all available reserves at the breach immediately to hold the ruins!',
          perspectiveTag: 'Crisis Command',
        },
        {
          characterId: 'patta',
          text: 'The breach is a killing funnel for both sides. If we flank the breach from the surviving bastions with matchlocks and boiling oil, we can annihilate their storming column as they enter.',
          perspectiveTag: 'Breach Defense Tactics',
        },
        {
          characterId: 'resource_steward',
          text: 'Dust and fire threaten our water channels. Civilian non-combatants are panicking near the temples. We must maintain internal order and guard the cisterns against sabotage.',
          perspectiveTag: 'Internal Discipline',
        },
        {
          characterId: 'akbar',
          text: 'The Lakhota wall is shattered. Let the imperial assault divisions charge with musket and saber. Chittor\'s ancient ramparts will yield to imperial determination.',
          perspectiveTag: 'Imperial Command Mandate',
        },
      ];

  // Consequence preview calculated via pure engine function
  let preview = null;
  if (selectedOption) {
    preview = calculateConsequences(session.currentState, selectedOption);
  }

  // Handle confirmation
  const handleConfirmDecision = () => {
    if (!selectedOption) return;
    setIsConfirming(true);

    const success = applyPlayerDecision(decisionPoint.id, selectedOption.id);
    if (success) {
      if (decisionNumber === 1) {
        goToStage('SIMULATION_1');
      } else {
        goToStage('OUTCOME');
      }
    }
    setIsConfirming(false);
  };

  return (
    <div className="game-screen-container">
      <GameHeader badge="simulation" />

      <main className="decision-screen-layout">
        {/* Header Banner */}
        <div className="decision-header">
          <div className="decision-meta-row">
            <span className="badge-simulation">⚔️ Your Simulation</span>
            <span className="decision-stage-badge">
              Council Decision Point {decisionNumber} of 2
            </span>
            <span className="decision-turn-pill">
              Turn {session.currentState.turn} &bull; {session.currentState.date_label}
            </span>
          </div>

          <h1 className="decision-prompt">{decisionPoint.prompt}</h1>
          <p className="decision-subtext">
            Weigh each defensive directive carefully. Every choice permanently shifts your resources,
            fortifications, and survival odds against the Mughal siege machinery.
          </p>
        </div>

        {/* Global Error message if any */}
        {error && (
          <div className="game-error-banner">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Current State HUD */}
        <div className="decision-hud-wrap">
          <StateHUD state={session.currentState} />
        </div>

        {/* Tactical Counsel Deliberation Panel */}
        <div className="my-3">
          <DialoguePanel
            entries={councilDialogueEntries}
            title={decisionNumber === 1 ? 'Command Council Deliberation — Defense Posture' : 'Emergency Council Deliberation — Rampart Breach'}
          />
        </div>

        {/* Contextual & Map Visual Aid */}
        <div className="decision-context-strip">
          <div className="strategic-map-thumb-wrap">
            <img
              src={ENVIRONMENTS.strategic_map.src}
              alt="Strategic Map of Chittor Fort"
              className="strategic-map-thumb object-cover"
              style={{ aspectRatio: '16/9', maxHeight: '160px', width: '100%' }}
            />
            <span className="strategic-map-caption">
              Strategic Map &mdash; Chittor Fort Ramparts &amp; Mughal Encampments
            </span>
          </div>

          <div className="decision-intel-card">
            <h4>Tactical Intelligence</h4>
            <p>
              {decisionNumber === 1
                ? 'Mughal artillery under Akbar is establishing batteries on Chittori hill and constructing covered sabats toward the Lakhota Gate and Suraj Pol. The siege approaches will intensify next turn.'
                : 'Mughal mines have breached a major section of the lower ramparts. Debris chokes the breach as Mughal assault columns muster. Structural failure is imminent without immediate intervention.'}
            </p>
            {decisionPoint.trigger_condition && (
              <span className="trigger-note">
                Trigger condition met: <em>{decisionPoint.trigger_condition}</em>
              </span>
            )}
          </div>
        </div>

        {/* 2×2 Decision Cards Grid */}
        <section className="decision-grid-section">
          <h2 className="decision-grid-heading">Available Defensive Directives (Choose 1)</h2>

          <div className="decision-2x2-grid">
            {decisionPoint.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <div
                  key={option.id}
                  className={`decision-card ${isSelected ? 'decision-card-selected' : ''}`}
                  onClick={() => setSelectedOptionId(option.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedOptionId(option.id);
                    }
                  }}
                  id={`option-${option.id}`}
                >
                  <div className="card-selection-marker">
                    <span className="radio-circle">{isSelected ? '◉' : '○'}</span>
                    <span className="card-order-tag">Directive {option.id.split('_').pop()?.toUpperCase()}</span>
                  </div>

                  <h3 className="card-title">{option.title}</h3>
                  <p className="card-desc">{option.description}</p>

                  {/* Expected Strategic Trade-Offs */}
                  <div className="card-tradeoffs">
                    <span className="tradeoff-label">Expected Trade-Off:</span>
                    <div className="delta-chips">
                      {Object.entries(option.delta).map(([k, v]) => {
                        const num = v ?? 0;
                        const isGood = k === 'siege_progress' ? num < 0 : num > 0;
                        return (
                          <span
                            key={k}
                            className={`delta-chip ${isGood ? 'chip-benefit' : 'chip-cost'}`}
                          >
                            {k.replace('_', ' ')}: {num > 0 ? `+${num}` : num}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Confirmation Interaction Drawer */}
        {selectedOption && (
          <div className="decision-confirmation-dock">
            <div className="confirmation-dock-content">
              <div className="confirmation-summary">
                <span className="confirmation-eyebrow">Ready to Issue Directive</span>
                <h3>
                  Order: <em>"{selectedOption.title}"</em>
                </h3>
                <p>{selectedOption.description}</p>
              </div>

              {/* Consequence Preview Table */}
              {preview && (
                <div className="confirmation-preview-pills">
                  {preview.thresholdEffects.length > 0 && (
                    <div className="threshold-warning-pill">
                      ⚠️ Triggers {preview.thresholdEffects.length} threshold rule(s)
                    </div>
                  )}
                </div>
              )}

              <div className="confirmation-actions">
                <button
                  className="game-btn game-btn-primary game-btn-lg"
                  onClick={handleConfirmDecision}
                  disabled={isConfirming}
                  id="confirm-decision-btn"
                >
                  {isConfirming ? 'Dispatching Orders...' : 'Confirm Decision & Execute Order &rarr;'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back navigation */}
        <footer className="screen-footer" style={{ marginTop: '2rem' }}>
          <button className="game-btn game-btn-secondary" onClick={prevStage}>
            &larr; Back to Previous
          </button>
        </footer>
      </main>
    </div>
  );
}
