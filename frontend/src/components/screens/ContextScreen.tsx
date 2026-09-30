/**
 * KaalNetra — Historical Context Screen (Archival Dossier)
 *
 * Implements Section 6 & 7 of design specification:
 *   - Feels like opening a historical dossier
 *   - Large historical image across the top
 *   - Parchment-inspired panels with aged-document subtlety
 *   - Sections:
 *       1. HISTORICAL CONTEXT
 *       2. KEY FIGURES (Archival Character Records with portrait, name, role, significance, gold separator)
 *       3. MAP & TOPOGRAPHY
 *       4. RESOURCES & CONSTRAINTS
 *       5. OBJECTIVES
 *       6. TIMELINE (Prelude Chronology)
 *   - Primary Sources Archival Record
 */

import { useState } from 'react';
import { useStage } from '../../app/StageContext';
import { useGameplay } from '../../app/GameplayContext';
import GameHeader from '../common/GameHeader';
import CharacterPortrait from '../common/CharacterPortrait';
import { ENVIRONMENTS } from '../../assets/registry';

type DossierSection = 'context' | 'figures' | 'map' | 'resources' | 'objectives' | 'timeline';

export default function ContextScreen() {
  const { nextStage, prevStage } = useStage();
  const { scenario } = useGameplay();
  const [activeSection, setActiveSection] = useState<DossierSection>('context');

  if (!scenario) return null;

  return (
    <div className="app-page-clean">
      <GameHeader badge="historical" />

      {/* Large Historical Image Across the Top */}
      <section className="relative w-full h-72 sm:h-96 overflow-hidden border-b border-[#B99652]/60">
        <picture>
          <source srcSet={ENVIRONMENTS.chittor_overview.src} type="image/webp" />
          <img
            src={ENVIRONMENTS.chittor_overview.fallbackSrc ?? ENVIRONMENTS.chittor_overview.src}
            alt="The Rocky Plateau Citadel of Chittorgarh"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.12]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-[#11110F]/40 to-transparent" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

        {/* Top Image Banner Overlay Content */}
        <div className="absolute bottom-6 left-0 right-0 clean-container flex flex-col justify-end">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#D1B16A] flex items-center gap-2 mb-1.5">
            <span>◈ Historical Dossier &bull; Record No. 1567-CHTR</span>
          </div>
          <h1 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4E9D0] leading-tight drop-shadow-md">
            The Siege of Chittorgarh
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono text-[#D8C9AA]">
            <span className="px-2.5 py-1 bg-[#11110F]/80 border border-[#B99652]/50 text-[#D1B16A]">
              October 1567 &ndash; February 1568
            </span>
            <span className="px-2.5 py-1 bg-[#11110F]/80 border border-[#2B251D]">
              Mewar, Rajasthan
            </span>
            <span className="px-2.5 py-1 bg-[#11110F]/80 border border-[#2B251D]">
              8,000 Defenders vs 60,000 Besiegers
            </span>
          </div>
        </div>
      </section>

      {/* Dossier Navigation Tabs */}
      <nav className="w-full bg-[#161412] border-b border-[#2B251D] sticky top-[61px] z-30">
        <div className="clean-container flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 text-xs font-['Cinzel'] uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveSection('context')}
            className={`px-3.5 py-1.5 border transition-all whitespace-nowrap ${
              activeSection === 'context'
                ? 'bg-[#1F1C16] border-[#B99652] text-[#D1B16A] font-bold shadow-[0_0_8px_rgba(209,177,106,0.2)]'
                : 'border-transparent text-[#8F8270] hover:text-[#D8C9AA]'
            }`}
          >
            1. Historical Context
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('figures')}
            className={`px-3.5 py-1.5 border transition-all whitespace-nowrap ${
              activeSection === 'figures'
                ? 'bg-[#1F1C16] border-[#B99652] text-[#D1B16A] font-bold shadow-[0_0_8px_rgba(209,177,106,0.2)]'
                : 'border-transparent text-[#8F8270] hover:text-[#D8C9AA]'
            }`}
          >
            2. Key Figures
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('map')}
            className={`px-3.5 py-1.5 border transition-all whitespace-nowrap ${
              activeSection === 'map'
                ? 'bg-[#1F1C16] border-[#B99652] text-[#D1B16A] font-bold shadow-[0_0_8px_rgba(209,177,106,0.2)]'
                : 'border-transparent text-[#8F8270] hover:text-[#D8C9AA]'
            }`}
          >
            3. Strategic Map
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('resources')}
            className={`px-3.5 py-1.5 border transition-all whitespace-nowrap ${
              activeSection === 'resources'
                ? 'bg-[#1F1C16] border-[#B99652] text-[#D1B16A] font-bold shadow-[0_0_8px_rgba(209,177,106,0.2)]'
                : 'border-transparent text-[#8F8270] hover:text-[#D8C9AA]'
            }`}
          >
            4. Resources &amp; Limits
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('objectives')}
            className={`px-3.5 py-1.5 border transition-all whitespace-nowrap ${
              activeSection === 'objectives'
                ? 'bg-[#1F1C16] border-[#B99652] text-[#D1B16A] font-bold shadow-[0_0_8px_rgba(209,177,106,0.2)]'
                : 'border-transparent text-[#8F8270] hover:text-[#D8C9AA]'
            }`}
          >
            5. Objectives
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('timeline')}
            className={`px-3.5 py-1.5 border transition-all whitespace-nowrap ${
              activeSection === 'timeline'
                ? 'bg-[#1F1C16] border-[#B99652] text-[#D1B16A] font-bold shadow-[0_0_8px_rgba(209,177,106,0.2)]'
                : 'border-transparent text-[#8F8270] hover:text-[#D8C9AA]'
            }`}
          >
            6. Prelude Timeline
          </button>
        </div>
      </nav>

      {/* Main Dossier Content */}
      <main className="clean-container py-10 space-y-10">

        {/* Section 1: Historical Context */}
        {activeSection === 'context' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="layout-sidebar-grid">
              {/* Left Column: Topographical Summary Plaque */}
              <div className="space-y-4">
                <div className="parchment-panel p-6 corner-ornament space-y-3">
                  <div className="parchment-meta">Plateau Architecture &bull; Mewar</div>
                  <h3 className="parchment-title text-xl">The Rock of Chittorgarh</h3>
                  <div className="parchment-divider" />
                  <p className="parchment-body text-sm">
                    Rising 500 feet precipitously above the plains of Rajasthan, the fortress of Chittor stretches across an elongated 8-mile rocky ridge. 
                    Its sheer vertical cliffs made direct assault with ladders impossible, forcing any besieger into an arduous, long-term technical investment.
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#54493B]">
                    Gaumukh Water System: 84 reservoirs fed by rainwater runoff.
                  </div>
                </div>

                <div className="historical-card p-5 corner-ornament space-y-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono block">
                    Strategic Geopolitics &bull; 1567
                  </span>
                  <p className="text-xs text-[#D8C9AA] leading-relaxed">
                    Control of Chittor was vital for securing imperial transit routes between Agra, the rich trading ports of Gujarat, and Malwa. Mewar stood as the sole defiant Rajput kingdom refusing imperial vassalage.
                  </p>
                </div>
              </div>

              {/* Right Column: Three Historical Story Beats */}
              <div className="space-y-4">
                <div className="historical-card p-6 corner-ornament space-y-2 hover:border-[#B99652]/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
                      Phase I &bull; The Imperial Encirclement
                    </span>
                    <span className="text-xs text-[#8F8270] font-mono">October 1567</span>
                  </div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
                    Emperor Akbar Arrives with 60,000 Troops
                  </h3>
                  <p className="text-sm text-[#D8C9AA] leading-relaxed">
                    In October 1567, Emperor Akbar marched from Agra and established an iron ring around the base of Chittorgarh. 
                    Mughal artillery was positioned at three strategic batteries, and 5,000 stonecutters, carpenters, and miners were assembled to begin tunneling operations.
                  </p>
                </div>

                <div className="historical-card p-6 corner-ornament space-y-2 hover:border-[#B99652]/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
                      Phase II &bull; The Dynastic Doctrine
                    </span>
                    <span className="text-xs text-[#8F8270] font-mono">Council of Kelwara</span>
                  </div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
                    Rana Udai Singh II Secures the Hills
                  </h3>
                  <p className="text-sm text-[#D8C9AA] leading-relaxed">
                    Following counsel from his senior Sardars, Maharana Udai Singh II withdrew into the rugged Aravalli mountains to preserve the ruling Sisodia line and organize mountain resistance. 
                    He entrusted the defense of the fortress to two renowned chieftains: <strong>Rao Jaimal of Merta</strong> and <strong>Rawat Patta of Kelwa</strong>.
                  </p>
                </div>

                <div className="historical-card p-6 corner-ornament space-y-2 hover:border-[#B99652]/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#D1B16A] font-mono">
                      Phase III &bull; The Technical Siege
                    </span>
                    <span className="text-xs text-[#8F8270] font-mono">Covered Sabats</span>
                  </div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
                    Bullet-Proof Covered Tunnels Creep Up the Rock
                  </h3>
                  <p className="text-sm text-[#D8C9AA] leading-relaxed">
                    Unable to scale the cliffs, Akbar ordered the construction of massive covered passageways called <em>sabats</em>. 
                    Wide enough for ten horsemen abreast and shielded by raw bullhides against musket fire and boiling oil, these armored corridors crept upward daily to plant devastating gunpowder mines beneath the stone bastions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Key Figures (Archival Character Records) */}
        {activeSection === 'figures' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
              <div>
                <div className="text-kicker">Command Records</div>
                <h2 className="serif-heading text-2xl sm:text-3xl text-[#F4E9D0]">
                  The 4 Key Historical Figures
                </h2>
              </div>
              <span className="text-xs text-[#8F8270] font-mono hidden sm:inline">
                Primary Sources: Akbarnama &bull; Bada&apos;uni
              </span>
            </div>

            {/* 4 Portrait Cards Styled as Archival Character Records */}
            <div className="layout-4col-grid">
              {/* Record 1: Jaimal */}
              <div className="parchment-panel p-5 corner-ornament flex flex-col justify-between space-y-4">
                <div className="flex flex-col items-center text-center">
                  <CharacterPortrait characterIdOrKey="jaimal" size="md" showBadge={true} />
                  <span className="parchment-meta mt-3">Principal Defender</span>
                  <h3 className="parchment-title text-xl text-[#29231B] mt-0.5">Rao Jaimal</h3>
                  <span className="text-xs text-[#54493B] font-serif italic">Lord of Merta &bull; Rathore</span>
                </div>
                <div className="parchment-divider" />
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#54493B] block">
                    Historical Significance:
                  </span>
                  <p className="parchment-body text-xs">
                    Vigilant, meticulous leader of the garrison. He directed daily wall repairs under direct enemy sniper fire. His death on the ramparts on the night of February 22, 1568 precipitated the final Saka.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#A38C65]/40 text-[10px] font-mono text-[#54493B]">
                  Historical Record: Documented in Akbarnama Vol. II
                </div>
              </div>

              {/* Record 2: Patta */}
              <div className="parchment-panel p-5 corner-ornament flex flex-col justify-between space-y-4">
                <div className="flex flex-col items-center text-center">
                  <CharacterPortrait characterIdOrKey="patta" size="md" showBadge={true} />
                  <span className="parchment-meta mt-3">Sortie Commander</span>
                  <h3 className="parchment-title text-xl text-[#29231B] mt-0.5">Rawat Patta</h3>
                  <span className="text-xs text-[#54493B] font-serif italic">Lord of Kelwa &bull; Chundawat</span>
                </div>
                <div className="parchment-divider" />
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#54493B] block">
                    Historical Significance:
                  </span>
                  <p className="parchment-body text-xs">
                    A sixteen-year-old warrior chieftain renowned for relentless valor. Commanded night sorties to set fire to advancing sabats and led the final garrison vanguard through the Lakhota gate.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#A38C65]/40 text-[10px] font-mono text-[#54493B]">
                  Historical Record: Statues erected at Agra Fort by Akbar
                </div>
              </div>

              {/* Record 3: Udai Singh II */}
              <div className="parchment-panel p-5 corner-ornament flex flex-col justify-between space-y-4">
                <div className="flex flex-col items-center text-center">
                  <CharacterPortrait characterIdOrKey="udai_singh" size="md" showBadge={true} />
                  <span className="parchment-meta mt-3">Dynastic Sovereign</span>
                  <h3 className="parchment-title text-xl text-[#29231B] mt-0.5">Rana Udai Singh</h3>
                  <span className="text-xs text-[#54493B] font-serif italic">Maharana of Mewar &bull; Sisodia</span>
                </div>
                <div className="parchment-divider" />
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#54493B] block">
                    Historical Significance:
                  </span>
                  <p className="parchment-body text-xs">
                    53rd ruler of the Mewar dynasty. He made the strategic decision to fight an external guerrilla war rather than perish inside the fort, saving the lineage and later founding Udaipur in the hills.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#A38C65]/40 text-[10px] font-mono text-[#54493B]">
                  Historical Record: Veer Vinod &amp; Rajput Chronicles
                </div>
              </div>

              {/* Record 4: Akbar */}
              <div className="parchment-panel p-5 corner-ornament flex flex-col justify-between space-y-4">
                <div className="flex flex-col items-center text-center">
                  <CharacterPortrait characterIdOrKey="akbar" size="md" showBadge={true} />
                  <span className="parchment-meta mt-3">Imperial Besieger</span>
                  <h3 className="parchment-title text-xl text-[#29231B] mt-0.5">Emperor Akbar</h3>
                  <span className="text-xs text-[#54493B] font-serif italic">Mughal Padshah &bull; Timurid</span>
                </div>
                <div className="parchment-divider" />
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#54493B] block">
                    Historical Significance:
                  </span>
                  <p className="parchment-body text-xs">
                    Personally directed the four-month siege. He brought specialized siege artillery and oversaw the construction of mines that detonated beneath the Lakhota gate on December 17, 1567.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#A38C65]/40 text-[10px] font-mono text-[#54493B]">
                  Historical Record: Muntakhab-ut-Tawarikh of Bada&apos;uni
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Strategic Map & Topography */}
        {activeSection === 'map' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="historical-card p-6 corner-ornament space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2B251D]">
                <div>
                  <div className="text-kicker">Theater Topography</div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-[#F4E9D0]">
                    Chittorgarh Bastions &amp; Battery Posts
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#D1B16A]">Scale: 8-Mile Perimeter</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 overflow-hidden border border-[#B99652] bg-[#11110F]">
                  <picture>
                    <source srcSet="/assets/environments/strategic_map.webp" type="image/webp" />
                    <img
                      src="/assets/environments/strategic_map.png"
                      alt="Antique Strategic Map of Chittorgarh"
                      className="w-full h-auto object-cover filter contrast-110"
                    />
                  </picture>
                </div>

                <div className="lg:col-span-4 space-y-4 text-xs text-[#D8C9AA]">
                  <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-1">
                    <strong className="text-[#D1B16A] uppercase font-mono block">1. Lakhota Bastion</strong>
                    <p>The northern apex of the fort. Focal point of Mughal sappers and mine detonations.</p>
                  </div>

                  <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-1">
                    <strong className="text-[#D1B16A] uppercase font-mono block">2. Gaumukh Reservoir</strong>
                    <p>Subterranean springs and cliff runoff fed dozens of rock cisterns providing clean water.</p>
                  </div>

                  <div className="p-4 bg-[#11110F] border border-[#2B251D] space-y-1">
                    <strong className="text-[#D1B16A] uppercase font-mono block">3. Ram Pol &amp; Suraj Pol</strong>
                    <p>Massive fortified gateways flanked by stone towers on the steep approach road.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Resources & Operational Constraints */}
        {activeSection === 'resources' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="parchment-panel p-6 sm:p-8 corner-ornament space-y-6">
              <div className="border-b border-[#A38C65]/50 pb-4">
                <div className="parchment-meta">Operational Constraints &bull; Mewar Garrison</div>
                <h2 className="parchment-title text-2xl sm:text-3xl text-[#29231B] mt-1">
                  The Four Iron Constraints of the Siege
                </h2>
                <p className="parchment-body text-sm mt-1">
                  Historical defenders did not have limitless choices. They were bound by strict physical realities:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F2E5C5] border border-[#A38C65]/60 space-y-1">
                  <span className="font-['Cinzel'] text-sm font-bold text-[#29231B] block">
                    1. No Outside Relief Army
                  </span>
                  <p className="text-xs text-[#54493B] leading-relaxed">
                    With Rana Udai Singh in the hills, the garrison stood isolated. No secondary relief force could breach the 60,000-man Mughal investment to deliver supplies.
                  </p>
                </div>

                <div className="p-4 bg-[#F2E5C5] border border-[#A38C65]/60 space-y-1">
                  <span className="font-['Cinzel'] text-sm font-bold text-[#29231B] block">
                    2. Irreplaceable 8,000 Defenders
                  </span>
                  <p className="text-xs text-[#54493B] leading-relaxed">
                    Every soldier lost to musket fire, sorties, or mine blasts reduced the total force permanently. Zero reinforcements could enter the fortress gates.
                  </p>
                </div>

                <div className="p-4 bg-[#F2E5C5] border border-[#A38C65]/60 space-y-1">
                  <span className="font-['Cinzel'] text-sm font-bold text-[#29231B] block">
                    3. 30,000 Non-Combatant Civilians
                  </span>
                  <p className="text-xs text-[#54493B] leading-relaxed">
                    Surrounding villagers took refuge inside the walls. Grain consumption was immense; daily rationing directly determined whether the citadel lasted months or weeks.
                  </p>
                </div>

                <div className="p-4 bg-[#F2E5C5] border border-[#A38C65]/60 space-y-1">
                  <span className="font-['Cinzel'] text-sm font-bold text-[#29231B] block">
                    4. Underground Gunpowder Mines
                  </span>
                  <p className="text-xs text-[#54493B] leading-relaxed">
                    The enemy could not scale the walls, but 5,000 diggers excavated subterranean shafts to blast breaches in the stone masonry from underneath.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Strategic Objectives */}
        {activeSection === 'objectives' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="historical-card p-6 sm:p-8 corner-ornament space-y-5">
              <div className="border-b border-[#2B251D] pb-4">
                <div className="text-kicker">War Council Directives</div>
                <h3 className="serif-heading text-2xl text-[#F4E9D0] mt-1">
                  Garrison Commander Objectives
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#D8C9AA]">
                <div className="flex items-start gap-4 p-4 bg-[#11110F] border border-[#2B251D]">
                  <span className="w-8 h-8 rounded-full border border-[#B99652] text-[#D1B16A] flex items-center justify-center font-bold shrink-0 font-['Cinzel']">
                    I
                  </span>
                  <div className="space-y-1">
                    <strong className="text-[#F4E9D0] text-sm block">Preserve Wall Integrity &amp; Sabat Interdiction</strong>
                    <p>Prevent Mughal covered tunnels from reaching the masonry footing where explosive mines can be placed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#11110F] border border-[#2B251D]">
                  <span className="w-8 h-8 rounded-full border border-[#B99652] text-[#D1B16A] flex items-center justify-center font-bold shrink-0 font-['Cinzel']">
                    II
                  </span>
                  <div className="space-y-1">
                    <strong className="text-[#F4E9D0] text-sm block">Manage Food &amp; Water Reserves</strong>
                    <p>Maintain civilian and soldier sustainability across winter months without causing starvation or mutiny.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#11110F] border border-[#2B251D]">
                  <span className="w-8 h-8 rounded-full border border-[#B99652] text-[#D1B16A] flex items-center justify-center font-bold shrink-0 font-['Cinzel']">
                    III
                  </span>
                  <div className="space-y-1">
                    <strong className="text-[#F4E9D0] text-sm block">Conserve Core Defender Cadre</strong>
                    <p>Balance bold night sorties against the necessity of keeping veteran archers and gunners alive for the main breaches.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Prelude Timeline */}
        {activeSection === 'timeline' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="historical-card p-6 sm:p-8 corner-ornament space-y-6">
              <div className="border-b border-[#2B251D] pb-3">
                <div className="text-kicker">Prelude Chronology</div>
                <h3 className="serif-heading text-2xl text-[#F4E9D0] mt-1">
                  Timeline of Events (1567)
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#11110F] border-l-2 border-l-[#B99652] border-[#2B251D] space-y-1 text-xs">
                  <span className="font-mono text-[#D1B16A] uppercase font-bold text-[11px]">September 1567 &bull; Agra</span>
                  <h4 className="font-['Cinzel'] text-sm font-bold text-[#F4E9D0]">Imperial Army Departs</h4>
                  <p className="text-[#D8C9AA]">Akbar leaves Agra with a vanguard of matchlock gunners, heavy bronze siege artillery, and supplies.</p>
                </div>

                <div className="p-4 bg-[#11110F] border-l-2 border-l-[#B99652] border-[#2B251D] space-y-1 text-xs">
                  <span className="font-mono text-[#D1B16A] uppercase font-bold text-[11px]">October 20, 1567 &bull; Mewar Plains</span>
                  <h4 className="font-['Cinzel'] text-sm font-bold text-[#F4E9D0]">Arrival at the Base of Chittor</h4>
                  <p className="text-[#D8C9AA]">The Mughal camp is established across five miles. Three principal assault batteries are positioned around the rock.</p>
                </div>

                <div className="p-4 bg-[#11110F] border-l-2 border-l-[#B99652] border-[#2B251D] space-y-1 text-xs">
                  <span className="font-mono text-[#D1B16A] uppercase font-bold text-[11px]">November 1567 &bull; The Slopes</span>
                  <h4 className="font-['Cinzel'] text-sm font-bold text-[#F4E9D0]">Construction of the Sabats</h4>
                  <p className="text-[#D8C9AA]">5,000 workers begin building the covered timber galleries under continuous fire from Rajput matchlocks atop the walls.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Sources Archival Record */}
        <section className="historical-card p-5 corner-ornament">
          <details className="cursor-pointer">
            <summary className="text-xs font-bold uppercase tracking-[0.15em] text-[#D1B16A] hover:text-[#F4E9D0] font-mono flex items-center justify-between">
              <span>&#9432; Archival Primary Sources &amp; Scholarly Citations (Click to inspect)</span>
              <span className="text-[10px] text-[#8F8270]">[Expand]</span>
            </summary>
            <div className="mt-4 pt-3 border-t border-[#2B251D] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#D8C9AA]">
              {scenario.evidence.map((ev) => (
                <div key={ev.id} className="p-3 bg-[#11110F] border border-[#2B251D] space-y-1">
                  <strong className="text-[#D1B16A] block font-mono">{ev.source}</strong>
                  <span className="leading-relaxed">{ev.claim}</span>
                  <span className="text-[10px] text-[#8F8270] block font-mono">Classification: {ev.type} &bull; {ev.evidence_level}</span>
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* Navigation Action Bar */}
        <div className="pt-4 border-t border-[#2B251D] flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            className="btn-historical-secondary text-xs py-2.5 px-5"
            onClick={prevStage}
          >
            &larr; Back to Scenarios
          </button>
          
          <button
            type="button"
            className="btn-historical-primary text-sm py-3.5 px-8"
            onClick={nextStage}
          >
            <span>Enter the War Council</span>
            <span className="text-[#D1B16A]">&rarr;</span>
          </button>
        </div>
      </main>
    </div>
  );
}
