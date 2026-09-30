/**
 * KaalNetra — Historical Reflection Screen
 *
 * Historiographical thinking screen:
 *   - What trade-off did your decision create?
 *   - Which resource became most important?
 *   - How did decisions differ from documented history?
 *   - What constraint was most difficult to manage?
 * Zero grading system. Replay loop.
 * Dark fortress theme, antique gold trims, zero gradients.
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

      <main className="clean-container py-10 space-y-10">
        {/* Reflection Header */}
        <header className="pb-6 border-b border-[#272E3D] space-y-2">
          <div className="text-kicker">Review &amp; Historiographical Reflection</div>
          <h1 className="serif-heading text-3xl md:text-5xl text-[#F4EFE6]">
            Think About Your Choices
          </h1>
          <p className="text-base text-[#B8B09F] max-w-3xl leading-relaxed">
            Real history happened in one specific way. In this game, you tested what might have happened if leaders made different choices.
          </p>
        </header>

        {/* 4 Core Reflective Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Trade-offs */}
          <div className="bg-[#141720] border border-[#272E3D] p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76] font-mono">
                Question 01
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                What was the cost of your choices?
              </h3>
            </div>
            <p className="text-sm text-[#B8B09F] leading-relaxed">
              In war, every action has a trade-off. Which trade-off felt most important to you?
            </p>
            <div className="space-y-2 text-xs">
              <button
                className={`w-full text-left p-3 border transition-colors ${
                  selectedTradeoff === 'garrison_vs_fort'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setSelectedTradeoff('garrison_vs_fort')}
              >
                <strong className="text-[#DFBE76]">Soldiers vs. Walls:</strong> Sending troops outside to attack destroyed enemy tunnels, but brave soldiers died who could never be replaced.
              </button>
              <button
                className={`w-full text-left p-3 border transition-colors ${
                  selectedTradeoff === 'morale_vs_conservation'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setSelectedTradeoff('morale_vs_conservation')}
              >
                <strong className="text-[#DFBE76]">Courage vs. Saving Food:</strong> Cutting food rations made food last longer, but hungry defenders lost their energy and spirit.
              </button>
            </div>
          </div>

          {/* Question 2: Decisive Constraints */}
          <div className="bg-[#141720] border border-[#272E3D] p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76] font-mono">
                Question 02
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                Which problem was hardest to solve?
              </h3>
            </div>
            <p className="text-sm text-[#B8B09F] leading-relaxed">
              Pick the rule of the siege that made surviving feel hardest:
            </p>
            <div className="space-y-2 text-xs">
              <button
                className={`w-full text-left p-3 border transition-colors ${
                  selectedConstraint === 'no_relief'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setSelectedConstraint('no_relief')}
              >
                <strong className="text-[#DFBE76]">Nobody Coming to Help:</strong> King Udai Singh was saving the rest of his army in the hills, so Chittor had to stand all alone.
              </button>
              <button
                className={`w-full text-left p-3 border transition-colors ${
                  selectedConstraint === 'finite_water'
                    ? 'border-[#C5A059] bg-[#1B202B] text-[#F4EFE6] font-semibold'
                    : 'border-[#272E3D] bg-[#0D0F14] text-[#B8B09F] hover:bg-[#1B202B]'
                }`}
                onClick={() => setSelectedConstraint('finite_water')}
              >
                <strong className="text-[#DFBE76]">Only Rainwater Tanks:</strong> 38,000 soldiers and villagers had only rainwater stored in rock tanks. Once it ran out, there was no water left.
              </button>
            </div>
          </div>

          {/* Question 3: Historical Divergence */}
          <div className="bg-[#141720] border border-[#272E3D] p-6 space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76] font-mono">
                Question 03
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                What happened in real history?
              </h3>
            </div>
            <p className="text-sm text-[#B8B09F] leading-relaxed">
              In real history, commanders Jaimal and Patta made aggressive night raids and repaired wall breaks under direct enemy fire. 
              When commander Jaimal was killed by a gunshot in February 1568, the remaining defenders fought one last heroic battle.
            </p>
          </div>

          {/* Question 4: Educational Conclusion */}
          <div className="bg-[#141720] border border-[#272E3D] p-6 space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-[#0D0F14] border border-[#272E3D] text-[#DFBE76] font-mono">
                Question 04
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                Why ask &quot;What If?&quot;
              </h3>
            </div>
            <p className="text-sm text-[#B8B09F] leading-relaxed">
              Asking &quot;What If&quot; helps us understand that historical leaders weren&apos;t just lucky or unlucky. 
              They were dealing with very real challenges like food, water, giant cannons, and geographic location.
            </p>
          </div>
        </div>

        {/* Optional AI Reflection Assistant */}
        <section className="bg-[#141720] border border-[#272E3D] p-6 sm:p-8 shadow-md">
          <ReflectionAssistant scenario={scenario} />
        </section>

        {/* Replay & Final Actions */}
        <div className="bg-[#141720] border border-[#272E3D] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <button
            className="btn-secondary-clean w-full sm:w-auto"
            onClick={handleFullReset}
          >
            &larr; Return to Archives
          </button>

          <button
            className="btn-primary-clean w-full sm:w-auto text-base py-3 px-8"
            onClick={handleRestart}
          >
            &#8634; Replay Scenario with Alternate Choices
          </button>
        </div>
      </main>
    </div>
  );
}
