/**
 * KaalNetra — Cinematic Historical Hero / Landing Screen
 *
 * Visual Language:
 *   - Full-bleed historical background with dark cinematic overlay & warm vignette
 *   - Elegant typography hierarchy (Cinzel monumental title, tracked subtitle, Cormorant quote)
 *   - Primary CTA: "ENTER HISTORY"
 *   - Secondary CTA: "EXPLORE SCENARIOS"
 *   - Premium historical interface controls (thin gold border, dark translucent background, soft hover glow)
 *   - Visual presentation of KaalNetra's signature 5-step loop
 */

import { useStage } from '../../app/StageContext';
import GameHeader from '../common/GameHeader';
import KaalNetraEmblem from '../common/KaalNetraEmblem';

export default function HomeScreen() {
  const { goToStage } = useStage();

  return (
    <div className="app-page-clean">
      <GameHeader />

      {/* Cinematic Hero Entrance */}
      <section className="hero-cinematic-wrapper">
        {/* Full-width Historical Background Image */}
        <div className="hero-bg-layer">
          <picture>
            <source srcSet="/assets/environments/chittor_overview.webp" type="image/webp" />
            <img
              src="/assets/environments/chittor_overview.png"
              alt="The Ancient Mountain Citadel of Chittorgarh"
              className="hero-bg-image"
            />
          </picture>
        </div>

        {/* Dark Cinematic Overlay with Warm Vignette */}
        <div className="hero-vignette-overlay" />

        {/* Foreground Hero Content */}
        <div className="hero-content-layer">
          {/* Subtle Archival Seal */}
          <div className="hero-emblem-badge corner-ornament">
            <KaalNetraEmblem size={22} glow={true} />
            <span className="text-xs uppercase tracking-[0.22em] text-[#D1B16A] font-medium font-['Cinzel']">
              Mewar Chronicles &bull; 1567 CE
            </span>
          </div>

          {/* Monumental Hero Headings */}
          <h1 className="hero-title-epic">
            KAALNETRA
          </h1>

          <div className="hero-subtitle-tracking">
            Interactive Historical Simulation
          </div>

          {/* Historical Signature Quote */}
          <blockquote className="hero-quote-scripture">
            &ldquo;Step into a moment history already decided.&rdquo;
          </blockquote>

          {/* Narrative Premise */}
          <p className="hero-description-prose">
            October 1567. Emperor Akbar encircles the mountain fortress of Chittorgarh with 60,000 imperial troops. 
            Within the stone citadel, 8,000 Rajput defenders and 30,000 citizens prepare for siege. 
            Assume command in the war room, issue critical strategic directives, experience the simulated consequences, 
            and compare your choices directly against documented history.
          </p>

          {/* Primary & Secondary Restrained CTAs */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-historical-primary"
              onClick={() => goToStage('SCENARIO')}
            >
              <span>Enter History</span>
              <span className="text-[#D1B16A]">&rarr;</span>
            </button>

            <button
              type="button"
              className="btn-historical-secondary"
              onClick={() => goToStage('SCENARIO')}
            >
              Explore Scenarios
            </button>
          </div>

          {/* Visual Representation of KaalNetra's Core 5-Step Loop */}
          <div className="hero-loop-bar corner-ornament">
            <span className="hero-loop-item">1. Historical Context</span>
            <span className="hero-loop-arrow">&rarr;</span>
            <span className="hero-loop-item">2. Strategic Decision</span>
            <span className="hero-loop-arrow">&rarr;</span>
            <span className="hero-loop-item">3. Simulated Consequence</span>
            <span className="hero-loop-arrow">&rarr;</span>
            <span className="hero-loop-item">4. Documented History</span>
            <span className="hero-loop-arrow">&rarr;</span>
            <span className="hero-loop-item">5. Historiographical Reflection</span>
          </div>
        </div>
      </section>

      {/* Archival Campaign Briefing Section */}
      <section className="clean-container py-14 border-t border-[#2B251D]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-kicker justify-center mb-1">Archival Campaign Record</div>
          <h2 className="serif-heading text-2xl sm:text-3xl text-[#F4E9D0]">
            The Siege of Chittorgarh Fortress
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-[#B99652] mt-1 font-mono">
            October 1567 &ndash; February 1568 &bull; Rajasthan, India
          </p>
        </div>

        {/* 3 Archival Dossier Keypoint Plaques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="historical-card p-6 corner-ornament">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#B99652]">
                Fortified Theater
              </span>
              <span className="text-xs text-[#8F8270] font-mono">500 ft Plateau</span>
            </div>
            <h3 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] mt-3">
              Chittor Citadel
            </h3>
            <p className="text-xs text-[#D8C9AA] leading-relaxed mt-2">
              Eight miles of stone ramparts high above the plains. 84 water reservoirs and rainwater pools (Gaumukh) enabled the garrison to hold out without an external river.
            </p>
          </div>

          <div className="historical-card p-6 corner-ornament">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#B99652]">
                Mewar Garrison
              </span>
              <span className="text-xs text-[#8F8270] font-mono">8,000 Rajput Warriors</span>
            </div>
            <h3 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] mt-3">
              Jaimal &amp; Patta
            </h3>
            <p className="text-xs text-[#D8C9AA] leading-relaxed mt-2">
              With Maharana Udai Singh II fighting a guerrilla campaign in the Aravalli hills, commanders Rao Jaimal and Rawat Patta led an unreinforced defense of 30,000 citizens.
            </p>
          </div>

          <div className="historical-card p-6 corner-ornament">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#B99652]">
                Imperial Besieger
              </span>
              <span className="text-xs text-[#8F8270] font-mono">60,000 Soldiers</span>
            </div>
            <h3 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] mt-3">
              Emperor Akbar
            </h3>
            <p className="text-xs text-[#D8C9AA] leading-relaxed mt-2">
              Armed with massive bronze siege guns, 5,000 miners building bullet-proof covered tunnels (sabats), and underground gunpowder mines to fracture the citadel walls.
            </p>
          </div>
        </div>

        {/* Enter Scenario Action Strip */}
        <div className="mt-12 text-center">
          <button
            type="button"
            className="btn-historical-primary text-sm py-3 px-10"
            onClick={() => goToStage('SCENARIO')}
          >
            Launch Chittor Campaign Dossier &rarr;
          </button>
        </div>
      </section>

      {/* Archival Colophon Footer */}
      <footer className="w-full bg-[#11110F] border-t border-[#2B251D] py-6 text-xs text-[#8F8270]">
        <div className="clean-container flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <KaalNetraEmblem size={18} />
            <span className="font-['Cinzel'] text-[#D8C9AA] font-bold tracking-wider">KAALNETRA</span>
            <span className="text-[#635A4D]">&bull;</span>
            <span>Interactive Historical Simulation</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-[#8F8270]">
            <span>SIH 26208</span>
            <span>&bull;</span>
            <span>Primary Sources: Akbarnama &bull; Bada&apos;uni &bull; Somani</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
