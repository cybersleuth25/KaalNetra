/**
 * KaalNetra — Centralized Asset Registry & Manifest
 *
 * Implements Phase 6 Asset Management:
 *   - Centralized, immutable asset paths
 *   - Character metadata, factions, historical vs composite status
 *   - Environment paths with WebP and PNG fallbacks
 *   - Aspect ratio constraints and sizing guidelines
 *   - Lazy and responsive loading utilities
 */

export interface CharacterAsset {
  id: string;
  name: string;
  role: string;
  faction: 'mewar' | 'mughal' | 'neutral';
  historical: boolean;
  src: string;
  fallbackSrc?: string;
  aspectRatio: string; // e.g. "3/4"
  title: string;
  quote: string;
  description: string;
}

export interface EnvironmentAsset {
  id: string;
  name: string;
  src: string;
  fallbackSrc?: string;
  context: string;
  description: string;
}

export const CHARACTERS: Record<string, CharacterAsset> = {
  jaimal: {
    id: 'jaimal',
    name: 'Rao Jaimal Rathore',
    role: 'Principal Defensive Commander',
    faction: 'mewar',
    historical: true,
    src: '/assets/characters/jaimal.png',
    aspectRatio: '3/4',
    title: 'Castellan of Chittorgarh & Rathore Chieftain',
    quote: 'The walls of Chittor have stood against monarchs for centuries. We will contest every foot of stone.',
    description: 'Entrusted by Rana Udai Singh II with garrison defense. Renowned for tireless vigilance inspecting ramparts and directing counter-fire.',
  },
  patta: {
    id: 'patta',
    name: 'Rawat Patta Chundawat',
    role: 'Defensive Commander & Sortie Leader',
    faction: 'mewar',
    historical: true,
    src: '/assets/characters/patta.png',
    aspectRatio: '3/4',
    title: 'Lord of Kelwa & Sisodia Chieftain',
    quote: 'Passive containment invites ruin. We must bleed their sappers in the ravines before their saps touch our footings.',
    description: 'Leader of the Kelwa clan, stationed at the Suraj Pol and Lakhota bastions. Advocated active sorties against Mughal siege works.',
  },
  udai_singh: {
    id: 'udai_singh',
    name: 'Maharana Udai Singh II',
    role: 'Ruler of Mewar (Dynastic Preserver)',
    faction: 'mewar',
    historical: true,
    src: '/assets/characters/udai_singh.png',
    aspectRatio: '3/4',
    title: '53rd Maharana of Mewar',
    quote: 'A stone fortress may fall, but as long as the Sisodia sword endures in the hills, Mewar remains unconquered.',
    description: 'Strategic architect of Mewar\'s guerrilla resistance. Withdrew to the Aravalli hills to avoid encirclement and ensure dynastic survival.',
  },
  akbar: {
    id: 'akbar',
    name: 'Jalal-ud-din Muhammad Akbar',
    role: 'Mughal Padshah & Besieger',
    faction: 'mughal',
    historical: true,
    src: '/assets/characters/akbar.png',
    aspectRatio: '3/4',
    title: 'Third Mughal Emperor',
    quote: 'No fortress is impregnable to the science of subterranean mining and resolute concentration of artillery.',
    description: 'Directly commanded the siege operations with over 60,000 troops, employing 5,000 sappers to build massive covered galleries (sabats).',
  },
  mirza_yusuf: {
    id: 'mirza_yusuf',
    name: 'Mirza Yusuf Khan',
    role: 'Imperial Siege Artillery Officer',
    faction: 'mughal',
    historical: false, // Fictional composite representing Mughal ordnance & sapper corps
    src: '/assets/characters/mirza_yusuf.png',
    aspectRatio: '3/4',
    title: 'Commander of Imperial Sabats & Mines',
    quote: 'Inch by inch, the rawhide shields protect our miners. Chittor will crack from below.',
    description: 'Composite figure representing the specialized engineers, sappers, and gunners who constructed the mammoth Lakhota and Chittori sabats.',
  },
  resource_steward: {
    id: 'resource_steward',
    name: 'Kaviraj Manohardas',
    role: 'Garrison Provisioner & Steward',
    faction: 'mewar',
    historical: false, // Fictional composite representing granary & cistern administration
    src: '/assets/characters/resource_steward.png',
    aspectRatio: '3/4',
    title: 'Keeper of Granaries & Cisterns',
    quote: 'Gunpowder does not nourish our men, nor do arrows quench their thirst. Guard the Gaumukh reservoir with your lives.',
    description: 'Composite character managing the logistical reality of 38,000 mouths inside the fort during months of total isolation.',
  },
};

