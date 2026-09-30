/**
 * KaalNetra — Historical Comparison Screen
 *
 * Dual timeline comparison.
 * Features:
 *   - Two-column comparison: YOUR SIMULATION vs DOCUMENTED HISTORY
 *   - Visually obvious distinction (crimson accent vs gold/ochre accent)
 *   - Immutable canonical history
 *   - "Why Are They Different?" explanatory section covering:
 *       historical constraints, resources, geography, technology, military conditions, info limitations
 * Dark fortress aesthetic, antique gold trims, zero gradients.
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import PlayerTimeline from '../timeline/PlayerTimeline';
import CanonicalTimeline from '../timeline/CanonicalTimeline';
import EvidenceDrawer from '../common/EvidenceDrawer';

export default function CompareScreen() {
  const { goToStage, prevStage } = useStage();
  const { scenario, session } = useGameplay();
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);

  if (!scenario || !session) return null;

  const history = session.turnHistory;

  return (
    <div className="app-page-clean">
      <GameHeader badge="result" />

      <main className="clean-container py-10 space-y-12">
        {/* Screen Header */}
        <header className="pb-6 border-b border-[#272E3D] space-y-2">
          <div className="text-kicker">Compare The Two Timelines</div>
          <h1 className="serif-heading text-3xl md:text-5xl text-[#F4EFE6]">
            Your Game vs. Real History
          </h1>
          <p className="text-base text-[#B8B09F] max-w-3xl leading-relaxed">
            See how your defense choices compare side-by-side with what actually took place in the year 1568.
          </p>

          {/* Plain Educational Notice */}
          <div className="p-4 bg-[#141720] border-l-4 border-l-[#C5A059] border-[#272E3D] text-xs text-[#B8B09F] mt-4">
            <strong className="text-[#DFBE76]">How to read this:</strong> On the <strong>left</strong> is your imaginary battle outcome based on your choices. 
            On the <strong>right</strong> is real documented history written down by eyewitness historians in 1568.
          </div>
        </header>

        {/* Section 1: 2-Column Side-by-Side Comparison */}
        <section className="space-y-4">
          <h2 className="serif-title text-2xl text-[#F4EFE6]">
            Side-by-Side Timeline Comparison
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Player Timeline */}
            <div className="bg-[#141720] border border-[#272E3D] p-6 space-y-4 shadow-md">
              <PlayerTimeline history={history} />
            </div>

            {/* Right: Canonical Timeline */}
            <div className="bg-[#141720] border border-[#272E3D] p-6 space-y-4 shadow-md">
              <CanonicalTimeline
                timeline={scenario.canonical_timeline}
                evidenceList={scenario.evidence}
                onSelectEvidence={(id) => setActiveEvidenceId(id)}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Why Are They Different? */}
        <section className="bg-[#141720] border border-[#272E3D] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="border-b border-[#272E3D] pb-4">
            <div className="text-kicker">Historiographical Explanation</div>
            <h2 className="serif-heading text-2xl md:text-3xl text-[#F4EFE6] mt-1">
              Why Are They Different?
            </h2>
            <p className="text-sm text-[#B8B09F] mt-1">
              Key systemic factors that bound and governed the historical outcome at Chittor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-[#B8B09F] leading-relaxed">
            {/* 1. Constraints */}
            <div className="p-4 bg-[#0D0F14] border border-[#272E3D] space-y-2">
              <h3 className="font-bold text-[#F4EFE6] text-base">
                1. No Outside Rescue
              </h3>
              <p>
                Akbar’s army completely surrounded the mountain. King Udai Singh was fighting in the hills to save the kingdom, so no rescue army could ever come.
              </p>
            </div>

            {/* 2. Resources */}
            <div className="p-4 bg-[#0D0F14] border border-[#272E3D] space-y-2">
              <h3 className="font-bold text-[#F4EFE6] text-base">
                2. Limited Food &amp; Water
              </h3>
              <p>
                The fort had only the grain inside its towers and rainwater in rock tanks. Because the fort was surrounded, no new food or water could ever enter.
              </p>
            </div>

            {/* 3. Geography */}
            <div className="p-4 bg-[#0D0F14] border border-[#272E3D] space-y-2">
              <h3 className="font-bold text-[#F4EFE6] text-base">
                3. Giant Mountain Plateau
              </h3>
              <p>
                Chittor stood 500 feet high on a steep cliff, making ladder attacks impossible. But its 8-mile wall was so long that defenders were spread very thin.
              </p>
            </div>

            {/* 4. Technology */}
            <div className="p-4 bg-[#0D0F14] border border-[#272E3D] space-y-2">
              <h3 className="font-bold text-[#F4EFE6] text-base">
                4. Gunpowder Mines &amp; Tunnels
              </h3>
              <p>
                Akbar brought 5,000 diggers who built bullet-proof wooden tunnels (<em>sabats</em>) right up to the walls, then buried barrels of gunpowder to blow them up.
              </p>
            </div>

            {/* 5. Military Balance */}
            <div className="p-4 bg-[#0D0F14] border border-[#272E3D] space-y-2">
              <h3 className="font-bold text-[#F4EFE6] text-base">
                5. 8,000 vs. 60,000 Soldiers
              </h3>
              <p>
                The 8,000 Rajput defenders were outnumbered almost 8 to 1. Akbar had unlimited reinforcements, big bronze cannons, and gunners from across his empire.
              </p>
            </div>

            {/* 6. Information Limitations */}
            <div className="p-4 bg-[#0D0F14] border border-[#272E3D] space-y-2">
              <h3 className="font-bold text-[#F4EFE6] text-base">
                6. Fighting in the Dark
              </h3>
              <p>
                Defenders inside could not see through the smoke or underground. They had no way of knowing where the next gunpowder tunnel was until it detonated.
              </p>
            </div>
          </div>
        </section>

        {/* Transition Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            className="btn-secondary-clean"
            onClick={prevStage}
          >
            &larr; Back to Outcome
          </button>
          <button
            className="btn-primary-clean"
            onClick={() => goToStage('REFLECTION')}
          >
            Proceed to Historical Reflection &rarr;
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
