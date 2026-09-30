"""KaalNetra Source-Grounded AI Guide Service.

Provides explanatory context, decision explanations, Q&A, and reflection assistance.
Grounds all outputs strictly in the Chittor 1567 scenario and canonical sources.
Never mutates simulation state, never invents quotes or facts.
Gracefully falls back to offline source-grounded answers when external APIs fail or are unconfigured.
"""

import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional
import urllib.request
import urllib.error

from .models import GuideResponse

# Locate scenario file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SCENARIO_PATHS = [
    BASE_DIR / "frontend" / "src" / "data" / "chittor_1567.json",
    BASE_DIR / "kaalnetra_prd" / "scenario" / "chittor_1567.json",
]

SCENARIO_DATA: Dict[str, Any] = {}
for p in SCENARIO_PATHS:
    if p.exists():
        try:
            with open(p, "r", encoding="utf-8") as f:
                SCENARIO_DATA = json.load(f)
                break
        except Exception:
            pass

# Authoritative Sources Catalog
PRIMARY_SOURCES = [
    "Abu'l Fazl, Akbarnama (Chittor siege account)",
    "Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh",
    "Satish Chandra, Medieval India: From Sultanat to the Mughals, Part II",
    "R. V. Somani, History of Mewar, from Earliest Times to 1751 A.D.",
    "Victoria and Albert Museum, Akbarnama manuscript record (IS.2:66-1896)",
]

# Canonical Disclaimers
CANONICAL_UNCERTAINTY = (
    "Historiographical Caveat: Casualty counts vary substantially across primary accounts. "
    "Persian court chronicles (Akbarnama) and regional Rajput traditions report differing figures. "
    "Furthermore, precise daily troop tallies represent historical estimates rather than census records."
)


def _call_gemini_api(api_key: str, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
    """Call Google Gemini API if key is available."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": f"{system_prompt}\n\nTask:\n{user_prompt}\n\nPlease respond strictly in valid JSON matching this schema:\n{{\n  \"historical_fact\": \"...\",\n  \"simulation_result\": \"...\",\n  \"ai_explanation\": \"...\",\n  \"uncertainty_note\": \"...\",\n  \"sources\": [\"...\"]\n}}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=6.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(content_text)
    except Exception:
        return None


def _call_openai_api(api_key: str, system_prompt: str, user_prompt: str) -> Optional[Dict[str, Any]]:
    """Call OpenAI API if key is available."""
    url = "https://api.openai.com/v1/chat/completions"
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{user_prompt}\n\nPlease respond strictly in valid JSON matching this schema:\n{{\n  \"historical_fact\": \"...\",\n  \"simulation_result\": \"...\",\n  \"ai_explanation\": \"...\",\n  \"uncertainty_note\": \"...\",\n  \"sources\": [\"...\"]\n}}"}
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=6.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content_text = data["choices"][0]["message"]["content"]
            return json.loads(content_text)
    except Exception:
        return None


def explain_decision(
    decision_id: str,
    option_id: str,
    state_before: Dict[str, Any],
    state_after: Dict[str, Any],
    delta: Dict[str, int]
) -> GuideResponse:
    """Generate a source-grounded explanation for a player's decision."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    system_prompt = (
        "You are the KaalNetra Historical Guide. You explain simulation consequences and historical context "
        "strictly based on the 1567–1568 Siege of Chittor. You NEVER mutate game state, NEVER invent quotes, "
        "and NEVER invent historical facts. Clearly distinguish HISTORICAL FACT, SIMULATION RESULT, and AI EXPLANATION."
    )

    user_prompt = (
        f"Explain the player's choice in decision '{decision_id}', option '{option_id}'.\n"
        f"State delta applied by the deterministic rule engine: {delta}.\n"
        f"State before: {state_before}\n"
        f"State after: {state_after}\n"
        f"Ground this in Chittor canonical sources: Akbarnama, Badayuni, Satish Chandra."
    )

    if gemini_key:
        result = _call_gemini_api(gemini_key, system_prompt, user_prompt)
        if result and "historical_fact" in result:
            return GuideResponse(
                historical_fact=result.get("historical_fact", ""),
                simulation_result=result.get("simulation_result", ""),
                ai_explanation=result.get("ai_explanation", ""),
                uncertainty_note=result.get("uncertainty_note", CANONICAL_UNCERTAINTY),
                sources=result.get("sources", PRIMARY_SOURCES[:3]),
                is_fallback=False,
                provider="gemini"
            )

    if openai_key:
        result = _call_openai_api(openai_key, system_prompt, user_prompt)
        if result and "historical_fact" in result:
            return GuideResponse(
                historical_fact=result.get("historical_fact", ""),
                simulation_result=result.get("simulation_result", ""),
                ai_explanation=result.get("ai_explanation", ""),
                uncertainty_note=result.get("uncertainty_note", CANONICAL_UNCERTAINTY),
                sources=result.get("sources", PRIMARY_SOURCES[:3]),
                is_fallback=False,
                provider="openai"
            )

    # Deterministic Offline Source-Grounded Fallback
    return _generate_offline_decision_explanation(decision_id, option_id, delta)