export const ENVIRONMENTS: Record<string, EnvironmentAsset> = {
  chittor_overview: {
    id: 'chittor_overview',
    name: 'Chittorgarh Plateau Overview',
    src: '/assets/environments/chittor_overview.webp',
    fallbackSrc: '/assets/environments/chittor_overview.png',
    context: 'Historical Context & Global Panorama',
    description: 'A 500-foot sheer limestone scarp dominating the surrounding plains of Mewar, extending 8 miles along its rugged perimeter.',
  },
  fort_interior: {
    id: 'fort_interior',
    name: 'Fort Citadel & Courtyard',
    src: '/assets/environments/fort_interior.webp',
    fallbackSrc: '/assets/environments/fort_interior.png',
    context: 'War Council Briefing & Garrison Life',
    description: 'The inner sanctum of Chittorgarh, housing temples, courtyards, rain cisterns, and 30,000 non-combatant civilians.',
  },
  fort_walls: {
    id: 'fort_walls',
    name: 'Ramparts & Bastions',
    src: '/assets/environments/fort_walls.webp',
    fallbackSrc: '/assets/environments/fort_walls.png',
    context: 'Tactical Defense & Sorties',
    description: 'Massive double-curtain masonry battlements, defended by archers and musketeers against advancing imperial saps.',
  },
  mughal_siege_camp: {
    id: 'mughal_siege_camp',
    name: 'Imperial Encampment & Sabat Line',
    src: '/assets/environments/mughal_siege_camp.webp',
    fallbackSrc: '/assets/environments/mughal_siege_camp.png',
    context: 'Siege Operations & Opponent Perspective',
    description: 'A vast city of pavilions, ordnance depots, and covered wooden trenches creeping steadily up the steep rock face.',
  },
  strategic_map: {
    id: 'strategic_map',
    name: 'Strategic Topographical Map of Chittor',
    src: '/assets/environments/strategic_map.webp',
    fallbackSrc: '/assets/environments/strategic_map.png',
    context: 'Council Decision Points & Tactical Planning',
    description: 'Detailed cartographic view mapping the seven fortified gates, Gaumukh reservoir, Lakhota bastion, and Mughal encampments.',
  },
};

/**
 * Retrieve a character asset by ID or role name, falling back to Jaimal
 */
export function getCharacterAsset(idOrKey?: string): CharacterAsset {
  if (!idOrKey) return CHARACTERS.jaimal;
  const key = idOrKey.toLowerCase().replace(/[\s-]/g, '_');
  
  if (CHARACTERS[key]) return CHARACTERS[key];
  if (key.includes('jaimal')) return CHARACTERS.jaimal;
  if (key.includes('patta')) return CHARACTERS.patta;
  if (key.includes('udai')) return CHARACTERS.udai_singh;
  if (key.includes('akbar')) return CHARACTERS.akbar;
  if (key.includes('steward') || key.includes('manohar') || key.includes('resource')) {
    return CHARACTERS.resource_steward;
  }
  if (key.includes('yusuf') || key.includes('mughal') || key.includes('siege_officer')) {
    return CHARACTERS.mirza_yusuf;
  }
  return CHARACTERS.jaimal;
}

/**
 * Retrieve an environment asset by ID or scene keyword, falling back to chittor_overview
 */
export function getEnvironmentAsset(sceneKey?: string): EnvironmentAsset {
  if (!sceneKey) return ENVIRONMENTS.chittor_overview;
  const key = sceneKey.toLowerCase().replace(/[\s-]/g, '_');
  
  if (ENVIRONMENTS[key]) return ENVIRONMENTS[key];
  if (key.includes('map') || key.includes('strategic')) return ENVIRONMENTS.strategic_map;
  if (key.includes('camp') || key.includes('mughal') || key.includes('siege')) {
    return ENVIRONMENTS.mughal_siege_camp;
  }
  if (key.includes('wall') || key.includes('bastion') || key.includes('rampart')) {
    return ENVIRONMENTS.fort_walls;
  }
  if (key.includes('interior') || key.includes('citadel') || key.includes('briefing')) {
    return ENVIRONMENTS.fort_interior;
  }
  return ENVIRONMENTS.chittor_overview;
}
