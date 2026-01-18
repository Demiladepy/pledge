"""
Opik Integration for Full Agent Observability
Tracks every decision, learns from patterns
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import os

try:
    from opik import Opik
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik not installed. Logging will be limited.")


class OpikLogger:
    """
    Comprehensive logging for agent behavior.
    
    Tracks:
    - Every verification decision
    - Confidence scores over time
    - Fraud detection accuracy
    - User behavior patterns
    - Agent learning progress
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.enabled = OPIK_AVAILABLE and api_key is not None
        
        if self.enabled:
            self.client = Opik(api_key=api_key)
        else:
            self.client = None
            print("OpikLogger running in fallback mode (console logging only)")
    
    async def log_verification(
        self,
        user_id: str,
        goal_id: str,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any],
        metrics: Dict[str, float],
        tags: List[str]
    ):
        """
        Log a verification event to Opik.
        
        This creates a full audit trail of every decision.
        """
        
        if self.enabled:
            try:
                self.client.log_trace(
                    name="proof_verification",
                    input=input_data,
                    output=output_data,
                    metadata={
                        "user_id": user_id,
                        "goal_id": goal_id,
                        "timestamp": datetime.utcnow().isoformat(),
                        **metrics
                    },
                    tags=tags
                )
            except Exception as e:
                print(f"Opik logging error: {e}")
        
        # Fallback: console logging
        self._console_log(
            "VERIFICATION",
            user_id=user_id,
            goal_id=goal_id,
            verdict=output_data.get("verdict"),
            confidence=output_data.get("confidence"),
            fraud_score=metrics.get("fraud_score")
        )
    
    async def log_fraud_detection(
        self,
        user_id: str,
        goal_id: str,
        signals: List[str],
        score: float,
        details: Dict[str, Any]
    ):
        """Log fraud detection event"""
        
        if self.enabled:
            try:
                self.client.log_trace(
                    name="fraud_detection",
                    input={"goal_id": goal_id, "user_id": user_id},
                    output={
                        "fraud_score": score,
                        "signals": signals,
                        "details": details
                    },
                    metadata={
                        "user_id": user_id,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    tags=[f"fraud_score:{score:.2f}"] + signals
                )
            except Exception as e:
                print(f"Opik logging error: {e}")
        
        self._console_log(
            "FRAUD_CHECK",
            user_id=user_id,
            goal_id=goal_id,
            score=score,
            signals=signals
        )
    
    async def log_stake_adjustment(
        self,
        user_id: str,
        old_stake: float,
        new_stake: float,
        reason: str
    ):
        """Log stake adjustment event"""
        
        if self.enabled:
            try:
                self.client.log_trace(
                    name="stake_adjustment",
                    input={
                        "user_id": user_id,
                        "old_stake": old_stake
                    },
                    output={
                        "new_stake": new_stake,
                        "reason": reason,
                        "change_pct": ((new_stake - old_stake) / old_stake) * 100
                    },
                    tags=["stake_adjustment", f"reason:{reason}"]
                )
            except Exception as e:
                print(f"Opik logging error: {e}")
        
        self._console_log(
            "STAKE_ADJUST",
            user_id=user_id,
            old=old_stake,
            new=new_stake,
            reason=reason
        )
    
    async def log_agent_decision(
        self,
        decision_type: str,
        context: Dict[str, Any],
        reasoning: str,
        confidence: float
    ):
        """Log general agent decision"""
        
        if self.enabled:
            try:
                self.client.log_trace(
                    name=f"agent_decision_{decision_type}",
                    input=context,
                    output={
                        "reasoning": reasoning,
                        "confidence": confidence
                    },
                    tags=[decision_type, f"confidence:{confidence:.2f}"]
                )
            except Exception as e:
                print(f"Opik logging error: {e}")
        
        self._console_log(
            "DECISION",
            type=decision_type,
            confidence=confidence,
            reasoning=reasoning[:100]
        )
    
    def _console_log(self, event_type: str, **kwargs):
        """Fallback console logging"""
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        log_line = f"[{timestamp}] {event_type}"
        
        for key, value in kwargs.items():
            log_line += f" | {key}={value}"
        
        print(log_line)
    
    async def get_metrics(
        self,
        metric_name: str,
        filter_tags: Optional[List[str]] = None,
        time_range: Optional[str] = "24h"
    ) -> Dict[str, Any]:
        """
        Query Opik for metrics.
        
        Useful for dashboard creation.
        """
        
        if not self.enabled:
            return {"error": "Opik not enabled"}
        
        try:
            # TODO: Implement Opik query API once documented
            # For now, return placeholder
            return {
                "metric": metric_name,
                "value": 0.85,
                "time_range": time_range
            }
        except Exception as e:
            return {"error": str(e)}
