/**
 * KaalNetra — Historical Context Screen
 *
 * PRD §5:
 *   Layout:
 *     - Large image on left
 *     - Facts on right
 *     - Timeline strip at bottom
 *   Facts should be concise.
 *   A "Historical Record" badge is present.
 *   Player role: Decision-maker within defensive command structure (NOT literally Jaimal).
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import CharacterPortrait from '../common/CharacterPortrait';
import { ENVIRONMENTS } from '../../assets/registry';

export default function ContextScreen() {
  const { nextStage, prevStage } = useStage();
  const { scenario } = useGameplay();
  const [activeScene, setActiveScene] = useState<'overview' | 'camp'>('overview');

  if (!scenario) return null;

  const currentEnv = activeScene === 'overview'
    ? ENVIRONMENTS.chittor_overview
    : ENVIRONMENTS.mughal_siege_camp;

  return (
    <div className="game-screen-container">
      <GameHeader badge="historical" />

      <main className="context-screen-layout">
        <div className="context-header">
          <div className="context-badge-row">
            <span className="badge-historical">📜 Documented Historical Record</span>
            <span className="context-date-pill">{scenario.period}</span>
          </div>
          <h1 className="context-title">The Fall of Mewar’s Colossus</h1>
          <p className="context-subtitle">
            Documented historical background prior to the defensive command’s pivotal decisions.
          </p>
        </div>

        {/* Strategic Monarchy Context: Udai Singh II vs Akbar */}
        <section className="monarchs-overview-strip bg-stone-900/80 border border-amber-600/25 rounded-lg p-4 mb-4">
          <div className="text-center mb-3">
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-serif font-bold">
              The Sovereign Confrontation (1567)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mewar Ruler */}
            <div className="flex items-center gap-3.5 bg-stone-950/60 border border-red-900/40 rounded-lg p-3">
              <CharacterPortrait characterIdOrKey="udai_singh" size="sm" showBadge={false} />
              <div className="text-left flex-1">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/80 text-amber-200 border border-red-800/50 font-bold">
                  🛡️ Mewar Sovereignty
                </span>
                <h4 className="font-serif font-bold text-amber-100 text-sm mt-1">Maharana Udai Singh II</h4>
                <p className="text-[11px] text-stone-300 leading-snug mt-1">
                  Advised by his council to withdraw into the Aravalli hills to safeguard the Sisodia lineage and establish guerrilla depth, leaving Chittorgarh in the custody of Jaimal and Patta.
                </p>
              </div>
            </div>

            {/* Mughal Besieger */}
            <div className="flex items-center gap-3.5 bg-stone-950/60 border border-emerald-900/40 rounded-lg p-3">
              <CharacterPortrait characterIdOrKey="akbar" size="sm" showBadge={false} />
              <div className="text-left flex-1">
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-200 border border-emerald-800/50 font-bold">
                  ⚔️ Imperial Mughal Crown
                </span>
                <h4 className="font-serif font-bold text-emerald-100 text-sm mt-1">Jalal-ud-din Akbar</h4>
                <p className="text-[11px] text-stone-300 leading-snug mt-1">
                  Personally directed the grand siege with 60,000 troops, employing Ottoman ordnance experts, 5,000 sappers, and heavy cannons to neutralize Chittor's natural escarpment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Split: Image Left, Facts Right */}
        <div className="context-split-grid">
          {/* Left Column: Visual Asset */}
          <div className="context-visual-pane">
            <div className="context-img-frame">
              {/* Scene Switcher Buttons */}
              <div className="flex gap-1.5 mb-2">
                <button
                  onClick={() => setActiveScene('overview')}
                  className={`text-xs px-2.5 py-1 rounded transition-all ${
                    activeScene === 'overview'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 hover:text-amber-200'
                  }`}
                >
                  🏰 Chittor Escarpment
                </button>
                <button
                  onClick={() => setActiveScene('camp')}
                  className={`text-xs px-2.5 py-1 rounded transition-all ${
                    activeScene === 'camp'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 hover:text-amber-200'
                  }`}
                >
                  ⛺ Imperial Siege Encampment
                </button>
              </div>

              <img
                src={currentEnv.src}
                alt={currentEnv.name}
                loading="eager"
                decoding="async"
                className="context-hero-img object-cover rounded-md"
                style={{ aspectRatio: '16/9', maxHeight: '280px', width: '100%' }}
              />
              <div className="context-img-caption">
                <strong>{currentEnv.name}</strong> &mdash; {currentEnv.description}
              </div>
            </div>

            {/* Player Role Box */}
            <div className="player-role-card">
              <div className="role-icon">🛡️</div>
              <div className="role-text">
                <h4>Your Command Role</h4>
                <p>
                  You are a decision-maker operating within the Mewar defensive council.
                  You evaluate logistical, military, and structural orders alongside historical commanders
                  <strong> Rao Jaimal Rathore</strong> and <strong>Patta Chundawat</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Historical Facts */}
          <div className="context-facts-pane">
            <h2 className="facts-heading">Documented Strategic Realities</h2>

            <ul className="facts-list">
              {scenario.historical_context.map((fact, idx) => (
                <li key={idx} className="fact-item">
                  <span className="fact-bullet">{idx + 1}</span>
                  <div className="fact-content">
                    <p>{fact}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Historical Constraints Card */}
            {scenario.historical_constraints && (
              <div className="constraints-card">
                <h3>Historical Constraints</h3>
                <ul>
                  {scenario.historical_constraints.map((c, i) => (
                    <li key={i}>
                      <strong>{c.id.replace(/_/g, ' ')}:</strong> {c.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Timeline Strip: Canonical History */}
        <section className="context-timeline-strip">
          <h3 className="timeline-strip-title">Chronological Sequence (Documented History)</h3>
          <div className="timeline-horizontal-track">
            {scenario.canonical_timeline.map((ev) => (
              <div key={ev.id} className="timeline-node-card">
                <span className="node-date">{ev.date_label}</span>
                <h4 className="node-title">{ev.title}</h4>
                <p className="node-desc">{ev.description}</p>
                <span className="node-badge">{ev.evidence_level}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="screen-footer">
          <button className="game-btn game-btn-secondary" onClick={prevStage}>
            &larr; Back to Scenarios
          </button>
          <button
            className="game-btn game-btn-primary"
            onClick={nextStage}
            id="proceed-to-briefing-btn"
          >
            Proceed to Council Briefing &rarr;
          </button>
        </footer>
      </main>
    </div>
  );
}
