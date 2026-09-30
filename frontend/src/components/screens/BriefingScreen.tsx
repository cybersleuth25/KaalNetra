/**
 * KaalNetra — Briefing Screen
 *
 * PRD §6:
 *   Character portrait on left; briefing text on right.
 *   Uses named figures carefully:
 *     - Jaimal: defensive commander / contextual adviser
 *     - Patta: defensive commander
 *     - Resource steward: logistical reality
 *   Do NOT invent historical quotations.
 *   CTA: "Continue to Decision"
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import CharacterPortrait from '../common/CharacterPortrait';
import { ENVIRONMENTS } from '../../assets/registry';

export default function BriefingScreen() {
  const { nextStage, prevStage } = useStage();
  const { scenario, session } = useGameplay();
  const [activeAdvisor, setActiveAdvisor] = useState<'jaimal' | 'patta' | 'steward' | 'udai_singh'>('jaimal');

  if (!scenario || !session) return null;

  return (
    <div
      className="game-screen-container relative bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 16, 14, 0.94), rgba(28, 23, 20, 0.96)), url(${ENVIRONMENTS.fort_interior.src})`,
      }}
    >
      <GameHeader badge="historical" />

      <main className="briefing-screen-layout relative z-10">
        <div className="briefing-header">
          <span className="section-eyebrow">Council of War</span>
          <h1 className="briefing-title">Garrison Command Briefing</h1>
          <p className="briefing-subtitle">
            Late 1567 &bull; Inside the Ramparts of Chittor &bull; Defensive War Council
          </p>
        </div>

        {/* Initial Parameters HUD */}
        <div className="briefing-hud-wrap">
          <StateHUD state={session.currentState} />
        </div>

        {/* Council Split: Portrait Left, Counsel Right */}
        <div className="briefing-split-grid">
          {/* Left Column: Character Presentation */}
          <div className="briefing-portrait-pane flex flex-col items-center">
            <CharacterPortrait
              characterIdOrKey={activeAdvisor}
              size="lg"
              showBadge={true}
              eager={true}
            />

            {/* Advisor Selector Tabs */}
            <div className="advisor-selector-tabs grid grid-cols-2 gap-1.5 mt-3 w-full max-w-xs">
              <button
                className={`advisor-tab text-xs py-1.5 px-2 rounded border transition-all ${
                  activeAdvisor === 'jaimal'
                    ? 'advisor-tab-active bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-stone-900/80 text-stone-300 border-amber-700/30 hover:border-amber-500/60'
                }`}
                onClick={() => setActiveAdvisor('jaimal')}
              >
                Rao Jaimal (Commander)
              </button>
              <button
                className={`advisor-tab text-xs py-1.5 px-2 rounded border transition-all ${
                  activeAdvisor === 'patta'
                    ? 'advisor-tab-active bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-stone-900/80 text-stone-300 border-amber-700/30 hover:border-amber-500/60'
                }`}
                onClick={() => setActiveAdvisor('patta')}
              >
                Patta (Vanguard)
              </button>
              <button
                className={`advisor-tab text-xs py-1.5 px-2 rounded border transition-all ${
                  activeAdvisor === 'steward'
                    ? 'advisor-tab-active bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-stone-900/80 text-stone-300 border-amber-700/30 hover:border-amber-500/60'
                }`}
                onClick={() => setActiveAdvisor('steward')}
              >
                Logistics Steward
              </button>
              <button
                className={`advisor-tab text-xs py-1.5 px-2 rounded border transition-all ${
                  activeAdvisor === 'udai_singh'
                    ? 'advisor-tab-active bg-amber-500 text-stone-950 font-bold border-amber-400'
                    : 'bg-stone-900/80 text-stone-300 border-amber-700/30 hover:border-amber-500/60'
                }`}
                onClick={() => setActiveAdvisor('udai_singh')}
              >
                Udai Singh II (Dynastic)
              </button>
            </div>
          </div>

          {/* Right Column: Briefing Text & Counsel */}
          <div className="briefing-text-pane">
            <div className="counsel-card bg-stone-900/90 border border-amber-600/30 rounded-lg p-5 shadow-xl">
              <div className="counsel-header flex items-center justify-between border-b border-amber-700/20 pb-2 mb-3">
                <span className="counsel-badge text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Advisory Perspective
                </span>
                <h3 className="font-serif font-bold text-amber-200 text-sm md:text-base">
                  {activeAdvisor === 'jaimal' && 'Rao Jaimal Rathore — Principal Commander'}
                  {activeAdvisor === 'patta' && 'Patta Chundawat — Garrison Vanguard'}
                  {activeAdvisor === 'steward' && 'Kaviraj Manohardas — Garrison Logistical Steward'}
                  {activeAdvisor === 'udai_singh' && 'Maharana Udai Singh II — Strategic Doctrine'}
                </h3>
              </div>

              <div className="counsel-body text-sm text-parchment-200 space-y-3 leading-relaxed">
                {activeAdvisor === 'jaimal' && (
                  <>
                    <p>
                      <strong>Strategic Posture:</strong> With Rana Udai Singh having withdrawn to
                      preserve the dynasty in the Aravalli hills, the defense of Mewar’s ancestral seat
                      rests upon the 8,000-strong garrison and the 30,000 non-combatants sheltering behind the gates.
                    </p>
                    <p>
                      <strong>Imperial Encirclement:</strong> Akbar’s artillery trains have encircled the plateau.
                      The Mughals have begun constructing covered saps (sabats) and subterranean mine tunnels toward
                      our curtain walls. Our fort is nearly impregnable to direct assault, but prolonged mining
                      threatens catastrophic breach.
                    </p>
                  </>
                )}

                {activeAdvisor === 'patta' && (
                  <>
                    <p>
                      <strong>Garrison Cohesion:</strong> Our warrior clans remain steadfast. The young defenders
                      from Kelwa and the Sisodia contingents stand ready at the ramparts.
                    </p>
                    <p>
                      <strong>Tactical Warning:</strong> Passive defense risks demoralizing the troops under
                      ceaseless bombardment. We must carefully weigh limited counter-sorties against the need to
                      preserve vital combat strength for the breaches to come.
                    </p>
                  </>
                )}

                {activeAdvisor === 'steward' && (
                  <>
                    <p>
                      <strong>Logistical Assessment:</strong> The Gaumukh reservoir and interior rain cisterns are
                      currently holding water (72%), and the storehouses hold grain for several months (78%).
                    </p>
                    <p>
                      <strong>Supply Vulnerability:</strong> Each turn of siege operations consumes roughly 4 units
                      of food and 5 units of water. If supplies drop below 30%, rationing will degrade combat morale;
                      below 15%, famine and disease will break our battle lines.
                    </p>
                  </>
                )}

                {activeAdvisor === 'udai_singh' && (
                  <>
                    <p>
                      <strong>Dynastic Continuity:</strong> The fortress of Chittorgarh is sacred, but the sovereignty of Mewar lives in its people and its royal bloodline. Do not sacrifice every soul in a vain premature frontal charge.
                    </p>
                    <p>
                      <strong>Protracted Resistance:</strong> Hold the walls as long as honorable resistance is feasible to pin down Akbar's main imperial army and exhaust his treasury.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Strategic Directive */}
            <div className="directive-card">
              <h4>Council Directive for the Decision-Maker</h4>
              <p>
                As our defensive orders are dispatched, remember: every allocation involves stark trade-offs.
                Conserving supplies risks enemy siege progress; aggressive counteraction risks irreplaceable defender lives.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="screen-footer">
          <button className="game-btn game-btn-secondary" onClick={prevStage}>
            &larr; Back to Historical Context
          </button>
          <button
            className="game-btn game-btn-primary"
            onClick={nextStage}
            id="continue-to-decision-btn"
          >
            Continue to First Decision &rarr;
          </button>
        </footer>
      </main>
    </div>
  );
}
