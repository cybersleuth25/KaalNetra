/**
 * KaalNetra — Final Outcome Screen (Siege Resolution)
 *
 * Visual Language:
 *   - Archival Resolution Banner with outcome tier badge
 *   - StateHUD fort indicators
 *   - Human reality analysis (fate of 30,000 citizens & garrison)
 *   - Direct transition to the Signature Screen: Historical Comparison
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
    label: 'Resilient Defense',
    title: 'The Fortress Held Against Imperial Odds',
    description:
      'Your disciplined commands preserved soldiers, fresh water, and wall defenses. Even though Akbar brought a massive army and heavy bronze cannons, your defenders held the breaches with exceptional courage.',
    color: '#79D19E',
    border: '#2E6B47',
    bg: '#122419',
  },
  strained_defense: {
    label: 'Strained Citadel',
    title: 'Defenders Held On by a Slender Thread',
    description:
      'You survived the main enemy assaults, but your food, fresh water, and stone ramparts were pushed to their absolute limits. You held the citadel, but at a very heavy human and logistical cost.',
    color: '#D1B16A',
    border: '#B99652',
    bg: '#1E1B16',
  },
  critical_defense: {
    label: 'Near Collapse',
    title: 'The Fortress Was on the Verge of Falling',
    description:
      'Severe shortages of grain, fresh cistern water, and brave fighters brought Chittor to the brink of disintegration. Only small pockets of defenders held the inner towers against relentless Mughal sappers.',
    color: '#FFA5A5',
    border: '#8C2D2E',
    bg: '#221010',
  },
  collapse: {
    label: 'Fortress Overwhelmed',
    title: 'The Ramparts Fell to Imperial Sappers',
    description:
      'Imperial artillery bombardment, underground gunpowder mines, and dwindling food supplies finally overwhelmed the fortress walls. This matches the tragic real-life culmination of the historical siege in February 1568.',
    color: '#FFA5A5',
    border: '#8C2D2E',
    bg: '#221010',
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

      <main className="clean-container py-10 sm:py-14 space-y-8">
        {/* Outcome Tier Archival Banner */}
        <section className="historical-card p-6 sm:p-8 corner-ornament space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2B251D]">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#B99652] font-mono">
              ◈ Simulation Consequence &bull; Final Operational Result
            </span>
            <span
              className="text-xs font-bold px-3 py-1 border font-mono uppercase tracking-wider"
              style={{
                color: tierInfo.color,
                borderColor: tierInfo.border,
                backgroundColor: tierInfo.bg,
              }}
            >
              Result Tier: {tierInfo.label}
            </span>
          </div>

          <h1 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl text-[#F4E9D0] font-extrabold leading-tight">
            {tierInfo.title}
          </h1>

          <p className="text-sm sm:text-base text-[#D8C9AA] leading-relaxed max-w-4xl">
            {tierInfo.description}
          </p>
        </section>

        {/* Final State HUD */}
        <section>
          <div className="text-xs uppercase tracking-[0.15em] font-bold text-[#D1B16A] mb-2 font-mono">
            Final Citadel Parameters (Conclusion of Battle)
          </div>
          <StateHUD state={session.currentState} />
        </section>

        {/* The Human Reality & Historical Transition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="historical-card p-6 corner-ornament space-y-3">
            <div className="text-xs uppercase tracking-wider font-bold text-[#FFA5A5] font-mono">
              The Human Reality &bull; Non-Combatants
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
              The 30,000 Citizens of Chittor
            </h3>
            <p className="text-xs sm:text-sm text-[#D8C9AA] leading-relaxed">
              Inside the rocky ramparts, 30,000 ordinary villagers, women, and children were trapped for months. 
              Because Akbar’s imperial lines completely encircled the mountain, no outside supplies could reach them. 
              Every tactical decision directly dictated the survival span of these families.
            </p>
          </div>

          <div className="historical-card p-6 corner-ornament space-y-3">
            <div className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
              The Core KaalNetra Experience
            </div>
            <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
              Now Compare with Documented History
            </h3>
            <p className="text-xs sm:text-sm text-[#D8C9AA] leading-relaxed">
              In real history, commanders Rao Jaimal and Rawat Patta faced the full brunt of Akbar’s siege engine. 
              Now step into KaalNetra&apos;s signature screen to compare your hypothetical decisions side-by-side with what actually happened in 1568.
            </p>
          </div>
        </div>

        {/* Primary Transition Actions */}
        <div className="historical-card p-6 corner-ornament flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            className="btn-historical-secondary w-full sm:w-auto text-xs py-3 px-6"
            onClick={() => {
              restart();
              goToStage('BRIEFING');
            }}
          >
            &#8634; Replay This Scenario
          </button>

          <button
            type="button"
            className="btn-historical-primary w-full sm:w-auto text-sm py-3.5 px-8"
            onClick={() => goToStage('COMPARE')}
          >
            <span>Compare with Real History</span>
            <span className="text-[#D1B16A]">&rarr;</span>
          </button>
        </div>
      </main>
    </div>
  );
}
