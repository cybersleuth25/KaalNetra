/**
 * KaalNetra — Historical Reflection Screen (Phase 5)
 *
 * PRD §12:
 *   Signature educational conclusion:
 *     - What trade-off did your decision create?
 *     - Which resource became most important in your defense?
 *     - How did your decisions differ from the documented historical path?
 *     - What constraint was most difficult to manage?
 *   Do NOT create a grading system.
 *   Provides structured reflection cards, free inquiry insights, and replay options.
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';

export default function ReflectionScreen() {
  const { goToStage, reset: resetStage } = useStage();
  const { scenario, session, restart } = useGameplay();

  // Interactive reflection states
  const [selectedTradeoff, setSelectedTradeoff] = useState<string>('garrison_vs_fort');
  const [selectedConstraint, setSelectedConstraint] = useState<string>('no_relief');
  const [userReflectionText, setUserReflectionText] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<boolean>(false);

  if (!scenario || !session) return null;

  const handleRestart = () => {
    restart();
    goToStage('BRIEFING');
  };

  const handleFullReset = () => {
    restart();
    resetStage();
  };

  const handleSaveNotes = () => {
    setSavedNotes(true);
  };

  return (
    <div className="game-screen-container">
      <GameHeader badge="historical" />

      <main className="reflection-screen-layout">
        {/* Screen Header */}
        <div className="reflection-header">
          <span className="section-eyebrow">Historiographical Reflection</span>
          <h1 className="reflection-title">Historical Insights &amp; Reflection</h1>
          <p className="reflection-subtitle">
            History is fixed. Your decisions are not. Reflect upon the systemic trade-offs that governed the siege.
          </p>
        </div>

        {/* 4 Core Reflective Pillars */}
        <div className="reflection-pillars-grid">
          {/* Question 1: Trade-offs */}
          <div className="reflection-card">
            <div className="reflection-card-header">
              <span className="pillar-num">01</span>
              <h3>What Trade-Off Did Your Decisions Create?</h3>
            </div>
            <div className="reflection-card-body">
              <p>
                Every command directive in Mewar entailed an unavoidable cost. Select which core trade-off most shaped your defense:
              </p>
              <div className="interactive-options">
                <button
                  className={`pillar-option-btn ${selectedTradeoff === 'garrison_vs_fort' ? 'option-btn-active' : ''}`}
                  onClick={() => setSelectedTradeoff('garrison_vs_fort')}
                >
                  <strong>Garrison Lives vs. Wall Integrity:</strong> Sorties and wall concentrations cost defender lives to slow siege works.
                </button>
                <button
                  className={`pillar-option-btn ${selectedTradeoff === 'morale_vs_conservation' ? 'option-btn-active' : ''}`}
                  onClick={() => setSelectedTradeoff('morale_vs_conservation')}
                >
                  <strong>Morale vs. Supply Conservation:</strong> Rationing food and water preserved granaries but demoralized besieged troops.
                </button>
                <button
                  className={`pillar-option-btn ${selectedTradeoff === 'active_vs_passive' ? 'option-btn-active' : ''}`}
                  onClick={() => setSelectedTradeoff('active_vs_passive')}
                >
                  <strong>Active Sorties vs. Passive Containment:</strong> Aggressive defense disrupted saps but exhausted frontline elites.
                </button>
              </div>
            </div>
          </div>

          {/* Question 2: Critical Resource */}
          <div className="reflection-card">
            <div className="reflection-card-header">
              <span className="pillar-num">02</span>
              <h3>Which Parameter Governed Your Survival?</h3>
            </div>
            <div className="reflection-card-body">
              <div className="parameter-recap-box">
                <div className="recap-row">
                  <span>Final Fort Integrity:</span>
                  <strong>{session.currentState.fort_integrity}%</strong>
                </div>
                <div className="recap-row">
                  <span>Final Garrison Strength:</span>
                  <strong>{session.currentState.defenders}%</strong>
                </div>
                <div className="recap-row">
                  <span>Mughal Siege Progress:</span>
                  <strong>{session.currentState.siege_progress}%</strong>
                </div>
              </div>
              <p className="parameter-insight">
                {session.currentState.fort_integrity <= 40
                  ? 'Your fort integrity suffered heaviest. Mughal gunpowder mines and sapping eroded stone ramparts faster than your garrison could quarry stone.'
                  : session.currentState.defenders <= 50
                  ? 'Garrison attrition proved decisive. While walls held, casualties reduced your ability to contest multiple simultaneous breaches.'
                  : 'You preserved a balanced defense. However, the absence of external relief meant attrition would eventually mount over subsequent months.'}
              </p>
            </div>
          </div>

          {/* Question 3: Historical Constraints */}
          <div className="reflection-card">
            <div className="reflection-card-header">
              <span className="pillar-num">03</span>
              <h3>What Constraint Was Most Difficult to Manage?</h3>
            </div>
            <div className="reflection-card-body">
              <div className="interactive-options">
                <button
                  className={`pillar-option-btn ${selectedConstraint === 'no_relief' ? 'option-btn-active' : ''}`}
                  onClick={() => setSelectedConstraint('no_relief')}
                >
                  <strong>Complete Strategic Encirclement:</strong> No allied army was coming. The defense was fighting a battle of pure attrition.
                </button>
                <button
                  className={`pillar-option-btn ${selectedConstraint === 'gunpowder' ? 'option-btn-active' : ''}`}
                  onClick={() => setSelectedConstraint('gunpowder')}
                >
                  <strong>Asymmetric Gunpowder Technology:</strong> Mughal heavy cannons and underground mines negated traditional stone height.
                </button>
                <button
                  className={`pillar-option-btn ${selectedConstraint === 'finite_water' ? 'option-btn-active' : ''}`}
                  onClick={() => setSelectedConstraint('finite_water')}
                >
                  <strong>Finite Citadel Cisterns:</strong> Water supplies decreased every single turn with zero chance of resupply.
                </button>
              </div>
            </div>
          </div>

          {/* Question 4: Freeform Learner Journal */}
          <div className="reflection-card">
            <div className="reflection-card-header">
              <span className="pillar-num">04</span>
              <h3>Commander's Analytical Journal</h3>
            </div>
            <div className="reflection-card-body">
              <p>Record your personal synthesis or observations on the historical divergence:</p>
              <textarea
                className="reflection-textarea"
                rows={4}
                placeholder="E.g., By choosing to preserve garrison strength early on, siege works advanced faster, creating a harsher breach crisis in Decision 2..."
                value={userReflectionText}
                onChange={(e) => {
                  setUserReflectionText(e.target.value);
                  setSavedNotes(false);
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button className="game-btn game-btn-secondary" onClick={handleSaveNotes}>
                  {savedNotes ? '✓ Notes Saved' : 'Save Observations'}
                </button>
                {savedNotes && <span style={{ color: '#34d399', fontSize: '0.8rem' }}>Saved locally</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Guided Historical Takeaway Box */}
        <section className="takeaway-banner">
          <div className="takeaway-crest">🏛️</div>
          <div className="takeaway-text">
            <h3>The Core Historical Lesson of Chittor (1567–1568)</h3>
            <p>
              The defense of Chittor demonstrated that fortress architecture designed for medieval siegecraft
              could not indefinitely withstand the early modern military revolution—specifically the combination
              of covered sapping (<em>sabats</em>), subterranean gunpowder mining, and imperial logistical depth.
              Rana Udai Singh’s decision to withdraw to the hills ensured the survival of Mewar, laying the foundation
              for Maharana Pratap's enduring resistance across the decades to come.
            </p>
          </div>
        </section>

        {/* Screen Footer & Navigation */}
        <footer className="screen-footer reflection-footer">
          <button className="game-btn game-btn-secondary" onClick={() => goToStage('COMPARE')}>
            &larr; Back to Comparison
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="game-btn game-btn-secondary" onClick={handleFullReset}>
              Return to Home
            </button>
            <button
              className="game-btn game-btn-primary game-btn-lg"
              onClick={handleRestart}
              id="try-alternate-path-final-btn"
            >
              ↺ Replay Alternate Strategic Path &rarr;
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
