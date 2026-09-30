/**
 * KaalNetra — Final Outcome Screen
 *
 * Immersive historical outcome summary.
 * Shows:
 *   - Outcome Tier Banner
 *   - Final State Parameters via StateHUD
 *   - The Fate of Civilians & Garrison Analysis
 *   - Direct transition to Historical Comparison
 * Dark fortress theme, antique gold trims, zero gradients.
 */

import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import StateHUD from '../common/StateHUD';
import type { OutcomeTier } from '../../data/types';

const TIER_METADATA: Record<
  OutcomeTier,
  { label: string; title: string; description: string; color: string; border: string; bg: string }
> = {
  resilient_defense: {
    label: 'Strong Defense',
    title: 'Your Fort Held Strong!',
    description:
      'Your disciplined commands preserved soldiers, fresh water, and wall defenses. Even though Akbar brought a massive army and heavy bronze cannons, your defenders held the breaches with exceptional courage.',
    color: '#79D19E',
    border: '#2E724F',
    bg: '#12281D',
  },
  strained_defense: {
    label: 'Barely Held On',
    title: 'Defenders Held On by a Thread',
    description:
      'You survived the main enemy assaults, but your food, fresh water, and stone ramparts were pushed to their absolute limits. You held the citadel, but at a very heavy human and logistical cost.',
    color: '#DFBE76',
    border: '#C5A059',
    bg: '#241D12',
  },
  critical_defense: {
    label: 'Near Defeat',
    title: 'The Fort Was on the Edge of Falling',
    description:
      'Severe shortages of grain, fresh cistern water, and brave fighters brought Chittor to the brink of disintegration. Only small pockets of defenders held the inner towers against relentless Mughal sappers.',
    color: '#FFA3A3',
    border: '#9E2A2B',
    bg: '#2A1212',
  },
  collapse: {
    label: 'Fort Overwhelmed',
    title: 'The Fortress Walls Fell',
    description:
      'Imperial artillery bombardment, underground gunpowder mines, and dwindling food supplies finally overwhelmed the fortress walls. This matches the tragic real-life culmination of the historical siege in February 1568.',
    color: '#FFA3A3',
    border: '#9E2A2B',
    bg: '#2A1212',
  },
};

export default function OutcomeScreen() {
  const { goToStage } = useStage();
  const { scenario, session, restart } = useGameplay();

  if (!scenario || !session) return null;

  const outcomeTier: OutcomeTier = session.outcomeTier ?? 'strained_defense';
  const tierInfo = TIER_METADATA[outcomeTier];

  return (
    <div className="app-page-clean">
      <GameHeader badge="result" />

      <main className="clean-container py-8 sm:py-10 space-y-8">
        {/* Outcome Tier Banner */}
        <section className="bg-[#141720] border border-l-4 border-[#272E3D] border-l-[#C5A059] p-6 sm:p-8 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059] font-mono">
              Battle Simulation Result &bull; What Happened in Your Game
            </span>
            <span
              className="text-xs font-bold px-3 py-1 border font-mono uppercase tracking-wider"
              style={{
                color: tierInfo.color,
                borderColor: tierInfo.border,
                backgroundColor: tierInfo.bg,
              }}
            >
              Result: {tierInfo.label}
            </span>
          </div>

          <h1 className="serif-heading text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6]">
            {tierInfo.title}
          </h1>

          <p className="text-base text-[#B8B09F] leading-relaxed max-w-4xl">
            {tierInfo.description}
          </p>
        </section>

        {/* Final State HUD */}
        <section>
          <div className="text-xs uppercase tracking-wider font-bold text-[#DFBE76] mb-2 font-mono">
            Final Fort Numbers (End of Battle)
          </div>
          <StateHUD state={session.currentState} />
        </section>

        {/* Analysis of Fate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#141720] border border-[#272E3D] p-6 shadow-md space-y-3">
            <div className="text-xs uppercase tracking-wider font-bold text-[#FFA3A3] font-mono">
              Human Reality
            </div>
            <h3 className="serif-title text-xl text-[#F4EFE6]">
              The 30,000 People Inside the Fort
            </h3>
            <p className="text-sm text-[#B8B09F] leading-relaxed">
              Inside Chittorgarh, 30,000 ordinary villagers and families were trapped on the rocky mountain. 
              Because Akbar’s army completely surrounded the cliff, no new food, fresh water, or reinforcements 
              could ever reach them. Every tactical choice you made decided how long these innocent people could survive.
            </p>
          </div>

          <div className="bg-[#141720] border border-[#272E3D] p-6 shadow-md space-y-3">
            <div className="text-xs uppercase tracking-wider font-bold text-[#DFBE76] font-mono">
              Historical Takeaway
            </div>
            <h3 className="serif-title text-xl text-[#F4EFE6]">
              Why Your Choices Changed the Outcome
            </h3>
            <p className="text-sm text-[#B8B09F] leading-relaxed">
              In real history, commanders Rao Jaimal and Rawat Patta faced impossible odds. 
              Now let&apos;s see how your choices compare side-by-side with what actually happened in documented history in 1568.
            </p>
          </div>
        </div>

        {/* Primary Transition Actions */}
        <div className="bg-[#141720] border border-[#272E3D] p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            className="btn-secondary-clean w-full sm:w-auto text-sm"
            onClick={() => {
              restart();
              goToStage('BRIEFING');
            }}
          >
            &#8634; Play Scenario Again
          </button>

          <button
            className="btn-primary-clean w-full sm:w-auto text-base py-3.5 px-8"
            onClick={() => goToStage('COMPARE')}
          >
            See Real History Comparison &rarr;
          </button>
        </div>
      </main>
    </div>
  );
}
