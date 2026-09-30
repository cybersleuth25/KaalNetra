/**
 * KaalNetra — Source-Grounded AI Guide Service (Phase 7)
 *
 * Technical Architecture & Requirements:
 * - AI serves ONLY as an explanatory layer.
 * - The simulation engine remains completely independent of AI.
 * - AI MUST NOT:
 *     - Change simulation state
 *     - Determine game outcomes
 *     - Generate canonical history
 *     - Invent historical facts or quotes
 *     - Modify historical timelines
 *     - Override deterministic rules
 * - Clearly distinguishes:
 *     - HISTORICAL FACT (canonical record)
 *     - SIMULATION RESULT (deterministic engine consequences)
 *     - AI EXPLANATION (explanatory synthesis)
 *     - UNCERTAINTY / CONTESTED DETAILS (historiographical caveats)
 *     - AUTHORITATIVE SOURCES (Akbarnama, Badayuni, Chandra, Somani)
 * - Security: API keys NEVER live in frontend code.
 * - Graceful Fallback: If backend is offline or API fails, uses authored source-grounded knowledge.
 */

import type { GameState, Scenario, DecisionOption, ChoiceDelta } from '../data/types';
import type { TurnResult } from '../simulation/types';
import scenarioData from '../data/chittor_1567.json';

export interface GuideResponse {
  historicalFact: string;
  simulationResult: string;
  aiExplanation: string;
  uncertaintyNote: string;
  sources: string[];
  isFallback: boolean;
  provider: string;
}

const API_TIMEOUT_MS = 6000;
const BACKEND_BASE = '/api/ai';

export const PRIMARY_SOURCES = [
  "Abu'l Fazl, Akbarnama (Chittor siege account)",
  'Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh',
  'Satish Chandra, Medieval India: From Sultanat to the Mughals, Part II',
  'R. V. Somani, History of Mewar, from Earliest Times to 1751 A.D.',
  'Victoria and Albert Museum, Akbarnama manuscript record (IS.2:66-1896)',
];

export const CANONICAL_UNCERTAINTY =
  'Historiographical Caveat: Casualty counts and precise troop tallies vary substantially across primary accounts. ' +
  'Persian court chronicles (Akbarnama) and regional Rajput traditions report differing figures. ' +
  'Numerical state parameters are game abstractions on a 0–100 scale, not historical measurements.';

/**
 * Helper to fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = API_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 1. "Explain My Decision"
 */
export async function explainDecision(
  option: DecisionOption,
  currentState: Readonly<GameState>,
  delta: Readonly<ChoiceDelta | Partial<Record<string, number>>>,
  scenario: Readonly<Scenario> = scenarioData as unknown as Scenario
): Promise<GuideResponse> {
  try {
    const response = await fetchWithTimeout(`${BACKEND_BASE}/explain-decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: scenario.id || 'chittor_1567',
        decision_id: option.id.includes('decision_1') ? 'decision_1' : 'decision_2',
        option_id: option.id,
        state_before: currentState,
        state_after: currentState,
        delta,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.historical_fact) {
        return {
          historicalFact: data.historical_fact,
          simulationResult: data.simulation_result,
          aiExplanation: data.ai_explanation,
          uncertaintyNote: data.uncertainty_note || CANONICAL_UNCERTAINTY,
          sources: data.sources || PRIMARY_SOURCES.slice(0, 3),
          isFallback: Boolean(data.is_fallback),
          provider: data.provider || 'backend_ai',
        };
      }
    }
  } catch {
    // Network error, abort timeout, or backend offline -> fall through to deterministic offline guide
  }

  // Graceful offline fallback
  return getOfflineDecisionExplanation(option, delta);
}

/**
 * 2. Historical Q&A
 */
export async function askHistoricalGuide(
  question: string,
  currentState: Readonly<GameState>,
  decisionHistory: ReadonlyArray<TurnResult | Record<string, unknown>> = [],
  scenario: Readonly<Scenario> = scenarioData as unknown as Scenario
): Promise<GuideResponse> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      historicalFact: 'Please provide a historical question regarding the Siege of Chittor (1567–1568).',
      simulationResult: 'Simulation state is unchanged.',
      aiExplanation: 'The Historical Guide answers questions concerning military doctrines, siegecraft, logistics, and constraints.',
      uncertaintyNote: CANONICAL_UNCERTAINTY,
      sources: PRIMARY_SOURCES.slice(0, 2),
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  try {
    const response = await fetchWithTimeout(`${BACKEND_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: scenario.id || 'chittor_1567',
        question: trimmed,
        current_state: currentState,
        decision_history: decisionHistory,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.historical_fact) {
        return {
          historicalFact: data.historical_fact,
          simulationResult: data.simulation_result,
          aiExplanation: data.ai_explanation,
          uncertaintyNote: data.uncertainty_note || CANONICAL_UNCERTAINTY,
          sources: data.sources || PRIMARY_SOURCES.slice(0, 3),
          isFallback: Boolean(data.is_fallback),
          provider: data.provider || 'backend_ai',
        };
      }
    }
  } catch {
    // Network error, abort timeout, or backend offline -> fall through to offline guide
  }

  return getOfflineQuestionAnswer(trimmed, currentState);
}

