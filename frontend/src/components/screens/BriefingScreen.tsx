/**
 * KaalNetra — War Council Briefing Screen
 *
 * Immersive historical war council inside the Chittor citadel.
 * Features:
 *   - Fort Defense Status Console (StateHUD)
 *   - Interactive advisor selection with authentic spoken dialogue & strategy
 *   - The 4 Battle Rules (Historical Constraints)
 *   - Command-room aesthetic with dark charcoal surfaces, antique gold framing, and parchment dispatches
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import CharacterPortrait from '../common/CharacterPortrait';
import { CHARACTERS } from '../../assets/registry';

interface SpokenAdvice {
  advice: string;
  recommendation: string;
}

const ADVISOR_SPOKEN_ADVICE: Record<string, SpokenAdvice> = {
  jaimal: {
    advice:
      'Adviser, look around our ramparts. We stand 500 feet above the enemy on solid stone. If we keep our archers vigilant and repair teams ready, no ladder can climb this mountain. Guard the gates and do not waste our men outside.',
    recommendation: 'Recommends: Steady defense behind stone ramparts; protect our 8,000 soldiers.',
  },
  patta: {
    advice:
      "Sitting like birds in a cage will get us buried alive! Akbar's miners are digging giant wooden tunnels right up to our gates. We must ride out at midnight, set fire to their wooden tunnels, and crush their diggers before they plant gunpowder!",
    recommendation: 'Recommends: Night surprise attacks outside the gates to burn enemy siege equipment.',
  },
  resource_steward: {
    advice:
      'Listen to the numbers, commander. We have 38,000 mouths to feed and only what is inside our granaries and rainwater tanks. Cut daily rations now! If we run out of grain or fresh water, this fort will fall without firing a single arrow.',
    recommendation: 'Recommends: Strict food and water rationing so the fort can outlast the siege.',
  },
};

export default function BriefingScreen() {
  const { nextStage, prevStage } = useStage();
  const { scenario, session } = useGameplay();
  const [activeAdvisor, setActiveAdvisor] = useState<'jaimal' | 'patta' | 'resource_steward'>('jaimal');

  if (!scenario || !session) return null;

  const currentAdvisor = CHARACTERS[activeAdvisor];
  const advisorSpeech = ADVISOR_SPOKEN_ADVICE[activeAdvisor] ?? ADVISOR_SPOKEN_ADVICE.jaimal;

  return (
    <div className="app-page-clean">
      <GameHeader badge="historical" />

      <main className="clean-container py-8 sm:py-12 space-y-8">
        {/* Council Header */}
        <header className="pb-4 border-b border-[#2B251D]">
          <div className="text-kicker">Citadel Command Chamber</div>
          <h1 className="serif-heading text-3xl sm:text-4xl text-[#F4E9D0] mt-1">
            War Council Briefing
          </h1>
          <p className="text-xs sm:text-sm text-[#8F8270] mt-1 font-mono">
            October 1567 &bull; Inside Chittorgarh Citadel &bull; Receive strategic counsel before issuing decrees
          </p>
        </header>

        {/* Starting Parameters HUD */}
        <section>
          <StateHUD state={session.currentState} />
        </section>

        {/* 2-Column War Council Layout */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Portrait & Advisor Selection */}
          <div className="historical-card p-6 corner-ornament space-y-5">
            <div className="flex flex-col items-center text-center">
              <CharacterPortrait
                characterIdOrKey={activeAdvisor}
                size="lg"
                showBadge={true}
                eager={true}
              />
              <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0] mt-4">
                {currentAdvisor.name}
              </h3>
              <span className="text-xs text-[#D1B16A] font-semibold uppercase tracking-wider font-mono mt-0.5">
                {currentAdvisor.title}
              </span>
            </div>

            {/* Advisor Selector Buttons */}
            <div className="space-y-2 pt-4 border-t border-[#2B251D]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B99652] block mb-2 font-mono">
                Consult Council Members:
              </span>

              <button
                type="button"
                className={`w-full text-left text-xs p-3.5 border transition-all ${
                  activeAdvisor === 'jaimal'
                    ? 'border-[#B99652] bg-[#1F1C16] text-[#F4E9D0] font-bold shadow-[0_0_10px_rgba(209,177,106,0.15)]'
                    : 'border-[#2B251D] bg-[#11110F] text-[#8F8270] hover:bg-[#1A1815] hover:text-[#D8C9AA]'
                }`}
                onClick={() => setActiveAdvisor('jaimal')}
              >
                <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">Rao Jaimal Rathore</div>
                <div className="text-xs text-[#D1B16A] mt-0.5 font-mono">Focus: Rampart Vigilance &amp; Stone Repair</div>
              </button>

              <button
                type="button"
                className={`w-full text-left text-xs p-3.5 border transition-all ${
                  activeAdvisor === 'patta'
                    ? 'border-[#B99652] bg-[#1F1C16] text-[#F4E9D0] font-bold shadow-[0_0_10px_rgba(209,177,106,0.15)]'
                    : 'border-[#2B251D] bg-[#11110F] text-[#8F8270] hover:bg-[#1A1815] hover:text-[#D8C9AA]'
                }`}
                onClick={() => setActiveAdvisor('patta')}
              >
                <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">Rawat Patta Chundawat</div>
                <div className="text-xs text-[#D1B16A] mt-0.5 font-mono">Focus: Midnight Sorties &amp; Burning Sabats</div>
              </button>

              <button
                type="button"
                className={`w-full text-left text-xs p-3.5 border transition-all ${
                  activeAdvisor === 'resource_steward'
                    ? 'border-[#B99652] bg-[#1F1C16] text-[#F4E9D0] font-bold shadow-[0_0_10px_rgba(209,177,106,0.15)]'
                    : 'border-[#2B251D] bg-[#11110F] text-[#8F8270] hover:bg-[#1A1815] hover:text-[#D8C9AA]'
                }`}
                onClick={() => setActiveAdvisor('resource_steward')}
              >
                <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0]">Food &amp; Water Steward</div>
                <div className="text-xs text-[#D1B16A] mt-0.5 font-mono">Focus: Granaries &amp; Gaumukh Reservoirs</div>
              </button>
            </div>
          </div>

          {/* Right Column: Commander's Spoken Advice & 4 Battle Rules */}
          <div className="space-y-6">
            {/* Spoken Advice Parchment Card */}
            <div className="parchment-panel p-6 corner-ornament space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#A38C65]/50">
                <span className="parchment-meta">
                  Spoken War Counsel &bull; Council Chamber
                </span>
                <span className="text-xs font-mono text-[#54493B]">Oral Record</span>
              </div>

              <h2 className="parchment-title text-2xl text-[#29231B]">
                {currentAdvisor.name} directs:
              </h2>

              <blockquote className="parchment-body text-base italic p-4 bg-[#F2E5C5] border-l-4 border-l-[#B99652] my-2">
                &ldquo;{advisorSpeech.advice}&rdquo;
              </blockquote>

              <div className="p-3 bg-[#E0CEA4] border border-[#A38C65] text-xs font-medium text-[#29231B]">
                <strong className="font-['Cinzel'] font-bold uppercase text-[11px] block mb-0.5">
                  Tactical Recommendation:
                </strong>
                {advisorSpeech.recommendation}
              </div>
            </div>

            {/* Documented Operational Constraints (4 Battle Rules) */}
            <div className="historical-card p-6 corner-ornament space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2B251D]">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
                  The Four Iron Realities of Chittor
                </h3>
                <span className="text-xs text-[#8F8270] font-mono">Historical Constraints</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#D8C9AA] leading-relaxed">
                <div className="p-3.5 bg-[#11110F] border border-[#2B251D] space-y-1">
                  <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0] flex items-center gap-2">
                    <span className="text-[#B99652]">I.</span> No Relief Army
                  </div>
                  <p>
                    King Udai Singh fights in the hills to save the dynasty. No reinforcements are marching to break the siege.
                  </p>
                </div>

                <div className="p-3.5 bg-[#11110F] border border-[#2B251D] space-y-1">
                  <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0] flex items-center gap-2">
                    <span className="text-[#B99652]">II.</span> Covered Sabats
                  </div>
                  <p>
                    5,000 imperial diggers are erecting bulletproof wooden galleries to dig gunpowder mines under the walls.
                  </p>
                </div>

                <div className="p-3.5 bg-[#11110F] border border-[#2B251D] space-y-1">
                  <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0] flex items-center gap-2">
                    <span className="text-[#B99652]">III.</span> Irreplaceable 8,000
                  </div>
                  <p>
                    You have exactly 8,000 veteran defenders. Because the fort is surrounded, lost warriors cannot be replaced.
                  </p>
                </div>

                <div className="p-3.5 bg-[#11110F] border border-[#2B251D] space-y-1">
                  <div className="font-['Cinzel'] font-bold text-sm text-[#F4E9D0] flex items-center gap-2">
                    <span className="text-[#B99652]">IV.</span> 30,000 Civilians
                  </div>
                  <p>
                    Tens of thousands took refuge within the gates. Grain and rainwater must be conserved or famine will prevail.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                className="btn-historical-secondary text-xs py-2.5 px-5"
                onClick={prevStage}
              >
                &larr; Historical Context
              </button>

              <button
                type="button"
                className="btn-historical-primary text-sm py-3 px-8"
                onClick={nextStage}
              >
                <span>Issue First Directives</span>
                <span className="text-[#D1B16A]">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
