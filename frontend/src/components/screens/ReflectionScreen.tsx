/**
 * KaalNetra — Historical Reflection Screen (Analysis Dossier)
 *
 * Implements Section 11 of design specification:
 *   - "Historical Analysis Dossier" style
 *   - Visually communicates:
 *       EXPERIENCE ↓ REFLECTION ↓ UNDERSTANDING
 *   - Sections:
 *       1. YOUR DECISION
 *       2. SIMULATED CONSEQUENCE
 *       3. HISTORICAL OUTCOME
 *       4. KEY FACTORS
 *       5. WHAT YOU LEARNED
 *   - Parchment cards with elegant typography
 *   - Horizontal timeline illustrating the analytical progression
 *   - Interactive reflection questions & AI Reflection Assistant
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import ReflectionAssistant from '../common/ReflectionAssistant';

export default function ReflectionScreen() {
  const { goToStage, reset: resetStage } = useStage();
  const { scenario, session, restart } = useGameplay();

  const [selectedTradeoff, setSelectedTradeoff] = useState<string>('garrison_vs_fort');
  const [selectedConstraint, setSelectedConstraint] = useState<string>('no_relief');

  if (!scenario || !session) return null;

  const handleRestart = () => {
    restart();
    goToStage('BRIEFING');
  };

  const handleFullReset = () => {
    restart();
    resetStage();
  };

  return (
    <div className="app-page-clean">
      <GameHeader badge="historical" />

      <main className="clean-container py-10 sm:py-14 space-y-12">
        {/* Reflection Header */}
        <header className="pb-6 border-b border-[#2B251D] space-y-2">
          <div className="text-kicker">Historiographical Synthesis Dossier</div>
          <h1 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4E9D0] tracking-wide">
            HISTORICAL REFLECTION
          </h1>
          <p className="text-sm sm:text-base text-[#D8C9AA] max-w-3xl leading-relaxed">
            Consolidate your findings. Move from immediate simulation experience to deep historical reflection and understanding.
          </p>

          {/* Visual Progression Marker: EXPERIENCE ↓ REFLECTION ↓ UNDERSTANDING */}
          <div className="pt-4">
            <div className="p-4 bg-[#161412] border border-[#B99652] corner-ornament flex flex-wrap items-center justify-around gap-4 text-xs font-mono uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 text-[#8F8270]">
                <span className="w-6 h-6 rounded-full border border-[#2B251D] flex items-center justify-center text-[10px]">1</span>
                <span>EXPERIENCE</span>
              </div>
              <span className="text-[#B99652] font-bold">&darr;</span>
              <div className="flex items-center gap-2 text-[#D1B16A] font-bold">
                <span className="w-6 h-6 rounded-full bg-[#B99652] text-[#11110F] flex items-center justify-center text-[10px]">2</span>
                <span>REFLECTION</span>
              </div>
              <span className="text-[#B99652] font-bold">&darr;</span>
              <div className="flex items-center gap-2 text-[#F4E9D0]">
                <span className="w-6 h-6 rounded-full border border-[#B99652] text-[#D1B16A] flex items-center justify-center text-[10px]">3</span>
                <span>UNDERSTANDING</span>
              </div>
            </div>
          </div>
        </header>

        {/* Horizontal Timeline: 5-Phase Historical Dossier Flow */}
        <section className="space-y-4">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#B99652] font-mono">
            ◈ The Analytical Arc of KaalNetra
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. Your Decision */}
            <div className="historical-card p-4 space-y-2 border-t-2 border-t-[#D1B16A]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#B99652] font-bold block">
                01 &bull; Directive
              </span>
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">
                Your Decision
              </h3>
              <p className="text-xs text-[#8F8270] leading-relaxed">
                Strategic choices made under incomplete intelligence and acute resource scarcity.
              </p>
            </div>

            {/* 2. Simulated Consequence */}
            <div className="historical-card p-4 space-y-2 border-t-2 border-t-[#FFA5A5]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFA5A5] font-bold block">
                02 &bull; Consequence
              </span>
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">
                Simulated Consequence
              </h3>
              <p className="text-xs text-[#8F8270] leading-relaxed">
                Hypothetical causal ripple across soldiers, food rations, Gaumukh water, and wall integrity.
              </p>
            </div>

            {/* 3. Historical Outcome */}
            <div className="historical-card p-4 space-y-2 border-t-2 border-t-[#B99652]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#B99652] font-bold block">
                03 &bull; Reality
              </span>
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">
                Historical Outcome
              </h3>
              <p className="text-xs text-[#8F8270] leading-relaxed">
                The documented fall of the ramparts following the death of Rao Jaimal on February 22, 1568.
              </p>
            </div>

            {/* 4. Key Factors */}
            <div className="historical-card p-4 space-y-2 border-t-2 border-t-[#D8C9AA]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#D8C9AA] font-bold block">
                04 &bull; Determinants
              </span>
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">
                Key Factors
              </h3>
              <p className="text-xs text-[#8F8270] leading-relaxed">
                Covered sabats, underground mines, isolation from relief, and 8:1 troop disparity.
              </p>
            </div>

            {/* 5. What You Learned */}
            <div className="historical-card p-4 space-y-2 border-t-2 border-t-[#79D19E]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#79D19E] font-bold block">
                05 &bull; Synthesis
              </span>
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">
                What You Learned
              </h3>
              <p className="text-xs text-[#8F8270] leading-relaxed">
                History is driven by systemic boundaries, logistics, and technology—not simple chance.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Core Reflective Questions in Parchment Cards */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <div className="text-kicker justify-center mb-1">Archival Inquiry</div>
            <h2 className="font-['Cinzel'] text-2xl sm:text-3xl text-[#F4E9D0] font-bold">
              Historiographical Examination
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question 1: Trade-offs */}
            <div className="parchment-panel p-6 corner-ornament space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#A38C65]/50">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E0CEA4] border border-[#A38C65] text-[#29231B] font-mono">
                  Dossier Inquiry 01
                </span>
                <h3 className="parchment-title text-lg text-[#29231B]">
                  What Was the Human Cost of Your Strategy?
                </h3>
              </div>
              <p className="parchment-body text-xs sm:text-sm text-[#29231B]">
                In siege warfare, every strategic gain demands a sacrifice. Which dilemma felt most decisive during your command?
              </p>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  className={`w-full text-left p-3 border transition-colors ${
                    selectedTradeoff === 'garrison_vs_fort'
                      ? 'border-[#29231B] bg-[#E0CEA4] text-[#29231B] font-semibold shadow-sm'
                      : 'border-[#A38C65] bg-[#F2E5C5] text-[#54493B] hover:bg-[#E0CEA4]'
                  }`}
                  onClick={() => setSelectedTradeoff('garrison_vs_fort')}
                >
                  <strong className="text-[#29231B] font-['Cinzel'] block mb-0.5">Soldiers vs. Ramparts:</strong>
                  Sabat interdiction raids destroyed enemy wooden galleries, but irreplaceable veteran warriors fell outside the gates.
                </button>

                <button
                  type="button"
                  className={`w-full text-left p-3 border transition-colors ${
                    selectedTradeoff === 'morale_vs_conservation'
                      ? 'border-[#29231B] bg-[#E0CEA4] text-[#29231B] font-semibold shadow-sm'
                      : 'border-[#A38C65] bg-[#F2E5C5] text-[#54493B] hover:bg-[#E0CEA4]'
                  }`}
                  onClick={() => setSelectedTradeoff('morale_vs_conservation')}
                >
                  <strong className="text-[#29231B] font-['Cinzel'] block mb-0.5">Morale vs. Supply Preservation:</strong>
                  Aggressive rationing stretched grain and Gaumukh water supplies across months, but civilian morale dropped severely.
                </button>
              </div>
            </div>

            {/* Question 2: Decisive Constraints */}
            <div className="parchment-panel p-6 corner-ornament space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#A38C65]/50">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E0CEA4] border border-[#A38C65] text-[#29231B] font-mono">
                  Dossier Inquiry 02
                </span>
                <h3 className="parchment-title text-lg text-[#29231B]">
                  Which Operational Limit Bound You Most?
                </h3>
              </div>
              <p className="parchment-body text-xs sm:text-sm text-[#29231B]">
                Historical commanders operated within rigid systemic envelopes. Select the constraint that proved most unyielding:
              </p>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  className={`w-full text-left p-3 border transition-colors ${
                    selectedConstraint === 'no_relief'
                      ? 'border-[#29231B] bg-[#E0CEA4] text-[#29231B] font-semibold shadow-sm'
                      : 'border-[#A38C65] bg-[#F2E5C5] text-[#54493B] hover:bg-[#E0CEA4]'
                  }`}
                  onClick={() => setSelectedConstraint('no_relief')}
                >
                  <strong className="text-[#29231B] font-['Cinzel'] block mb-0.5">The Absolute Isolation:</strong>
                  King Udai Singh preserved the royal lineage in the Aravalli hills, meaning no relieving army was ever marching to help.
                </button>

                <button
                  type="button"
                  className={`w-full text-left p-3 border transition-colors ${
                    selectedConstraint === 'finite_water'
                      ? 'border-[#29231B] bg-[#E0CEA4] text-[#29231B] font-semibold shadow-sm'
                      : 'border-[#A38C65] bg-[#F2E5C5] text-[#54493B] hover:bg-[#E0CEA4]'
                  }`}
                  onClick={() => setSelectedConstraint('finite_water')}
                >
                  <strong className="text-[#29231B] font-['Cinzel'] block mb-0.5">The Gaumukh Reservoirs:</strong>
                  With 38,000 souls atop the cliff, rainwater depletion represented a hard logistical ceiling on defense duration.
                </button>
              </div>
            </div>

            {/* Question 3: Historical Divergence */}
            <div className="parchment-panel p-6 corner-ornament space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#A38C65]/50">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E0CEA4] border border-[#A38C65] text-[#29231B] font-mono">
                  Dossier Inquiry 03
                </span>
                <h3 className="parchment-title text-lg text-[#29231B]">
                  What Documented History Teaches Us
                </h3>
              </div>
              <p className="parchment-body text-xs sm:text-sm text-[#29231B] leading-relaxed">
                In documented history, Rao Jaimal and Rawat Patta executed a strategy of relentless aggressive repair and midnight counter-raids. 
                When Jaimal was mortally struck by Akbar&apos;s musket <em>Sangram</em> while supervising repairs on February 22, 1568, the loss of unified leadership triggered the final sacred rites of Jauhar and the sortie of Saka.
              </p>
            </div>

            {/* Question 4: The Purpose of Simulation */}
            <div className="parchment-panel p-6 corner-ornament space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#A38C65]/50">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E0CEA4] border border-[#A38C65] text-[#29231B] font-mono">
                  Dossier Inquiry 04
                </span>
                <h3 className="parchment-title text-lg text-[#29231B]">
                  Why Explore Counterfactual History?
                </h3>
              </div>
              <p className="parchment-body text-xs sm:text-sm text-[#29231B] leading-relaxed">
                KaalNetra does not exist to alter the historical record, but to illuminate it. 
                By placing you at the command table with genuine constraints, simulation reveals that historical actors were not mythical archetypes, but leaders wrestling with finite resources, imperfect information, and harrowing moral choices.
              </p>
            </div>
          </div>
        </section>

        {/* AI Historical Reflection Assistant in Archival Frame */}
        <section className="historical-card p-6 sm:p-8 corner-ornament">
          <div className="mb-4 pb-2 border-b border-[#2B251D]">
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#D1B16A] font-bold">
              ◈ Interactive Archival Inquiry Assistant
            </span>
          </div>
          <ReflectionAssistant scenario={scenario} />
        </section>

        {/* Replay & Final Navigation Actions */}
        <div className="historical-card p-6 corner-ornament flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            className="btn-historical-secondary w-full sm:w-auto text-xs py-3 px-6"
            onClick={handleFullReset}
          >
            &larr; Return to Historical Archives
          </button>

          <button
            type="button"
            className="btn-historical-primary w-full sm:w-auto text-sm py-3.5 px-8"
            onClick={handleRestart}
          >
            <span>&#8634; Replay Chittor with Alternate Choices</span>
            <span className="text-[#D1B16A]">&rarr;</span>
          </button>
        </div>
      </main>
    </div>
  );
}
