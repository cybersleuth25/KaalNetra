/**
 * KaalNetra — Dark Cinematic Historical Navigation Bar
 *
 * Left: KaalNetra logo + antique-gold emblem
 * Center: Home, Scenarios, Library, About
 * Right: Context actions + Login, Sign Up
 * Translucent dark background with subtle blur and antique gold underline for active items.
 */

import { useState } from 'react';
import { useStage, type GameStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import HistoricalGuideModal from './HistoricalGuideModal';
import KaalNetraEmblem from './KaalNetraEmblem';

const STAGE_LABELS: Record<GameStage, string> = {
  HOME: 'Home',
  SCENARIO: 'Scenario',
  CONTEXT: 'Historical Context',
  BRIEFING: 'War Council',
  DECISION_1: 'Decision 1',
  SIMULATION_1: 'Simulation',
  DECISION_2: 'Decision 2',
  OUTCOME: 'Final Outcome',
  COMPARE: 'Comparison',
  REFLECTION: 'Reflection',
};

const STAGES_ORDER: GameStage[] = [
  'SCENARIO',
  'CONTEXT',
  'BRIEFING',
  'DECISION_1',
  'SIMULATION_1',
  'DECISION_2',
  'OUTCOME',
  'COMPARE',
  'REFLECTION',
];

interface GameHeaderProps {
  currentStage?: GameStage;
  badge?: 'historical' | 'simulation' | 'result';
}

export default function GameHeader({ badge }: GameHeaderProps) {
  const { stage, prevStage, reset, goToStage } = useStage();
  const { restart } = useGameplay();
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);

  const handleRestart = () => {
    restart();
    reset();
  };

  const currentIdx = STAGES_ORDER.indexOf(stage);

  return (
    <>
      <header className="w-full bg-[#11110F]/90 backdrop-blur-md border-b border-[#2B251D] sticky top-0 z-40 transition-colors">
        <div className="w-full max-w-[84rem] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-6">
          
          {/* Left: KaalNetra Logo + Antique Gold Emblem */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={handleRestart}
          >
            <KaalNetraEmblem size={30} glow={true} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-['Cinzel'] text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#F4E9D0] group-hover:text-[#D1B16A] transition-colors leading-none">
                KAALNETRA
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8F8270] font-medium mt-1">
                Historical Simulation
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.15em] uppercase font-medium">
            <button
              type="button"
              onClick={() => goToStage('HOME')}
              className={`py-1.5 transition-colors relative ${
                stage === 'HOME'
                  ? 'text-[#D1B16A] font-bold'
                  : 'text-[#D8C9AA] hover:text-[#F4E9D0]'
              }`}
            >
              Home
              {stage === 'HOME' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B99652] shadow-[0_0_6px_#D1B16A]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => goToStage('SCENARIO')}
              className={`py-1.5 transition-colors relative ${
                stage === 'SCENARIO'
                  ? 'text-[#D1B16A] font-bold'
                  : 'text-[#D8C9AA] hover:text-[#F4E9D0]'
              }`}
            >
              Scenarios
              {stage === 'SCENARIO' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B99652] shadow-[0_0_6px_#D1B16A]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="py-1.5 text-[#D8C9AA] hover:text-[#D1B16A] transition-colors"
            >
              Library &bull; Sources
            </button>

            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="py-1.5 text-[#D8C9AA] hover:text-[#D1B16A] transition-colors"
            >
              About
            </button>
          </nav>

          {/* Right: Badge, Controls & Auth */}
          <div className="flex items-center gap-3">
            {badge === 'historical' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 border border-[#B99652]/60 bg-[#1A1815] text-[#D1B16A] tracking-[0.1em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D1B16A]" />
                Historical Record
              </span>
            )}
            {badge === 'simulation' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 border border-[#8C2D2E] bg-[#221010] text-[#FFA5A5] tracking-[0.1em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFA5A5]" />
                Simulation Result
              </span>
            )}
            {badge === 'result' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 border border-[#B99652] bg-[#1E1B16] text-[#D1B16A] tracking-[0.1em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D1B16A]" />
                Comparison
              </span>
            )}

            {/* Tactical Actions inside simulation flow */}
            {stage !== 'HOME' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-historical-secondary text-xs py-1.5 px-3"
                  onClick={prevStage}
                  title="Return to previous stage"
                >
                  &larr; Back
                </button>

                <button
                  type="button"
                  className="btn-historical-secondary text-xs py-1.5 px-3"
                  onClick={handleRestart}
                  title="Reset simulation to beginning"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Authentication Buttons (Restrained Historical Style) */}
            <div className="flex items-center gap-2 border-l border-[#2B251D] pl-3">
              <button
                type="button"
                onClick={() => setShowAuthModal('login')}
                className="text-xs tracking-wider uppercase text-[#D8C9AA] hover:text-[#F4E9D0] px-2.5 py-1.5 transition-colors font-medium"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal('signup')}
                className="text-xs tracking-wider uppercase border border-[#B99652] text-[#D1B16A] hover:text-[#FFF2D1] hover:border-[#D1B16A] px-3 py-1.5 bg-[#1A1815]/80 hover:bg-[#242019] transition-all font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Stepper Strip (When in scenario flow) */}
        {stage !== 'HOME' && currentIdx >= 0 && (
          <div className="w-full bg-[#141210] border-t border-[#2B251D] px-4 py-2 overflow-x-auto">
            <div className="w-full max-w-[84rem] mx-auto flex items-center justify-between gap-3 text-xs text-[#8F8270] whitespace-nowrap">
              {STAGES_ORDER.map((stg, idx) => {
                const isCurrent = stg === stage;
                const isPassed = idx < currentIdx;

                return (
                  <div key={stg} className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#B99652] text-[#11110F] shadow-[0_0_8px_#D1B16A]'
                          : isPassed
                          ? 'bg-[#2B251D] text-[#D1B16A]'
                          : 'border border-[#2B251D] text-[#635A4D]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className={isCurrent ? 'font-bold text-[#F4E9D0]' : isPassed ? 'text-[#D8C9AA]' : 'text-[#635A4D]'}>
                      {STAGE_LABELS[stg]}
                    </span>
                    {idx < STAGES_ORDER.length - 1 && (
                      <span className="text-[#2B251D] mx-1">&rsaquo;</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Historical Guide Modal */}
      {showGuideModal && (
        <HistoricalGuideModal onClose={() => setShowGuideModal(false)} />
      )}

      {/* About KaalNetra Archival Modal */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#161412] border border-[#B99652] text-[#D8C9AA] p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#2B251D] pb-3">
              <div className="flex items-center gap-3">
                <KaalNetraEmblem size={28} />
                <div>
                  <h2 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
                    About KaalNetra
                  </h2>
                  <span className="text-xs uppercase tracking-widest text-[#B99652] font-mono">
                    Interactive Historical Simulation Engine
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-[#8F8270] hover:text-[#D1B16A] text-xl font-bold p-1 leading-none transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-[#D8C9AA]">
              <p>
                <strong className="text-[#F4E9D0]">KaalNetra</strong> (&ldquo;The Eye of Time&rdquo;) is an interactive historiographical platform designed to bridge historical archives and strategy simulation.
              </p>
              
              <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-2">
                <div className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
                  The KaalNetra Historical Loop:
                </div>
                <div className="text-xs text-[#8F8270] flex flex-col gap-1.5 font-medium">
                  <div>1. <strong className="text-[#F4E9D0]">Historical Context:</strong> Review authentic documentation, geography, and leaders.</div>
                  <div>2. <strong className="text-[#F4E9D0]">Strategic Decision:</strong> Issue tactical orders in critical historical crises.</div>
                  <div>3. <strong className="text-[#F4E9D0]">Simulated Consequence:</strong> Experience hypothetical causal outcomes.</div>
                  <div>4. <strong className="text-[#F4E9D0]">Documented History:</strong> Compare side-by-side with immutable historical records.</div>
                  <div>5. <strong className="text-[#F4E9D0]">Historiographical Reflection:</strong> Understand why events unfolded as they did.</div>
                </div>
              </div>

              <p className="text-xs text-[#8F8270]">
                All canonical timelines are sourced from contemporaneous records including the <em>Akbarnama</em> of Abu&apos;l-Fazl, the <em>Muntakhab-ut-Tawarikh</em> of Bada&apos;uni, and modern historiographical scholarship by Dr. Satish Chandra and Dr. R.V. Somani.
              </p>
            </div>

            <div className="pt-3 border-t border-[#2B251D] flex justify-end">
              <button
                type="button"
                className="btn-historical-primary text-xs"
                onClick={() => setShowAboutModal(false)}
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal (Restrained Historical UI) */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAuthModal(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#161412] border border-[#B99652] text-[#D8C9AA] p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#2B251D] pb-3">
              <div className="flex items-center gap-3">
                <KaalNetraEmblem size={24} />
                <div>
                  <h3 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0]">
                    {showAuthModal === 'login' ? 'Commander Access' : 'Create Archival Profile'}
                  </h3>
                  <span className="text-[11px] uppercase tracking-wider text-[#B99652] font-mono">
                    Imperial Council Archives
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(null)}
                className="text-[#8F8270] hover:text-[#D1B16A] text-xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowAuthModal(null); }} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8F8270] font-semibold mb-1">
                  Archival Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="commander@kaalnetra.org"
                  className="w-full bg-[#11110F] border border-[#2B251D] text-[#F4E9D0] p-2.5 text-sm focus:outline-none focus:border-[#B99652]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8F8270] font-semibold mb-1">
                  Password Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#11110F] border border-[#2B251D] text-[#F4E9D0] p-2.5 text-sm focus:outline-none focus:border-[#B99652]"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-historical-primary w-full text-center">
                  {showAuthModal === 'login' ? 'Enter Archive' : 'Register Profile'} &rarr;
                </button>
              </div>

              <div className="text-center text-xs text-[#8F8270] pt-1">
                {showAuthModal === 'login' ? (
                  <span>
                    No profile yet?{' '}
                    <button
                      type="button"
                      className="text-[#D1B16A] hover:underline"
                      onClick={() => setShowAuthModal('signup')}
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Existing researcher?{' '}
                    <button
                      type="button"
                      className="text-[#D1B16A] hover:underline"
                      onClick={() => setShowAuthModal('login')}
                    >
                      Log in here
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