def ask_historical_question(
    question: str,
    current_state: Dict[str, Any],
    decision_history: List[Dict[str, Any]]
) -> GuideResponse:
    """Answer a historical inquiry grounded in scenario facts."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    system_prompt = (
        "You are the KaalNetra Historical Guide. You answer historical questions regarding the 1567–1568 "
        "Siege of Chittor. Ground all answers strictly in documented evidence (Akbarnama, Badayuni, Satish Chandra, Somani). "
        "Distinguish HISTORICAL FACT from SIMULATION RESULT and AI EXPLANATION. State uncertainties where chronicles diverge."
    )

    user_prompt = (
        f"Historical Question: '{question}'\n"
        f"Current Simulation State: {current_state}\n"
        f"Decisions Taken: {decision_history}\n"
    )

    if gemini_key:
        result = _call_gemini_api(gemini_key, system_prompt, user_prompt)
        if result and "historical_fact" in result:
            return GuideResponse(
                historical_fact=result.get("historical_fact", ""),
                simulation_result=result.get("simulation_result", ""),
                ai_explanation=result.get("ai_explanation", ""),
                uncertainty_note=result.get("uncertainty_note", CANONICAL_UNCERTAINTY),
                sources=result.get("sources", PRIMARY_SOURCES[:3]),
                is_fallback=False,
                provider="gemini"
            )

    if openai_key:
        result = _call_openai_api(openai_key, system_prompt, user_prompt)
        if result and "historical_fact" in result:
            return GuideResponse(
                historical_fact=result.get("historical_fact", ""),
                simulation_result=result.get("simulation_result", ""),
                ai_explanation=result.get("ai_explanation", ""),
                uncertainty_note=result.get("uncertainty_note", CANONICAL_UNCERTAINTY),
                sources=result.get("sources", PRIMARY_SOURCES[:3]),
                is_fallback=False,
                provider="openai"
            )

    # Deterministic Offline Source-Grounded Fallback
    return _generate_offline_question_answer(question, current_state)


def generate_reflection(
    prompt_type: str,
    final_state: Dict[str, Any],
    decisions_taken: List[Dict[str, Any]]
) -> GuideResponse:
    """Generate historiographical reflection assistance."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    system_prompt = (
        "You are the KaalNetra Reflection Assistant. Help the player reflect on their strategic divergence from canonical history. "
        "Highlight the systemic trade-offs between medieval fort defense and early-modern siegecraft. Never alter simulation state."
    )

    user_prompt = (
        f"Reflection Category: '{prompt_type}'\n"
        f"Final State Reached: {final_state}\n"
        f"Decision Sequence: {decisions_taken}\n"
    )

    if gemini_key:
        result = _call_gemini_api(gemini_key, system_prompt, user_prompt)
        if result and "historical_fact" in result:
            return GuideResponse(
                historical_fact=result.get("historical_fact", ""),
                simulation_result=result.get("simulation_result", ""),
                ai_explanation=result.get("ai_explanation", ""),
                uncertainty_note=result.get("uncertainty_note", CANONICAL_UNCERTAINTY),
                sources=result.get("sources", PRIMARY_SOURCES[:3]),
                is_fallback=False,
                provider="gemini"
            )

    if openai_key:
        result = _call_openai_api(openai_key, system_prompt, user_prompt)
        if result and "historical_fact" in result:
            return GuideResponse(
                historical_fact=result.get("historical_fact", ""),
                simulation_result=result.get("simulation_result", ""),
                ai_explanation=result.get("ai_explanation", ""),
                uncertainty_note=result.get("uncertainty_note", CANONICAL_UNCERTAINTY),
                sources=result.get("sources", PRIMARY_SOURCES[:3]),
                is_fallback=False,
                provider="openai"
            )

    # Deterministic Offline Source-Grounded Fallback
    return _generate_offline_reflection(prompt_type, final_state, decisions_taken)


