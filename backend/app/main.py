"""FastAPI backend service for KaalNetra AI Guide."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models import (
    ExplainDecisionRequest,
    AskQuestionRequest,
    ReflectionRequest,
    GuideResponse,
)
from .ai_service import (
    explain_decision,
    ask_historical_question,
    generate_reflection,
    CANONICAL_UNCERTAINTY,
    PRIMARY_SOURCES,
)

# Load environment variables if present
load_dotenv()

app = FastAPI(
    title="KaalNetra AI Guide API",
    description="Source-grounded explanatory companion for the Siege of Chittor simulation",
    version="1.0.0",
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    """Health check endpoint displaying active AI provider status."""
    provider = "offline_grounded"
    if os.environ.get("GEMINI_API_KEY"):
        provider = "gemini"
    elif os.environ.get("OPENAI_API_KEY"):
        provider = "openai"

    return {
        "status": "healthy",
        "service": "kaalnetra-ai-guide",
        "version": "1.0.0",
        "provider": provider,
    }


@app.post("/api/ai/explain-decision", response_model=GuideResponse)
def handle_explain_decision(req: ExplainDecisionRequest):
    """Explain a simulation decision grounded in scenario data."""
    try:
        return explain_decision(
            decision_id=req.decision_id,
            option_id=req.option_id,
            state_before=req.state_before or {},
            state_after=req.state_after or {},
            delta=req.delta or {},
        )
    except Exception as e:
        # Graceful error handling: never return an unhandled crash
        return GuideResponse(
            historical_fact="Historical command decisions at Chittor required managing acute trade-offs under complete encirclement.",
            simulation_result=f"Decision {req.option_id} modified simulation parameters by {req.delta}.",
            ai_explanation=f"Explanatory synthesis safely generated via offline fallback: {str(e)}.",
            uncertainty_note=CANONICAL_UNCERTAINTY,
            sources=PRIMARY_SOURCES[:3],
            is_fallback=True,
            provider="offline_grounded_fallback",
        )


@app.post("/api/ai/ask", response_model=GuideResponse)
def handle_ask_question(req: AskQuestionRequest):
    """Answer a historical inquiry grounded strictly in canonical evidence."""
    try:
        return ask_historical_question(
            question=req.question,
            current_state=req.current_state or {},
            decision_history=req.decision_history or [],
        )
    except Exception as e:
        return GuideResponse(
            historical_fact="The 1567–1568 Siege of Chittor is documented in primary chronicles by Abu'l Fazl and Badayuni.",
            simulation_result="Simulation parameters remain deterministic and unaffected by question inquiries.",
            ai_explanation=f"Answer generated via offline fallback: {str(e)}.",
            uncertainty_note=CANONICAL_UNCERTAINTY,
            sources=PRIMARY_SOURCES[:3],
            is_fallback=True,
            provider="offline_grounded_fallback",
        )


@app.post("/api/ai/reflect", response_model=GuideResponse)
def handle_reflection(req: ReflectionRequest):
    """Provide historiographical reflection analysis for post-simulation review."""
    try:
        return generate_reflection(
            prompt_type=req.prompt_type,
            final_state=req.final_state or {},
            decisions_taken=req.decisions_taken or [],
        )
    except Exception as e:
        return GuideResponse(
            historical_fact="Chittor fell in February 1568 after Akbar's subterranean mines breached the northern wall.",
            simulation_result=f"Final simulation state: {req.final_state}.",
            ai_explanation=f"Reflection assistance generated via offline fallback: {str(e)}.",
            uncertainty_note=CANONICAL_UNCERTAINTY,
            sources=PRIMARY_SOURCES,
            is_fallback=True,
            provider="offline_grounded_fallback",
        )
