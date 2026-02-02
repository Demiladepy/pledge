"""
Vision AI Verification Module
Uses Google Gemini Vision with Opik tracing for full observability

Opik Integration: https://www.comet.com/docs/opik/integrations/gemini.mdx
"""

import base64
from typing import Dict, Any, Optional, TYPE_CHECKING
import json
import time
from PIL import Image
import io

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️  google-generativeai not installed")

try:
    import opik
    from opik import track
    from opik.integrations.gemini import track_gemini
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    track_gemini = None

if TYPE_CHECKING:
    from ..observability.opik_logger import OpikLogger


class VerificationAgent:
    """
    Analyzes images using Gemini Vision to determine if they prove goal completion.
    
    Features:
    - Gemini 1.5 Flash for fast image analysis
    - Full Opik tracing for LLM observability
    - Structured JSON responses
    - Fraud signal detection
    """
    
    def __init__(self, api_key: str, opik_logger: Optional["OpikLogger"] = None):
        """
        Initialize with Google API key and optional Opik logger.
        
        Args:
            api_key: Google API key for Gemini
            opik_logger: Optional OpikLogger instance for tracing
        """
        self.opik_logger = opik_logger
        self.enabled = GEMINI_AVAILABLE and api_key and api_key != ""
        
        if self.enabled:
            genai.configure(api_key=api_key)
            
            # Create the base model
            base_model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Wrap with Opik tracking if available
            if OPIK_AVAILABLE and track_gemini:
                try:
                    self.model = track_gemini(base_model, project_name="pledgeagent")
                    print("✅ Gemini Vision initialized with Opik tracing")
                except Exception as e:
                    print(f"⚠️  Opik Gemini tracking failed: {e}")
                    self.model = base_model
            else:
                self.model = base_model
                print("✅ Gemini Vision initialized (no Opik tracing)")
        else:
            self.model = None
            if not GEMINI_AVAILABLE:
                print("⚠️  Install: pip install google-generativeai")
            elif not api_key:
                print("⚠️  GOOGLE_API_KEY not set")
    
    @track(name="verify_proof", project_name="pledgeagent") if OPIK_AVAILABLE else lambda f: f
    async def verify_proof(
        self,
        image_data: bytes,
        goal_context: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Main verification method with full Opik tracing.
        
        Args:
            image_data: Raw image bytes
            goal_context: Dict with 'description' and 'expected_proof'
            
        Returns:
            {
                "verdict": "approve" | "reject" | "unclear",
                "confidence": 0-100,
                "reasoning": str,
                "red_flags": [str]
            }
        """
        
        if not self.enabled:
            return {
                "verdict": "unclear",
                "confidence": 0,
                "reasoning": "Vision verification not configured. Set GOOGLE_API_KEY.",
                "red_flags": ["api_not_configured"]
            }
        
        start_time = time.time()
        
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Build verification prompt
            prompt = self._build_verification_prompt(goal_context)
            
            # Call Gemini Vision (automatically traced by Opik if enabled)
            response = self.model.generate_content([prompt, image])
            
            latency_ms = (time.time() - start_time) * 1000
            
            # Parse response
            result_text = response.text
            result = self._parse_response(result_text)
            
            # Log to Opik if available
            if self.opik_logger:
                await self.opik_logger.log_gemini_call(
                    prompt=prompt[:500],
                    response=result_text[:500],
                    model="gemini-1.5-flash",
                    latency_ms=latency_ms
                )
            
            print(f"🔍 Gemini verification: {result.get('verdict')} ({result.get('confidence')}% confidence) in {latency_ms:.0f}ms")
            
            return result
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Gemini error: {error_msg}")
            
            # Return error result
            return {
                "verdict": "unclear",
                "confidence": 0,
                "reasoning": f"Verification failed: {error_msg}",
                "red_flags": ["api_error"]
            }
    
    def _build_verification_prompt(self, goal_context: Dict[str, str]) -> str:
        """
        Construct the verification prompt for Gemini.
        """
        
        goal_desc = goal_context.get("description", "")
        proof_type = goal_context.get("expected_proof", "photo")
        
        prompt = f"""You are a strict AI judge verifying proof of goal completion for an accountability app.

**Goal:** {goal_desc}
**Expected Proof Type:** {proof_type}

**Your Task:** Analyze this image and determine if it proves the goal was completed TODAY.

**Analysis Checklist:**
1. Does the image clearly show evidence of the stated goal?
2. Are there any signs this is an old/reused photo?
3. Are there signs of digital manipulation or AI generation?
4. Does the image match the expected proof type?
5. Is there anything suspicious about this submission?

**Decision Rules:**
- "approve" (confidence 80-100): Image clearly proves the goal was completed
- "unclear" (confidence 40-60): Image is related but insufficient evidence  
- "reject" (confidence 70-100): Image doesn't prove the goal or shows signs of fraud

**IMPORTANT:** Respond ONLY with valid JSON in this exact format:
{{
  "verdict": "approve",
  "confidence": 85,
  "reasoning": "Brief explanation of your decision",
  "red_flags": []
}}

Only output the JSON object, nothing else."""

        return prompt
    
    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse Gemini's JSON response.
        Handle cases where model includes markdown or extra text.
        """
        
        # Clean up the response text
        response_text = response_text.strip()
        
        try:
            # Try direct JSON parse
            return json.loads(response_text)
        except json.JSONDecodeError:
            pass
        
        # Try to extract JSON from markdown code blocks
        if "```json" in response_text:
            try:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
                return json.loads(json_text)
            except:
                pass
        
        if "```" in response_text:
            try:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
                return json.loads(json_text)
            except:
                pass
        
        # Try to find JSON object in the text
        if "{" in response_text and "}" in response_text:
            try:
                json_start = response_text.find("{")
                json_end = response_text.rfind("}") + 1
                json_text = response_text[json_start:json_end]
                return json.loads(json_text)
            except:
                pass
        
        # Fallback: return unclear with the raw response
        return {
            "verdict": "unclear",
            "confidence": 0,
            "reasoning": f"Could not parse AI response: {response_text[:200]}",
            "red_flags": ["parse_error"]
        }
    
    async def batch_verify(
        self,
        submissions: list[tuple[bytes, Dict[str, str]]]
    ) -> list[Dict[str, Any]]:
        """
        Verify multiple submissions in sequence.
        Each call is individually traced by Opik.
        """
        
        results = []
        for i, (image_data, context) in enumerate(submissions):
            print(f"Processing submission {i+1}/{len(submissions)}...")
            result = await self.verify_proof(image_data, context)
            results.append(result)
        
        return results