/**
 * 3. Reflection Assistant
 */
export async function askReflectionAssistant(
  promptType: 'biggest_decision' | 'historical_constraint' | 'why_different' | 'custom',
  finalState: Readonly<GameState>,
  decisionsTaken: ReadonlyArray<TurnResult | Record<string, unknown>> = [],
  scenario: Readonly<Scenario> = scenarioData as unknown as Scenario
): Promise<GuideResponse> {
  try {
    const response = await fetchWithTimeout(`${BACKEND_BASE}/reflect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: scenario.id || 'chittor_1567',
        prompt_type: promptType,
        final_state: finalState,
        decisions_taken: decisionsTaken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.historical_fact) {
        return {
          historicalFact: data.historical_fact,
          simulationResult: data.simulation_result,
          aiExplanation: data.ai_explanation,
          uncertaintyNote: data.uncertainty_note || CANONICAL_UNCERTAINTY,
          sources: data.sources || PRIMARY_SOURCES,
          isFallback: Boolean(data.is_fallback),
          provider: data.provider || 'backend_ai',
        };
      }
    }
  } catch {
    // Fall through to offline guide
  }

  return getOfflineReflection(promptType, finalState);
}

// ============================================================================
// DETERMINISTIC OFFLINE SOURCE-GROUNDED KNOWLEDGE BASE
// ============================================================================

export function getOfflineDecisionExplanation(
  option: DecisionOption,
  delta: Readonly<ChoiceDelta | Partial<Record<string, number>>>
): GuideResponse {
  const optId = option.id;

  if (optId.includes('decision_1_a') || optId.includes('decision_1_option_a')) {
    return {
      historicalFact:
        "Historically, Rao Jaimal Rathore and Patta Chundawat organized frontline archers and matchlockmen " +
        "along the 8-mile curtain walls to repel direct escalade attempts by Akbar's vanguard.",
      simulationResult:
        `Defenders committed to battlements reduced immediate wall damage, but constant barrage exposure ` +
        `inflicted manpower depletion (defenders ${delta.defenders ?? -8}).`,
      aiExplanation:
        'Reinforcing the curtain walls effectively deters rapid assault, but stone battlements without external relief ' +
        'gradually become artillery targets for imperial siege guns placed on the surrounding ridges.',
      uncertaintyNote:
        'Accounts in Badayuni and Abu\'l Fazl note fierce daily skirmishing along the parapets, though exact daily ' +
        'attrition rates are unrecorded.',
      sources: ["Abu'l Fazl, Akbarnama", 'Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (optId.includes('decision_1_b') || optId.includes('decision_1_option_b')) {
    return {
      historicalFact:
        "Chittor's internal water cisterns (such as Gaumukh Kund) were fed by natural aquifers and rainfall. " +
        'Historical garrisons strictly protected reservoir water to prevent contamination during extended sieges.',
      simulationResult:
        `Conserving water and rationing grain preserved critical stores (food +${delta.food ?? 5}, water +${delta.water ?? 5}), ` +
        `but defensive passivity allowed Mughal sappers to advance siege works (siege_progress +${delta.siege_progress ?? 10}).`,
      aiExplanation:
        'A conservation strategy extends physical survival endurance within the fort, but cedes offensive initiative. ' +
        'Without sorties, imperial sappers constructed covered sabats unhindered.',
      uncertaintyNote:
        'The exact capacity and replenishment rates of Gaumukh Kund during the 1567 winter are unrecorded in contemporary chronicles.',
      sources: ['R. V. Somani, History of Mewar', 'Satish Chandra, Medieval India'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (optId.includes('decision_1_c') || optId.includes('decision_1_option_c')) {
    return {
      historicalFact:
        'Rajput garrisons frequently launched aggressive night sorties against imperial construction trenches and mantlets. ' +
        "Abu'l Fazl notes that Mughal sappers were under continuous sniper and sortie fire.",
      simulationResult:
        `Aggressive sorties disrupted imperial siege lines (siege_progress ${delta.siege_progress ?? -8}), ` +
        `but close-quarters combat outside the gates cost defender lives (defenders ${delta.defenders ?? -6}).`,
      aiExplanation:
        'Sorties disrupted the construction of covered sabats, demonstrating that active tactical resistance could ' +
        'buy time, albeit at high irreplaceable garrison cost.',
      uncertaintyNote:
        'Sortie casualty reports vary widely between Mughal victory bulletins and Mewar bardic narratives.',
      sources: ["Abu'l Fazl, Akbarnama", 'Satish Chandra, Medieval India, Part II'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (optId.includes('decision_1_d') || optId.includes('decision_1_option_d')) {
    return {
      historicalFact:
        'The defenses of Chittor were organized across multiple gates (Suraj Pol, Lakhota Pol, Ram Pol). ' +
        'Internal redoubts served as retreat positions if the lower curtain collapsed.',
      simulationResult:
        `Concentrating forces in the upper citadel fortified fort integrity (+${delta.fort_integrity ?? 8}), ` +
        `but abandoning outer works lowered general morale (${delta.morale ?? -10}).`,
      aiExplanation:
        'Yielding outer perimeters shortens the defensive line and reduces sapper vulnerabilities, but damages morale ' +
        'by admitting that the outer citadel cannot be held.',
      uncertaintyNote:
        'Chronicles confirm inner gates held after outer perimeter breaches, though internal troop reorganizations are documented sketchily.',
      sources: ['R. V. Somani, History of Mewar', "Abu'l Fazl, Akbarnama"],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (optId.includes('decision_2_a') || optId.includes('decision_2_option_a')) {
    return {
      historicalFact:
        'Following the catastrophic explosion of Mughal subterranean gunpowder mines at the Lakhota bastion in early 1568, ' +
        'Jaimal Rathore personally directed masonry repairs at the breach under heavy fire.',
      simulationResult:
        `Reinforcing the breach halted the immediate assault column (siege_progress ${delta.siege_progress ?? -5}), ` +
        `but exposed defenders to deadly musket volleys (defenders ${delta.defenders ?? -12}).`,
      aiExplanation:
        'Plugging a mine breach with physical manpower and timber mantlets prevents immediate fortress overrun, ' +
        'yet creates a deadly kill zone where defenders face imperial matchlock snipers.',
      uncertaintyNote:
        "Abu'l Fazl and Badayuni both record Jaimal overseeing breach repairs, where he was fatally shot by Akbar's musket 'Sangram'.",
      sources: ["Abu'l Fazl, Akbarnama", 'Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (optId.includes('decision_2_b') || optId.includes('decision_2_option_b')) {
    return {
      historicalFact:
        'When breaches became untenable, Rajput defense shifted toward enfilading crossfire from flanking towers ' +
        'using traditional archers and boiling pitch.',
      simulationResult:
        `Flanking crossfire maximized attacker casualties without sacrificing wall builders, but allowed imperial sappers ` +
        `to widen the rubble breach (fort_integrity ${delta.fort_integrity ?? -10}).`,
      aiExplanation:
        'Defending a breach by fire rather than physical presence preserves manpower while ceding structural control ' +
        'over the collapsed parapet.',
      uncertaintyNote:
        'Chronicles describe both close-quarters melee and flanking projectile fire at the breach.',
      sources: ['Satish Chandra, Medieval India', 'R. V. Somani, History of Mewar'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (optId.includes('decision_2_c') || optId.includes('decision_2_option_c')) {
    return {
      historicalFact:
        'In historical Rajput siegecraft, when primary outer walls were irreversibly compromised, defenders fell back ' +
        'to secondary barricades leading to the royal palaces.',
      simulationResult:
        `Falling back behind interior barricades bought organizational stability (+${delta.fort_integrity ?? 5}), ` +
        `but demoralized besieged civilian populations (${delta.morale ?? -15}).`,
      aiExplanation:
        'Interior fallback buys tactical time within the fortress, but signals that total perimeter collapse is imminent.',
      uncertaintyNote:
        'Chronicles indicate fierce resistance at the interior seven gates, confirming staged defense doctrines.',
      sources: ['R. V. Somani, History of Mewar', "Abu'l Fazl, Akbarnama"],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // Fallback for other choices
  return {
    historicalFact: 'Chittor was defended under severe strategic encirclement without an external relief column.',
    simulationResult: `Decision ${optId} produced deterministic state changes: ${JSON.stringify(delta)}.`,
    aiExplanation:
      'Every choice in the siege represents an authored operational trade-off between garrison lives, wall preservation, and food/water endurance.',
    uncertaintyNote: CANONICAL_UNCERTAINTY,
    sources: PRIMARY_SOURCES.slice(0, 3),
    isFallback: true,
    provider: 'offline_grounded_guide',
  };
}

export function getOfflineQuestionAnswer(question: string, currentState: Readonly<GameState>): GuideResponse {
  const qLower = question.toLowerCase();

  // 1. "What constraints existed for the defenders?"
  if (qLower.includes('constraint') || qLower.includes('limit') || qLower.includes('restriction')) {
    return {
      historicalFact:
        'Four primary historical constraints bound the defenders of Chittor in 1567–1568:\n' +
        '1. Complete Strategic Encirclement: No external Rajput relief force arrived.\n' +
        '2. Asymmetric Siege Technology: Mughal sappers utilized covered sabats and deep gunpowder mines.\n' +
        '3. Finite Water Reserves: Rainwater cisterns (Gaumukh Kund) could not be replenished during siege.\n' +
        '4. Finite Granaries: Stored food depleted progressively with no overland resupply corridor.',
      simulationResult:
        'The simulation engine enforces these historical constraints deterministically: food and water decrease each turn, ' +
        'no external reinforcements can be summoned, and imperial siege progress climbs persistently.',
      aiExplanation:
        'These constraints defined the tragic inevitability of Chittor. Even flawless tactical decisions could only delay, ' +
        'not reverse, the systemic exhaustion of fortress supplies against the imperial logistics of Akbar.',
      uncertaintyNote:
        'Chronicles confirm the absolute lack of external relief, although Udaipur hill forces under Udai Singh conducted guerrilla harassment outside the siege cordon.',
      sources: ['Satish Chandra, Medieval India', 'R. V. Somani, History of Mewar', "Abu'l Fazl, Akbarnama"],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // 2. "Why was the siege difficult?"
  if (qLower.includes('difficult') || qLower.includes('hard') || qLower.includes('challenge')) {
    return {
      historicalFact:
        'Chittor is situated atop an isolated 500-foot sheer basalt cliff stretching over three miles. ' +
        'Mughal forces could neither storm the steep switchback paths directly nor starve the garrison quickly, ' +
        'requiring monumental engineering projects including covered approaches (sabats) and subterranean gunpowder mining.',
      simulationResult:
        `In the simulation, the fort's natural resilience is modeled through high initial fort integrity (82%) ` +
        `and dedicated water reserves (75%), requiring sustained siege pressure (currently ${currentState.siege_progress}%) ` +
        'to degrade.',
      aiExplanation:
        'The siege was exceptionally difficult for both sides: for the Mughals, scaling sheer vertical cliffs under archery fire ' +
        'required thousands of laborers building covered wooden tunnels (sabats) wide enough for ten horsemen. ' +
        'For the defenders, the absence of any relief army turned the siege into an inescapable war of attrition.',
      uncertaintyNote:
        'Akbarnama notes that hundreds of sappers died daily while constructing the sabats under fire, ' +
        'though exact construction casualties are contested across accounts.',
      sources: ["Abu'l Fazl, Akbarnama", 'Satish Chandra, Medieval India, Part II', 'R. V. Somani, History of Mewar'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // 3. "Why did my decision reduce stability / morale / defenders?"
  if (
    qLower.includes('reduce') ||
    qLower.includes('stability') ||
    qLower.includes('decrease') ||
    qLower.includes('drop') ||
    qLower.includes('fall') ||
    qLower.includes('lower')
  ) {
    return {
      historicalFact:
        'Defending a besieged stronghold without prospect of relief created an unavoidable zero-sum dilemma. ' +
        'Every sortie expended veteran Rajput warriors who could not be replaced. Conversely, passive wall defense ' +
        'allowed imperial artillery to zero in on defensive bastions, shaking garrison morale.',
      simulationResult:
        `Your simulation state currently reflects: Defenders ${currentState.defenders}%, ` +
        `Morale ${currentState.morale}%, Fort Integrity ${currentState.fort_integrity}%. ` +
        'Threshold rules in the simulation trigger compound penalties when vital parameters drop below 30%.',
      aiExplanation:
        'Your decisions directly produced state decrements because KaalNetra enforces historical trade-offs. ' +
        'Active resistance preserves ramparts at the price of blood; resource rationing conserves supplies at the price of spirit. ' +
        'No defensive decision was cost-free in 1567.',
      uncertaintyNote:
        'Simulation state deltas are authored gameplay abstractions on a 0–100 scale, not literal measurements.',
      sources: ['KaalNetra Simulation Specification', 'Satish Chandra, Medieval India'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // 4. Sabats and mines
  if (qLower.includes('sabat') || qLower.includes('mine') || qLower.includes('gunpowder')) {
    return {
      historicalFact:
        "Mughal engineers constructed 'sabats'—massive covered earthen and timber galleries with high bulletproof walls " +
        'roofed with raw hides, wide enough for ten horsemen to ride abreast. Beneath this cover, sappers excavated underground ' +
        "galleries to plant gunpowder mines directly under Chittor's bastions.",
      simulationResult:
        `Represented in the simulation by the persistent increase of 'siege_progress' (currently ${currentState.siege_progress}%) ` +
        'and sudden catastrophic damage to fort_integrity during mine detonations.',
      aiExplanation:
        "Sabats neutralized Chittor's natural height advantage by sheltering sappers right up to the base of the masonry walls, " +
        'marking the decisive transition from medieval siegecraft to gunpowder warfare.',
      uncertaintyNote:
        "Abu'l Fazl notes that over 5,000 builders and laborers worked simultaneously on the main sabat, with continuous casualties from Rajput sharpshooters.",
      sources: ["Abu'l Fazl, Akbarnama", 'Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // 5. Udai Singh withdrawal
  if (qLower.includes('udai singh') || qLower.includes('withdraw') || qLower.includes('left') || qLower.includes('fled')) {
    return {
      historicalFact:
        "Prior to Akbar's encirclement, Rana Udai Singh II and the Mewar council resolved that the sovereign should withdraw " +
        'into the Aravalli hills (where Udaipur was being established), leaving Chittor under experienced garrison commanders ' +
        'Rao Jaimal Rathore and Patta Chundawat.',
      simulationResult:
        'This historical withdrawal forms the foundational starting state of KaalNetra: the player commands the fort\'s defense ' +
        'from the perspective of garrison leadership without sovereign political authority to surrender.',
      aiExplanation:
        'While later romantic chroniclers questioned the Rana\'s departure, modern historians (such as Satish Chandra and Somani) ' +
        'recognize it as sound strategic doctrine: preserving the ruling dynasty in inaccessible hills prevented total dynastic eradication, ' +
        'ensuring Mewar\'s long-term survival under Maharana Pratap.',
      uncertaintyNote:
        'Mughal chronicles characterized the departure as flight, whereas Rajput histories describe a council resolution to protect the royal house.',
      sources: ['Satish Chandra, Medieval India', 'R. V. Somani, History of Mewar, 1526–1707'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // Default inquiry
  return {
    historicalFact:
      "The Siege of Chittor (October 1567 – February 1568) was Akbar's decisive campaign to subdue Mewar. " +
      'Defended by Rao Jaimal Rathore and Patta Chundawat, the fort resisted until a mine breach and Jaimal\'s death triggered the final fall.',
    simulationResult:
      `Current state: Food ${currentState.food}%, Water ${currentState.water}%, ` +
      `Defenders ${currentState.defenders}%, Fort ${currentState.fort_integrity}%, ` +
      `Siege Progress ${currentState.siege_progress}%.`,
    aiExplanation:
      'Your simulation explores counterfactual paths within authentic historical boundaries. ' +
      'All state transitions follow deterministic mathematical rules grounded in documented siege conditions.',
    uncertaintyNote: CANONICAL_UNCERTAINTY,
    sources: PRIMARY_SOURCES.slice(0, 3),
    isFallback: true,
    provider: 'offline_grounded_guide',
  };
}

export function getOfflineReflection(
  promptType: string,
  finalState: Readonly<GameState>
): GuideResponse {
  if (promptType === 'biggest_decision') {
    return {
      historicalFact:
        'The defining historical turning point was the defense of the Lakhota breach in early 1568, where Jaimal was killed ' +
        'while directing repairs, precipitating the final Saka and Jauhar.',
      simulationResult:
        `In your simulation, the decisions taken resulted in final fort integrity of ${finalState.fort_integrity}% ` +
        `and garrison strength of ${finalState.defenders}%.`,
      aiExplanation:
        'Your initial choice set the systemic trajectory: aggressive postures bought time at the expense of soldiers, ' +
        'while conservative defense preserved reserves but permitted faster imperial engineering.',
      uncertaintyNote:
        'Simulation states are comparative abstractions rather than claims of actual historical numerical ratios.',
      sources: ["Abu'l Fazl, Akbarnama", 'Satish Chandra, Medieval India'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  if (promptType === 'historical_constraint') {
    return {
      historicalFact:
        'The most unforgiving constraint was the complete absence of external relief. Isolated on the plateau, ' +
        'the garrison was locked into an asymmetrical endurance contest against the entire logistical might of the Mughal empire.',
      simulationResult:
        `Water ended at ${finalState.water}% and food at ${finalState.food}%, demonstrating ` +
        'that the fortress resources dwindle monotonically without resupply.',
      aiExplanation:
        'Fortress walls alone cannot defend an empire without field armies. When a citadel is surrounded with no relief army, ' +
        'even heroic resistance can only alter the date of the inevitable conclusion.',
      uncertaintyNote:
        'Udai Singh held mountain terrain near Gogunda, but lacked field strength to break the siege ring.',
      sources: ['R. V. Somani, History of Mewar', 'Satish Chandra, Medieval India'],
      isFallback: true,
      provider: 'offline_grounded_guide',
    };
  }

  // why_different or default
  return {
    historicalFact:
      'Documented history followed a single immutable timeline: Akbar deployed sabats and gunpowder mines, ' +
      'breached the northern curtain wall, shot Jaimal at night, and stormed Chittor in February 1568.',
    simulationResult:
      `Your simulation branched counterfactually into: Final Siege Progress ${finalState.siege_progress}%, ` +
      `Final Morale ${finalState.morale}%, Final Garrison ${finalState.defenders}%.`,
    aiExplanation:
      'Your simulation diverged because you exercised strategic agency within the historical parameter space. ' +
      'While history records the single tragic outcome, exploring the alternate trade-offs deepens our respect ' +
      'for the agonising choices faced by Jaimal and Patta under siege.',
    uncertaintyNote: CANONICAL_UNCERTAINTY,
    sources: PRIMARY_SOURCES,
    isFallback: true,
    provider: 'offline_grounded_guide',
  };
}
