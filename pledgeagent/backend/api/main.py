"""
PledgeAgent API Server
FastAPI backend for goal management and proof verification
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

from agent.brain import PledgeAgentBrain
from agent.verification import VerificationAgent
from agent.fraud_detector import FraudPatternMatcher
from agent.stake_adjuster import StakeAdjuster
from observability.opik_logger import OpikLogger

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="PledgeAgent API",
    description="Adversarial AI agent for resolution enforcement",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent brain (singleton)
agent_brain = None

def get_agent_brain() -> PledgeAgentBrain:
    """Dependency injection for agent brain"""
    global agent_brain
    
    if agent_brain is None:
        agent_brain = PledgeAgentBrain(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            opik_api_key=os.getenv("OPIK_API_KEY"),
            database_url=os.getenv("DATABASE_URL")
        )
    
    return agent_brain


# ===== REQUEST/RESPONSE MODELS =====

class GoalCreateRequest(BaseModel):
    user_id: str
    description: str = Field(..., example="Go to gym 4 times per week")
    proof_type: str = Field(..., example="photo")
    stake_amount: float = Field(..., ge=10.0, le=500.0)
    duration_days: int = Field(..., ge=7, le=365)
    penalty_recipient: str = Field(..., example="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")


class GoalCreateResponse(BaseModel):
    goal_id: str
    transaction_hash: str
    message: str


class ProofSubmitResponse(BaseModel):
    verdict: str
    confidence: float
    message: str
    fraud_signals: List[str]
    reasoning: str
    processing_time_ms: float
    recommendation: Optional[str] = None


class UserStatsResponse(BaseModel):
    user_id: str
    current_streak: int
    total_successes: int
    total_failures: int
    current_stake: float
    success_rate: float
    recommended_stake: float


# ===== ENDPOINTS =====

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "operational",
        "service": "PledgeAgent API",
        "version": "1.0.0"
    }


@app.post("/api/goals", response_model=GoalCreateResponse)
@app.post("/api/goals/create", response_model=GoalCreateResponse)
async def create_goal(
    request: GoalCreateRequest,
    brain: PledgeAgentBrain = Depends(get_agent_brain)
):
    """
    Create a new goal and lock stake in smart contract.
    
    Flow:
    1. Validate goal parameters
    2. Deploy escrow contract
    3. Lock funds
    4. Store goal in database
    """
    
    try:
        # TODO: Implement smart contract interaction
        # For MVP, we'll simulate this
        
        goal_id = f"goal_{request.user_id}_{int(datetime.now().timestamp())}"
        
        # Simulate transaction
        tx_hash = "0x" + "a" * 64  # Placeholder
        
        return GoalCreateResponse(
            goal_id=goal_id,
            transaction_hash=tx_hash,
            message=f"Goal created. ${request.stake_amount} locked. Prove yourself."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/proof/submit", response_model=ProofSubmitResponse)
async def submit_proof(
    user_id: str,
    goal_id: str,
    proof_image: UploadFile = File(...),
    brain: PledgeAgentBrain = Depends(get_agent_brain)
):
    """
    Submit proof for verification.
    
    This is where the magic happens:
    1. Image uploaded by user
    2. Agent analyzes with Vision AI
    3. Fraud detection runs
    4. Decision rendered
    5. Everything logged to Opik
    """
    
    try:
        # Read image data
        image_data = await proof_image.read()
        
        # Extract metadata (in production, parse EXIF here)
        metadata = {
            "filename": proof_image.filename,
            "content_type": proof_image.content_type,
            "size": len(image_data),
            "timestamp": datetime.now().isoformat()
        }
        
        # Process through agent brain
        result = await brain.process_submission(
            user_id=user_id,
            goal_id=goal_id,
            goal_description="Gym workout",  # TODO: Fetch from database
            proof_type="photo",
            image_data=image_data,
            metadata=metadata
        )
        
        # Add recommendation based on verdict
        recommendation = None
        if result.get("verdict") == "approved":
            recommendation = "Great job! Keep up the momentum and maintain your streak."
        elif result.get("verdict") == "rejected":
            recommendation = "Try submitting clearer evidence that better matches your goal description."
        elif result.get("verdict") == "fraud_detected":
            recommendation = "Fraud detected. Please submit authentic proof to avoid penalties."
        else:
            recommendation = "The evidence is unclear. Please resubmit with better quality proof."
        
        result["recommendation"] = recommendation
        
        return ProofSubmitResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/user/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_stats(
    user_id: str,
    brain: PledgeAgentBrain = Depends(get_agent_brain)
):
    """
    Get user statistics and behavioral profile.
    """
    
    try:
        # TODO: Implement full stats retrieval
        # For now, return mock data
        
        return UserStatsResponse(
            user_id=user_id,
            current_streak=5,
            total_successes=12,
            total_failures=3,
            current_stake=25.0,
            success_rate=0.8,
            recommended_stake=30.0
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/metrics/dashboard")
async def get_dashboard_metrics(
    brain: PledgeAgentBrain = Depends(get_agent_brain)
):
    """
    Get metrics for Opik dashboard.
    
    Returns:
    - Verification accuracy
    - Fraud detection stats
    - User engagement metrics
    """
    
    try:
        # TODO: Query Opik for real metrics
        
        return {
            "total_verifications": 1247,
            "approval_rate": 0.72,
            "fraud_detection_rate": 0.15,
            "average_confidence": 0.87,
            "active_users": 89,
            "total_stake_locked": 12450.0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== ERROR HANDLERS =====

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all error handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
