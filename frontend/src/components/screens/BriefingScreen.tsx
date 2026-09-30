/**
 * KaalNetra — War Council Briefing Screen
 *
 * Immersive historical war council briefing.
 * Shows:
 *   - Rich StateHUD status console
 *   - Interactive advisor selection with authentic spoken dialogue
 *   - 4 Clear battle constraints (Battle Rules)
 *   - Clear call to action to proceed to Decision 1
 * Dark fortress aesthetic, antique gold trims, zero gradients.
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

      <main className="clean-container py-8 sm:py-10 space-y-8">
        {/* Council Header */}
        <header className="pb-4 border-b border-[#272E3D]">
          <div className="text-kicker">War Council Meeting</div>
          <h1 className="serif-heading text-3xl sm:text-4xl text-[#F4EFE6] mt-1">
            Meet Your Defense Team
          </h1>
          <p className="text-[#B8B09F] text-sm mt-1">
            Inside the Chittor Citadel &bull; Hear counsel from your chieftains before issuing your first decrees
          </p>
        </header>

        {/* Starting Parameters HUD */}
        <section>
          <StateHUD state={session.currentState} />
        </section>

        {/* 2-Column Council Layout */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Portrait & Advisor Selection */}
          <div className="bg-[#141720] border border-[#272E3D] p-6 shadow-md space-y-5">
            <div className="flex flex-col items-center text-center">
              <CharacterPortrait
                characterIdOrKey={activeAdvisor}
                size="lg"
                showBadge={true}
                eager={true}
              />
              <h3 className="serif-title text-xl text-[#F4EFE6] mt-4">
                {currentAdvisor.name}
              </h3>
              <span className="text-xs text-[#DFBE76] font-semibold uppercase tracking-wider mt-0.5 font-mono">
                {currentAdvisor.title}
              </span>
            </div>

            {/* Advisor Selector Buttons */}
            <div className="space-y-2 pt-4 border-t border-[#272E3D]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-2 font-mono">
                Click to Hear Their Strategy:
              </span>
              <button
                className={`w-full text-left text-xs p-3 border transition-colors ${
                  activeAdvisor === 'jaimal'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-bold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setActiveAdvisor('jaimal')}
              >
                <div className="font-bold text-sm text-[#F4EFE6]">Rao Jaimal Rathore</div>
                <div className="text-xs text-[#DFBE76] mt-0.5">Focus: Guard the Walls &amp; Ramparts</div>
              </button>

              <button
                className={`w-full text-left text-xs p-3 border transition-colors ${
                  activeAdvisor === 'patta'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-bold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setActiveAdvisor('patta')}
              >
                <div className="font-bold text-sm text-[#F4EFE6]">Rawat Patta Chundawat</div>
                <div className="text-xs text-[#DFBE76] mt-0.5">Focus: Night Surprise Sorties Outside</div>
              </button>

              <button
                className={`w-full text-left text-xs p-3 border transition-colors ${
                  activeAdvisor === 'resource_steward'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-bold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setActiveAdvisor('resource_steward')}
              >
                <div className="font-bold text-sm text-[#F4EFE6]">Food &amp; Water Steward</div>
                <div className="text-xs text-[#DFBE76] mt-0.5">Focus: Conserve Grain &amp; Rainwater</div>
              </button>
            </div>
          </div>

          {/* Right Column: Commander's Spoken Advice & 4 Rules */}
          <div className="space-y-6">
            {/* Dialogue Card */}
            <div className="bg-[#141720] border border-[#272E3D] p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#272E3D]">
                <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059]">
                  Commander&apos;s Advice &bull; Spoken Strategy
                </span>
                <span className="text-xs text-[#788194] italic font-mono">Council Chamber</span>
              </div>

              <h2 className="serif-title text-2xl text-[#F4EFE6]">
                {currentAdvisor.name} says:
              </h2>

              <p className="text-base text-[#F4EFE6] leading-relaxed italic border-l-4 border-l-[#C5A059] pl-4 py-2 bg-[#0D0F14]">
                &ldquo;{advisorSpeech.advice}&rdquo;
              </p>

              <div className="p-3 bg-[#1B202B] border border-[#272E3D] text-xs text-[#DFBE76] font-medium">
                <strong className="text-[#F4EFE6]">Tactical Takeaway:</strong> {advisorSpeech.recommendation}
              </div>
            </div>

            {/* Documented Operational Constraints (4 Battle Rules) */}
            <div className="bg-[#141720] border border-[#272E3D] p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
                  4 Battle Rules You Must Remember
                </h3>
                <span className="text-xs text-[#788194]">Historical Reality</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#B8B09F] leading-relaxed">
                <div className="p-3.5 bg-[#0D0F14] border border-[#272E3D]">
                  <div className="font-bold text-sm text-[#F4EFE6] mb-1 flex items-center gap-1.5">
                    <span>🏔️</span> 1. No Outside Rescue
                  </div>
                  <p>
                    King Udai Singh is in the hills preserving the dynasty. You are completely on your own; no relief army is coming to break the siege.
                  </p>
                </div>

                <div className="p-3.5 bg-[#0D0F14] border border-[#272E3D]">
                  <div className="font-bold text-sm text-[#F4EFE6] mb-1 flex items-center gap-1.5">
                    <span>⛏️</span> 2. Enemy Diggers (Sabats)
                  </div>
                  <p>
                    5,000 imperial sappers are building giant wooden tunnels creeping up the slope to dig gunpowder mines under your stone walls.
                  </p>
                </div>

                <div className="p-3.5 bg-[#0D0F14] border border-[#272E3D]">
                  <div className="font-bold text-sm text-[#F4EFE6] mb-1 flex items-center gap-1.5">
                    <span>⚔️</span> 3. Irreplaceable 8,000 Men
                  </div>
                  <p>
                    You have exactly 8,000 veteran defenders. Because the fort is encircled, lost soldiers cannot be replaced.
                  </p>
                </div>

                <div className="p-3.5 bg-[#0D0F14] border border-[#272E3D]">
                  <div className="font-bold text-sm text-[#F4EFE6] mb-1 flex items-center gap-1.5">
                    <span>🌾</span> 4. 30,000 Ordinary People
                  </div>
                  <p>
                    Thousands of villagers took shelter inside. You must manage grain and rainwater tanks carefully or starvation will defeat you.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                className="btn-secondary-clean"
                onClick={prevStage}
              >
                &larr; Story Background
              </button>
              <button
                className="btn-primary-clean text-base py-3 px-8"
                onClick={nextStage}
              >
                Give Your First Orders &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
