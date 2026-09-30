/**
 * KaalNetra — Simulation vs. History (Signature Screen)
 *
 * Implements Section 10 of design specification:
 *   - Dramatic split-screen comparison:
 *       LEFT:
 *         YOUR DECISION & SIMULATED OUTCOME
 *         Dark charcoal (#161412 / #11110F), battle imagery, subtle red/brown accents
 *         Clearly labeled as hypothetical counterfactual model
 *         "Your decision produced..."
 *       RIGHT:
 *         WHAT ACTUALLY HAPPENED & HISTORICAL RECORD
 *         Aged parchment (#E8D7B3), dark text (#29231B), manuscript imagery, warm gold accents
 *         Clearly labeled as documented historical record
 *         "Historical records show..."
 *       CENTER:
 *         Large circular "VS" marker with thin gold divider
 *   - Below:
 *       COMPARE YOUR DECISION WITH HISTORY
 *       Why Are They Different? (Constraints, Resources, Geography, Technology, Military Balance, Information Limitations)
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import PlayerTimeline from '../timeline/PlayerTimeline';
import CanonicalTimeline from '../timeline/CanonicalTimeline';
import EvidenceDrawer from '../common/EvidenceDrawer';
import { ENVIRONMENTS } from '../../assets/registry';

export default function CompareScreen() {
  const { goToStage, prevStage } = useStage();
  const { scenario, session } = useGameplay();
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);

  if (!scenario || !session) return null;

  const history = session.turnHistory;

  return (
    <div className="app-page-clean">
      <GameHeader badge="result" />

      <main className="clean-container py-10 sm:py-14 space-y-12">
        {/* Screen Header */}
        <header className="pb-6 border-b border-[#2B251D] space-y-2">
          <div className="text-kicker">Signature Historical Analysis</div>
          <h1 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4E9D0] tracking-wide">
            SIMULATION VS HISTORY
          </h1>
          <p className="text-sm sm:text-base text-[#D8C9AA] max-w-3xl leading-relaxed">
            Side-by-side comparative analysis between your simulated strategic choices and the documented historical record of the 1567&ndash;1568 siege.
          </p>

          {/* Educational Principle Notice */}
          <div className="p-4 bg-[#161412] border-l-4 border-l-[#B99652] border-[#2B251D] text-xs text-[#D8C9AA] mt-4 space-y-1">
            <strong className="text-[#D1B16A] uppercase font-mono tracking-wider block">
              Historiographical Integrity Notice:
            </strong>
            <p className="leading-relaxed">
              The <strong>Left column</strong> reflects your hypothetical counterfactual simulation based on player decrees. 
              The <strong>Right column</strong> reflects immutable documented history recorded in 16th-century chronicles. 
              Simulation demonstrates potential consequence; primary sources demonstrate actual reality.
            </p>
          </div>
        </header>

        {/* Section 1: Dramatic Split-Screen Comparison */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <div className="text-kicker justify-center mb-1">Comparative Timeline</div>
            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl text-[#F4E9D0] font-bold">
              COMPARE YOUR DECISION WITH HISTORY
            </h2>
          </div>

          <div className="relative">
            {/* Split Screen Grid */}
            <div className="split-comparison-container">
              
              {/* LEFT SIDE: YOUR DECISION / SIMULATED OUTCOME */}
              <div className="split-pane-simulated corner-ornament space-y-5">
                {/* Header Badge */}
                <div className="border-b border-[#2B251D] pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FFA5A5] font-bold">
                      Hypothetical Simulation
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#221010] border border-[#8C2D2E] text-[#FFA5A5]">
                      Counterfactual
                    </span>
                  </div>
                  <h3 className="font-['Cinzel'] text-2xl font-bold text-[#F4E9D0]">
                    YOUR DECISION &bull; SIMULATED OUTCOME
                  </h3>
                  <p className="text-xs text-[#8F8270] italic">
                    &ldquo;Your decision produced a branch diverging from the historical record.&rdquo;
                  </p>
                </div>

                {/* Historical Battle Imagery Snippet with Dark Charcoal Overlay */}
                <div className="relative h-32 overflow-hidden border border-[#2B251D]">
                  <picture>
                    <source srcSet={ENVIRONMENTS.mughal_siege_camp.src} type="image/webp" />
                    <img
                      src={ENVIRONMENTS.mughal_siege_camp.fallbackSrc ?? ENVIRONMENTS.mughal_siege_camp.src}
                      alt="Battlefield Simulation"
                      className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.2]"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#D8C9AA]">
                    Simulated Battlefield Theater &bull; Counterfactual Model
                  </div>
                </div>

                {/* Player Timeline Component */}
                <PlayerTimeline history={history} />
              </div>

              {/* RIGHT SIDE: WHAT ACTUALLY HAPPENED / HISTORICAL RECORD */}
              <div className="split-pane-historical corner-ornament space-y-5">
                {/* Header Badge */}
                <div className="border-b border-[#A38C65]/50 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#54493B] font-bold">
                      Documented History
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#E0CEA4] border border-[#A38C65] text-[#29231B] font-bold">
                      Primary Record
                    </span>
                  </div>
                  <h3 className="font-['Cinzel'] text-2xl font-bold text-[#29231B]">
                    WHAT ACTUALLY HAPPENED &bull; HISTORICAL RECORD
                  </h3>
                  <p className="text-xs text-[#54493B] italic">
                    &ldquo;Historical records show the documented sequence of events in 1568.&rdquo;
                  </p>
                </div>

                {/* Historical Manuscript Imagery Snippet */}
                <div className="relative h-32 overflow-hidden border border-[#A38C65]">
                  <picture>
                    <source srcSet={ENVIRONMENTS.strategic_map.src} type="image/webp" />
                    <img
                      src={ENVIRONMENTS.strategic_map.fallbackSrc ?? ENVIRONMENTS.strategic_map.src}
                      alt="Historical Manuscript"
                      className="w-full h-full object-cover filter sepia-[0.35] brightness-[0.9]"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#E8D7B3] via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#29231B] font-bold">
                    Contemporaneous Archival Chronicles &bull; Akbarnama &amp; Bada&apos;uni
                  </div>
                </div>

                {/* Canonical Timeline Component */}
                <CanonicalTimeline
                  timeline={scenario.canonical_timeline}
                  evidenceList={scenario.evidence}
                  onSelectEvidence={(id) => setActiveEvidenceId(id)}
                />
              </div>
            </div>

            {/* Central Circular "VS" Marker & Thin Gold Divider (Desktop) */}
            <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 z-20 flex-col items-center pointer-events-none">
              <div className="vs-badge-circle shadow-[0_0_16px_rgba(209,177,106,0.35)]">
                VS
              </div>
              <div className="w-[1px] h-[580px] bg-gradient-to-b from-[#B99652] via-[#B99652]/30 to-transparent mt-3" />
            </div>

            {/* Mobile / Tablet VS Pill */}
            <div className="flex lg:hidden justify-center my-2 z-20">
              <div className="vs-badge-circle">
                VS
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Why Are They Different? (Historiographical Factors) */}
        <section className="historical-card p-6 sm:p-10 corner-ornament space-y-8">
          <div className="border-b border-[#2B251D] pb-4">
            <div className="text-kicker">Historiographical Explanation</div>
            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#F4E9D0] mt-1">
              Why Are They Different?
            </h2>
            <p className="text-xs sm:text-sm text-[#D8C9AA] mt-1 leading-relaxed">
              Six systemic historical factors that bound the real outcome at Chittor and distinguish recorded reality from simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-[#D8C9AA] leading-relaxed">
            {/* 1. Constraints */}
            <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B99652] font-bold block">Factor 01 &bull; Operational</span>
              <h3 className="font-['Cinzel'] font-bold text-[#F4E9D0] text-sm">
                1. No Relief Army
              </h3>
              <p>
                Akbar’s army completely surrounded the mountain. King Udai Singh was fighting in the hills to preserve the kingdom, so no outside rescue army could ever break through.
              </p>
            </div>

            {/* 2. Resources */}
            <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B99652] font-bold block">Factor 02 &bull; Logistical</span>
              <h3 className="font-['Cinzel'] font-bold text-[#F4E9D0] text-sm">
                2. Finite Food &amp; Water
              </h3>
              <p>
                The fort had only the grain in its towers and rainwater in rock cisterns. Because the perimeter was sealed, no additional provisions could enter across four months.
              </p>
            </div>

            {/* 3. Geography */}
            <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B99652] font-bold block">Factor 03 &bull; Topographical</span>
              <h3 className="font-['Cinzel'] font-bold text-[#F4E9D0] text-sm">
                3. The 8-Mile Perimeter
              </h3>
              <p>
                Chittor stood 500 feet high on a steep cliff, making ladder attacks impossible. But its 8-mile curtain wall was so extensive that 8,000 defenders were spread precariously thin.
              </p>
            </div>

            {/* 4. Technology */}
            <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B99652] font-bold block">Factor 04 &bull; Technological</span>
              <h3 className="font-['Cinzel'] font-bold text-[#F4E9D0] text-sm">
                4. Covered Sabats &amp; Gunpowder
              </h3>
              <p>
                Akbar brought 5,000 diggers who constructed bullet-proof wooden tunnels (sabats) right up to the walls, then buried barrels of gunpowder to shatter the masonry from below.
              </p>
            </div>

            {/* 5. Military Balance */}
            <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B99652] font-bold block">Factor 05 &bull; Force Ratios</span>
              <h3 className="font-['Cinzel'] font-bold text-[#F4E9D0] text-sm">
                5. 8,000 vs. 60,000 Soldiers
              </h3>
              <p>
                The 8,000 Rajput defenders were outnumbered almost 8 to 1. Akbar commanded limitless imperial reserves, heavy bronze siege ordnance, and musketeers from across India.
              </p>
            </div>

            {/* 6. Information Limitations */}
            <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#B99652] font-bold block">Factor 06 &bull; Fog of War</span>
              <h3 className="font-['Cinzel'] font-bold text-[#F4E9D0] text-sm">
                6. Subterranean Blind Spots
              </h3>
              <p>
                Defenders could not see through heavy artillery smoke or detect the exact location of underground mine shafts until the powder charges were detonated.
              </p>
            </div>
          </div>
        </section>

        {/* Transition Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2B251D]">
          <button
            type="button"
            className="btn-historical-secondary text-xs py-2.5 px-5"
            onClick={prevStage}
          >
            &larr; Back to Final Outcome
          </button>
          
          <button
            type="button"
            className="btn-historical-primary text-sm py-3.5 px-8"
            onClick={() => goToStage('REFLECTION')}
          >
            <span>Proceed to Historical Reflection</span>
            <span className="text-[#D1B16A]">&rarr;</span>
          </button>
        </div>
      </main>

      {/* Evidence Drawer */}
      {activeEvidenceId && (
        <EvidenceDrawer
          activeEvidenceId={activeEvidenceId}
          evidenceList={scenario.evidence}
          onClose={() => setActiveEvidenceId(null)}
        />
      )}
    </div>
  );
}
