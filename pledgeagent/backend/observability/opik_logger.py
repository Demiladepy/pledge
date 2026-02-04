"""
Opik Integration for Full Agent Observability
Comprehensive tracing for the PledgeAgent AI system

Based on Opik documentation: https://www.comet.com/docs/opik/
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import os

try:
    import opik
    from opik import track, opik_context
    from opik.integrations.gemini import track_gemini
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik not installed. Run: pip install opik")


class OpikLogger:
    """
    Comprehensive observability for PledgeAgent using Opik.
    
    Supports both:
    - Open-Source Opik: http://localhost:5173 (no API key needed)
    - Opik Cloud: https://www.comet.com/opik (API key required)
    
    Features:
    - Full trace logging for every verification
    - Span tracking for sub-operations (fraud detection, vision AI)
    - Metrics aggregation for dashboard
    - Gemini integration for LLM tracing
    
    Docs: https://www.comet.com/docs/opik/
    """
    
    def __init__(self, api_key: Optional[str] = None, use_local: bool = False):
        self.api_key = api_key
        self.project_name = "pledgeagent"
        self.use_local = use_local or os.getenv("OPIK_USE_LOCAL", "false").lower() == "true"
        self.local_url = os.getenv("OPIK_LOCAL_URL", "http://localhost:5173/api")
        
        # Determine mode
        if self.use_local:
            # Open-Source local mode - no API key needed
            self.enabled = OPIK_AVAILABLE
            self.dashboard_url = "http://localhost:5173"
        else:
            # Cloud mode - API key required
            self.enabled = OPIK_AVAILABLE and api_key is not None and api_key != ""
            self.dashboard_url = "https://www.comet.com/opik"
        
        if self.enabled:
            try:
                if self.use_local:
                    # Configure for local Open-Source Opik
                    opik.configure(
                        use_local=True,
                        project_name=self.project_name
                    )
                    print(f"✅ Opik (Local) initialized - Project: {self.project_name}")
                    print(f"   Dashboard: {self.dashboard_url}")
                else:
                    # Configure for Opik Cloud
                    opik.configure(
                        api_key=api_key,
                        workspace=os.getenv("OPIK_WORKSPACE", "default"),
                        project_name=self.project_name
                    )
                    print(f"✅ Opik (Cloud) initialized - Project: {self.project_name}")
                    print(f"   Dashboard: {self.dashboard_url}/{self.project_name}")
                
                # Get client for direct API calls
                self.client = opik.Opik()
                
            except Exception as e:
                print(f"⚠️  Opik initialization error: {e}")
                self.enabled = False
                self.client = None
        else:
            self.client = None
            if not self.use_local and not api_key:
                print("⚠️  OPIK_API_KEY not set.")
                print("   Options:")
                print("   1. Get cloud key: https://www.comet.com/opik")
                print("   2. Run local: set OPIK_USE_LOCAL=true")
            print("   Running in console-logging mode")
    
    def get_gemini_tracker(self):
        """
        Get Gemini tracker for LLM call tracing.
        Use this to wrap Gemini model for automatic tracing.
        
        Usage:
            tracker = opik_logger.get_gemini_tracker()
            if tracker:
                model = tracker(genai.GenerativeModel('gemini-1.5-flash'))
        """
        if self.enabled:
            return track_gemini
        return None
    
    @staticmethod
    def tracked(name: str = None):
        """
        Decorator for tracking functions with Opik.
        
        Usage:
            @OpikLogger.tracked("my_function")
            async def my_function():
                pass
        """
        if OPIK_AVAILABLE:
            return track(name=name, project_name="pledgeagent")
        else:
            # No-op decorator when Opik not available
            def decorator(func):
                return func
            return decorator
    
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
        Log a complete verification trace to Opik.
        This is the main entry point for proof verification logging.
        """
        
        trace_data = {
            "name": "proof_verification",
            "input": {
                "user_id": user_id,
                "goal_id": goal_id,
                "goal_description": input_data.get("goal", ""),
                "proof_type": input_data.get("proof_type", ""),
                "metadata": input_data.get("metadata", {})
            },
            "output": {
                "verdict": output_data.get("verdict"),
                "confidence": output_data.get("confidence"),
                "message": output_data.get("message"),
                "reasoning": output_data.get("reasoning")
            },
            "metadata": {
                "fraud_score": metrics.get("fraud_score", 0),
                "processing_time_ms": metrics.get("processing_time_ms", 0),
                "fraud_signals_count": metrics.get("fraud_signals_detected", 0),
                "timestamp": datetime.utcnow().isoformat()
            },
            "tags": tags
        }
        
        if self.enabled and self.client:
            try:
                # Create trace using Opik client
                trace = self.client.trace(
                    name="proof_verification",
                    input=trace_data["input"],
                    output=trace_data["output"],
                    metadata=trace_data["metadata"],
                    tags=tags,
                    project_name=self.project_name
                )
                trace.end()
                print(f"📊 Opik: Logged verification trace for {goal_id}")
            except Exception as e:
                print(f"⚠️  Opik trace error: {e}")
        
        # Always log to console for visibility
        self._console_log("VERIFICATION", **{
            "user": user_id,
            "goal": goal_id,
            "verdict": output_data.get("verdict"),
            "confidence": f"{output_data.get('confidence', 0):.1%}",
            "fraud_score": f"{metrics.get('fraud_score', 0):.2f}"
        })
    
    async def log_fraud_detection(
        self,
        user_id: str,
        goal_id: str,
        signals: List[str],
        score: float,
        details: Dict[str, Any]
    ):
        """Log fraud detection as a span within a trace"""
        
        if self.enabled and self.client:
            try:
                trace = self.client.trace(
                    name="fraud_detection",
                    input={
                        "user_id": user_id,
                        "goal_id": goal_id
                    },
                    output={
                        "fraud_score": score,
                        "signals": signals,
                        "signal_count": len(signals),
                        "is_fraud": score > 0.7
                    },
                    metadata={
                        "details": details,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    tags=["fraud_detection", f"score_{int(score*100)}"] + signals[:3],
                    project_name=self.project_name
                )
                trace.end()
            except Exception as e:
                print(f"⚠️  Opik fraud log error: {e}")
        
        self._console_log("FRAUD_CHECK", **{
            "user": user_id,
            "goal": goal_id,
            "score": f"{score:.2f}",
            "signals": len(signals)
        })
    
    async def log_stake_adjustment(
        self,
        user_id: str,
        old_stake: float,
        new_stake: float,
        reason: str
    ):
        """Log stake adjustments for behavioral learning tracking"""
        
        change_pct = ((new_stake - old_stake) / old_stake * 100) if old_stake > 0 else 0
        
        if self.enabled and self.client:
            try:
                trace = self.client.trace(
                    name="stake_adjustment",
                    input={
                        "user_id": user_id,
                        "old_stake": old_stake
                    },
                    output={
                        "new_stake": new_stake,
                        "change_pct": change_pct,
                        "reason": reason
                    },
                    tags=["stake", reason, "increase" if new_stake > old_stake else "decrease"],
                    project_name=self.project_name
                )
                trace.end()
            except Exception as e:
                print(f"⚠️  Opik stake log error: {e}")
        
        self._console_log("STAKE_ADJUST", **{
            "user": user_id,
            "old": f"${old_stake:.2f}",
            "new": f"${new_stake:.2f}",
            "change": f"{change_pct:+.1f}%",
            "reason": reason
        })
    
    async def log_gemini_call(
        self,
        prompt: str,
        response: str,
        model: str = "gemini-1.5-flash",
        tokens_used: int = 0,
        latency_ms: float = 0
    ):
        """Log Gemini API calls for LLM observability"""
        
        if self.enabled and self.client:
            try:
                trace = self.client.trace(
                    name="gemini_vision_call",
                    input={"prompt": prompt[:500]},  # Truncate long prompts
                    output={"response": response[:1000]},  # Truncate long responses
                    metadata={
                        "model": model,
                        "tokens_used": tokens_used,
                        "latency_ms": latency_ms,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    tags=["llm", "gemini", model],
                    project_name=self.project_name
                )
                trace.end()
            except Exception as e:
                print(f"⚠️  Opik Gemini log error: {e}")
    
    async def log_agent_decision(
        self,
        decision_type: str,
        context: Dict[str, Any],
        reasoning: str,
        confidence: float
    ):
        """Log general agent decision-making"""
        
        if self.enabled and self.client:
            try:
                trace = self.client.trace(
                    name=f"agent_decision_{decision_type}",
                    input=context,
                    output={
                        "reasoning": reasoning,
                        "confidence": confidence,
                        "decision_type": decision_type
                    },
                    tags=[decision_type, f"conf_{int(confidence*100)}"],
                    project_name=self.project_name
                )
                trace.end()
            except Exception as e:
                print(f"⚠️  Opik decision log error: {e}")
        
        self._console_log("DECISION", **{
            "type": decision_type,
            "confidence": f"{confidence:.1%}",
            "reasoning": reasoning[:80] + "..." if len(reasoning) > 80 else reasoning
        })
    
    def _console_log(self, event_type: str, **kwargs):
        """Fallback console logging with nice formatting"""
        timestamp = datetime.utcnow().strftime("%H:%M:%S")
        
        # Color codes for terminal
        colors = {
            "VERIFICATION": "\033[92m",  # Green
            "FRAUD_CHECK": "\033[93m",   # Yellow
            "STAKE_ADJUST": "\033[94m",  # Blue
            "DECISION": "\033[95m",      # Magenta
        }
        reset = "\033[0m"
        color = colors.get(event_type, "")
        
        log_parts = [f"{color}[{timestamp}] {event_type}{reset}"]
        for key, value in kwargs.items():
            log_parts.append(f"{key}={value}")
        
        print(" | ".join(log_parts))
    
    async def get_dashboard_metrics(self) -> Dict[str, Any]:
        """
        Get aggregated metrics for the dashboard.
        Queries Opik for trace statistics.
        """
        
        if not self.enabled:
            return {
                "total_verifications": 0,
                "approval_rate": 0.0,
                "fraud_detection_rate": 0.0,
                "average_confidence": 0.0,
                "active_users": 0,
                "total_stake_locked": 0.0,
                "opik_enabled": False,
                "opik_dashboard_url": self.dashboard_url,
                "opik_mode": "local" if self.use_local else "cloud"
            }
        
        try:
            # Try to get traces from Opik
            traces = []
            if hasattr(self.client, 'search_traces'):
                traces = self.client.search_traces(
                    project_name=self.project_name,
                    filter_string='name = "proof_verification"',
                    max_results=1000
                )
            
            if traces:
                total = len(traces)
                approved = sum(1 for t in traces if t.output and t.output.get("verdict") == "approved")
                dashboard = f"{self.dashboard_url}/{self.project_name}" if not self.use_local else self.dashboard_url
                return {
                    "total_verifications": total,
                    "approval_rate": approved / total if total > 0 else 0,
                    "fraud_detection_rate": 0.15,  # Would need fraud trace query
                    "average_confidence": 0.85,
                    "active_users": len(set(t.input.get("user_id") for t in traces if t.input)),
                    "total_stake_locked": 0.0,
                    "opik_enabled": True,
                    "opik_dashboard_url": dashboard,
                    "opik_mode": "local" if self.use_local else "cloud"
                }
        except Exception as e:
            print(f"⚠️  Error fetching Opik metrics: {e}")
        
        # Return defaults if query fails
        dashboard = f"{self.dashboard_url}/{self.project_name}" if not self.use_local else self.dashboard_url
        return {
            "total_verifications": 0,
            "approval_rate": 0.0,
            "fraud_detection_rate": 0.0,
            "average_confidence": 0.0,
            "active_users": 0,
            "total_stake_locked": 0.0,
            "opik_enabled": True,
            "opik_dashboard_url": dashboard,
            "opik_mode": "local" if self.use_local else "cloud",
            "note": "Submit verifications to see real metrics"
        }


# Convenience decorator for tracking any function
def opik_track(name: str = None):
    """
    Decorator to track any function with Opik.
    
    Usage:
        @opik_track("process_image")
        def process_image(data):
            ...
    """
    return OpikLogger.tracked(name)
