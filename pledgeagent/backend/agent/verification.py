"""
Vision AI Verification Module
Uses GPT-4o Vision to analyze proof submissions
"""

import base64
from typing import Dict, Any, Optional
import json
from openai import AsyncOpenAI


class VerificationAgent:
    """
    Analyzes images using GPT-4o Vision to determine if they prove goal completion.
    """
    
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)
        
    async def verify_proof(
        self,
        image_data: bytes,
        goal_context: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Main verification method.
        
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
        
        # Encode image to base64
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        
        # Build verification prompt
        prompt = self._build_verification_prompt(goal_context)
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a strict judge verifying proof of completed goals. Be thorough and skeptical."
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_b64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=500,
                temperature=0.3  # Lower temp = more consistent judgments
            )
            
            # Parse response
            result_text = response.choices[0].message.content
            result = self._parse_response(result_text)
            
            return result
            
        except Exception as e:
            # Fallback on API errors
            return {
                "verdict": "unclear",
                "confidence": 0,
                "reasoning": f"Verification failed: {str(e)}",
                "red_flags": ["api_error"]
            }
    
    def _build_verification_prompt(self, goal_context: Dict[str, str]) -> str:
        """
        Construct the verification prompt for GPT-4o.
        """
        
        goal_desc = goal_context.get("description", "")
        proof_type = goal_context.get("expected_proof", "photo")
        
        prompt = f"""You are verifying proof of goal completion.

**Goal:** {goal_desc}
**Expected Proof Type:** {proof_type}
**Your Task:** Determine if this image proves the goal was completed TODAY.

**Analysis Checklist:**
1. Does the image clearly show evidence of the stated goal?
2. Are there any signs this is an old photo (clothing, environment, visible dates)?
3. Are there signs of digital manipulation (artifacts, inconsistencies)?
4. Does the image match what you'd expect for "{proof_type}"?
5. Is there any visible timestamp or date in the image?

**Decision Rules:**
- If the image clearly proves the goal: verdict = "approve", confidence = 80-100%
- If the image is related but insufficient: verdict = "unclear", confidence = 40-60%
- If the image doesn't prove the goal: verdict = "reject", confidence = 70-100%
- If you see manipulation signs: verdict = "reject", note in red_flags

Respond ONLY with valid JSON in this exact format:
{{
  "verdict": "approve|reject|unclear",
  "confidence": 0-100,
  "reasoning": "Brief explanation of your decision",
  "red_flags": ["list", "of", "concerns"]
}}

No other text. Only JSON."""

        return prompt
    
    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse GPT-4o's JSON response.
        Handle cases where model includes markdown or extra text.
        """
        
        try:
            # Try direct JSON parse
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
                return json.loads(json_text)
            
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
                return json.loads(json_text)
            
            else:
                # Fallback: return unclear
                return {
                    "verdict": "unclear",
                    "confidence": 0,
                    "reasoning": "Failed to parse AI response",
                    "red_flags": ["parse_error"]
                }
    
    async def batch_verify(
        self,
        submissions: list[tuple[bytes, Dict[str, str]]]
    ) -> list[Dict[str, Any]]:
        """
        Verify multiple submissions in parallel.
        Useful for batch processing or testing.
        """
        
        import asyncio
        
        tasks = [
            self.verify_proof(image_data, context)
            for image_data, context in submissions
        ]
        
        results = await asyncio.gather(*tasks)
        return results
