/**
 * KaalNetra — Scenario Selection Screen
 *
 * PRD §4:
 *   MVP has only one playable card:
 *   "The Siege of Chittor"
 *   "1567–1568 | Mewar | Historical Simulation"
 *   Button: "Begin Simulation"
 */

import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';

export default function ScenarioSelectScreen() {
  const { nextStage } = useStage();
  const { scenario, isLoading, error } = useGameplay();

  if (isLoading) {
    return (
      <div className="game-screen-container">
        <GameHeader />
        <div className="game-loading-card">
          <div className="loading-spinner" />
          <p>Loading historical scenarios...</p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="game-screen-container">
        <GameHeader />
        <div className="game-error-card">
          <h3>Unable to Load Scenario</h3>
          <p>{error ?? 'Scenario data unavailable'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen-container">
      <GameHeader />

      <main className="scenario-select-layout">
        <div className="scenario-select-header">
          <span className="section-eyebrow">Campaign Selection</span>
          <h1 className="scenario-select-title">Historical Scenarios</h1>
          <p className="scenario-select-subtitle">
            Select a turning point in history to analyze defensive decisions and their systemic outcomes.
          </p>
        </div>

        <div className="scenario-card-grid">
          {/* Active Scenario Card: Chittor 1567 */}
          <div className="scenario-card active-card">
            <div className="scenario-card-media">
              <img
                src="/assets/environments/chittor_overview.png"
                alt="Chittor Fort at dusk"
                className="scenario-card-img"
              />
              <div className="scenario-card-badge">Available</div>
            </div>

            <div className="scenario-card-content">
              <div className="scenario-meta">
                <span className="scenario-dates">{scenario.period}</span>
                <span className="scenario-dot">&bull;</span>
                <span className="scenario-loc">{scenario.location}</span>
                <span className="scenario-dot">&bull;</span>
                <span className="scenario-genre">Historical Simulation</span>
              </div>

              <h2 className="scenario-title">{scenario.title}</h2>

              <p className="scenario-desc">
                Akbar’s Mughal forces encircle the colossal citadel of Mewar.
                As a decision-maker within the defensive command, determine logistical, garrison,
                and fortification orders under mounting siege pressure.
              </p>

              <div className="scenario-actors-preview">
                <span className="actors-label">Key Figures:</span>
                <div className="actor-tags">
                  <span className="actor-tag">Rao Jaimal Rathore (Commander)</span>
                  <span className="actor-tag">Patta Chundawat (Commander)</span>
                  <span className="actor-tag">Emperor Akbar (Opposing)</span>
                </div>
              </div>

              <div className="scenario-card-footer">
                <div className="scenario-stats-pill">
                  <span>Starting Garrison: 8,000</span>
                  <span>&bull;</span>
                  <span>Besiegers: ~50,000+</span>
                </div>

                <button
                  className="game-btn game-btn-primary"
                  onClick={nextStage}
                  id="begin-simulation-btn"
                >
                  Begin Simulation &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Locked / Future Scenario Placeholder */}
          <div className="scenario-card locked-card">
            <div className="scenario-card-media locked-media">
              <div className="locked-overlay">
                <span className="locked-icon">🔒</span>
                <span>Coming Soon</span>
              </div>
            </div>
            <div className="scenario-card-content">
              <div className="scenario-meta">
                <span>1576 &bull; Mewar</span>
              </div>
              <h2 className="scenario-title" style={{ opacity: 0.7 }}>Battle of Haldighati</h2>
              <p className="scenario-desc" style={{ opacity: 0.6 }}>
                Maharana Pratap confronts Man Singh’s imperial vanguard in the narrow mountain defile.
              </p>
              <div className="scenario-card-footer">
                <button className="game-btn game-btn-disabled" disabled>
                  Locked
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
