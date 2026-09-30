/**
 * KaalNetra — Final Outcome Screen
 *
 * PRD §10:
 *   Header: "YOUR SIMULATION vs DOCUMENTED HISTORY"
 *   Left: Counterfactual path (Your Simulation)
 *   Right: Canonical path (Documented History)
 *   Center: Divergence marker / "What differs?" panel
 *   Clearly label:
 *     - [ Historical Record ]
 *     - [ Your Simulation ]
 *     - [ Simulation Result ]
 *   Reset / Restart actions to repeat or try alternate decisions.
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import CharacterPortrait from '../common/CharacterPortrait';
import type { OutcomeTier } from '../../data/types';

const TIER_METADATA: Record<
  OutcomeTier,
  { label: string; badgeClass: string; title: string; description: string }
> = {
  resilient_defense: {
    label: 'Resilient Defense',
    badgeClass: 'tier-resilient',
    title: 'Garrison Held with Resilient Strength',
    description:
      'Through disciplined allocation and timely counteraction, the garrison held the breaches with sustainable morale and fortifications intact. While ultimate Mughal pressure remained immense, the defense proved exceptionally durable.',
  },
  strained_defense: {
    label: 'Strained Defense',
    badgeClass: 'tier-strained',
    title: 'Defensive Lines Held Under Severe Strain',
    description:
      'The garrison weathered the primary Mughal assaults, but supplies and structural defenses have been degraded to perilous margins. The citadel survived the initial crisis at heavy logistical and human cost.',
  },
  critical_defense: {
    label: 'Critical Defense',
    badgeClass: 'tier-critical',
    title: 'Defence on the Verge of Complete Collapse',
    description:
      'Severe shortages of water, grain, or combat troops brought Chittor to the brink of disintegration. Resistance continues only in pockets, vulnerable to any subsequent imperial assault.',
  },
  collapse: {
    label: 'Defensive Collapse',
    badgeClass: 'tier-collapse',
    title: 'Citadel Defenses Overwhelmed',
    description:
      'The ramparts or garrison cohesion collapsed before imperial bombardment, sapping, or starvation. The fortress fell under direct assault matching the tragic culmination of the historical siege.',
  },
};

export default function OutcomeScreen() {
  const { goToStage, reset: resetStage } = useStage();
  const { scenario, session, restart } = useGameplay();
  const [showHistoryLog, setShowHistoryLog] = useState<boolean>(false);

  if (!scenario || !session) return null;

  const outcomeTier: OutcomeTier = session.outcomeTier ?? 'strained_defense';
  const tierInfo = TIER_METADATA[outcomeTier];
  const history = session.turnHistory;

  const handleRestart = () => {
    restart();
    goToStage('BRIEFING');
  };

  const handleFullReset = () => {
    restart();
    resetStage();
  };

  return (
    <div className="game-screen-container">
      <GameHeader badge="result" />

      <main className="outcome-screen-layout">
        {/* Outcome Tier Banner */}
        <section className={`outcome-hero-banner ${tierInfo.badgeClass}`}>
          <div className="outcome-hero-content">
            <span className="outcome-eyebrow">Simulation Concluded</span>
            <div className="outcome-tier-pill">{tierInfo.label}</div>
            <h1 className="outcome-hero-title">{tierInfo.title}</h1>
            <p className="outcome-hero-desc">{tierInfo.description}</p>
          </div>
        </section>

        {/* Final State HUD */}
        <section className="outcome-hud-section">
          <StateHUD state={session.currentState} />
        </section>

        {/* Comparison Header */}
        <div className="comparison-section-header">
          <h2 className="comparison-title">YOUR SIMULATION vs DOCUMENTED HISTORY</h2>
          <p className="comparison-subtitle">
            Analyzing divergence between the defensive orders you issued and the documented historical record.
          </p>
        </div>

        {/* 2-Column Split: Simulation Left, History Right */}
        <div className="outcome-comparison-grid">
          {/* Left Column: Your Simulation */}
          <div className="comparison-column sim-column">
            <div className="column-header">
              <span className="badge-simulation">⚔️ Your Simulation</span>
              <h3>Simulated Trajectory</h3>
            </div>

            <div className="sim-summary-card">
              <h4>Decisions Executed ({history.length}):</h4>
              <ul className="executed-orders-list">
                {history.map((turnRes) => (
                  <li key={turnRes.turn}>
                    <span className="order-turn">Turn {turnRes.turn} ({turnRes.state_after.date_label}):</span>
                    <strong> {turnRes.decision_id} &rarr; {turnRes.option_id}</strong>
                    <p className="order-desc">{turnRes.event_description}</p>
                  </li>
                ))}
              </ul>

              <div className="sim-metric-recap">
                <div className="recap-stat">
                  <span>Defenders Preserved:</span>
                  <strong>{session.currentState.defenders}%</strong>
                </div>
                <div className="recap-stat">
                  <span>Rampart Integrity:</span>
                  <strong>{session.currentState.fort_integrity}%</strong>
                </div>
                <div className="recap-stat">
                  <span>Mughal Siege Progress:</span>
                  <strong>{session.currentState.siege_progress}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Canonical Documented History */}
          <div className="comparison-column canon-column">
            <div className="column-header">
              <span className="badge-historical">📜 Documented Historical Record</span>
              <h3>Documented Canonical History</h3>
            </div>

            <div className="canon-summary-card">
              <h4>Historical Culmination (February 1568):</h4>
              <p>
                In documented history, Akbar’s siege engineers drove covered sabats directly to the curtain walls
                and detonated subterranean gunpowder mines at the Lakhota gate, blowing open massive breaches.
              </p>

              {/* Key Historical Figures Visual Anchor */}
              <div className="flex items-center gap-3 my-3 p-2.5 bg-stone-950/70 border border-amber-600/25 rounded-md">
                <CharacterPortrait characterIdOrKey="jaimal" size="sm" showBadge={false} />
                <CharacterPortrait characterIdOrKey="patta" size="sm" showBadge={false} />
                <div className="text-left text-xs text-stone-300">
                  <p className="font-serif font-bold text-amber-200">Rao Jaimal &amp; Rawat Patta</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Commanders of the garrison. Both fell in the breach during the final imperial storm on February 22–23, 1568.
                  </p>
                </div>
              </div>

              <p>
                On the night of February 22, 1568, while inspecting breach repairs, commander <strong>Rao Jaimal Rathore</strong> was
                struck and killed by a musket shot fired by Emperor Akbar personally (recorded as the matchlock <em>Sangram</em> in the <em>Akbarnama</em>).
              </p>
              <p>
                Deprived of their chief commander, the defenders performed the sacred rites:
                the <strong>Jauhar</strong> (ritual self-immolation of Rajput women to prevent capture) and the
                <strong> Saka</strong> (a fight to the last man in saffron robes led by the 16-year-old Patta Chundawat).
                Chittor fell to imperial forces on February 23, 1568.
              </p>

              <div className="canon-citation-tag">
                Sources: <em>Akbarnama</em> (Abu’l-Fazl) &bull; <em>Muntakhab-ut-Tawarikh</em> (Badauni) &bull; Somani (1976)
              </div>
            </div>
          </div>
        </div>

        {/* Divergence Analysis Panel */}
        <section className="divergence-analysis-card">
          <div className="divergence-header">
            <span className="divergence-icon">⚖️</span>
            <h3>Key Historical Divergence Insights</h3>
          </div>
          <div className="divergence-points">
            <div className="divergence-point">
              <h4>1. Fortification Integrity</h4>
              <p>
                In history, mines breached the walls by late February 1568. In your simulation, fort integrity ended at{' '}
                <strong>{session.currentState.fort_integrity}%</strong>, reflecting your emphasis on structural repair versus sorties.
              </p>
            </div>
            <div className="divergence-point">
              <h4>2. Combat Strength &amp; Morale</h4>
              <p>
                Historically, garrison cohesion shattered upon the death of Jaimal. Your simulation maintained garrison morale at{' '}
                <strong>{session.currentState.morale}%</strong> with <strong>{session.currentState.defenders}%</strong> surviving defenders.
              </p>
            </div>
            <div className="divergence-point">
              <h4>3. The Role of Counteraction</h4>
              <p>
                The historical record notes sporadic counter-sorties that slowed imperial sabats but could not halt concentrated mining.
                Your decision choices demonstrate how shifting garrison resources alters the siege timetable.
              </p>
            </div>
          </div>
        </section>

        {/* Collapsible Full Event History Log */}
        <section className="full-history-accordion">
          <button
            className="accordion-toggle-btn"
            onClick={() => setShowHistoryLog(!showHistoryLog)}
          >
            <span>{showHistoryLog ? '▼ Hide Complete Event Log' : '▶ Inspect Complete Turn-by-Turn Simulation Log'}</span>
            <span className="log-count">{history.length} turns recorded</span>
          </button>

          {showHistoryLog && (
            <div className="accordion-content">
              {history.map((turnRes) => (
                <div key={turnRes.turn} className="history-turn-entry">
                  <div className="history-turn-header">
                    <strong>Turn {turnRes.turn} ({turnRes.state_after.date_label})</strong>
                    <span>Order: <code>{turnRes.decision_id} &rarr; {turnRes.option_id}</code></span>
                  </div>
                  <p>{turnRes.event_description}</p>
                  <div className="history-affected-vars">
                    Affected variables: {turnRes.affected_variables.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Action Controls */}
        <footer className="screen-footer outcome-actions">
          <button
            className="game-btn game-btn-secondary"
            onClick={handleFullReset}
            id="return-home-btn"
          >
            ← Return to Home
          </button>

          <button
            className="game-btn game-btn-secondary"
            onClick={handleRestart}
            id="try-alternate-path-btn"
          >
            ↺ Try Alternate Path
          </button>

          <button
            className="game-btn game-btn-primary game-btn-lg"
            onClick={() => goToStage('COMPARE')}
            id="explore-comparison-btn"
          >
            Explore Comparative Timeline &amp; Analysis &rarr;
          </button>
        </footer>
      </main>
    </div>
  );
}
