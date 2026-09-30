"""Pydantic data models for KaalNetra AI Guide endpoints."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ExplainDecisionRequest(BaseModel):
    scenario_id: str = Field(..., description="Scenario identifier, e.g. chittor_1567")
    decision_id: str = Field(..., description="Decision point ID, e.g. decision_1 or decision_2")
    option_id: str = Field(..., description="Selected option ID, e.g. decision_1_option_a")
    state_before: Optional[Dict[str, Any]] = Field(default_factory=dict)
    state_after: Optional[Dict[str, Any]] = Field(default_factory=dict)
    delta: Optional[Dict[str, int]] = Field(default_factory=dict)


class AskQuestionRequest(BaseModel):
    scenario_id: str = Field(..., description="Scenario identifier, e.g. chittor_1567")
    question: str = Field(..., description="User's historical inquiry")
    current_state: Optional[Dict[str, Any]] = Field(default_factory=dict)
    decision_history: Optional[List[Dict[str, Any]]] = Field(default_factory=list)


class ReflectionRequest(BaseModel):
    scenario_id: str = Field(..., description="Scenario identifier, e.g. chittor_1567")
    prompt_type: str = Field(..., description="Prompt type: biggest_decision, historical_constraint, why_different, custom")
    final_state: Optional[Dict[str, Any]] = Field(default_factory=dict)
    decisions_taken: Optional[List[Dict[str, Any]]] = Field(default_factory=list)


class GuideResponse(BaseModel):
    historical_fact: str = Field(..., description="Canonical historical record grounded in documented sources")
    simulation_result: str = Field(..., description="Concrete consequences within the deterministic game engine")
    ai_explanation: str = Field(..., description="Grounded synthesis explaining why the two align or diverge")
    uncertainty_note: str = Field(..., description="Explicit acknowledgement of contested sources, varying estimates, or historiographical nuances")
    sources: List[str] = Field(default_factory=list, description="List of authoritative primary or scholarly sources cited")
    is_fallback: bool = Field(default=False, description="True if generated via offline source-grounded fallback")
    provider: str = Field(default="grounded_knowledge_engine", description="LLM provider or offline engine identifier")
