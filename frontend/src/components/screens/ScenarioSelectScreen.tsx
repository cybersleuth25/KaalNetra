/**
 * KaalNetra — Cinematic Historical Scenario Selection Screen
 *
 * Implements Section 5 of design specification:
 *   - Cinematic historical scenario cards
 *   - Image-first composition with 1–2px subtle gold border
 *   - Dark overlay, serif title, location, date / period
 *   - Restrained hover movement (image scale 1.03, gold border brightens, card rises 6px)
 *   - "Enter Scenario" historical action
 */

import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';

export default function ScenarioSelectScreen() {
  const { nextStage, goToStage } = useStage();
  const { scenario, isLoading, error } = useGameplay();

  if (isLoading) {
    return (
      <div className="app-page-clean">
        <GameHeader />
        <div className="clean-container py-24 text-center">
          <div className="inline-block p-8 bg-[#161412] border border-[#B99652] shadow-2xl">
            <p className="font-['Cinzel'] text-lg text-[#D1B16A]">Unrolling Historical Dossiers...</p>
            <p className="text-xs text-[#8F8270] mt-1 font-mono">Accessing Imperial Chronicles &bull; 1567 CE</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="app-page-clean">
        <GameHeader />
        <div className="clean-container py-24 text-center">
          <div className="inline-block p-8 bg-[#161412] border border-[#8C2D2E] shadow-2xl max-w-lg">
            <h3 className="font-['Cinzel'] text-xl text-[#FFA5A5] mb-2">Scenario Unavailable</h3>
            <p className="text-sm text-[#D8C9AA]">{error ?? 'Scenario archive could not be accessed.'}</p>
            <button
              className="btn-historical-secondary text-xs mt-4"
              onClick={() => goToStage('HOME')}
            >
              &larr; Return to Archives
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page-clean">
      <GameHeader />

      <main className="clean-container py-10 sm:py-14 space-y-10">
        {/* Section Header */}
        <div className="border-b border-[#2B251D] pb-6">
          <div className="text-kicker">Historical Operations Catalog</div>
          <h1 className="serif-heading text-3xl sm:text-4xl md:text-5xl text-[#F4E9D0] mt-1">
            Choose a Historical Scenario
          </h1>
          <p className="text-sm text-[#D8C9AA] max-w-3xl mt-2 leading-relaxed">
            Select a critical historical inflection point. Step into the shoes of commanding decision-makers, 
            test alternative strategies against systemic realities, and compare your outcome directly against documented records.
          </p>
        </div>

        {/* Primary Featured Scenario Card (Chittorgarh 1567) */}
        <section>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#B99652] mb-3 flex items-center gap-2">
            <span>◈ Active Campaign Dossier</span>
            <span className="w-12 h-px bg-[#B99652]/40" />
          </div>

          <div className="scenario-card-cinematic corner-ornament grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image-First Composition Column */}
            <div className="lg:col-span-7 scenario-media-frame relative min-h-[320px] lg:min-h-[440px]">
              <picture>
                <source srcSet="/assets/environments/chittor_overview.webp" type="image/webp" />
                <img
                  src="/assets/environments/chittor_overview.png"
                  alt="Panoramic view of Chittorgarh fortress"
                  className="w-full h-full object-cover"
                />
              </picture>
              <div className="scenario-media-overlay" />

              {/* Badges on artwork */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span className="text-[11px] font-bold px-3 py-1 bg-[#11110F]/90 border border-[#B99652] text-[#D1B16A] uppercase tracking-wider font-mono">
                  Mewar Chronicles &bull; 1567 CE
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 bg-[#11110F]/80 border border-[#2B251D] text-[#D8C9AA] uppercase tracking-wider font-mono">
                  Full Simulation Ready
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 hidden sm:block">
                <span className="text-[11px] text-[#D1B16A] font-['Cormorant_Garamond'] italic tracking-wide">
                  &ldquo;A 500-foot rocky citadel defended by 8,000 against Akbar&apos;s 60,000.&rdquo;
                </span>
              </div>
            </div>

            {/* Content & Metadata Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#161412] border-t lg:border-t-0 lg:border-l border-[#2B251D] space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8F8270] font-mono">
                  <span className="text-[#D1B16A] uppercase font-bold tracking-wider">
                    Location: Chittorgarh, Mewar
                  </span>
                  <span>Duration: 4 Months</span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#8F8270] font-semibold block font-mono">
                    Year 1567&ndash;1568 CE
                  </span>
                  <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-[#F4E9D0] mt-1 leading-tight">
                    The Defense of Chittor
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#D8C9AA] leading-relaxed">
                  Emperor Akbar has invested the mountain fortress of Chittor with 60,000 imperial troops, 
                  heavy bronze siege guns, and 5,000 sappers building bulletproof covered tunnels (sabats). 
                  Inside the citadel, commanders Rao Jaimal and Rawat Patta defend 30,000 citizens with 8,000 garrison warriors.
                </p>

                {/* Key Metrics / Armies */}
                <div className="grid grid-cols-2 gap-3 py-1 text-xs">
                  <div className="p-3 bg-[#11110F] border border-[#2B251D]">
                    <span className="text-[10px] uppercase tracking-wider text-[#B99652] block font-mono font-bold">
                      Garrison Force
                    </span>
                    <strong className="text-sm text-[#F4E9D0]">8,000 Soldiers</strong>
                    <span className="text-[10px] text-[#8F8270] block mt-0.5">30,000 Civilians</span>
                  </div>

                  <div className="p-3 bg-[#11110F] border border-[#2B251D]">
                    <span className="text-[10px] uppercase tracking-wider text-[#B99652] block font-mono font-bold">
                      Besieging Force
                    </span>
                    <strong className="text-sm text-[#F4E9D0]">60,000 Soldiers</strong>
                    <span className="text-[10px] text-[#8F8270] block mt-0.5">Imperial Artillery</span>
                  </div>
                </div>

                {/* Commanders list */}
                <div className="text-xs pt-2 border-t border-[#2B251D] text-[#8F8270]">
                  <strong className="text-[#D1B16A] uppercase tracking-wider block mb-1 font-mono text-[10px]">
                    Archival Characters:
                  </strong>
                  <span>Rao Jaimal Rathore &bull; Rawat Patta &bull; Rana Udai Singh II &bull; Emperor Akbar</span>
                </div>
              </div>

              {/* Enter Scenario Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  className="btn-historical-primary w-full text-center py-3.5 text-sm"
                  onClick={nextStage}
                >
                  <span>Enter Scenario</span>
                  <span className="text-[#D1B16A]">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Forthcoming Historical Archives (Museum Catalog Previews) */}
        <section className="space-y-4 pt-6 border-t border-[#2B251D]">
          <div className="flex items-center justify-between">
            <h3 className="font-['Cinzel'] text-xl text-[#F4E9D0]">
              Additional Archival Dossiers
            </h3>
            <span className="text-xs text-[#8F8270] font-mono uppercase">
              Archival Simulations Under Digitization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Panipat Preview */}
            <div className="historical-card p-6 opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between pb-2 border-b border-[#2B251D]">
                <span className="text-[11px] font-mono text-[#B99652] uppercase font-bold tracking-wider">
                  First Battle of Panipat &bull; 1526 CE
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#11110F] border border-[#2B251D] text-[#8F8270] uppercase font-mono">
                  Archived Record
                </span>
              </div>
              <h4 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] mt-3">
                Babur vs. Ibrahim Lodi
              </h4>
              <p className="text-xs text-[#D8C9AA] leading-relaxed mt-2">
                Field artillery and the tactical Tulghuma wheeling flank maneuver against the massive Afghan sultanate elephant corps on the northern plains.
              </p>
              <div className="mt-4 pt-3 border-t border-[#2B251D] flex items-center justify-between text-xs text-[#8F8270]">
                <span>Theater: Haryana Plains</span>
                <span className="text-[#B99652] font-mono text-[11px]">Primary Source: Baburnama</span>
              </div>
            </div>

            {/* Haldighati Preview */}
            <div className="historical-card p-6 opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between pb-2 border-b border-[#2B251D]">
                <span className="text-[11px] font-mono text-[#B99652] uppercase font-bold tracking-wider">
                  Battle of Haldighati &bull; 1576 CE
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#11110F] border border-[#2B251D] text-[#8F8270] uppercase font-mono">
                  Archived Record
                </span>
              </div>
              <h4 className="font-['Cinzel'] text-lg font-bold text-[#F4E9D0] mt-3">
                Maharana Pratap at the Yellow Pass
              </h4>
              <p className="text-xs text-[#D8C9AA] leading-relaxed mt-2">
                Mountain warfare in the narrow yellow turmeric clay defiles of the Aravalli range against the imperial vanguard led by Man Singh of Amber.
              </p>
              <div className="mt-4 pt-3 border-t border-[#2B251D] flex items-center justify-between text-xs text-[#8F8270]">
                <span>Theater: Khamnore Defile</span>
                <span className="text-[#B99652] font-mono text-[11px]">Primary Source: Rajprashasti</span>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Home Action */}
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            className="btn-historical-secondary text-xs"
            onClick={() => goToStage('HOME')}
          >
            &larr; Back to Introduction
          </button>
        </div>
      </main>
    </div>
  );
}