# ============================================================================
# CURATED OFFLINE SOURCE-GROUNDED KNOWLEDGE BASE
# ============================================================================

def _generate_offline_decision_explanation(
    decision_id: str,
    option_id: str,
    delta: Dict[str, int]
) -> GuideResponse:
    """Deterministic, sourced explanations for each authored decision option."""

    # Decision 1 Options
    if "decision_1_a" in option_id or "decision_1_option_a" in option_id:
        return GuideResponse(
            historical_fact=(
                "Historically, Rao Jaimal Rathore and Patta Chundawat organized frontline archers and matchlockmen "
                "along the 8-mile curtain walls to repel direct escalade attempts by Akbar's vanguard."
            ),
            simulation_result=(
                f"Defenders committed to battlements reduced immediate wall damage, but constant barrage exposure "
                f"inflicted manpower depletion (defenders {delta.get('defenders', -8)})."
            ),
            ai_explanation=(
                "Reinforcing the curtain walls effectively deters rapid assault, but stone battlements without external relief "
                "gradually become artillery targets for imperial siege guns placed on the surrounding ridges."
            ),
            uncertainty_note=(
                "Accounts in Badayuni and Abu'l Fazl note fierce daily skirmishing along the parapets, though exact daily "
                "attrition rates are unrecorded."
            ),
            sources=["Abu'l Fazl, Akbarnama", "Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    if "decision_1_b" in option_id or "decision_1_option_b" in option_id:
        return GuideResponse(
            historical_fact=(
                "Chittor's internal water cisterns (such as Gaumukh Kund) were fed by natural aquifers and rainfall. "
                "Historical garrisons strictly protected reservoir water to prevent contamination during extended sieges."
            ),
            simulation_result=(
                f"Conserving water and rationing grain preserved critical stores (food +{delta.get('food', 5)}, water +{delta.get('water', 5)}), "
                f"but defensive passivity allowed Mughal sappers to advance siege works (siege_progress +{delta.get('siege_progress', 10)})."
            ),
            ai_explanation=(
                "A conservation strategy extends physical survival endurance within the fort, but cedes offensive initiative. "
                "Without sorties, imperial sappers constructed covered sabats unhindered."
            ),
            uncertainty_note="The exact capacity and replenishment rates of Gaumukh Kund during the 1567 winter are unrecorded in contemporary chronicles.",
            sources=["R. V. Somani, History of Mewar", "Satish Chandra, Medieval India"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    if "decision_1_c" in option_id or "decision_1_option_c" in option_id:
        return GuideResponse(
            historical_fact=(
                "Rajput garrisons frequently launched aggressive night sorties against imperial construction trenches and mantlets. "
                "Abu'l Fazl notes that Mughal sappers were under continuous sniper and sortie fire."
            ),
            simulation_result=(
                f"Aggressive sorties disrupted imperial siege lines (siege_progress {delta.get('siege_progress', -8)}), "
                f"but close-quarters combat outside the gates cost defender lives (defenders {delta.get('defenders', -6)})."
            ),
            ai_explanation=(
                "Sorties disrupted the construction of covered sabats, demonstrating that active tactical resistance could "
                "buy time, albeit at high irreplaceable garrison cost."
            ),
            uncertainty_note="Sortie casualty reports vary widely between Mughal victory bulletins and Mewar bardic narratives.",
            sources=["Abu'l Fazl, Akbarnama", "Satish Chandra, Medieval India, Part II"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    if "decision_1_d" in option_id or "decision_1_option_d" in option_id:
        return GuideResponse(
            historical_fact=(
                "The defenses of Chittor were organized across multiple gates (Suraj Pol, Lakhota Pol, Ram Pol). "
                "Internal redoubts served as retreat positions if the lower curtain collapsed."
            ),
            simulation_result=(
                f"Concentrating forces in the upper citadel fortified fort integrity (+{delta.get('fort_integrity', 8)}), "
                f"but abandoning outer works lowered general morale ({delta.get('morale', -10)})."
            ),
            ai_explanation=(
                "Yielding outer perimeters shortens the defensive line and reduces sapper vulnerabilities, but damages morale "
                "by admitting that the outer citadel cannot be held."
            ),
            uncertainty_note="Chronicles confirm inner gates held after outer perimeter breaches, though internal troop reorganizations are documented sketchily.",
            sources=["R. V. Somani, History of Mewar", "Abu'l Fazl, Akbarnama"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # Decision 2 Options
    if "decision_2_a" in option_id or "decision_2_option_a" in option_id:
        return GuideResponse(
            historical_fact=(
                "Following the catastrophic explosion of Mughal subterranean gunpowder mines at the Lakhota bastion in late 1567 / early 1568, "
                "Jaimal Rathore personally directed masonry repairs at the breach under heavy fire."
            ),
            simulation_result=(
                f"Reinforcing the breach halted the immediate assault column (siege_progress {delta.get('siege_progress', -5)}), "
                f"but exposed defenders to deadly musket volleys (defenders {delta.get('defenders', -12)})."
            ),
            ai_explanation=(
                "Plugging a mine breach with physical manpower and timber mantlets prevents immediate fortress overrun, "
                "yet creates a deadly kill zone where defenders face imperial matchlock snipers."
            ),
            uncertainty_note=(
                "Abu'l Fazl and Badayuni both record Jaimal overseeing breach repairs, where he was fatally shot by Akbar's musket 'Sangram'."
            ),
            sources=["Abu'l Fazl, Akbarnama", "Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    if "decision_2_b" in option_id or "decision_2_option_b" in option_id:
        return GuideResponse(
            historical_fact=(
                "When breaches became untenable, Rajput defense shifted toward enfilading crossfire from flanking towers "
                "using traditional archers and boiling pitch."
            ),
            simulation_result=(
                f"Flanking crossfire maximized attacker casualties without sacrificing wall builders, but allowed imperial sappers "
                f"to widen the rubble breach (fort_integrity {delta.get('fort_integrity', -10)})."
            ),
            ai_explanation=(
                "Defending a breach by fire rather than physical presence preserves manpower while ceding structural control "
                "over the collapsed parapet."
            ),
            uncertainty_note="Chronicles describe both close-quarters melee and flanking projectile fire at the breach.",
            sources=["Satish Chandra, Medieval India", "R. V. Somani, History of Mewar"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    if "decision_2_c" in option_id or "decision_2_option_c" in option_id:
        return GuideResponse(
            historical_fact=(
                "In historical Rajput siegecraft, when primary outer walls were irreversibly compromised, defenders fell back "
                "to secondary barricades leading to the royal palaces."
            ),
            simulation_result=(
                f"Falling back behind interior barricades bought organizational stability (+{delta.get('fort_integrity', 5)}), "
                f"but demoralized besieged civilian populations ({delta.get('morale', -15)})."
            ),
            ai_explanation=(
                "Interior fallback buys tactical time within the fortress, but signals that total perimeter collapse is imminent."
            ),
            uncertainty_note="Chronicles indicate fierce resistance at the interior seven gates, confirming staged defense doctrines.",
            sources=["R. V. Somani, History of Mewar", "Abu'l Fazl, Akbarnama"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # General Fallback
    return GuideResponse(
        historical_fact="Chittor was defended under severe strategic encirclement without an external relief column.",
        simulation_result=f"Decision {option_id} produced deterministic state changes: {delta}.",
        ai_explanation="Every choice in the siege represents an authored operational trade-off between garrison lives, wall preservation, and food/water endurance.",
        uncertainty_note=CANONICAL_UNCERTAINTY,
        sources=PRIMARY_SOURCES[:3],
        is_fallback=True,
        provider="offline_grounded_guide"
    )


def _generate_offline_question_answer(question: str, current_state: Dict[str, Any]) -> GuideResponse:
    """Deterministic, sourced answers to core historical inquiry queries."""
    q_lower = question.lower()

    # 1. "What constraints existed for the defenders?"
    if "constraint" in q_lower or "limit" in q_lower or "restriction" in q_lower:
        return GuideResponse(
            historical_fact=(
                "Four primary historical constraints bound the defenders of Chittor in 1567–1568:\n"
                "1. Complete Strategic Encirclement: No external Rajput relief force arrived.\n"
                "2. Asymmetric Siege Technology: Mughal sappers utilized covered sabats and deep gunpowder mines.\n"
                "3. Finite Water Reserves: Rainwater cisterns (Gaumukh Kund) could not be replenished during siege.\n"
                "4. Finite Granaries: Stored food depleted progressively with no overland resupply corridor."
            ),
            simulation_result=(
                "The simulation engine enforces these historical constraints deterministically: food and water decrease each turn, "
                "no external reinforcements can be summoned, and imperial siege progress climbs persistently."
            ),
            ai_explanation=(
                "These constraints defined the tragic inevitability of Chittor. Even flawless tactical decisions could only delay, "
                "not reverse, the systemic exhaustion of fortress supplies against the imperial logistics of Akbar."
            ),
            uncertainty_note="Chronicles confirm the absolute lack of external relief, although Udaipur hill forces under Udai Singh conducted guerrilla harassment outside the siege cordon.",
            sources=["Satish Chandra, Medieval India", "R. V. Somani, History of Mewar", "Abu'l Fazl, Akbarnama"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # 2. "Why was the siege difficult?"
    if "difficult" in q_lower or "hard" in q_lower or "challenge" in q_lower:
        return GuideResponse(
            historical_fact=(
                "Chittor is situated atop an isolated 500-foot sheer basalt cliff stretching over three miles. "
                "Mughal forces could neither storm the steep switchback paths directly nor starve the garrison quickly, "
                "requiring monumental engineering projects including covered approaches (sabats) and subterranean gunpowder mining."
            ),
            simulation_result=(
                f"In the simulation, the fort's natural resilience is modeled through high initial fort integrity (82%) "
                f"and dedicated water reserves (75%), requiring sustained siege pressure (currently {current_state.get('siege_progress', 30)}%) "
                "to degrade."
            ),
            ai_explanation=(
                "The siege was exceptionally difficult for both sides: for the Mughals, scaling sheer vertical cliffs under archery fire "
                "required thousands of laborers building covered wooden tunnels (sabats) wide enough for ten horsemen. "
                "For the defenders, the absence of any relief army turned the siege into an inescapable war of attrition."
            ),
            uncertainty_note=(
                "Akbarnama notes that hundreds of sappers died daily while constructing the sabats under fire, "
                "though exact construction casualties are contested across accounts."
            ),
            sources=["Abu'l Fazl, Akbarnama", "Satish Chandra, Medieval India, Part II", "R. V. Somani, History of Mewar"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # 3. "Why did my decision reduce stability / morale / defenders?"
    if "reduce" in q_lower or "stability" in q_lower or "decrease" in q_lower or "drop" in q_lower or "fall" in q_lower or "lower" in q_lower:
        return GuideResponse(
            historical_fact=(
                "Defending a besieged stronghold without prospect of relief created an unavoidable zero-sum dilemma. "
                "Every sortie expended veteran Rajput warriors who could not be replaced. Conversely, passive wall defense "
                "allowed imperial artillery to zero in on defensive bastions, shaking garrison morale."
            ),
            simulation_result=(
                f"Your simulation state currently reflects: Defenders {current_state.get('defenders', 60)}%, "
                f"Morale {current_state.get('morale', 50)}%, Fort Integrity {current_state.get('fort_integrity', 70)}%. "
                "Threshold rules in the simulation trigger compound penalties when vital parameters drop below 30%."
            ),
            ai_explanation=(
                "Your decisions directly produced state decrements because KaalNetra enforces historical trade-offs. "
                "Active resistance preserves ramparts at the price of blood; resource rationing conserves supplies at the price of spirit. "
                "No defensive decision was cost-free in 1567."
            ),
            uncertainty_note="Simulation state deltas are authored gameplay abstractions on a 0–100 scale, not literal measurements.",
            sources=["KaalNetra Simulation Specification", "Satish Chandra, Medieval India"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # 3. "What constraints existed for the defenders?"
    if "constraint" in q_lower or "limits" in q_lower or "restrictions" in q_lower:
        return GuideResponse(
            historical_fact=(
                "Four primary historical constraints bound the defenders of Chittor in 1567–1568:\n"
                "1. Complete Strategic Encirclement: No external Rajput relief force arrived.\n"
                "2. Asymmetric Siege Technology: Mughal sappers utilized covered sabats and deep gunpowder mines.\n"
                "3. Finite Water Reserves: Rainwater cisterns (Gaumukh Kund) could not be replenished during siege.\n"
                "4. Finite Granaries: Stored food depleted progressively with no overland resupply corridor."
            ),
            simulation_result=(
                "The simulation engine enforces these historical constraints deterministically: food and water decrease each turn, "
                "no external reinforcements can be summoned, and imperial siege progress climbs persistently."
            ),
            ai_explanation=(
                "These constraints defined the tragic inevitability of Chittor. Even flawless tactical decisions could only delay, "
                "not reverse, the systemic exhaustion of fortress supplies against the imperial logistics of Akbar."
            ),
            uncertainty_note="Chronicles confirm the absolute lack of external relief, although Udaipur hill forces under Udai Singh conducted guerrilla harassment outside the siege cordon.",
            sources=["Satish Chandra, Medieval India", "R. V. Somani, History of Mewar", "Abu'l Fazl, Akbarnama"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # 4. Mughal sabats and mining
    if "sabat" in q_lower or "mine" in q_lower or "gunpowder" in q_lower:
        return GuideResponse(
            historical_fact=(
                "Mughal engineers constructed 'sabats'—massive covered earthen and timber galleries with high bulletproof walls "
                "roofed with raw hides, wide enough for ten horsemen to ride abreast. Beneath this cover, sappers excavated underground "
                "galleries to plant gunpowder mines directly under Chittor's bastions."
            ),
            simulation_result=(
                f"Represented in the simulation by the persistent increase of 'siege_progress' (currently {current_state.get('siege_progress', 30)}%) "
                "and sudden catastrophic damage to fort_integrity during mine detonations."
            ),
            ai_explanation=(
                "Sabats neutralized Chittor's natural height advantage by sheltering sappers right up to the base of the masonry walls, "
                "marking the decisive transition from medieval siegecraft to gunpowder warfare."
            ),
            uncertainty_note="Abu'l Fazl notes that over 5,000 builders and laborers worked simultaneously on the main sabat, with continuous casualties from Rajput sharpshooters.",
            sources=["Abu'l Fazl, Akbarnama", "Abdul Qadir Badayuni, Muntakhab-ut-Tawarikh"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # 5. Udai Singh withdrawal
    if "udai singh" in q_lower or "withdraw" in q_lower or "left" in q_lower or "fled" in q_lower:
        return GuideResponse(
            historical_fact=(
                "Prior to Akbar's encirclement, Rana Udai Singh II and the Mewar council resolved that the sovereign should withdraw "
                "into the Aravalli hills (where Udaipur was being established), leaving Chittor under experienced garrison commanders "
                "Rao Jaimal Rathore and Patta Chundawat."
            ),
            simulation_result=(
                "This historical withdrawal forms the foundational starting state of KaalNetra: the player commands the fort's defense "
                "from the perspective of garrison leadership without sovereign political authority to surrender."
            ),
            ai_explanation=(
                "While later romantic chroniclers questioned the Rana's departure, modern historians (such as Satish Chandra and Somani) "
                "recognize it as sound strategic doctrine: preserving the ruling dynasty in inaccessible hills prevented total dynastic eradication, "
                "ensuring Mewar's long-term survival under Maharana Pratap."
            ),
            uncertainty_note="Mughal chronicles characterized the departure as flight, whereas Rajput histories describe a council resolution to protect the royal house.",
            sources=["Satish Chandra, Medieval India", "R. V. Somani, History of Mewar, 1526–1707"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # Default Inquiry Response
    return GuideResponse(
        historical_fact=(
            "The Siege of Chittor (October 1567 – February 1568) was Akbar's decisive campaign to subdue Mewar. "
            "Defended by Rao Jaimal Rathore and Patta Chundawat, the fort resisted until a mine breach and Jaimal's death triggered the final fall."
        ),
        simulation_result=(
            f"Current state: Food {current_state.get('food', 70)}%, Water {current_state.get('water', 70)}%, "
            f"Defenders {current_state.get('defenders', 60)}%, Fort {current_state.get('fort_integrity', 70)}%, "
            f"Siege {current_state.get('siege_progress', 30)}%."
        ),
        ai_explanation=(
            "Your simulation explores counterfactual paths within authentic historical boundaries. "
            "All state transitions follow deterministic mathematical rules grounded in documented siege conditions."
        ),
        uncertainty_note=CANONICAL_UNCERTAINTY,
        sources=PRIMARY_SOURCES[:3],
        is_fallback=True,
        provider="offline_grounded_guide"
    )


def _generate_offline_reflection(
    prompt_type: str,
    final_state: Dict[str, Any],
    decisions_taken: List[Dict[str, Any]]
) -> GuideResponse:
    """Deterministic, sourced reflection assistance."""
    if prompt_type == "biggest_decision":
        return GuideResponse(
            historical_fact=(
                "The defining historical turning point was the defense of the Lakhota breach in early 1568, where Jaimal was killed "
                "while directing repairs, precipitating the final Saka and Jauhar."
            ),
            simulation_result=(
                f"In your simulation, the decisions taken resulted in final fort integrity of {final_state.get('fort_integrity', 0)}% "
                f"and garrison strength of {final_state.get('defenders', 0)}%."
            ),
            ai_explanation=(
                "Your initial choice set the systemic trajectory: aggressive postures bought time at the expense of soldiers, "
                "while conservative defense preserved reserves but permitted faster imperial engineering."
            ),
            uncertainty_note="Simulation states are comparative abstractions rather than claims of actual historical numerical ratios.",
            sources=["Abu'l Fazl, Akbarnama", "Satish Chandra, Medieval India"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    if prompt_type == "historical_constraint":
        return GuideResponse(
            historical_fact=(
                "The most unforgiving constraint was the complete absence of external relief. Isolated on the plateau, "
                "the garrison was locked into an asymmetrical endurance contest against the entire logistical might of the Mughal empire."
            ),
            simulation_result=(
                f"Water ended at {final_state.get('water', 0)}% and food at {final_state.get('food', 0)}%, demonstrating "
                "that the fortress resources dwindle monotonically without resupply."
            ),
            ai_explanation=(
                "Fortress walls alone cannot defend an empire without field armies. When a citadel is surrounded with no relief army, "
                "even heroic resistance can only alter the date of the inevitable conclusion."
            ),
            uncertainty_note="Udai Singh held mountain terrain near Gogunda, but lacked field strength to break the siege ring.",
            sources=["R. V. Somani, History of Mewar", "Satish Chandra, Medieval India"],
            is_fallback=True,
            provider="offline_grounded_guide"
        )

    # why_different or default
    return GuideResponse(
        historical_fact=(
            "Documented history followed a single immutable timeline: Akbar deployed sabats and gunpowder mines, "
            "breached the northern curtain wall, shot Jaimal at night, and stormed Chittor in February 1568."
        ),
        simulation_result=(
            f"Your simulation branched counterfactually into: Final Siege Progress {final_state.get('siege_progress', 0)}%, "
            f"Final Morale {final_state.get('morale', 0)}%, Final Garrison {final_state.get('defenders', 0)}%."
        ),
        ai_explanation=(
            "Your simulation diverged because you exercised strategic agency within the historical parameter space. "
            "While history records the single tragic outcome, exploring the alternate trade-offs deepens our respect "
            "for the agonising choices faced by Jaimal and Patta under siege."
        ),
        uncertainty_note=CANONICAL_UNCERTAINTY,
        sources=PRIMARY_SOURCES,
        is_fallback=True,
        provider="offline_grounded_guide"
    )
