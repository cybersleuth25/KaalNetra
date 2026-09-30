/**
 * KaalNetra — Historical Context Screen
 *
 * Immersive historical prologue.
 * Shows:
 *   - Overview header with Date, Location, and Armies
 *   - 2-Column Story: Fort Artwork on Left + Story beats on Right
 *   - 4 Leaders across full width (Jaimal, Patta, Udai Singh II, Akbar)
 *   - Primary Sources in a dignified bottom panel
 *   - Smooth progression to War Council
 * Dark fortress theme, antique gold trims, zero gradients.
 */

import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import CharacterPortrait from '../common/CharacterPortrait';
import { ENVIRONMENTS } from '../../assets/registry';

export default function ContextScreen() {
  const { nextStage, prevStage } = useStage();
  const { scenario } = useGameplay();

  if (!scenario) return null;

  return (
    <div className="app-page-clean">
      <GameHeader badge="historical" />

      <main className="clean-container py-8 sm:py-10 space-y-8">
        {/* Story Header */}
        <header className="pb-5 border-b border-[#272E3D]">
          <div className="text-kicker">The True Historical Story</div>
          <h1 className="serif-heading text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6] mt-1">
            The Siege of Chittor Fort
          </h1>
          <div className="mt-3 text-sm flex flex-wrap items-center gap-3">
            <span className="bg-[#141720] px-3 py-1 border border-[#272E3D] text-[#B8B09F]">
              <strong className="text-[#DFBE76]">Date:</strong> October 1567 &ndash; February 1568
            </span>
            <span className="bg-[#141720] px-3 py-1 border border-[#272E3D] text-[#B8B09F]">
              <strong className="text-[#DFBE76]">Location:</strong> Chittorgarh Fort, Mewar
            </span>
            <span className="bg-[#141720] px-3 py-1 border border-[#272E3D] text-[#B8B09F]">
              <strong className="text-[#DFBE76]">Defenders:</strong> 8,000 Rajput Warriors
            </span>
            <span className="bg-[#141720] px-3 py-1 border border-[#272E3D] text-[#B8B09F]">
              <strong className="text-[#DFBE76]">Besiegers:</strong> 60,000 Mughal Imperial Troops
            </span>
          </div>
        </header>

        {/* 2-Column Overview */}
        <div className="layout-sidebar-grid">
          {/* Left Column: Fort Illustration */}
          <div className="space-y-4">
            <figure className="border border-[#C5A059] bg-[#141720] p-2.5 shadow-md">
              <picture>
                <source srcSet={ENVIRONMENTS.chittor_overview.src} type="image/webp" />
                <img
                  src={ENVIRONMENTS.chittor_overview.fallbackSrc ?? ENVIRONMENTS.chittor_overview.src}
                  alt="Chittor Fort Plateau"
                  className="w-full aspect-[16/10] object-cover border border-[#272E3D]"
                />
              </picture>
              <figcaption className="text-xs text-[#DFBE76] mt-2.5 text-center font-serif">
                Chittorgarh sits on a 500-foot-tall rocky plateau, protected by 8 miles of stone ramparts.
              </figcaption>
            </figure>

            <div className="p-4 bg-[#141720] border border-[#272E3D]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block mb-1">
                Fort Fortress Fact
              </span>
              <p className="text-xs text-[#B8B09F] leading-relaxed">
                The fortress held 84 water reservoirs and rainwater pools (called <em>Gaumukh</em>), 
                allowing thousands of people to hold out for months without an outside river.
              </p>
            </div>
          </div>

          {/* Right Column: The 3 Story Beats */}
          <div className="space-y-4">
            <div className="p-5 bg-[#141720] border border-[#272E3D] hover:border-[#3D4659] transition-colors space-y-2">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                1. The Mughal Attack
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                Emperor Akbar Arrives with 60,000 Soldiers
              </h3>
              <p className="text-sm text-[#B8B09F] leading-relaxed">
                In October 1567, Emperor Akbar marched to conquer Chittor &mdash; the ultimate symbol of Rajput independence. 
                His army brought giant bronze cannons, 5,000 diggers, and sealed every trail surrounding the mountain.
              </p>
            </div>

            <div className="p-5 bg-[#141720] border border-[#272E3D] hover:border-[#3D4659] transition-colors space-y-2">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                2. The King&apos;s Strategy
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                King Udai Singh Saves the Royal Dynasty
              </h3>
              <p className="text-sm text-[#B8B09F] leading-relaxed">
                Knowing that staying in the fort would risk total destruction of the royal family, 
                King Udai Singh II took part of the army into the rugged Aravalli hills to fight on. 
                He placed his two best commanders &mdash; <strong>Rao Jaimal</strong> and <strong>Rawat Patta</strong> &mdash; 
                in charge of 8,000 garrison fighters and 30,000 villagers inside Chittor.
              </p>
            </div>

            <div className="p-5 bg-[#141720] border border-[#272E3D] hover:border-[#3D4659] transition-colors space-y-2">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                3. The Secret Weapon
              </span>
              <h3 className="serif-title text-xl text-[#F4EFE6]">
                Giant Covered Tunnels (Sabats) Creep Up the Rock
              </h3>
              <p className="text-sm text-[#B8B09F] leading-relaxed">
                Because the cliffs were too steep to climb with ladders, Akbar ordered his engineers to construct 
                massive armored wooden tunnels called <em>sabats</em>. Covered in raw bull hides to deflect fire and arrows, 
                these tunnels crept closer to the fort walls every day to place gunpowder mines underneath!
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Leader Card Deck */}
        <section className="space-y-4 pt-4 border-t border-[#272E3D]">
          <div className="flex items-center justify-between">
            <h2 className="serif-title text-2xl text-[#F4EFE6]">
              The 4 Key Historical Leaders
            </h2>
            <span className="text-xs text-[#B8B09F]">
              2 Defenders inside &bull; 1 King in the hills &bull; 1 Imperial Besieger
            </span>
          </div>

          <div className="layout-4col-grid">
            {/* Jaimal */}
            <div className="p-4 bg-[#141720] border border-[#272E3D] hover:border-[#C5A059] transition-colors flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <CharacterPortrait characterIdOrKey="jaimal" size="md" showBadge={false} />
                <div>
                  <h3 className="font-bold text-base text-[#F4EFE6]">Rao Jaimal</h3>
                  <span className="text-xs font-semibold text-[#DFBE76] block">Chief Defender</span>
                  <span className="text-[11px] text-[#788194]">Rathore Chieftain</span>
                </div>
              </div>
              <p className="text-xs text-[#B8B09F] leading-relaxed">
                Careful and tireless. He personally patrolled the walls day and night and directed repair teams under direct enemy fire.
              </p>
            </div>

            {/* Patta */}
            <div className="p-4 bg-[#141720] border border-[#272E3D] hover:border-[#C5A059] transition-colors flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <CharacterPortrait characterIdOrKey="patta" size="md" showBadge={false} />
                <div>
                  <h3 className="font-bold text-base text-[#F4EFE6]">Rawat Patta</h3>
                  <span className="text-xs font-semibold text-[#DFBE76] block">Raid Commander</span>
                  <span className="text-[11px] text-[#788194]">Lord of Kelwa</span>
                </div>
              </div>
              <p className="text-xs text-[#B8B09F] leading-relaxed">
                Fearless and aggressive. He led fast nighttime surprise sorties outside the gates to burn enemy siege equipment.
              </p>
            </div>

            {/* Udai Singh II */}
            <div className="p-4 bg-[#141720] border border-[#272E3D] hover:border-[#C5A059] transition-colors flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <CharacterPortrait characterIdOrKey="udai_singh" size="md" showBadge={false} />
                <div>
                  <h3 className="font-bold text-base text-[#F4EFE6]">Rana Udai Singh</h3>
                  <span className="text-xs font-semibold text-[#B8B09F] block">Maharana of Mewar</span>
                  <span className="text-[11px] text-[#788194]">Dynastic Leader</span>
                </div>
              </div>
              <p className="text-xs text-[#B8B09F] leading-relaxed">
                Preserved the royal lineage by fighting a guerrilla war from the Aravalli hills; he later founded the city of Udaipur.
              </p>
            </div>

            {/* Akbar */}
            <div className="p-4 bg-[#141720] border border-[#272E3D] hover:border-[#C5A059] transition-colors flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <CharacterPortrait characterIdOrKey="akbar" size="md" showBadge={false} />
                <div>
                  <h3 className="font-bold text-base text-[#F4EFE6]">Emperor Akbar</h3>
                  <span className="text-xs font-semibold text-[#DFBE76] block">Mughal Padshah</span>
                  <span className="text-[11px] text-[#788194]">Third Mughal Emperor</span>
                </div>
              </div>
              <p className="text-xs text-[#B8B09F] leading-relaxed">
                Personally commanded the siege with massive bronze cannons and 5,000 tunnel workers to break the fortress.
              </p>
            </div>
          </div>
        </section>

        {/* Primary Sources Accordion/Box */}
        <section className="p-4 bg-[#141720] border border-[#272E3D]">
          <details className="cursor-pointer">
            <summary className="text-xs font-bold uppercase tracking-wider text-[#DFBE76] hover:text-[#F4EFE6]">
              &#9432; Primary Historical Sources (Click to expand 4 historical records)
            </summary>
            <div className="mt-3 pt-3 border-t border-[#272E3D] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#B8B09F]">
              {scenario.evidence.map((ev) => (
                <div key={ev.id} className="p-3 bg-[#0D0F14] border border-[#272E3D]">
                  <strong className="text-[#DFBE76] block mb-0.5">{ev.source}</strong>
                  <span>{ev.claim}</span>
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* Navigation Action Bar */}
        <div className="pt-4 border-t border-[#272E3D] flex items-center justify-between">
          <button
            className="btn-secondary-clean"
            onClick={prevStage}
          >
            &larr; Back to Scenarios
          </button>
          <button
            className="btn-primary-clean text-base py-3 px-8"
            onClick={nextStage}
          >
            Enter the War Council &rarr;
          </button>
        </div>
      </main>
    </div>
  );
}
