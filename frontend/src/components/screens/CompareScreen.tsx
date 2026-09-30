/**
 * KaalNetra — Historical Comparison Screen (Phase 5)
 *
 * Implements KaalNetra's signature educational feature:
 *   - Side-by-side Dual Timeline (Counterfactual Simulation vs Documented Historical Record)
 *   - "Why Are They Different?" in-depth analytical section:
 *       - Historical constraints
 *       - Available technology (Mughal mines/sabats vs ramparts)
 *       - Geography (Chittor plateau vs valley encirclement)
 *       - Resources (finite cistern water vs external supply)
 *       - Military & information limitations
 *       - Political & social context
 *   - Clear labels:
 *       "Counterfactual Simulation"
 *       "Documented Historical Record"
 *       "Simulation Assumption"
 *   - Historical evidence/source cards connecting claims to scenario sources
 *   - Navigation: "Proceed to Historical Reflection →"
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
  const [activeTab, setActiveTab] = useState<'dual_timeline' | 'why_different' | 'sources'>('dual_timeline');

  if (!scenario || !session) return null;

  const history = session.turnHistory;

  return (
    <div className="game-screen-container">
      <GameHeader badge="result" />

      <main className="compare-screen-layout">
        {/* Screen Header */}
        <div className="compare-screen-header">
          <div className="compare-labels-row">
            <span className="badge-simulation">⚔️ Counterfactual Simulation</span>
            <span className="compare-vs-badge">VS</span>
            <span className="badge-historical">📜 Documented Historical Record</span>
          </div>

          <h1 className="compare-title">Comparative Timeline &amp; Historical Analysis</h1>
          <p className="compare-subtitle">
            Juxtaposing your simulated defensive path against the documented events of the 1567–1568 siege of Chittor.
          </p>

          {/* Prominent Architectural Disclaimer */}
          <div className="simulation-assumption-banner">
            <span className="assumption-icon">ℹ️</span>
            <div>
              <strong>Simulation Assumption:</strong> The choices and states displayed under "Counterfactual Simulation"
              represent authored systemic models evaluated by KaalNetra's deterministic rule engine.
              They are educational what-if analyses and do <strong>not</strong> assert that history unfolded in this manner.
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="compare-nav-tabs">
          <button
            className={`compare-tab-btn ${activeTab === 'dual_timeline' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('dual_timeline')}
          >
            ⏱️ Dual Timelines (Side-by-Side)
          </button>
          <button
            className={`compare-tab-btn ${activeTab === 'why_different' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('why_different')}
          >
            🔍 Why Are They Different?
          </button>
          <button
            className={`compare-tab-btn ${activeTab === 'sources' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            📚 Evidence &amp; Source Index ({scenario.evidence.length})
          </button>
        </div>

        {/* TAB 1: Side-by-Side Dual Timelines */}
        {activeTab === 'dual_timeline' && (
          <section className="dual-timeline-section">
            <div className="dual-timeline-grid">
              {/* Left Column: Player Timeline */}
              <div className="timeline-pane player-pane">
                <PlayerTimeline history={history} />
              </div>

              {/* Right Column: Canonical Timeline */}
              <div className="timeline-pane canon-pane">
                <CanonicalTimeline
                  timeline={scenario.canonical_timeline}
                  evidenceList={scenario.evidence}
                  onSelectEvidence={(id) => setActiveEvidenceId(id)}
                />
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: Why Are They Different? */}
        {activeTab === 'why_different' && (
          <section className="why-different-section">
            <div className="why-different-header">
              <span className="section-eyebrow">Causal &amp; Contextual Dissection</span>
              <h2>Why Did Your Simulation Diverge From History?</h2>
              <p>
                Historical outcomes are rarely the result of a single isolated order.
                They are bounded by hard technological, geographic, logistical, and political realities.
              </p>
            </div>

            <div className="reasons-grid">
              {/* 1. Technology */}
              <div className="reason-card">
                <div className="reason-header">
                  <span className="reason-icon">💣</span>
                  <h3>1. Siege Technology &amp; Mining</h3>
                </div>
                <div className="reason-body">
                  <p>
                    <strong>Mughal Engineering:</strong> Akbar deployed thousands of sappers constructing covered
                    wooden galleries (<em>sabats</em>) wide enough for ten horsemen abreast, shielded by raw rawhide.
                  </p>
                  <p>
                    <strong>Subterranean Gunpowder Mines:</strong> The catastrophic failure of Chittor's Lakhota bastion
                    resulted from massive dual gunpowder mines detonated underground, blowing apart masonry that had
                    withstood direct catapult shot for centuries.
                  </p>
                  <span className="reason-tag">Constraint: Gunpowder Assault Dynamics</span>
                </div>
              </div>

              {/* 2. Geography & Encirclement */}
              <div className="reason-card">
                <div className="reason-header">
                  <span className="reason-icon">⛰️</span>
                  <h3>2. Geography &amp; Total Isolation</h3>
                </div>
                <div className="reason-body">
                  <p>
                    <strong>Plateau Advantage vs. Encirclement Trap:</strong> Chittor’s 500-foot scarp prevented cavalry
                    assault, but its 8-mile perimeter required massive troop dispersion along multiple gates (Suraj Pol,
                    Bhairon Pol, Hanuman Pol).
                  </p>
                  <p>
                    <strong>No External Relief:</strong> Once Akbar’s forces anchored camps across the Berach River and
                    southern plain, Chittor was completely sealed. No allied Rajput coalition could assemble in time to
                    relieve the fort.
                  </p>
                  <span className="reason-tag">Constraint: Zero External Reinforcements</span>
                </div>
              </div>

              {/* 3. Finite Resources vs. Empire Logistical Depth */}
              <div className="reason-card">
                <div className="reason-header">
                  <span className="reason-icon">💧</span>
                  <h3>3. Asymmetric Logistics &amp; Water</h3>
                </div>
                <div className="reason-body">
                  <p>
                    <strong>Finite Citadels:</strong> The fort relied solely on monsoon reservoirs like Gaumukh Kund and
                    paved rain cisterns. With 38,000 souls within (8,000 combatants + 30,000 civilians), every week of
                    siege drained rations without replenishment.
                  </p>
                  <p>
                    <strong>Imperial Supply Train:</strong> The Mughal army drew inexhaustible grain supplies from the
                    rich agricultural plains of Malwa and Delhi through established caravan supply lines.
                  </p>
                  <span className="reason-tag">Constraint: Resource Asymmetry</span>
                </div>
              </div>

              {/* 4. Command Structure & Psychological Crisis */}
              <div className="reason-card">
                <div className="reason-header">
                  <span className="reason-icon">👑</span>
                  <h3>4. Command &amp; Political Realities</h3>
                </div>
                <div className="reason-body">
                  <p>
                    <strong>Strategic Withdrawal of Udai Singh II:</strong> Rana Udai Singh’s council wisely insisted
                    he withdraw into the Aravalli forests to preserve the Guhila/Sisodia lineage, leaving Chittor to
                    commanders Jaimal and Patta.
                  </p>
                  <p>
                    <strong>The Death of Jaimal:</strong> In documented history, the mortal wounding of Jaimal at the
                    breach shattered defensive command. In your simulation, defense survived according to the cohesion
                    of your surviving garrison.
                  </p>
                  <span className="reason-tag">Constraint: Leadership Vulnerability</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: Evidence & Sources Index */}
        {activeTab === 'sources' && (
          <section className="sources-index-section">
            <div className="sources-index-header">
              <span className="section-eyebrow">Scholarly Rigor</span>
              <h2>Documented Historical Evidence &amp; Sources</h2>
              <p>
                Every historical assertion in KaalNetra is grounded in primary court chronicles, contemporary
                accounts, or authoritative scholarly syntheses. Click any card for details.
              </p>
            </div>

            <div className="evidence-cards-grid">
              {scenario.evidence.map((ev) => (
                <div
                  key={ev.id}
                  className="evidence-item-card"
                  onClick={() => setActiveEvidenceId(ev.id)}
                >
                  <div className="evidence-item-top">
                    <span className="evidence-badge-tag">{ev.evidence_level}</span>
                    <span className="evidence-type-tag">{ev.type}</span>
                  </div>
                  <h3 className="evidence-claim-title">{ev.claim}</h3>
                  <p className="evidence-source-line">
                    <strong>Source:</strong> {ev.source}
                  </p>
                  {ev.note && <p className="evidence-note-snippet">{ev.note}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="screen-footer">
          <button className="game-btn game-btn-secondary" onClick={prevStage}>
            &larr; Back to Final Outcome
          </button>

          <button
            className="game-btn game-btn-primary game-btn-lg"
            onClick={() => goToStage('REFLECTION')}
            id="proceed-to-reflection-btn"
          >
            Proceed to Historical Reflection &rarr;
          </button>
        </footer>
      </main>

      {/* Historical Evidence Drawer Modal */}
      <EvidenceDrawer
        evidenceList={scenario.evidence}
        activeEvidenceId={activeEvidenceId}
        onClose={() => setActiveEvidenceId(null)}
      />
    </div>
  );
}
