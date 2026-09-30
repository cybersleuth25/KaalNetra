/**
 * KaalNetra — Imperial War Council Landing Screen
 *
 * Immersive historical strategy landing.
 * Deep fortress basalt palette, antique gold trims, monumental typography.
 * Zero gradients, zero generic AI template styling.
 */

import { useStage } from '../../app/StageContext';

export default function HomeScreen() {
  const { nextStage } = useStage();

  return (
    <div className="home-screen-clean">
      <div className="home-container-clean">
        {/* Left / Command Editorial Pane */}
        <div className="home-copy-pane">
          <div className="home-kicker">
            <span>Historical Strategy Simulation</span>
            <span>&bull;</span>
            <span>1567 CE</span>
          </div>

          <div>
            <h1 className="home-brand-title">KAALNETRA</h1>
            <div className="text-xs uppercase tracking-widest text-[#B8B09F] mt-2 font-mono">
              The Eye of Time &bull; Mewar Chronicles
            </div>
          </div>

          <div className="home-thesis">
            <p className="font-semibold text-[#F4EFE6]">Change the choice.</p>
            <p className="text-[#DFBE76]">See what happens.</p>
            <p className="text-[#B8B09F]">Discover real history.</p>
          </div>

          <p className="home-overview-text">
            October 1567. Emperor Akbar has surrounded the mountain fortress of Chittorgarh with 60,000 soldiers. 
            Inside the rock citadel, 8,000 Rajput defenders and 30,000 citizens prepare for siege. 
            Step into the War Council, command the garrison, and test your decisions against real history.
          </p>

          {/* Tactical Battle Keypoints */}
          <div className="grid grid-cols-3 gap-2.5 py-1 text-xs">
            <div className="p-2.5 bg-[#141720] border border-[#272E3D]">
              <span className="block text-[#C5A059] font-bold uppercase text-[10px] tracking-wider">Theater</span>
              <strong className="text-[#F4EFE6] text-xs">Chittor Fort</strong>
            </div>
            <div className="p-2.5 bg-[#141720] border border-[#272E3D]">
              <span className="block text-[#C5A059] font-bold uppercase text-[10px] tracking-wider">Mewar Garrison</span>
              <strong className="text-[#F4EFE6] text-xs">8,000 Warriors</strong>
            </div>
            <div className="p-2.5 bg-[#141720] border border-[#272E3D]">
              <span className="block text-[#C5A059] font-bold uppercase text-[10px] tracking-wider">Mughal Siege</span>
              <strong className="text-[#F4EFE6] text-xs">60,000 Troops</strong>
            </div>
          </div>

          <div className="home-action-row">
            <button
              className="btn-primary-clean text-sm py-3 px-8 text-center"
              onClick={nextStage}
            >
              Enter War Council &rarr;
            </button>
          </div>

          <div className="home-colophon">
            <span>Siege of Chittorgarh (1567&ndash;1568 CE)</span>
            <span>&bull;</span>
            <span>Interactive Historiographical Engine</span>
            <span>&bull;</span>
            <span>SIH 26208</span>
          </div>
        </div>

        {/* Right / Chittor Plateau Painting with Gold Frame */}
        <div className="home-visual-pane">
          <figure className="home-figure">
            <picture>
              <source srcSet="/assets/environments/chittor_overview.webp" type="image/webp" />
              <img
                src="/assets/environments/chittor_overview.png"
                alt="Panoramic view of the Chittorgarh plateau at dusk"
                className="home-figure-img"
              />
            </picture>
            <figcaption className="home-figure-caption">
              The Fortress of Chittorgarh, Capital of Mewar &mdash; 1567 CE
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
