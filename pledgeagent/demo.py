#!/usr/bin/env python3
"""
PledgeAgent Interactive Demo
Demonstrates the complete verification flow
"""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from agent.brain import PledgeAgentBrain, Verdict
import os
from dotenv import load_dotenv

# ASCII Art Banner
BANNER = """
╔═══════════════════════════════════════════════════════╗
║                    PLEDGEAGENT                        ║
║         Adversarial AI Resolution Enforcer            ║
╚═══════════════════════════════════════════════════════╝
"""


def print_banner():
    print("\033[96m" + BANNER + "\033[0m")


def print_section(title: str):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60 + "\n")


def print_success(message: str):
    print("\033[92m✓ " + message + "\033[0m")


def print_error(message: str):
    print("\033[91m✗ " + message + "\033[0m")


def print_info(message: str):
    print("\033[94mℹ " + message + "\033[0m")


def print_warning(message: str):
    print("\033[93m⚠ " + message + "\033[0m")


async def demo_scenario_1():
    """Scenario 1: Clean submission that gets approved"""
    
    print_section("SCENARIO 1: Legitimate Proof Submission")
    
    print("User: John")
    print("Goal: Go to gym 4x per week")
    print("Proof: Fresh gym photo taken today")
    print()
    
    # Simulate the decision process
    print("Agent Processing:")
    print("  [1/5] Vision AI analyzing image...")
    await asyncio.sleep(0.5)
    print("  └─ Result: Clear treadmill visible, proper gym environment")
    print("  └─ Confidence: 94%")
    print()
    
    print("  [2/5] Checking metadata...")
    await asyncio.sleep(0.3)
    print("  └─ Timestamp: Today, 7:23 AM")
    print("  └─ GPS: Matches user's city")
    print("  └─ File hash: New (not seen before)")
    print()
    
    print("  [3/5] Fraud pattern matching...")
    await asyncio.sleep(0.3)
    print("  └─ No suspicious signals detected")
    print("  └─ Fraud score: 0.05 (very low)")
    print()
    
    print("  [4/5] Making decision...")
    await asyncio.sleep(0.2)
    print("  └─ Vision approved + Low fraud = APPROVED")
    print()
    
    print("  [5/5] Selecting response personality...")
    await asyncio.sleep(0.2)
    print("  └─ Early morning submission detected")
    print("  └─ Personality: ENCOURAGING")
    print()
    
    print_success("VERDICT: APPROVED")
    print()
    print("\033[1mAgent Response:\033[0m")
    print("  \"Verified. Confidence: 94%. 7 AM submission? You're serious about this.\"")
    print()
    print_info("Logged to Opik with full reasoning trail")


async def demo_scenario_2():
    """Scenario 2: Fraud attempt that gets caught"""
    
    print_section("SCENARIO 2: Fraud Attempt Detection")
    
    print("User: Sarah")
    print("Goal: Read 5 books per month")
    print("Proof: Screenshot of book (suspicious)")
    print()
    
    print("Agent Processing:")
    print("  [1/5] Vision AI analyzing image...")
    await asyncio.sleep(0.5)
    print("  └─ Result: Image shows book cover")
    print("  └─ Confidence: 78%")
    print()
    
    print("  [2/5] Checking metadata...")
    await asyncio.sleep(0.3)
    print("  └─ Timestamp: 3 weeks ago ⚠️")
    print("  └─ GPS: Missing")
    print("  └─ File hash: DUPLICATE - submitted before! 🚨")
    print()
    
    print("  [3/5] Fraud pattern matching...")
    await asyncio.sleep(0.4)
    print("  └─ Signal 1: old_photo (21 days old)")
    print("  └─ Signal 2: duplicate_image")
    print("  └─ Signal 3: missing_gps")
    print("  └─ Fraud score: 0.85 (HIGH)")
    print()
    
    print("  [4/5] Making decision...")
    await asyncio.sleep(0.2)
    print("  └─ Fraud score > 0.7 threshold")
    print("  └─ OVERRIDE: Automatic rejection")
    print()
    
    print("  [5/5] Learning from attempt...")
    await asyncio.sleep(0.3)
    print("  └─ Pattern logged: [old_photo + duplicate_image]")
    print("  └─ Detection model updated")
    print()
    
    print_error("VERDICT: FRAUD DETECTED")
    print()
    print("\033[1mAgent Response:\033[0m")
    print("  \"Fraud detected: old_photo, duplicate_image. I'm not stupid.")
    print("   Submission rejected.\"")
    print()
    print_warning("User's fraud attempt count: +1")
    print_info("This pattern will now be caught faster for all users")


async def demo_scenario_3():
    """Scenario 3: Unclear evidence requiring resubmission"""
    
    print_section("SCENARIO 3: Unclear Evidence")
    
    print("User: Mike")
    print("Goal: Meditation 10 minutes daily")
    print("Proof: Blurry photo of meditation app")
    print()
    
    print("Agent Processing:")
    print("  [1/5] Vision AI analyzing image...")
    await asyncio.sleep(0.5)
    print("  └─ Result: Image quality too low to verify")
    print("  └─ Confidence: 42% (below threshold)")
    print()
    
    print("  [2/5] Checking metadata...")
    await asyncio.sleep(0.3)
    print("  └─ Timestamp: Valid (today)")
    print("  └─ No fraud signals")
    print()
    
    print("  [3/5] Making decision...")
    await asyncio.sleep(0.2)
    print("  └─ Low confidence + No fraud = UNCLEAR")
    print("  └─ Requires better proof")
    print()
    
    print_warning("VERDICT: UNCLEAR")
    print()
    print("\033[1mAgent Response:\033[0m")
    print("  \"Unclear evidence. Image quality insufficient to verify.")
    print("   Resubmit with clearer proof.\"")
    print()
    print_info("User gets another chance to submit better proof")


async def run_demo():
    """Run the complete interactive demo"""
    
    print_banner()
    
    print("This demo shows how PledgeAgent processes proof submissions.")
    print("Each scenario demonstrates different aspects of the agent's intelligence.")
    print()
    
    input("Press Enter to start demo...")
    
    # Scenario 1: Success case
    await demo_scenario_1()
    print()
    input("Press Enter for next scenario...")
    
    # Scenario 2: Fraud detection
    await demo_scenario_2()
    print()
    input("Press Enter for next scenario...")
    
    # Scenario 3: Unclear case
    await demo_scenario_3()
    
    # Summary
    print_section("DEMO SUMMARY")
    
    print("What makes PledgeAgent intelligent:")
    print()
    print("1. \033[1mMultimodal Analysis\033[0m")
    print("   → Vision AI + Metadata + Behavioral patterns")
    print()
    print("2. \033[1mLearning System\033[0m")
    print("   → Every fraud attempt trains the detection model")
    print()
    print("3. \033[1mAdaptive Behavior\033[0m")
    print("   → Response tone changes based on user history")
    print()
    print("4. \033[1mFull Observability\033[0m")
    print("   → Every decision logged to Opik with reasoning")
    print()
    
    print_success("Demo complete!")
    print()
    print("To see this in action with real images:")
    print("  1. Start the backend: cd backend && python api/main.py")
    print("  2. Visit http://localhost:8000/docs")
    print("  3. Try the /api/proof/submit endpoint")


if __name__ == "__main__":
    try:
        asyncio.run(run_demo())
    except KeyboardInterrupt:
        print("\n\nDemo interrupted. Goodbye!")
    except Exception as e:
        print_error(f"Demo error: {e}")
        sys.exit(1)
