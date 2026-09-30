/**
 * KaalNetra — Scenario Selection Screen
 *
 * Immersive historical campaign selector.
 * Features:
 *   CHITTOR FORT
 *   1567–1568 CE
 *   The Defense of Chittor
 *   [ Begin Scenario ]
 * Solid dark basalt background, antique gold frames, zero gradients.
 */

import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';

export default function ScenarioSelectScreen() {
  const { nextStage } = useStage();
  const { scenario, isLoading, error } = useGameplay();

  if (isLoading) {
    return (
      <div className="app-page-clean">
        <GameHeader />
        <div className="clean-content-box py-16 text-center m-8">
          <p className="text-[#B8B09F]">Unrolling historical war records...</p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="app-page-clean">
        <GameHeader />
        <div className="clean-content-box py-16 text-center m-8 border-[#9E2A2B]">
          <h3 className="serif-title text-xl text-[#DFBE76] mb-2">Scenario Unavailable</h3>
          <p className="text-[#B8B09F]">{error ?? 'Scenario data could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page-clean">
      <GameHeader />

      <main className="clean-container py-10">
        <div className="scenario-select-intro mb-8">
          <div className="text-kicker">Choose a Mission</div>
          <h1 className="serif-heading text-3xl md:text-5xl text-[#F4EFE6] mt-1">
            Historical Battles &amp; Sieges
          </h1>
          <p className="text-[#B8B09F] text-base max-w-2xl mt-2 leading-relaxed">
            Step into the shoes of fort commanders at pivotal crossroads in Indian history. Test your defense strategy against overwhelming imperial odds.
          </p>
        </div>

        {/* Primary Scenario Card */}
        <section className="scenario-featured-panel">
          <div className="scenario-panel-grid">
            {/* Visual Column */}
            <div className="scenario-panel-visual">
              <picture>
                <source srcSet="/assets/environments/chittor_overview.webp" type="image/webp" />
                <img
                  src="/assets/environments/chittor_overview.png"
                  alt="The Fortress of Chittor"
                  className="scenario-panel-img"
                />
              </picture>
            </div>

            {/* Content Column */}
            <div className="scenario-panel-content">
              <div className="scenario-header-meta">
                <span className="text-[#C5A059] font-mono uppercase text-xs tracking-wider">
                  Mewar, Rajasthan
                </span>
                <span className="scenario-status-tag">Campaign Ready</span>
              </div>

              <div className="scenario-title-group">
                <span className="scenario-caps-label">CHITTORGARH FORTRESS</span>
                <span className="scenario-date-range">Year 1567&ndash;1568 CE</span>
                <h2 className="scenario-name">The Defense of Chittor</h2>
              </div>

              <p className="scenario-description">
                Emperor Akbar has arrived with 60,000 soldiers to conquer Chittor Fort. 
                Inside the 500-foot rock plateau, 8,000 Rajput defenders and 30,000 citizens are trapped. 
                As a war council commander, choose how to manage food, cistern water, and counter-attacks.
              </p>

              <div className="scenario-commanders-list">
                <span className="commanders-title">Key Leaders in this Battle:</span>
                <p className="commanders-names">
                  Rao Jaimal Rathore (Principal Defender) &bull; Rawat Patta (Sortie Commander) &bull; Emperor Akbar (Imperial Besieger)
                </p>
              </div>

              <div className="scenario-action-box">
                <button
                  className="btn-primary-clean"
                  onClick={nextStage}
                >
                  Start This Battle &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
