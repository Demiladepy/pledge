"""
PledgeAgent Brain - Main orchestration engine
Coordinates verification, fraud detection, and decision-making
"""

from typing import Dict, Any, Optional
from datetime import datetime
import json
from enum import Enum

from .verification import VerificationAgent
from .fraud_detector import FraudPatternMatcher
from .stake_adjuster import StakeAdjuster
from ..observability.opik_logger import OpikLogger
from ..blockchain.contract_interface import get_contract_interface


class Verdict(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    UNCLEAR = "unclear"
    FRAUD_DETECTED = "fraud_detected"


class AgentPersonality(str, Enum):
    STRICT = "strict"
    ENCOURAGING = "encouraging"
    NEUTRAL = "neutral"
    COMPASSIONATE = "compassionate"


class PledgeAgentBrain:
    """
    The core decision-making engine.
    
    This agent doesn't just verify - it deliberates, learns, and adapts.
    """
    
    def __init__(
        self,
        openai_api_key: str,
        opik_api_key: str,
        database_url: str
    ):
        self.verifier = VerificationAgent(openai_api_key)
        self.fraud_detector = FraudPatternMatcher(database_url)
        self.stake_adjuster = StakeAdjuster(database_url)
        self.opik = OpikLogger(opik_api_key)
        self.contract = get_contract_interface()  # Blockchain integration
        
    async def process_submission(
        self,
        user_id: str,
        goal_id: str,
        goal_description: str,
        proof_type: str,
        image_data: bytes,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Main entry point for proof processing.
        
        Pipeline:
        1. Vision AI verification
        2. Metadata forensics
        3. Fraud pattern matching
        4. Decision synthesis
        5. Behavioral adjustment
        6. Logging
        """
        
        start_time = datetime.utcnow()
        
        # Step 1: Vision Analysis
        vision_result = await self.verifier.verify_proof(
            image_data=image_data,
            goal_context={
                "description": goal_description,
                "expected_proof": proof_type
            }
        )
        
        # Step 2: Fraud Detection
        fraud_analysis = await self.fraud_detector.analyze(
            image_data=image_data,
            user_id=user_id,
            goal_id=goal_id,
            metadata=metadata
        )
        
        # Step 3: Synthesize Decision
        decision = self._make_decision(
            vision_result=vision_result,
            fraud_analysis=fraud_analysis,
            metadata=metadata
        )
        
        # Step 4: Determine Response Personality
        personality = self._select_personality(
            user_id=user_id,
            decision=decision,
            submission_time=metadata.get("timestamp", datetime.utcnow())
        )
        
        # Step 5: Generate Response Message
        message = self._generate_message(
            decision=decision,
            personality=personality,
            vision_reasoning=vision_result.get("reasoning", ""),
            fraud_signals=fraud_analysis.get("signals", [])
        )
        
        # Step 6: Record on Blockchain (if goal_id is numeric)
        blockchain_tx = None
        try:
            # Check if goal_id is a valid on-chain goal ID
            if goal_id.isdigit():
                on_chain_goal_id = int(goal_id)
                approved = decision["verdict"] == Verdict.APPROVED
                blockchain_tx = self.contract.record_verification(on_chain_goal_id, approved)
                if blockchain_tx:
                    print(f"✅ Verification recorded on-chain: {blockchain_tx}")
        except Exception as e:
            print(f"⚠️  Blockchain recording failed (continuing): {e}")
        
        # Step 7: Behavioral Learning (async)
        if decision["verdict"] == Verdict.APPROVED:
            await self.stake_adjuster.record_success(user_id, goal_id)
        else:
            await self.stake_adjuster.record_failure(user_id, goal_id)
            
        # Step 8: Log Everything to Opik
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        await self.opik.log_verification(
            user_id=user_id,
            goal_id=goal_id,
            input_data={
                "goal": goal_description,
                "proof_type": proof_type,
                "metadata": metadata
            },
            output_data={
                "verdict": decision["verdict"],
                "confidence": decision["confidence"],
                "message": message,
                "reasoning": vision_result.get("reasoning", "")
            },
            metrics={
                "fraud_score": fraud_analysis.get("score", 0),
                "processing_time_ms": processing_time * 1000,
                "fraud_signals_detected": len(fraud_analysis.get("signals", []))
            },
            tags=[
                f"verdict:{decision['verdict']}",
                f"confidence:{decision['confidence_tier']}",
                f"personality:{personality}"
            ]
        )
        
        response = {
            "verdict": decision["verdict"],
            "confidence": decision["confidence"],
            "message": message,
            "fraud_signals": fraud_analysis.get("signals", []),
            "reasoning": vision_result.get("reasoning", ""),
            "processing_time_ms": processing_time * 1000
        }
        
        # Add blockchain transaction if available
        if blockchain_tx:
            response["blockchain_tx"] = blockchain_tx
        
        return response
    
    def _make_decision(
        self,
        vision_result: Dict[str, Any],
        fraud_analysis: Dict[str, Any],
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Decision synthesis logic.
        
        Rules:
        1. High fraud score (>0.7) → automatic rejection
        2. Low vision confidence (<0.6) → unclear
        3. Vision says no → rejected
        4. Vision says yes + low fraud → approved
        """
        
        fraud_score = fraud_analysis.get("score", 0)
        vision_verdict = vision_result.get("verdict", "unclear")
        vision_confidence = vision_result.get("confidence", 0) / 100.0
        
        # Rule 1: Fraud detection override
        if fraud_score > 0.7:
            return {
                "verdict": Verdict.FRAUD_DETECTED,
                "confidence": fraud_score,
                "confidence_tier": "high",
                "primary_reason": "fraud_patterns"
            }
        
        # Rule 2: Vision analysis primary path
        if vision_verdict == "approve" and vision_confidence > 0.85 and fraud_score < 0.3:
            return {
                "verdict": Verdict.APPROVED,
                "confidence": vision_confidence,
                "confidence_tier": "high",
                "primary_reason": "vision_approved"
            }
        
        if vision_verdict == "approve" and vision_confidence > 0.6 and fraud_score < 0.5:
            return {
                "verdict": Verdict.APPROVED,
                "confidence": vision_confidence,
                "confidence_tier": "medium",
                "primary_reason": "vision_approved"
            }
        
        if vision_verdict == "reject":
            return {
                "verdict": Verdict.REJECTED,
                "confidence": 1.0 - vision_confidence,
                "confidence_tier": "high",
                "primary_reason": "vision_rejected"
            }
        
        # Rule 3: Unclear cases
        return {
            "verdict": Verdict.UNCLEAR,
            "confidence": 0.5,
            "confidence_tier": "low",
            "primary_reason": "insufficient_confidence"
        }
    
    def _select_personality(
        self,
        user_id: str,
        decision: Dict[str, Any],
        submission_time: datetime
    ) -> AgentPersonality:
        """
        Choose response tone based on context.
        
        Factors:
        - Time of submission (early morning = encouraging)
        - User's history (streak = encouraging, failures = strict)
        - Decision outcome (rejection = strict, approval = encouraging)
        """
        
        hour = submission_time.hour
        verdict = decision["verdict"]
        
        # Early morning submissions get encouragement
        if hour < 9 and verdict == Verdict.APPROVED:
            return AgentPersonality.ENCOURAGING
        
        # Fraud attempts get harshness
        if verdict == Verdict.FRAUD_DETECTED:
            return AgentPersonality.STRICT
        
        # Rejections are neutral but firm
        if verdict == Verdict.REJECTED:
            return AgentPersonality.NEUTRAL
        
        # Approvals get positive reinforcement
        if verdict == Verdict.APPROVED:
            return AgentPersonality.ENCOURAGING
        
        return AgentPersonality.NEUTRAL
    
    def _generate_message(
        self,
        decision: Dict[str, Any],
        personality: AgentPersonality,
        vision_reasoning: str,
        fraud_signals: list
    ) -> str:
        """
        Generate human-readable response message.
        """
        
        verdict = decision["verdict"]
        confidence = decision["confidence"]
        
        if verdict == Verdict.APPROVED:
            if personality == AgentPersonality.ENCOURAGING:
                messages = [
                    f"Verified. Confidence: {confidence:.0%}. You showed up.",
                    f"Approved. {confidence:.0%} certain. Keep going.",
                    f"That's what I like to see. {confidence:.0%} confidence. Approved."
                ]
            else:
                messages = [
                    f"Proof accepted. {confidence:.0%} confidence.",
                    f"Verified. Moving on."
                ]
            
            import random
            return random.choice(messages)
        
        elif verdict == Verdict.REJECTED:
            return f"Rejected. {vision_reasoning}. Try again with better proof."
        
        elif verdict == Verdict.FRAUD_DETECTED:
            signals_text = ", ".join(fraud_signals[:3])
            return f"Fraud detected: {signals_text}. I'm not stupid. Submission rejected."
        
        else:  # UNCLEAR
            return f"Unclear evidence. {vision_reasoning}. Resubmit with clearer proof."
